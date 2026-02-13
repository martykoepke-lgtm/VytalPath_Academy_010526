export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SectionContext {
  sectionId: string;
  sectionName: string;
  currentPhase?: string;
  currentLesson?: string;
  currentSOP?: string;
  practiceMode?: string;
  scenarioType?: string;
  scenarioInstructions?: string;
  // Agent orchestration fields
  agentMode?: string;
  studentWeaknesses?: string;
  ehrLabState?: string;
}

export interface AiTutorTheme {
  accent: string;
  buttonBg: string;
  buttonHoverBg: string;
  headerBg: string;
  userBubbleBg: string;
  lightBg: string;
  borderColor: string;
  iconColor: string;
  focusRing: string;
}
