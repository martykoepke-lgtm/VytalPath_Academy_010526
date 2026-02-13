// Competency Engine — Pure computation, no React dependencies
// Reads progress data from localStorage and computes competency levels per knowledge statement

import { cmaaDomains, type CMAAdomain, type KnowledgeStatement, type ActivityRef } from '../data/cmaaCompetencyMap';

export type CompetencyLevel = 'not_available' | 'not_started' | 'exposed' | 'practiced' | 'assessed' | 'mastered';

export interface KSCompetency {
  ksId: string;
  level: CompetencyLevel;
  activitiesCompleted: number;
  activitiesTotal: number;
  completedActivities: { slug: string; label: string; type: string; score?: number }[];
  quizScore?: number;
}

export interface DomainCompetency {
  domainId: string;
  domainMeta: CMAAdomain;
  overallScore: number;
  ksCompetencies: KSCompetency[];
  distribution: Record<CompetencyLevel, number>;
}

export interface CMAAReadiness {
  overallScore: number;
  domains: DomainCompetency[];
  totalKSCovered: number;
  totalKSPartial: number;
  totalKSGap: number;
  topStrengths: string[];
  topGaps: string[];
}

// ─── Progress data shape from localStorage ───

interface ProgressState {
  quizAttempts: Record<string, { score: number; passed: boolean }[]>;
  lessonProgress: Record<string, { completed: boolean }>;
  moduleProgress: Record<string, { quizPassed: boolean; bestScore: number }>;
}

interface ExerciseProgress {
  completed?: boolean;
  score?: number;
  total?: number;
}

// ─── Read all progress sources ───

function readProgressData(): ProgressState {
  try {
    const raw = localStorage.getItem('vytalpath_progress');
    if (raw) return JSON.parse(raw);
  } catch { /* empty */ }
  return { quizAttempts: {}, lessonProgress: {}, moduleProgress: {} };
}

function readExerciseProgress(key: string): ExerciseProgress | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* empty */ }
  return null;
}

// ─── Check if a specific activity is completed ───

function isActivityCompleted(activity: ActivityRef, progress: ProgressState): { completed: boolean; score?: number } {
  switch (activity.type) {
    case 'lesson': {
      const lp = progress.lessonProgress[activity.slug];
      return { completed: lp?.completed || false };
    }
    case 'quiz': {
      const attempts = progress.quizAttempts[activity.slug];
      if (!attempts || attempts.length === 0) return { completed: false };
      const best = Math.max(...attempts.map(a => a.score));
      const passed = attempts.some(a => a.passed);
      return { completed: passed, score: best };
    }
    case 'sop': {
      // SOPs tracked with sop_ prefix in lesson progress
      const sopKey = `sop_${activity.slug}`;
      const lp = progress.lessonProgress[sopKey];
      return { completed: lp?.completed || false };
    }
    case 'exercise': {
      const ep = readExerciseProgress(activity.slug);
      return { completed: ep?.completed || false, score: ep?.score };
    }
    case 'ai-practice': {
      const ep = readExerciseProgress(activity.slug);
      return { completed: ep?.completed || false, score: ep?.score };
    }
    case 'knowledge-check': {
      const lp = progress.lessonProgress[activity.slug];
      return { completed: lp?.completed || false };
    }
    default:
      return { completed: false };
  }
}

// ─── Compute competency level for one KS ───

function computeKSCompetency(ks: KnowledgeStatement, progress: ProgressState): KSCompetency {
  // Gap = content doesn't exist
  if (ks.coverageStatus === 'gap' && ks.activities.length === 0) {
    return {
      ksId: ks.id,
      level: 'not_available',
      activitiesCompleted: 0,
      activitiesTotal: 0,
      completedActivities: [],
    };
  }

  const total = ks.activities.length;
  if (total === 0) {
    return {
      ksId: ks.id,
      level: ks.coverageStatus === 'gap' ? 'not_available' : 'not_started',
      activitiesCompleted: 0,
      activitiesTotal: 0,
      completedActivities: [],
    };
  }

  const completed: { slug: string; label: string; type: string; score?: number }[] = [];
  let hasLesson = false;
  let hasQuiz = false;
  let hasExerciseOrSop = false;
  let quizScore: number | undefined;

  for (const activity of ks.activities) {
    const result = isActivityCompleted(activity, progress);
    if (result.completed) {
      completed.push({ slug: activity.slug, label: activity.label, type: activity.type, score: result.score });
      if (activity.type === 'lesson') hasLesson = true;
      if (activity.type === 'quiz') { hasQuiz = true; quizScore = result.score; }
      if (activity.type === 'exercise' || activity.type === 'sop' || activity.type === 'ai-practice') hasExerciseOrSop = true;
    }
  }

  let level: CompetencyLevel;

  if (completed.length === 0) {
    level = 'not_started';
  } else if (hasLesson && hasQuiz && hasExerciseOrSop) {
    level = 'mastered';
  } else if (hasQuiz) {
    level = 'assessed';
  } else if (hasLesson && hasExerciseOrSop) {
    level = 'practiced';
  } else {
    level = 'exposed';
  }

  return {
    ksId: ks.id,
    level,
    activitiesCompleted: completed.length,
    activitiesTotal: total,
    completedActivities: completed,
    quizScore,
  };
}

// ─── Compute domain competency ───

function computeDomainCompetency(domain: CMAAdomain, progress: ProgressState): DomainCompetency {
  const ksCompetencies = domain.knowledgeStatements.map(ks => computeKSCompetency(ks, progress));

  const distribution: Record<CompetencyLevel, number> = {
    not_available: 0,
    not_started: 0,
    exposed: 0,
    practiced: 0,
    assessed: 0,
    mastered: 0,
  };

  for (const ksc of ksCompetencies) {
    distribution[ksc.level]++;
  }

  // Score: weighted by level (not_available excluded from denominator)
  const weights: Record<CompetencyLevel, number> = {
    not_available: 0,
    not_started: 0,
    exposed: 0.25,
    practiced: 0.5,
    assessed: 0.75,
    mastered: 1.0,
  };

  const availableKS = ksCompetencies.filter(k => k.level !== 'not_available');
  const totalAvailable = availableKS.length;

  let score = 0;
  if (totalAvailable > 0) {
    const sum = availableKS.reduce((acc, k) => acc + weights[k.level], 0);
    score = Math.round((sum / totalAvailable) * 100);
  }

  return {
    domainId: domain.id,
    domainMeta: domain,
    overallScore: score,
    ksCompetencies,
    distribution,
  };
}

// ─── Main: Compute full CMAA readiness ───

export function computeCMAAReadiness(): CMAAReadiness {
  const progress = readProgressData();
  const domains = cmaaDomains.map(d => computeDomainCompetency(d, progress));

  // Weighted overall score using exam weights
  const overallScore = Math.round(
    domains.reduce((sum, d) => sum + d.overallScore * d.domainMeta.examWeight, 0) /
    domains.reduce((sum, d) => sum + d.domainMeta.examWeight, 0)
  );

  // Count coverage statuses across all KS
  let totalKSCovered = 0;
  let totalKSPartial = 0;
  let totalKSGap = 0;

  for (const domain of cmaaDomains) {
    for (const ks of domain.knowledgeStatements) {
      if (ks.coverageStatus === 'covered') totalKSCovered++;
      else if (ks.coverageStatus === 'partial') totalKSPartial++;
      else totalKSGap++;
    }
  }

  // Identify strengths and gaps
  const sorted = [...domains].sort((a, b) => b.overallScore - a.overallScore);
  const topStrengths = sorted
    .filter(d => d.overallScore > 0)
    .slice(0, 2)
    .map(d => d.domainMeta.shortName);
  const topGaps = sorted
    .filter(d => d.overallScore < 50)
    .reverse()
    .slice(0, 2)
    .map(d => d.domainMeta.shortName);

  return {
    overallScore,
    domains,
    totalKSCovered,
    totalKSPartial,
    totalKSGap,
    topStrengths,
    topGaps,
  };
}

// ─── Enhanced competency with practice engagement ───

/**
 * Enhanced KS competency that factors in adaptive practice engagement.
 * Practice engagement can upgrade 'exposed' → 'practiced' but NEVER:
 * - Downgrades a level
 * - Replaces a graded quiz requirement
 * - Affects certificate eligibility (use computeKSCompetency for that)
 */
export function computeEnhancedKSCompetency(
  ks: KnowledgeStatement,
  progress: ProgressState,
  practiceKSData: { ksId: string; questionsCorrect: number; questionsAsked: number }[]
): KSCompetency {
  const base = computeKSCompetency(ks, progress);

  // Only enhance 'exposed' level — higher levels already account for graded activities
  if (base.level !== 'exposed') return base;

  const relevantPractice = practiceKSData.filter(p => p.ksId === ks.id);
  if (relevantPractice.length === 0) return base;

  const totalCorrect = relevantPractice.reduce((sum, p) => sum + p.questionsCorrect, 0);
  const totalAsked = relevantPractice.reduce((sum, p) => sum + p.questionsAsked, 0);

  // Need at least 3 correct answers to upgrade
  if (totalCorrect >= 3 && totalAsked > 0 && (totalCorrect / totalAsked) >= 0.7) {
    return { ...base, level: 'practiced' };
  }

  return base;
}

/**
 * Compute full CMAA readiness with practice enhancement.
 * Separate from computeCMAAReadiness() which remains the graded-only version.
 */
export function computeEnhancedCMAAReadiness(
  practiceKSData: { ksId: string; questionsCorrect: number; questionsAsked: number }[]
): CMAAReadiness {
  const progress = readProgressData();
  const domains = cmaaDomains.map(domain => {
    const ksCompetencies = domain.knowledgeStatements.map(ks =>
      computeEnhancedKSCompetency(ks, progress, practiceKSData)
    );

    const distribution: Record<CompetencyLevel, number> = {
      not_available: 0, not_started: 0, exposed: 0, practiced: 0, assessed: 0, mastered: 0,
    };
    for (const ksc of ksCompetencies) distribution[ksc.level]++;

    const weights: Record<CompetencyLevel, number> = {
      not_available: 0, not_started: 0, exposed: 0.25, practiced: 0.5, assessed: 0.75, mastered: 1.0,
    };
    const availableKS = ksCompetencies.filter(k => k.level !== 'not_available');
    let score = 0;
    if (availableKS.length > 0) {
      const sum = availableKS.reduce((acc, k) => acc + weights[k.level], 0);
      score = Math.round((sum / availableKS.length) * 100);
    }

    return { domainId: domain.id, domainMeta: domain, overallScore: score, ksCompetencies, distribution };
  });

  const overallScore = Math.round(
    domains.reduce((sum, d) => sum + d.overallScore * d.domainMeta.examWeight, 0) /
    domains.reduce((sum, d) => sum + d.domainMeta.examWeight, 0)
  );

  let totalKSCovered = 0, totalKSPartial = 0, totalKSGap = 0;
  for (const domain of cmaaDomains) {
    for (const ks of domain.knowledgeStatements) {
      if (ks.coverageStatus === 'covered') totalKSCovered++;
      else if (ks.coverageStatus === 'partial') totalKSPartial++;
      else totalKSGap++;
    }
  }

  const sorted = [...domains].sort((a, b) => b.overallScore - a.overallScore);
  const topStrengths = sorted.filter(d => d.overallScore > 0).slice(0, 2).map(d => d.domainMeta.shortName);
  const topGaps = sorted.filter(d => d.overallScore < 50).reverse().slice(0, 2).map(d => d.domainMeta.shortName);

  return { overallScore, domains, totalKSCovered, totalKSPartial, totalKSGap, topStrengths, topGaps };
}

// Competency level display helpers
export const competencyLevelConfig: Record<CompetencyLevel, { label: string; color: string; bg: string; border: string }> = {
  not_available: { label: 'Not Yet Available', color: 'text-gray-400', bg: 'bg-gray-100', border: 'border-gray-200 border-dashed' },
  not_started: { label: 'Not Started', color: 'text-gray-500', bg: 'bg-gray-200', border: 'border-gray-300' },
  exposed: { label: 'Exposed', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' },
  practiced: { label: 'Practiced', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300' },
  assessed: { label: 'Assessed', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  mastered: { label: 'Mastered', color: 'text-green-700', bg: 'bg-green-200', border: 'border-green-400' },
};
