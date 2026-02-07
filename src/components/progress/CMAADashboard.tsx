import { useMemo } from 'react';
import { BarChart3, BookOpen, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { computeCMAAReadiness, competencyLevelConfig, type CompetencyLevel } from '../../utils/cmaaCompetencyEngine';
import { ReadinessGauge } from './ReadinessGauge';
import { DomainCard } from './DomainCard';

const legendLevels: CompetencyLevel[] = ['mastered', 'assessed', 'practiced', 'exposed', 'not_started', 'not_available'];

export function CMAADashboard() {
  const readiness = useMemo(() => computeCMAAReadiness(), []);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-3 bg-indigo-100 rounded-2xl shadow-sm">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-1">CMAA Exam Readiness</h1>
        <p className="text-sm text-gray-500">
          Track your progress against all 101 NHA CMAA knowledge statements across 7 exam domains.
        </p>
      </header>

      {/* Score Overview Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Gauge */}
          <div className="flex-shrink-0">
            <ReadinessGauge score={readiness.overallScore} />
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Covered</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{readiness.totalKSCovered}</span>
              <span className="text-[11px] text-gray-400 ml-1">of 101</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Partial</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{readiness.totalKSPartial}</span>
              <span className="text-[11px] text-gray-400 ml-1">of 101</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Gaps</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{readiness.totalKSGap}</span>
              <span className="text-[11px] text-gray-400 ml-1">of 101</span>
            </div>
          </div>

          {/* Strengths & Focus */}
          <div className="flex-shrink-0 space-y-2 text-[12px]">
            {readiness.topStrengths.length > 0 && (
              <div className="flex items-start gap-1.5">
                <Target className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-500">Strengths: </span>
                  <span className="font-medium text-gray-700">{readiness.topStrengths.join(', ')}</span>
                </div>
              </div>
            )}
            {readiness.topGaps.length > 0 && (
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-500">Focus areas: </span>
                  <span className="font-medium text-gray-700">{readiness.topGaps.join(', ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-3 justify-center">
          {legendLevels.map(level => {
            const config = competencyLevelConfig[level];
            return (
              <div key={level} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-sm ${config.bg} ${config.border} border`} />
                <span className="text-[10px] text-gray-500">{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Info Bar */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-100 px-4 py-2.5 mb-5 flex items-center justify-between text-[11px] text-indigo-700">
        <span>NHA CMAA Exam: 110 scored questions · 2h 15m · Passing: 390/500</span>
        <span className="font-medium">7 Domains · 101 Knowledge Statements</span>
      </div>

      {/* Domain Cards */}
      <section className="space-y-3" aria-label="CMAA Domains">
        {readiness.domains.map(domain => (
          <DomainCard key={domain.domainId} domain={domain} />
        ))}
      </section>

      {/* Footer note */}
      <div className="mt-6 text-center text-[11px] text-gray-400 pb-8">
        <p>Coverage status reflects currently available content. "Not Yet Available" items are planned for future modules.</p>
        <p className="mt-1">Your competency level updates automatically as you complete lessons, quizzes, and exercises.</p>
      </div>
    </article>
  );
}
