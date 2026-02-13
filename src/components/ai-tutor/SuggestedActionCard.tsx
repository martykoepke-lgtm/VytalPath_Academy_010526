import { ArrowRight, Target, RotateCcw, Monitor, FileText } from 'lucide-react';
import type { SuggestedAction } from '../../types/agent';

interface SuggestedActionCardProps {
  action: SuggestedAction;
  onAction: () => void;
}

const actionIcons: Record<string, typeof Target> = {
  'practice-weak-area': Target,
  'retry-quiz': RotateCcw,
  'try-ehr-lab': Monitor,
  'review-sop': FileText,
  'complete-lesson': ArrowRight,
};

const actionColors: Record<string, { bg: string; border: string; icon: string; button: string }> = {
  'practice-weak-area': { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' },
  'retry-quiz': { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', button: 'bg-amber-600 hover:bg-amber-700' },
  'try-ehr-lab': { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'text-teal-600', button: 'bg-teal-600 hover:bg-teal-700' },
  'review-sop': { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
  'complete-lesson': { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
};

export default function SuggestedActionCard({ action, onAction }: SuggestedActionCardProps) {
  const Icon = actionIcons[action.type] || Target;
  const colors = actionColors[action.type] || actionColors['practice-weak-area'];

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 mx-4 my-3`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
          <Icon className={`w-4 h-4 ${colors.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{action.label}</p>
          <p className="text-xs text-gray-600 mt-0.5">{action.description}</p>
        </div>
      </div>
      <button
        onClick={onAction}
        className={`mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium ${colors.button} transition-colors`}
      >
        Start
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
