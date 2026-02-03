/*
  # Safe Migration - Creates All Tables If Not Exists

  This migration safely creates all tables needed for VytalPath Academy,
  skipping any that already exist.
*/

-- =============================================
-- LMS TABLES (if not exist)
-- =============================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('foundation', 'role', 'advanced')),
  prerequisite_ids UUID[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  estimated_hours NUMERIC(4,1) NOT NULL DEFAULT 0,
  certificate_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, slug)
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'reading')),
  video_url TEXT,
  reading_content TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(module_id, slug)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL DEFAULT 80 CHECK (passing_score >= 0 AND passing_score <= 100),
  max_attempts INTEGER NOT NULL DEFAULT 3 CHECK (max_attempts >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false')),
  options TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  certificate_issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- =============================================
-- ORGANIZATION TABLES
-- =============================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS org_invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  label TEXT,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  joined_via UUID REFERENCES org_invite_links(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- =============================================
-- INDEXES (create if not exist via DO block)
-- =============================================

DO $$
BEGIN
  -- LMS indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_courses_sort_order') THEN
    CREATE INDEX idx_courses_sort_order ON courses(sort_order);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_courses_type') THEN
    CREATE INDEX idx_courses_type ON courses(type);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_courses_published') THEN
    CREATE INDEX idx_courses_published ON courses(is_published);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_modules_course_order') THEN
    CREATE INDEX idx_modules_course_order ON modules(course_id, sort_order);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_lessons_module_order') THEN
    CREATE INDEX idx_lessons_module_order ON lessons(module_id, sort_order);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quiz_questions_order') THEN
    CREATE INDEX idx_quiz_questions_order ON quiz_questions(quiz_id, sort_order);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_lesson_progress_user') THEN
    CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_lesson_progress_lesson') THEN
    CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quiz_attempts_user') THEN
    CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quiz_attempts_quiz') THEN
    CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quiz_attempts_user_quiz') THEN
    CREATE INDEX idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_course_enrollments_user') THEN
    CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_course_enrollments_course') THEN
    CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
  END IF;

  -- Organization indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_org_members_org') THEN
    CREATE INDEX idx_org_members_org ON org_members(org_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_org_members_user') THEN
    CREATE INDEX idx_org_members_user ON org_members(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_org_invite_links_code') THEN
    CREATE INDEX idx_org_invite_links_code ON org_invite_links(code);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_org_invite_links_org') THEN
    CREATE INDEX idx_org_invite_links_org ON org_invite_links(org_id);
  END IF;
END $$;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first, then recreate (safe approach)
DROP POLICY IF EXISTS "Public read access for courses" ON courses;
DROP POLICY IF EXISTS "Public read access for modules" ON modules;
DROP POLICY IF EXISTS "Public read access for lessons" ON lessons;
DROP POLICY IF EXISTS "Public read access for quizzes" ON quizzes;
DROP POLICY IF EXISTS "Public read access for quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Users can read own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can read own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can read own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can insert own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON course_enrollments;

-- Organization policies
DROP POLICY IF EXISTS "Public can read organizations" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Org admins can update their organization" ON organizations;
DROP POLICY IF EXISTS "Public can read active invite links" ON org_invite_links;
DROP POLICY IF EXISTS "Org admins can manage invite links" ON org_invite_links;
DROP POLICY IF EXISTS "Users can read their own memberships" ON org_members;
DROP POLICY IF EXISTS "Org admins can read all members" ON org_members;
DROP POLICY IF EXISTS "System can insert members" ON org_members;
DROP POLICY IF EXISTS "Org admins can update member status" ON org_members;

-- LMS Policies
CREATE POLICY "Public read access for courses"
  ON courses FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Public read access for modules"
  ON modules FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM courses WHERE courses.id = modules.course_id AND courses.is_published = true
  ));

CREATE POLICY "Public read access for lessons"
  ON lessons FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM modules
    JOIN courses ON courses.id = modules.course_id
    WHERE modules.id = lessons.module_id AND courses.is_published = true
  ));

CREATE POLICY "Public read access for quizzes"
  ON quizzes FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM modules
    JOIN courses ON courses.id = modules.course_id
    WHERE modules.id = quizzes.module_id AND courses.is_published = true
  ));

CREATE POLICY "Public read access for quiz questions"
  ON quiz_questions FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM quizzes
    JOIN modules ON modules.id = quizzes.module_id
    JOIN courses ON courses.id = modules.course_id
    WHERE quizzes.id = quiz_questions.quiz_id AND courses.is_published = true
  ));

CREATE POLICY "Users can read own lesson progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments"
  ON course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
  ON course_enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Organization Policies
CREATE POLICY "Public can read organizations"
  ON organizations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Org admins can update their organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM org_members
    WHERE org_members.org_id = organizations.id
    AND org_members.user_id = auth.uid()
    AND org_members.role = 'admin'
  ));

CREATE POLICY "Public can read active invite links"
  ON org_invite_links FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Org admins can manage invite links"
  ON org_invite_links FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM org_members
    WHERE org_members.org_id = org_invite_links.org_id
    AND org_members.user_id = auth.uid()
    AND org_members.role = 'admin'
  ));

CREATE POLICY "Users can read their own memberships"
  ON org_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Org admins can read all members"
  ON org_members FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM org_members AS admin_check
    WHERE admin_check.org_id = org_members.org_id
    AND admin_check.user_id = auth.uid()
    AND admin_check.role = 'admin'
  ));

CREATE POLICY "System can insert members"
  ON org_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Org admins can update member status"
  ON org_members FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM org_members AS admin_check
    WHERE admin_check.org_id = org_members.org_id
    AND admin_check.user_id = auth.uid()
    AND admin_check.role = 'admin'
  ));

-- =============================================
-- FUNCTIONS
-- =============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Use invite link function
CREATE OR REPLACE FUNCTION use_invite_link(invite_code TEXT, joining_user_id UUID)
RETURNS TABLE(success BOOLEAN, org_id UUID, org_name TEXT, error_message TEXT) AS $$
DECLARE
  v_link org_invite_links%ROWTYPE;
  v_org organizations%ROWTYPE;
  v_existing_member org_members%ROWTYPE;
BEGIN
  -- Find the invite link
  SELECT * INTO v_link FROM org_invite_links
  WHERE code = invite_code AND is_active = true;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid or expired invite link'::TEXT;
    RETURN;
  END IF;

  -- Check expiration
  IF v_link.expires_at IS NOT NULL AND v_link.expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This invite link has expired'::TEXT;
    RETURN;
  END IF;

  -- Check max uses
  IF v_link.max_uses IS NOT NULL AND v_link.use_count >= v_link.max_uses THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This invite link has reached its maximum uses'::TEXT;
    RETURN;
  END IF;

  -- Get organization
  SELECT * INTO v_org FROM organizations WHERE id = v_link.org_id;

  -- Check if already a member
  SELECT * INTO v_existing_member FROM org_members
  WHERE org_id = v_link.org_id AND user_id = joining_user_id;

  IF FOUND THEN
    RETURN QUERY SELECT true, v_org.id, v_org.name, 'Already a member of this organization'::TEXT;
    RETURN;
  END IF;

  -- Add member
  INSERT INTO org_members (org_id, user_id, role, joined_via, status)
  VALUES (v_link.org_id, joining_user_id, 'student', v_link.id, 'active');

  -- Increment use count
  UPDATE org_invite_links SET use_count = use_count + 1 WHERE id = v_link.id;

  RETURN QUERY SELECT true, v_org.id, v_org.name, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS (drop and recreate)
-- =============================================

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_modules_updated_at ON modules;
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
