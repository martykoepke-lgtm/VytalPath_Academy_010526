// Types for Interactive Learning Experiences

export type AnswerSeverity = 'correct' | 'partial' | 'wrong';
export type RiskLevel = 'safe' | 'caution' | 'risky' | 'violation';

// Simulation Experience Types ("Your First Day")
export interface SimulationOption {
  id: string;
  text: string;
  isCorrect: boolean;
  severity: AnswerSeverity;
  feedback: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  context?: string; // Optional additional context
  options: SimulationOption[];
}

// Spot the Violation Types
export interface Violation {
  id: string;
  description: string;
  explanation: string;
  lawReference?: string; // e.g., "HIPAA - Minimum Necessary"
}

export interface SpotScene {
  id: string;
  title: string;
  description: string;
  sceneType: 'visual' | 'conversation';
  conversationLines?: string[]; // For conversation-type scenes
  violations: Violation[];
  hints?: string[]; // Optional hints if user is stuck
}

// Risk Meter Types
export interface RiskScenario {
  id: string;
  description: string;
  correctLevel: RiskLevel;
  explanation: string;
  lawReference?: string;
}

// Progress & Results Types
export interface ExperienceProgress {
  simulationScore: number;
  simulationTotal: number;
  simulationCompleted: boolean;
  spotViolationScore: number;
  spotViolationTotal: number;
  spotViolationCompleted: boolean;
  riskMeterScore: number;
  riskMeterTotal: number;
  riskMeterCompleted: boolean;
  allCompleted: boolean;
  completedAt?: string;
}

export interface ExperienceResult {
  experienceType: 'simulation' | 'spot-violation' | 'risk-meter';
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  missedItems: string[]; // IDs of incorrectly answered items
}

// Risk level metadata
export const RISK_LEVELS: Record<RiskLevel, { label: string; color: string; bgColor: string; icon: string }> = {
  safe: { label: 'Safe', color: 'text-green-700', bgColor: 'bg-green-100', icon: '🟢' },
  caution: { label: 'Caution', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: '🟡' },
  risky: { label: 'Risky', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: '🟠' },
  violation: { label: 'Violation', color: 'text-red-700', bgColor: 'bg-red-100', icon: '🔴' },
};
