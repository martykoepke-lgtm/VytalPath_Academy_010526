// Agent Orchestrator Context — Central coordination for multi-agent system
// Reads from ProgressContext to compute student weakness profile,
// determines active agent mode, and constructs enriched SectionContext

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import type { SectionContext } from '../types/ai-tutor';
import type {
  AgentMode,
  EHRLabSnapshot,
  OrchestratorState,
  SuggestedAction,
  StudentWeaknessProfile,
  PracticeEngagementSummary,
} from '../types/agent';
import { computeStudentWeaknessProfile, serializeWeaknessProfile, serializeEHRSnapshot } from '../utils/studentProfileComputer';
import { computeEngagementSummary, startSession as startPracticeSession, endSession as endPracticeSession, recordQuestion as recordPracticeQuestion } from '../utils/practiceTracker';
import { useProgress } from './ProgressContext';

const AgentOrchestratorContext = createContext<OrchestratorState | null>(null);

export function useAgentOrchestrator(): OrchestratorState {
  const ctx = useContext(AgentOrchestratorContext);
  if (!ctx) throw new Error('useAgentOrchestrator must be used within AgentOrchestratorProvider');
  return ctx;
}

function computeSuggestedAction(
  profile: StudentWeaknessProfile,
  engagement: PracticeEngagementSummary
): SuggestedAction | null {
  // Priority 1: Failed quiz topics — suggest retry
  if (profile.failedQuizTopics.length > 0) {
    const worst = profile.failedQuizTopics.sort((a, b) => a.bestScore - b.bestScore)[0];
    return {
      type: 'retry-quiz',
      label: 'Retry Quiz',
      description: `You scored ${worst.bestScore}% on ${worst.moduleSlug.replace(/-/g, ' ')}. Practice these topics to improve.`,
      route: '/progress',
      agentMode: 'assessment',
      priority: 1,
    };
  }

  // Priority 2: Weak domains — suggest adaptive practice
  if (profile.weakDomains.length > 0) {
    const weakest = profile.weakDomains[0];
    return {
      type: 'practice-weak-area',
      label: 'Practice Weak Area',
      description: `${weakest.shortName} is at ${weakest.score}%. Try adaptive practice to strengthen this area.`,
      route: '/progress',
      agentMode: 'assessment',
      priority: 2,
    };
  }

  // Priority 3: If never used EHR Lab — suggest trying it
  if (engagement.sessionsByMode['ehr-coach'] === 0) {
    return {
      type: 'try-ehr-lab',
      label: 'Try EHR Lab',
      description: 'Practice hands-on EHR workflows with AI coaching in the Practice Lab.',
      route: '/ehr-lab',
      agentMode: 'ehr-coach',
      priority: 3,
    };
  }

  // Priority 4: If never done SOP practice — suggest it
  if (engagement.sessionsByMode['sop-scenario'] === 0) {
    return {
      type: 'review-sop',
      label: 'Practice SOPs',
      description: 'Test your knowledge of standard operating procedures with realistic scenarios.',
      route: '/workflows/sops',
      agentMode: 'sop-scenario',
      priority: 4,
    };
  }

  return null;
}

export function AgentOrchestratorProvider({ children }: { children: ReactNode }) {
  const [activeAgent, setActiveAgent] = useState<AgentMode>('tutor');
  const [ehrSnapshot, setEHRSnapshot] = useState<EHRLabSnapshot | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);

  // Access progress context to trigger recomputation on progress changes
  const progress = useProgress();

  // Compute student profile — recomputes when progress or session tracking changes
  const studentProfile = useMemo<StudentWeaknessProfile>(() => {
    return computeStudentWeaknessProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, sessionVersion]);

  // Compute practice engagement
  const practiceEngagement = useMemo<PracticeEngagementSummary>(() => {
    return computeEngagementSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionVersion]);

  // Compute suggested next action
  const suggestedNextAction = useMemo<SuggestedAction | null>(() => {
    return computeSuggestedAction(studentProfile, practiceEngagement);
  }, [studentProfile, practiceEngagement]);

  // Enrich a base SectionContext with agent-specific fields
  const getEnrichedSectionContext = useCallback((base: SectionContext): SectionContext => {
    const enriched = { ...base };

    switch (activeAgent) {
      case 'ehr-coach':
        enriched.practiceMode = 'ehr-coach';
        enriched.agentMode = 'ehr-coach';
        if (ehrSnapshot) {
          enriched.ehrLabState = serializeEHRSnapshot(ehrSnapshot);
        }
        break;

      case 'assessment':
        enriched.practiceMode = 'adaptive-assessment';
        enriched.agentMode = 'assessment';
        enriched.studentWeaknesses = serializeWeaknessProfile(studentProfile);
        break;

      case 'sop-scenario':
        enriched.practiceMode = 'sop-scenario';
        enriched.agentMode = 'sop-scenario';
        // scenarioInstructions will be set by the SOP page
        break;

      case 'patient-sim':
        enriched.practiceMode = 'patient-simulation';
        enriched.agentMode = 'patient-sim';
        enriched.studentWeaknesses = serializeWeaknessProfile(studentProfile);
        break;

      case 'tutor':
      default:
        // Existing behavior — no modification
        break;
    }

    return enriched;
  }, [activeAgent, ehrSnapshot, studentProfile]);

  const updateEHRSnapshot = useCallback((snapshot: EHRLabSnapshot) => {
    setEHRSnapshot(snapshot);
  }, []);

  const handleStartPracticeSession = useCallback((mode: AgentMode): string => {
    const session = startPracticeSession(mode);
    setSessionVersion(v => v + 1);
    return session.id;
  }, []);

  const handleEndPracticeSession = useCallback((sessionId: string) => {
    endPracticeSession(sessionId);
    setSessionVersion(v => v + 1);
  }, []);

  const handleRecordPracticeQuestion = useCallback((
    sessionId: string,
    correct: boolean,
    ksIds: string[],
    domainIds: string[]
  ) => {
    recordPracticeQuestion(sessionId, correct, ksIds, domainIds);
    setSessionVersion(v => v + 1);
  }, []);

  const value = useMemo<OrchestratorState>(() => ({
    activeAgent,
    studentProfile,
    practiceEngagement,
    setActiveAgent,
    getEnrichedSectionContext,
    updateEHRSnapshot,
    startPracticeSession: handleStartPracticeSession,
    endPracticeSession: handleEndPracticeSession,
    recordPracticeQuestion: handleRecordPracticeQuestion,
    suggestedNextAction,
  }), [
    activeAgent,
    studentProfile,
    practiceEngagement,
    getEnrichedSectionContext,
    updateEHRSnapshot,
    handleStartPracticeSession,
    handleEndPracticeSession,
    handleRecordPracticeQuestion,
    suggestedNextAction,
  ]);

  return (
    <AgentOrchestratorContext.Provider value={value}>
      {children}
    </AgentOrchestratorContext.Provider>
  );
}
