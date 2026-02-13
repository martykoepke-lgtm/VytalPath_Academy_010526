import { Bot, Stethoscope, ClipboardCheck, Users, FileText, TrendingUp, Clock } from 'lucide-react';
import type { PracticeEngagementSummary, AgentMode } from '../../types/agent';

interface PracticeEngagementPanelProps {
  engagement: PracticeEngagementSummary;
}

const modeConfig: Record<AgentMode, { label: string; icon: typeof Bot; color: string }> = {
  tutor: { label: 'Tutor', icon: Bot, color: 'text-blue-600' },
  'ehr-coach': { label: 'EHR Coach', icon: Stethoscope, color: 'text-teal-600' },
  assessment: { label: 'Practice Qs', icon: ClipboardCheck, color: 'text-green-600' },
  'patient-sim': { label: 'Patient Sim', icon: Users, color: 'text-purple-600' },
  'sop-scenario': { label: 'SOP Scenarios', icon: FileText, color: 'text-amber-600' },
};

export function PracticeEngagementPanel({ engagement }: PracticeEngagementPanelProps) {
  const accuracy = engagement.totalQuestionsAttempted > 0
    ? Math.round((engagement.totalQuestionsCorrect / engagement.totalQuestionsAttempted) * 100)
    : 0;

  const activeModes = (Object.entries(engagement.sessionsByMode) as [AgentMode, number][])
    .filter(([mode, count]) => count > 0 && mode !== 'tutor');

  if (engagement.totalSessions === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">AI Practice Engagement</h3>
            <p className="text-xs text-gray-500">Ungraded adaptive practice sessions</p>
          </div>
        </div>
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">No practice sessions yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Open the AI Study Assistant and switch to Practice mode to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">AI Practice Engagement</h3>
          <p className="text-xs text-gray-500">Ungraded adaptive practice — does not affect quiz scores or certificate</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{engagement.totalSessions}</p>
          <p className="text-xs text-gray-500 mt-0.5">Sessions</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{engagement.totalQuestionsAttempted}</p>
          <p className="text-xs text-gray-500 mt-0.5">Questions</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className={`text-2xl font-bold ${accuracy >= 70 ? 'text-green-600' : accuracy >= 50 ? 'text-amber-600' : 'text-gray-900'}`}>
            {accuracy}%
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Accuracy</p>
        </div>
      </div>

      {/* Sessions by mode */}
      {activeModes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Sessions by Type</p>
          <div className="space-y-1.5">
            {activeModes.map(([mode, count]) => {
              const cfg = modeConfig[mode];
              const Icon = cfg.icon;
              return (
                <div key={mode} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                    <span className="text-sm text-gray-700">{cfg.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Last practice */}
      {engagement.lastPracticeDate && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          Last practice: {new Date(engagement.lastPracticeDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
