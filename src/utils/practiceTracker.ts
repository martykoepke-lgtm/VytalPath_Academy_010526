// Practice Session Tracker — Ungraded adaptive practice tracking
// Stored in localStorage separately from graded progress (vytalpath_progress)
// This data NEVER affects quiz scores or progress tracking

import type { AgentMode, PracticeSession, PracticeEngagementSummary, PracticeStore } from '../types/agent';

const PRACTICE_STORAGE_KEY = 'vytalpath_practice_sessions';
const MAX_SESSIONS = 50;

export function loadPracticeStore(): PracticeStore {
  try {
    const raw = localStorage.getItem(PRACTICE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore corrupt data */ }
  return {
    sessions: [],
    totalQuestionsAttempted: 0,
    totalQuestionsCorrect: 0,
    lastUpdated: '',
  };
}

export function savePracticeStore(store: PracticeStore): void {
  // Auto-cleanup: keep only the most recent sessions
  if (store.sessions.length > MAX_SESSIONS) {
    store.sessions = store.sessions.slice(-MAX_SESSIONS);
  }
  store.lastUpdated = new Date().toISOString();
  localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(store));
}

export function startSession(mode: AgentMode): PracticeSession {
  const session: PracticeSession = {
    id: crypto.randomUUID(),
    agentMode: mode,
    startedAt: new Date().toISOString(),
    endedAt: null,
    questionsAsked: 0,
    questionsCorrect: 0,
    domainsCovered: [],
    ksIdsCovered: [],
    feedbackReceived: false,
  };
  const store = loadPracticeStore();
  store.sessions.push(session);
  savePracticeStore(store);
  return session;
}

export function recordQuestion(
  sessionId: string,
  correct: boolean,
  ksIds: string[],
  domainIds: string[]
): void {
  const store = loadPracticeStore();
  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) return;

  session.questionsAsked++;
  if (correct) session.questionsCorrect++;
  session.ksIdsCovered = [...new Set([...session.ksIdsCovered, ...ksIds])];
  session.domainsCovered = [...new Set([...session.domainsCovered, ...domainIds])];

  store.totalQuestionsAttempted++;
  if (correct) store.totalQuestionsCorrect++;

  savePracticeStore(store);
}

export function endSession(sessionId: string): void {
  const store = loadPracticeStore();
  const session = store.sessions.find(s => s.id === sessionId);
  if (session) {
    session.endedAt = new Date().toISOString();
    session.feedbackReceived = true;
    savePracticeStore(store);
  }
}

export function computeEngagementSummary(): PracticeEngagementSummary {
  const store = loadPracticeStore();
  const sessionsByMode: Record<AgentMode, number> = {
    tutor: 0,
    'ehr-coach': 0,
    assessment: 0,
    'patient-sim': 0,
    'sop-scenario': 0,
  };

  for (const s of store.sessions) {
    sessionsByMode[s.agentMode] = (sessionsByMode[s.agentMode] || 0) + 1;
  }

  return {
    totalSessions: store.sessions.length,
    totalQuestionsAttempted: store.totalQuestionsAttempted,
    totalQuestionsCorrect: store.totalQuestionsCorrect,
    sessionsByMode,
    recentSessions: store.sessions.slice(-20),
    lastPracticeDate: store.sessions.length > 0
      ? store.sessions[store.sessions.length - 1].startedAt
      : null,
  };
}
