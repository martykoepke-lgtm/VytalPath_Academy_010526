import type { AiTutorTheme } from '../../types/ai-tutor';

// Unified dark grey theme for consistent Apple-style appearance
const unifiedTheme: AiTutorTheme = {
  accent: 'text-slate-600',
  buttonBg: 'bg-slate-600',
  buttonHoverBg: 'hover:bg-slate-700',
  headerBg: 'bg-slate-600',
  userBubbleBg: 'bg-slate-600',
  lightBg: 'bg-slate-50',
  borderColor: 'border-slate-200',
  iconColor: 'text-slate-600',
  focusRing: 'focus:ring-slate-500',
};

export const aiTutorThemes: Record<string, AiTutorTheme> = {
  foundations: unifiedTheme,
  compliance: unifiedTheme,
  insurance: unifiedTheme,
  workflows: unifiedTheme,
  administration: unifiedTheme,
  terminology: unifiedTheme,
  practice: unifiedTheme,
  'ehr-lab': unifiedTheme,
  'ehr-fundamentals': unifiedTheme,
  communication: unifiedTheme,
};

export const defaultSuggestedQuestions: Record<string, string[]> = {
  workflows: [
    'Walk me through new patient registration',
    'What forms does a Medicare patient need?',
    'How should I handle a no-show?',
    'Explain the check-in process',
  ],
  insurance: [
    'How do I verify insurance eligibility?',
    'Explain copays vs deductibles vs coinsurance',
    'How do I read an insurance card?',
    'What is prior authorization?',
  ],
  compliance: [
    'What is HIPAA and why does it matter?',
    'What counts as PHI?',
    'Explain the Minimum Necessary Rule',
    'What are common HIPAA violations?',
  ],
  foundations: [
    'What does front office staff do?',
    'Explain acute vs ambulatory care',
    'What skills do I need for healthcare admin?',
    'What is the typical front desk workflow?',
  ],
  terminology: [
    'How do medical terms get built?',
    'What are common prefixes I should know?',
    'Explain common abbreviations like PRN and BID',
    'Help me practice decoding a medical term',
  ],
  administration: [
    'Walk me through opening procedures',
    'What are end-of-day closing tasks?',
    'How do I handle office supply management?',
    'Explain cash drawer reconciliation',
  ],
  practice: [
    'Give me a patient check-in scenario to practice',
    'Quiz me on insurance terms',
    'Help me practice phone etiquette',
    'Test my knowledge of HIPAA rules',
  ],
  'ehr-lab': [
    'How do I find a patient in the system?',
    'Walk me through checking in a patient',
    'What patients are available to practice with?',
    'How do I open a patient chart?',
  ],
  'ehr-fundamentals': [
    'What is the difference between PM and EHR?',
    'Explain encounter types in a clinic',
    'What is the encounter lifecycle?',
    'How do scheduling templates work?',
  ],
  communication: [
    'What are the four communication styles?',
    'How do I handle an angry patient at the front desk?',
    'What active listening techniques should I use?',
    'When should I escalate a difficult situation?',
  ],
};
