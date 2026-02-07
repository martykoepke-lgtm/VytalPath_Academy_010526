import { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';

interface PatientSearchModalProps {
  onSelectPatient: (patientId: string) => void;
  onAddPatient: () => void;
  onClose: () => void;
}

export function PatientSearchModal({ onSelectPatient, onAddPatient, onClose }: PatientSearchModalProps) {
  const { searchPatients } = useEHRSession();
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [dob, setDob] = useState('');
  const [mrn, setMrn] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof searchPatients>>([]);

  const handleSearch = () => {
    const query = [lastName, firstName, dob, mrn].filter(Boolean).join(' ').trim();
    if (!query) {
      setResults(searchPatients(''));
    } else {
      setResults(searchPatients(query));
    }
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Patient Search</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search fields */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Thompson"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="James"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">MRN</label>
              <input
                type="text"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="MRN-10001"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={onAddPatient}
              className="px-4 py-2 rounded-lg bg-white text-teal-700 text-sm font-medium border border-teal-300 hover:bg-teal-50 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!hasSearched ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Enter search criteria and click Search
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm">No patients found</p>
              <button
                onClick={onAddPatient}
                className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                + Register New Patient
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRN</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((pt) => (
                  <tr
                    key={pt.id}
                    onClick={() => onSelectPatient(pt.id)}
                    className="hover:bg-teal-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {pt.demographics.lastName}, {pt.demographics.firstName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(pt.demographics.dateOfBirth + 'T12:00:00').toLocaleDateString('en-US')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pt.mrn}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pt.contact.cellPhone || pt.contact.homePhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
