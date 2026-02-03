// Types for interactive learning features

export interface KnowledgeCheckQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface LessonKnowledgeCheck {
  lessonId: string;
  questions: KnowledgeCheckQuestion[];
}

// Drag-and-drop matching types
export interface MatchingTerm {
  id: string;
  term: string;
  definition: string;
}

export interface MatchingExercise {
  id: string;
  title: string;
  description: string;
  terms: MatchingTerm[];
}
