// Multi-Agent Orchestration System Types

import type { SectionContext } from './ai-tutor';

// ─── Agent Mode Identifiers ───

export type AgentMode = 'tutor' | 'ehr-coach' | 'assessment' | 'patient-sim' | 'sop-scenario';

// ─── Student Weakness Profile ───

export interface StudentWeaknessProfile {
  weakDomains: { domainId: string; shortName: string; score: number }[];
  weakKnowledgeStatements: { ksId: string; text: string; level: string }[];
  completedLessons: string[];
  failedQuizTopics: { moduleSlug: string; bestScore: number }[];
  practiceEngagement: PracticeEngagementSummary;
  overallReadiness: number; // 0-100
}

// ─── EHR Lab Snapshot ───

export interface EHRLabSnapshot {
  currentView: string;
  activePatientId: string | null;
  activeEncounterId: string | null;
  recentActions: string[];
  sessionAge: number; // minutes
}

// ─── Practice Session Tracking (Ungraded) ───

export interface PracticeSession {
  id: string;
  agentMode: AgentMode;
  startedAt: string;
  endedAt: string | null;
  questionsAsked: number;
  questionsCorrect: number;
  domainsCovered: string[];
  ksIdsCovered: string[];
  feedbackReceived: boolean;
}

export interface PracticeEngagementSummary {
  totalSessions: number;
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  sessionsByMode: Record<AgentMode, number>;
  recentSessions: PracticeSession[];
  lastPracticeDate: string | null;
}

export interface PracticeStore {
  sessions: PracticeSession[];
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  lastUpdated: string;
}

// ─── Suggested Actions ───

export type SuggestedActionType =
  | 'practice-weak-area'
  | 'retry-quiz'
  | 'try-ehr-lab'
  | 'review-sop'
  | 'complete-lesson';

export interface SuggestedAction {
  type: SuggestedActionType;
  label: string;
  description: string;
  route: string;
  agentMode?: AgentMode;
  priority: number; // lower = higher priority
}

// ─── Orchestrator Context ───

export interface OrchestratorState {
  activeAgent: AgentMode;
  studentProfile: StudentWeaknessProfile;
  practiceEngagement: PracticeEngagementSummary;

  // Actions
  setActiveAgent: (mode: AgentMode) => void;
  getEnrichedSectionContext: (baseSectionContext: SectionContext) => SectionContext;
  updateEHRSnapshot: (snapshot: EHRLabSnapshot) => void;
  startPracticeSession: (mode: AgentMode) => string; // returns session ID
  endPracticeSession: (sessionId: string) => void;
  recordPracticeQuestion: (sessionId: string, correct: boolean, ksIds: string[], domainIds: string[]) => void;

  // Computed suggestion
  suggestedNextAction: SuggestedAction | null;
}
