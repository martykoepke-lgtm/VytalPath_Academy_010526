// Progress tracking types

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  attempted_at: string;
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  certificate_issued_at: string | null;
  created_at: string;
}

// Aggregated progress for display
export interface ModuleProgress {
  module_id: string;
  completed_lessons: number;
  total_lessons: number;
  quiz_passed: boolean;
  quiz_attempts: number;
  best_score: number | null;
}

export interface CourseProgress {
  course_id: string;
  completed_modules: number;
  total_modules: number;
  completed_lessons: number;
  total_lessons: number;
  progress_percent: number;
  is_complete: boolean;
}

// Session-based progress (before auth is implemented)
export interface SessionProgress {
  session_id: string;
  completed_lessons: string[];
  quiz_attempts: SessionQuizAttempt[];
}

export interface SessionQuizAttempt {
  quiz_id: string;
  score: number;
  passed: boolean;
  attempted_at: string;
}
