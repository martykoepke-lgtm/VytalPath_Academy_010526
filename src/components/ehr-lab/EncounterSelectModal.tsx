import { useState } from 'react';
import { X, FileText, Plus } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';

interface EncounterSelectModalProps {
  patientId: string;
  onSelectEncounter: (encounterId: string) => void;
  onCreateNew: () => void;
  onClose: () => void;
}

const typeLabels: Record<string, string> = {
  clinic: 'Clinic',
  'non-clinic': 'Non-Clinic',
  phone: 'Phone',
  abstraction: 'Abstraction',
};

export function EncounterSelectModal({ patientId, onSelectEncounter, onCreateNew, onClose }: EncounterSelectModalProps) {
  const { getPatientEncounters, getPatient } = useEHRSession();
  const encounters = getPatientEncounters(patientId);
  const patient = getPatient(patientId);
  const [selected, setSelected] = useState<string | 'new'>('new');

  const handleSelect = () => {
    if (selected === 'new') {
      onCreateNew();
    } else {
      onSelectEncounter(selected);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Select Encounter</h2>
            {patient && (
              <p className="text-sm text-gray-500">
                {patient.demographics.lastName}, {patient.demographics.firstName} — {patient.mrn}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Encounter list */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {encounters.length > 0 && (
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Existing Encounters</p>
          )}
          <div className="space-y-2">
            {encounters.map((enc) => {
              const encDate = new Date(enc.date + 'T12:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              return (
                <label
                  key={enc.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selected === enc.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="encounter"
                    checked={selected === enc.id}
                    onChange={() => setSelected(enc.id)}
                    className="accent-teal-600"
                  />
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{encDate}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                        enc.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {enc.status}
                      </span>
                      <span className="text-xs text-gray-400">{typeLabels[enc.type] || enc.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{enc.reason}</p>
                  </div>
                </label>
              );
            })}

            {/* Create new encounter option */}
            <label
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selected === 'new'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="encounter"
                checked={selected === 'new'}
                onChange={() => setSelected('new')}
                className="accent-teal-600"
              />
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-teal-700">Create New Encounter</span>
                <p className="text-xs text-gray-500">Start a new encounter for this patient</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            {selected === 'new' ? 'Continue' : 'Open Encounter'}
          </button>
        </div>
      </div>
    </div>
  );
}
