import { X, Building2, Phone, FileText, ClipboardList } from 'lucide-react';
import type { EncounterType } from '../../types/ehr';

interface EncounterTypeModalProps {
  allowClinic?: boolean;
  onSelectType: (type: EncounterType) => void;
  onClose: () => void;
}

const encounterTypeCards: { type: EncounterType; label: string; description: string; icon: typeof Building2; color: string }[] = [
  {
    type: 'clinic',
    label: 'Clinic',
    description: 'In-person office visit',
    icon: Building2,
    color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
  },
  {
    type: 'non-clinic',
    label: 'Non-Clinic',
    description: 'Outside facility encounter',
    icon: ClipboardList,
    color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
  },
  {
    type: 'phone',
    label: 'Phone',
    description: 'Telephone encounter',
    icon: Phone,
    color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
  },
  {
    type: 'abstraction',
    label: 'Abstraction',
    description: 'Chart review / data entry',
    icon: FileText,
    color: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
  },
];

export function EncounterTypeModal({ allowClinic = false, onSelectType, onClose }: EncounterTypeModalProps) {
  const cards = allowClinic
    ? encounterTypeCards
    : encounterTypeCards.filter((c) => c.type !== 'clinic');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select Encounter Type</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Type cards */}
        <div className="p-6">
          <div className={`grid ${cards.length === 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.type}
                  onClick={() => onSelectType(card.type)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${card.color}`}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{card.label}</span>
                  <span className="text-xs opacity-70 text-center">{card.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
