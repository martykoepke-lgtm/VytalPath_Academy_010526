import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { calculateCompletionPercent } from '../utils/completionCalculator';

// Types for progress tracking
interface QuizAttempt {
  score: number;
  passed: boolean;
  attemptNumber: number;
  completedAt: string;
  answers: Record<string, string>;
}

interface LessonProgress {
  completed: boolean;
  completedAt: string;
}

interface ModuleProgress {
  quizPassed: boolean;
  bestScore: number;
  attempts: number;
}

interface ProgressState {
  quizAttempts: Record<string, QuizAttempt[]>; // moduleSlug -> attempts
  lessonProgress: Record<string, LessonProgress>; // lessonSlug -> progress
  moduleProgress: Record<string, ModuleProgress>; // moduleSlug -> progress
}

interface ProgressContextType {
  // Quiz functions
  getQuizAttempts: (moduleSlug: string) => QuizAttempt[];
  getLatestQuizAttempt: (moduleSlug: string) => QuizAttempt | null;
  getBestQuizScore: (moduleSlug: string) => number;
  hasPassedQuiz: (moduleSlug: string) => boolean;
  getRemainingAttempts: (moduleSlug: string, maxAttempts: number) => number;
  saveQuizAttempt: (moduleSlug: string, score: number, passed: boolean, answers: Record<string, string>) => void;

  // Lesson functions
  isLessonCompleted: (lessonSlug: string) => boolean;
  markLessonComplete: (lessonSlug: string) => void;

  // Module functions
  isModuleCompleted: (moduleSlug: string, lessonSlugs: string[]) => boolean;
  getModuleProgress: (moduleSlug: string) => ModuleProgress | null;

  // Utility
  clearAllProgress: () => void;
}

const STORAGE_KEY = 'vytalpath_progress';

const defaultProgress: ProgressState = {
  quizAttempts: {},
  lessonProgress: {},
  moduleProgress: {},
};

// ---------------------------------------------------------------------------
// Merge helpers: combine localStorage + Supabase data (union, never lose data)
// ---------------------------------------------------------------------------
function deriveModuleProgress(quizAttempts: Record<string, QuizAttempt[]>): Record<string, ModuleProgress> {
  const result: Record<string, ModuleProgress> = {};
  for (const [slug, attempts] of Object.entries(quizAttempts)) {
    result[slug] = {
      quizPassed: attempts.some(a => a.passed),
      bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0,
      attempts: attempts.length,
    };
  }
  return result;
}

function mergeProgress(
  local: ProgressState,
  remote: { lessonProgress: Record<string, LessonProgress>; quizAttempts: Record<string, QuizAttempt[]> }
): ProgressState {
  // Merge lessons: union, keep earliest completedAt
  const mergedLessons: Record<string, LessonProgress> = { ...remote.lessonProgress };
  for (const [slug, lp] of Object.entries(local.lessonProgress)) {
    if (!mergedLessons[slug]) {
      mergedLessons[slug] = lp;
    } else if (lp.completedAt && lp.completedAt < mergedLessons[slug].completedAt) {
      mergedLessons[slug] = lp;
    }
  }

  // Merge quiz attempts: union by module slug, deduplicate by attemptNumber
  const mergedQuizAttempts: Record<string, QuizAttempt[]> = {};
  const allModuleSlugs = new Set([
    ...Object.keys(local.quizAttempts),
    ...Object.keys(remote.quizAttempts),
  ]);

  for (const slug of allModuleSlugs) {
    const localAttempts = local.quizAttempts[slug] || [];
    const remoteAttempts = remote.quizAttempts[slug] || [];
    const byAttemptNumber = new Map<number, QuizAttempt>();
    for (const a of localAttempts) byAttemptNumber.set(a.attemptNumber, a);
    for (const a of remoteAttempts) byAttemptNumber.set(a.attemptNumber, a); // remote wins ties
    mergedQuizAttempts[slug] = Array.from(byAttemptNumber.values())
      .sort((a, b) => a.attemptNumber - b.attemptNumber);
  }

  return {
    lessonProgress: mergedLessons,
    quizAttempts: mergedQuizAttempts,
    moduleProgress: deriveModuleProgress(mergedQuizAttempts),
  };
}

function findLocalOnlyLessons(
  local: Record<string, LessonProgress>,
  remote: Record<string, LessonProgress>
): Array<{ lessonSlug: string; completedAt: string }> {
  const result: Array<{ lessonSlug: string; completedAt: string }> = [];
  for (const [slug, lp] of Object.entries(local)) {
    if (lp.completed && !remote[slug]) {
      result.push({ lessonSlug: slug, completedAt: lp.completedAt });
    }
  }
  return result;
}

function findLocalOnlyQuizAttempts(
  local: Record<string, QuizAttempt[]>,
  remote: Record<string, QuizAttempt[]>
): Array<{ moduleSlug: string; score: number; passed: boolean; attemptNumber: number; answers: Record<string, string>; completedAt: string }> {
  const result: Array<{ moduleSlug: string; score: number; passed: boolean; attemptNumber: number; answers: Record<string, string>; completedAt: string }> = [];
  for (const [slug, attempts] of Object.entries(local)) {
    const remoteAttempts = remote[slug] || [];
    const remoteNumbers = new Set(remoteAttempts.map(a => a.attemptNumber));
    for (const a of attempts) {
      if (!remoteNumbers.has(a.attemptNumber)) {
        result.push({
          moduleSlug: slug,
          score: a.score,
          passed: a.passed,
          attemptNumber: a.attemptNumber,
          answers: a.answers,
          completedAt: a.completedAt,
        });
      }
    }
  }
  return result;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [progress, setProgress] = useState<ProgressState>(() => {
    // Load from localStorage on initial mount (instant)
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage:', e);
    }
    return defaultProgress;
  });

  // Track which user we've synced for (prevents duplicate syncs)
  const hasSyncedRef = useRef<string | null>(null);

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage:', e);
    }
  }, [progress]);

  // ---------------------------------------------------------------------------
  // Supabase sync: load on login, merge with localStorage, push local-only data
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      hasSyncedRef.current = null;
      return;
    }

    // Don't re-sync if we already synced for this user in this session
    if (hasSyncedRef.current === user.id) return;

    const loadAndMerge = async () => {
      try {
        const { data, error } = await (supabase.rpc as any)('load_user_progress', {
          p_user_id: user.id,
        });

        if (error) {
          console.error('Failed to load progress from Supabase:', error);
          // Fall back to localStorage only — app still works
          hasSyncedRef.current = user.id;
          return;
        }

        const remoteState = data as {
          lessonProgress: Record<string, LessonProgress>;
          quizAttempts: Record<string, QuizAttempt[]>;
        };

        // Read current localStorage state for merge
        let localState = defaultProgress;
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) localState = JSON.parse(stored);
        } catch {
          // Use default if parse fails
        }

        // Merge local + remote (union — never lose data)
        const merged = mergeProgress(localState, remoteState);
        setProgress(merged);

        // Push any local-only data to Supabase
        const localOnlyLessons = findLocalOnlyLessons(
          localState.lessonProgress,
          remoteState.lessonProgress
        );
        const localOnlyQuizzes = findLocalOnlyQuizAttempts(
          localState.quizAttempts,
          remoteState.quizAttempts
        );

        if (localOnlyLessons.length > 0 || localOnlyQuizzes.length > 0) {
          await (supabase.rpc as any)('bulk_sync_progress', {
            p_user_id: user.id,
            p_lessons: localOnlyLessons,
            p_quizzes: localOnlyQuizzes,
          });
        }

        hasSyncedRef.current = user.id;
      } catch (err) {
        console.error('Progress sync error:', err);
        // Still mark as synced to avoid retry loops; next login will retry
        hasSyncedRef.current = user.id;
      }
    };

    loadAndMerge();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced sync of completion % to Supabase (5s delay)
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedPercent = useRef<number>(-1);

  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);

    syncTimer.current = setTimeout(async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const isLesson = (slug: string) => progress.lessonProgress[slug]?.completed || false;
        const isQuiz = (slug: string) => (progress.quizAttempts[slug] || []).some(a => a.passed);
        const { percent } = calculateCompletionPercent(isLesson, isQuiz);

        // Only sync if the percentage actually changed
        if (percent !== lastSyncedPercent.current) {
          lastSyncedPercent.current = percent;
          await (supabase.rpc as any)('sync_completion_percentage', {
            p_user_id: authUser.id,
            p_completion_percentage: percent,
          });
        }
      } catch (err) {
        // Silent fail — sync is best-effort
      }
    }, 5000);

    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
  }, [progress]);

  // Quiz functions
  const getQuizAttempts = (moduleSlug: string): QuizAttempt[] => {
    return progress.quizAttempts[moduleSlug] || [];
  };

  const getLatestQuizAttempt = (moduleSlug: string): QuizAttempt | null => {
    const attempts = getQuizAttempts(moduleSlug);
    return attempts.length > 0 ? attempts[attempts.length - 1] : null;
  };

  const getBestQuizScore = (moduleSlug: string): number => {
    const attempts = getQuizAttempts(moduleSlug);
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map((a) => a.score));
  };

  const hasPassedQuiz = (moduleSlug: string): boolean => {
    const attempts = getQuizAttempts(moduleSlug);
    return attempts.some((a) => a.passed);
  };

  const getRemainingAttempts = (moduleSlug: string, maxAttempts: number): number => {
    const attempts = getQuizAttempts(moduleSlug);
    return Math.max(0, maxAttempts - attempts.length);
  };

  const saveQuizAttempt = (
    moduleSlug: string,
    score: number,
    passed: boolean,
    answers: Record<string, string>
  ) => {
    setProgress((prev) => {
      const existingAttempts = prev.quizAttempts[moduleSlug] || [];
      const attemptNumber = existingAttempts.length + 1;
      const completedAt = new Date().toISOString();

      const newAttempt: QuizAttempt = {
        score,
        passed,
        attemptNumber,
        completedAt,
        answers,
      };

      // Fire-and-forget Supabase write
      if (user) {
        (supabase.rpc as any)('save_quiz_attempt', {
          p_user_id: user.id,
          p_module_slug: moduleSlug,
          p_score: score,
          p_passed: passed,
          p_attempt_number: attemptNumber,
          p_answers: answers,
          p_completed_at: completedAt,
        }).then(({ error }: any) => {
          if (error) console.error('Failed to save quiz attempt to Supabase:', error);
        });
      }

      const updatedModuleProgress: ModuleProgress = {
        quizPassed: passed || prev.moduleProgress[moduleSlug]?.quizPassed || false,
        bestScore: Math.max(score, prev.moduleProgress[moduleSlug]?.bestScore || 0),
        attempts: attemptNumber,
      };

      return {
        ...prev,
        quizAttempts: {
          ...prev.quizAttempts,
          [moduleSlug]: [...existingAttempts, newAttempt],
        },
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleSlug]: updatedModuleProgress,
        },
      };
    });
  };

  // Lesson functions
  const isLessonCompleted = (lessonSlug: string): boolean => {
    return progress.lessonProgress[lessonSlug]?.completed || false;
  };

  const markLessonComplete = (lessonSlug: string) => {
    const completedAt = new Date().toISOString();

    setProgress((prev) => ({
      ...prev,
      lessonProgress: {
        ...prev.lessonProgress,
        [lessonSlug]: {
          completed: true,
          completedAt,
        },
      },
    }));

    // Fire-and-forget Supabase write
    if (user) {
      (supabase.rpc as any)('save_lesson_complete', {
        p_user_id: user.id,
        p_lesson_slug: lessonSlug,
        p_completed_at: completedAt,
      }).then(({ error }: any) => {
        if (error) console.error('Failed to save lesson to Supabase:', error);
      });
    }
  };

  // Module functions
  const isModuleCompleted = (moduleSlug: string, lessonSlugs: string[]): boolean => {
    // Module is complete if all lessons are done AND quiz is passed
    const allLessonsDone = lessonSlugs.every((slug) => isLessonCompleted(slug));
    const quizPassed = hasPassedQuiz(moduleSlug);
    return allLessonsDone && quizPassed;
  };

  const getModuleProgress = (moduleSlug: string): ModuleProgress | null => {
    return progress.moduleProgress[moduleSlug] || null;
  };

  // Utility
  const clearAllProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);

    // Also clear Supabase data
    if (user) {
      supabase.from('user_lesson_progress').delete().eq('user_id', user.id)
        .then(({ error }) => { if (error) console.error('Failed to clear lesson progress:', error); });
      supabase.from('user_quiz_attempts').delete().eq('user_id', user.id)
        .then(({ error }) => { if (error) console.error('Failed to clear quiz attempts:', error); });
    }
  };

  const value: ProgressContextType = {
    getQuizAttempts,
    getLatestQuizAttempt,
    getBestQuizScore,
    hasPassedQuiz,
    getRemainingAttempts,
    saveQuizAttempt,
    isLessonCompleted,
    markLessonComplete,
    isModuleCompleted,
    getModuleProgress,
    clearAllProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
