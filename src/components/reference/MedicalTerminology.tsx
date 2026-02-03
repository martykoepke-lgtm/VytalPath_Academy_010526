import { useState } from 'react';
import { TerminologyView } from '../TerminologyView';
import { TermDetail } from '../TermDetail';
import type { MedicalTerm } from '../../types/medical';

export function MedicalTerminology() {
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);

  return (
    <>
      <TerminologyView onTermSelect={setSelectedTerm} />

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTerm(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <TermDetail term={selectedTerm} onClose={() => setSelectedTerm(null)} />
          </div>
        </div>
      )}
    </>
  );
}
