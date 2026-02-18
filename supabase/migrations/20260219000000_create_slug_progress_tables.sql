-- ============================================================================
-- Slug-based progress tables for client-side progress persistence
-- Stores lesson completions and quiz attempts keyed by slug (not UUID)
-- to match the client-side ProgressContext data model.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: user_lesson_progress
-- Tracks lesson completions by slug (matches ProgressContext.lessonProgress)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_slug)
);

CREATE INDEX IF NOT EXISTS idx_ulp_user ON user_lesson_progress(user_id);

-- ----------------------------------------------------------------------------
-- Table: user_quiz_attempts
-- Tracks quiz attempts by module slug (matches ProgressContext.quizAttempts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN NOT NULL,
  attempt_number INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uqa_user ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_uqa_user_module ON user_quiz_attempts(user_id, module_slug);

-- ----------------------------------------------------------------------------
-- RLS Policies
-- ----------------------------------------------------------------------------
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Lesson progress: users manage their own rows
CREATE POLICY "Users read own lesson progress"
  ON user_lesson_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own lesson progress"
  ON user_lesson_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own lesson progress"
  ON user_lesson_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own lesson progress"
  ON user_lesson_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Quiz attempts: users manage their own rows
CREATE POLICY "Users read own quiz attempts"
  ON user_quiz_attempts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own quiz attempts"
  ON user_quiz_attempts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own quiz attempts"
  ON user_quiz_attempts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Super admin read access
CREATE POLICY "Super admins read all lesson progress"
  ON user_lesson_progress FOR SELECT TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'mkoepkeci@gmail.com',
      'marty.koepke@practicalinformatics.org'
    )
  );

CREATE POLICY "Super admins read all quiz attempts"
  ON user_quiz_attempts FOR SELECT TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'mkoepkeci@gmail.com',
      'marty.koepke@practicalinformatics.org'
    )
  );

-- ----------------------------------------------------------------------------
-- RPC: load_user_progress
-- Single call to fetch all progress for a user on login.
-- Returns JSON matching the client-side ProgressState shape.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION load_user_progress(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_lessons JSON;
  v_quizzes JSON;
BEGIN
  -- Only allow users to load their own progress
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Lesson progress as { slug: { completed, completedAt } }
  SELECT COALESCE(json_object_agg(lesson_slug, json_build_object(
    'completed', completed,
    'completedAt', completed_at
  )), '{}'::json)
  INTO v_lessons
  FROM user_lesson_progress
  WHERE user_id = p_user_id;

  -- Quiz attempts grouped by module_slug as { slug: [attempts] }
  SELECT COALESCE(json_object_agg(module_slug, attempts), '{}'::json)
  INTO v_quizzes
  FROM (
    SELECT module_slug, json_agg(
      json_build_object(
        'score', score,
        'passed', passed,
        'attemptNumber', attempt_number,
        'completedAt', completed_at,
        'answers', answers
      ) ORDER BY attempt_number
    ) AS attempts
    FROM user_quiz_attempts
    WHERE user_id = p_user_id
    GROUP BY module_slug
  ) sub;

  RETURN json_build_object(
    'lessonProgress', v_lessons,
    'quizAttempts', v_quizzes
  );
END;
$$;

-- ----------------------------------------------------------------------------
-- RPC: save_lesson_complete
-- Upsert a single lesson completion (idempotent).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION save_lesson_complete(
  p_user_id UUID,
  p_lesson_slug TEXT,
  p_completed_at TIMESTAMPTZ DEFAULT now()
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO user_lesson_progress (user_id, lesson_slug, completed, completed_at)
  VALUES (p_user_id, p_lesson_slug, true, p_completed_at)
  ON CONFLICT (user_id, lesson_slug) DO NOTHING;
END;
$$;

-- ----------------------------------------------------------------------------
-- RPC: save_quiz_attempt
-- Insert a new quiz attempt.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION save_quiz_attempt(
  p_user_id UUID,
  p_module_slug TEXT,
  p_score INTEGER,
  p_passed BOOLEAN,
  p_attempt_number INTEGER,
  p_answers JSONB,
  p_completed_at TIMESTAMPTZ DEFAULT now()
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO user_quiz_attempts (
    user_id, module_slug, score, passed, attempt_number, answers, completed_at
  ) VALUES (
    p_user_id, p_module_slug, p_score, p_passed, p_attempt_number, p_answers, p_completed_at
  );
END;
$$;

-- ----------------------------------------------------------------------------
-- RPC: bulk_sync_progress
-- One-time migration of localStorage data to Supabase.
-- Called on first login after deploy. Idempotent via ON CONFLICT DO NOTHING.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION bulk_sync_progress(
  p_user_id UUID,
  p_lessons JSONB,
  p_quizzes JSONB
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_lesson JSONB;
  v_quiz JSONB;
BEGIN
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Upsert all lessons
  FOR v_lesson IN SELECT * FROM jsonb_array_elements(p_lessons) LOOP
    INSERT INTO user_lesson_progress (user_id, lesson_slug, completed, completed_at)
    VALUES (
      p_user_id,
      v_lesson->>'lessonSlug',
      true,
      COALESCE((v_lesson->>'completedAt')::TIMESTAMPTZ, now())
    )
    ON CONFLICT (user_id, lesson_slug) DO NOTHING;
  END LOOP;

  -- Insert quiz attempts
  FOR v_quiz IN SELECT * FROM jsonb_array_elements(p_quizzes) LOOP
    -- Skip if this exact attempt already exists
    IF NOT EXISTS (
      SELECT 1 FROM user_quiz_attempts
      WHERE user_id = p_user_id
        AND module_slug = v_quiz->>'moduleSlug'
        AND attempt_number = (v_quiz->>'attemptNumber')::INTEGER
    ) THEN
      INSERT INTO user_quiz_attempts (
        user_id, module_slug, score, passed, attempt_number, answers, completed_at
      ) VALUES (
        p_user_id,
        v_quiz->>'moduleSlug',
        (v_quiz->>'score')::INTEGER,
        (v_quiz->>'passed')::BOOLEAN,
        (v_quiz->>'attemptNumber')::INTEGER,
        COALESCE(v_quiz->'answers', '{}'::JSONB),
        COALESCE((v_quiz->>'completedAt')::TIMESTAMPTZ, now())
      );
    END IF;
  END LOOP;
END;
$$;
