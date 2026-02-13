// Student Profile Computer — Computes weakness profile from progress + competency data
// Pure functions, no React dependencies

import { computeCMAAReadiness } from './cmaaCompetencyEngine';
import { computeEngagementSummary } from './practiceTracker';
import { cmaaDomains } from '../data/cmaaCompetencyMap';
import type { StudentWeaknessProfile, EHRLabSnapshot } from '../types/agent';

export function computeStudentWeaknessProfile(): StudentWeaknessProfile {
  const readiness = computeCMAAReadiness();
  const practiceData = computeEngagementSummary();

  // Sort domains by score ascending to find weakest
  const weakDomains = readiness.domains
    .filter(d => d.overallScore < 70)
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 3)
    .map(d => ({
      domainId: d.domainId,
      shortName: d.domainMeta.shortName,
      score: d.overallScore,
    }));

  // Find KS that are not_started or exposed
  const weakKS: { ksId: string; text: string; level: string }[] = [];
  for (const domain of readiness.domains) {
    for (const ks of domain.ksCompetencies) {
      if (ks.level === 'not_started' || ks.level === 'exposed') {
        const ksDef = cmaaDomains
          .flatMap(d => d.knowledgeStatements)
          .find(k => k.id === ks.ksId);
        if (ksDef) {
          weakKS.push({
            ksId: ks.ksId,
            text: ksDef.text,
            level: ks.level,
          });
        }
      }
    }
  }

  // Find failed quiz topics
  const failedQuizTopics: { moduleSlug: string; bestScore: number }[] = [];
  try {
    const raw = localStorage.getItem('vytalpath_progress');
    if (raw) {
      const progress = JSON.parse(raw);
      for (const [slug, attempts] of Object.entries(progress.quizAttempts || {})) {
        const arr = attempts as { score: number; passed: boolean }[];
        const anyPassed = arr.some(a => a.passed);
        if (!anyPassed && arr.length > 0) {
          failedQuizTopics.push({
            moduleSlug: slug,
            bestScore: Math.max(...arr.map(a => a.score)),
          });
        }
      }
    }
  } catch { /* ignore */ }

  // Completed lessons
  let completedLessons: string[] = [];
  try {
    const raw = localStorage.getItem('vytalpath_progress');
    if (raw) {
      const progress = JSON.parse(raw);
      completedLessons = Object.keys(progress.lessonProgress || {})
        .filter(slug => progress.lessonProgress[slug]?.completed);
    }
  } catch { /* ignore */ }

  return {
    weakDomains,
    weakKnowledgeStatements: weakKS.slice(0, 10),
    completedLessons,
    failedQuizTopics,
    practiceEngagement: practiceData,
    overallReadiness: readiness.overallScore,
  };
}

// ─── Serialization helpers for prompt injection ───

export function serializeWeaknessProfile(profile: StudentWeaknessProfile): string {
  const weak = profile.weakDomains.slice(0, 3);
  const ks = profile.weakKnowledgeStatements.slice(0, 5);
  const failed = profile.failedQuizTopics.slice(0, 3);

  let result = `Overall Readiness: ${profile.overallReadiness}%\n`;
  if (weak.length > 0) {
    result += `Weakest Domains: ${weak.map(d => `${d.shortName} (${d.score}%)`).join(', ')}\n`;
  }
  if (ks.length > 0) {
    result += `Focus Areas:\n${ks.map(k => `- ${k.text} [${k.level}]`).join('\n')}\n`;
  }
  if (failed.length > 0) {
    result += `Failed Quiz Topics: ${failed.map(f => `${f.moduleSlug} (best: ${f.bestScore}%)`).join(', ')}`;
  }
  if (profile.practiceEngagement.totalSessions > 0) {
    const accuracy = profile.practiceEngagement.totalQuestionsAttempted > 0
      ? Math.round((profile.practiceEngagement.totalQuestionsCorrect / profile.practiceEngagement.totalQuestionsAttempted) * 100)
      : 0;
    result += `\nPractice Stats: ${profile.practiceEngagement.totalSessions} sessions, ${accuracy}% accuracy`;
  }
  return result;
}

export function serializeEHRSnapshot(snapshot: EHRLabSnapshot): string {
  return `Current View: ${snapshot.currentView}
Active Patient: ${snapshot.activePatientId || 'None'}
Active Encounter: ${snapshot.activeEncounterId || 'None'}
Session Duration: ${snapshot.sessionAge} minutes`;
}
