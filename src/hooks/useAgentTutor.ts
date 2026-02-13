// Agent-aware AI Tutor Hook — Enriches SectionContext via the orchestrator
// Use this instead of useAiTutor when you want agent-aware behavior

import { useMemo } from 'react';
import { useAiTutor } from './useAiTutor';
import { useAgentOrchestrator } from '../contexts/AgentOrchestratorContext';
import type { SectionContext } from '../types/ai-tutor';

interface UseAgentTutorOptions {
  onAssistantMessage?: (content: string) => void;
}

export function useAgentTutor(baseSectionContext: SectionContext, options?: UseAgentTutorOptions) {
  const orchestrator = useAgentOrchestrator();

  // Enrich the section context with agent-specific fields
  const enrichedContext = useMemo(() => {
    return orchestrator.getEnrichedSectionContext(baseSectionContext);
  }, [orchestrator, baseSectionContext]);

  const tutorResult = useAiTutor(enrichedContext, options);

  return {
    ...tutorResult,
    activeAgent: orchestrator.activeAgent,
    setActiveAgent: orchestrator.setActiveAgent,
    suggestedNextAction: orchestrator.suggestedNextAction,
    studentProfile: orchestrator.studentProfile,
    startPracticeSession: orchestrator.startPracticeSession,
    endPracticeSession: orchestrator.endPracticeSession,
    recordPracticeQuestion: orchestrator.recordPracticeQuestion,
  };
}
