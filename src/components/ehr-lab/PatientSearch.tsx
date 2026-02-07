import { useState } from 'react';
import { Search, UserPlus, AlertTriangle, Phone, Calendar, Shield } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';

interface PatientSearchProps {
  onSelectPatient: (patientId: string) => void;
  onRegisterNew: () => void;
}

export function PatientSearch({ onSelectPatient, onRegisterNew }: PatientSearchProps) {
  const { searchPatients, getPatientAppointments, getNoShowCount } = useEHRSession();
  const [query, setQuery] = useState('');

  const results = searchPatients(query);

  function calculateAge(dob: string): number {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  function formatDOB(dob: string): string {
    const [y, m, d] = dob.split('-');
    return `${m}/${d}/${y}`;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Patient Search</h2>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by patient name, date of birth, or MRN..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-apple-sm"
          autoFocus
        />
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">{results.length} patient{results.length !== 1 ? 's' : ''} found</span>
          <button
            onClick={onRegisterNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 shadow-apple-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Register New Patient
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
          <div className="col-span-2">MRN</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-2">DOB / Age</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Insurance</div>
          <div className="col-span-1">Alerts</div>
        </div>

        {/* Results list */}
        <div className="divide-y divide-gray-100">
          {results.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No patients match your search</p>
              <button
                onClick={onRegisterNew}
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Register a new patient
              </button>
            </div>
          ) : (
            results.map((patient) => {
              const noShows = getNoShowCount(patient.id);
              const appts = getPatientAppointments(patient.id);
              const lastVisit = appts.find((a) => a.status === 'completed');
              const primaryIns = patient.insurances.find((i) => i.type === 'primary');

              return (
                <button
                  key={patient.id}
                  onClick={() => onSelectPatient(patient.id)}
                  className="w-full grid grid-cols-12 gap-2 px-5 py-3 hover:bg-blue-50/50 transition-colors text-left items-center"
                >
                  <div className="col-span-2">
                    <span className="text-sm font-mono text-gray-700">{patient.mrn}</span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-gray-900">
                      {patient.demographics.lastName}, {patient.demographics.firstName}
                    </p>
                    {patient.demographics.preferredName && patient.demographics.preferredName !== patient.demographics.firstName && (
                      <p className="text-xs text-gray-400">"{patient.demographics.preferredName}"</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-700">{formatDOB(patient.demographics.dateOfBirth)}</p>
                    <p className="text-xs text-gray-400">{calculateAge(patient.demographics.dateOfBirth)}y {patient.demographics.sexAssignedAtBirth}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {patient.contact.cellPhone || patient.contact.homePhone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    {primaryIns ? (
                      <div>
                        <p className="text-sm text-gray-700">{primaryIns.carrier}</p>
                        <p className="text-xs text-gray-400">{primaryIns.planType}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center gap-1">
                    {noShows > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700" title={`${noShows} no-show(s)`}>
                        <AlertTriangle className="w-3 h-3" />
                        {noShows}
                      </span>
                    )}
                    {patient.accountBalance > 0 && (
                      <span className="inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700" title={`Balance: $${patient.accountBalance.toFixed(2)}`}>
                        $
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
