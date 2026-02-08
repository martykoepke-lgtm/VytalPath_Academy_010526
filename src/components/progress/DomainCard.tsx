import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CMAAdomain, KnowledgeStatement } from '../../data/cmaaCompetencyMap';
import { type DomainCompetency, type KSCompetency, type CompetencyLevel, competencyLevelConfig } from '../../utils/cmaaCompetencyEngine';

interface DomainCardProps {
  domain: DomainCompetency;
}

// Stacked bar segment colors
const barColors: Record<CompetencyLevel, string> = {
  mastered: 'bg-green-500',
  assessed: 'bg-emerald-400',
  practiced: 'bg-blue-400',
  exposed: 'bg-amber-300',
  not_started: 'bg-gray-200',
  not_available: 'bg-gray-100',
};

function StackedBar({ distribution, total }: { distribution: Record<CompetencyLevel, number>; total: number }) {
  if (total === 0) return null;
  const levels: CompetencyLevel[] = ['mastered', 'assessed', 'practiced', 'exposed', 'not_started', 'not_available'];

  return (
    <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 w-full">
      {levels.map(level => {
        const count = distribution[level];
        if (count === 0) return null;
        const pct = (count / total) * 100;
        return (
          <div
            key={level}
            className={`${barColors[level]} transition-all duration-500`}
            style={{ width: `${pct}%` }}
            title={`${competencyLevelConfig[level].label}: ${count}`}
          />
        );
      })}
    </div>
  );
}

function CompetencyBadge({ level }: { level: CompetencyLevel }) {
  const config = competencyLevelConfig[level];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded ${config.bg} ${config.color} ${config.border} border`}>
      {config.label}
    </span>
  );
}

function KSRow({ ks, competency }: { ks: KnowledgeStatement; competency: KSCompetency }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const hasActivities = ks.activities.length > 0;

  return (
    <div className="border-b border-gray-50 last:border-b-0">
      <button
        onClick={() => hasActivities && setExpanded(!expanded)}
        className={`w-full flex items-start gap-2 px-3 py-1.5 text-left ${hasActivities ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'} transition-colors`}
      >
        {hasActivities ? (
          <ChevronRight className={`w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}
        <span className="text-[11px] font-mono text-gray-400 flex-shrink-0 w-6">{ks.id}</span>
        <span className="text-[12px] text-gray-700 flex-1 leading-tight">{ks.text}</span>
        <div className="flex-shrink-0 ml-2">
          <CompetencyBadge level={competency.level} />
        </div>
      </button>

      {expanded && (
        <div className="pl-12 pr-3 pb-2 space-y-1">
          {ks.activities.map(activity => {
            const done = competency.completedActivities.find(a => a.slug === activity.slug);
            return (
              <div key={`${activity.type}-${activity.slug}`} className="flex items-center gap-2 text-[11px]">
                <span className={done ? 'text-green-500' : 'text-gray-300'}>{done ? '✓' : '○'}</span>
                {activity.link ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(activity.link!);
                    }}
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-left"
                  >
                    {activity.label}
                    {done?.score !== undefined && <span className="text-gray-400">({done.score}%)</span>}
                    <ExternalLink className="w-2.5 h-2.5 text-blue-400" />
                  </button>
                ) : (
                  <span className="text-gray-600">
                    {activity.label}
                    {done?.score !== undefined && <span className="text-gray-400 ml-1">({done.score}%)</span>}
                  </span>
                )}
                <span className="text-[10px] text-gray-300 capitalize">{activity.type.replace('-', ' ')}</span>
              </div>
            );
          })}
          {ks.plannedContent && (
            <div className="text-[11px] text-gray-400 italic">
              Planned: {ks.plannedContent}
            </div>
          )}
        </div>
      )}

      {!expanded && competency.level === 'not_available' && ks.plannedContent && (
        <div className="pl-12 pr-3 pb-1.5 text-[10px] text-gray-400 italic">
          {ks.plannedContent}
        </div>
      )}
    </div>
  );
}

export function DomainCard({ domain }: DomainCardProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = domain.domainMeta;
  const totalKS = meta.knowledgeStatements.length;
  const availableKS = domain.ksCompetencies.filter(k => k.level !== 'not_available').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-semibold text-gray-900">{meta.name}</span>
            <span className="text-[11px] text-gray-400">{meta.examItems} items · {Math.round(meta.examWeight * 100)}%</span>
          </div>
          <StackedBar distribution={domain.distribution} total={totalKS} />
        </div>

        <div className="flex-shrink-0 text-right">
          <div className={`text-lg font-bold ${domain.overallScore >= 50 ? 'text-green-600' : domain.overallScore > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
            {domain.overallScore}%
          </div>
          <div className="text-[10px] text-gray-400">{availableKS}/{totalKS} available</div>
        </div>
      </button>

      {/* Knowledge Statements */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          {meta.knowledgeStatements.map((ks, i) => {
            const competency = domain.ksCompetencies[i];
            return <KSRow key={ks.id} ks={ks} competency={competency} />;
          })}
        </div>
      )}
    </div>
  );
}
