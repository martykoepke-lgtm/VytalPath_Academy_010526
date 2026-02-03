import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    // Load from localStorage on initial mount
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

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage:', e);
    }
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
      const newAttempt: QuizAttempt = {
        score,
        passed,
        attemptNumber: existingAttempts.length + 1,
        completedAt: new Date().toISOString(),
        answers,
      };

      const updatedModuleProgress: ModuleProgress = {
        quizPassed: passed || prev.moduleProgress[moduleSlug]?.quizPassed || false,
        bestScore: Math.max(score, prev.moduleProgress[moduleSlug]?.bestScore || 0),
        attempts: existingAttempts.length + 1,
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
    setProgress((prev) => ({
      ...prev,
      lessonProgress: {
        ...prev.lessonProgress,
        [lessonSlug]: {
          completed: true,
          completedAt: new Date().toISOString(),
        },
      },
    }));
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
