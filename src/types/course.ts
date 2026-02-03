// Course types for the LMS structure

export type CourseType = 'foundation' | 'role' | 'advanced';
export type ContentType = 'video' | 'reading';
export type QuestionType = 'multiple_choice' | 'true_false';

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: CourseType;
  prerequisite_ids: string[];
  sort_order: number;
  is_published: boolean;
  estimated_hours: number;
  certificate_title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  description: string;
  content_type: ContentType;
  video_url: string | null;
  reading_content: string | null;
  duration_minutes: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  passing_score: number;
  max_attempts: number;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  sort_order: number;
  created_at: string;
}

// Extended types with relationships (for frontend use)
export interface LessonWithStatus extends Lesson {
  is_completed: boolean;
  is_locked: boolean;
}

export interface ModuleWithLessons extends Module {
  lessons: LessonWithStatus[];
  quiz: Quiz | null;
  is_completed: boolean;
  is_locked: boolean;
  quiz_passed: boolean;
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
  progress_percent: number;
  is_enrolled: boolean;
  is_completed: boolean;
  is_locked: boolean;
}
