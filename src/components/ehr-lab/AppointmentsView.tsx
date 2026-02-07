import { useState, useEffect } from 'react';
import { CalendarPlus, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import { PatientSearchModal } from './PatientSearchModal';

interface AppointmentsViewProps {
  initialPatientId?: string;
  onSelectAppointment: (appointmentId: string) => void;
  onScheduleAppointment: (patientId: string) => void;
  onAddPatient: () => void;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const statusBadgeColors: Record<string, string> = {
  scheduled: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-50 text-blue-700',
  'checked-in': 'bg-green-50 text-green-700',
  completed: 'bg-gray-50 text-gray-500',
  'no-show': 'bg-red-50 text-red-700',
  cancelled: 'bg-gray-50 text-gray-400',
  rescheduled: 'bg-gray-50 text-gray-400',
};

export function AppointmentsView({
  initialPatientId,
  onSelectAppointment,
  onScheduleAppointment,
  onAddPatient,
}: AppointmentsViewProps) {
  const { getPatient, getPatientAppointments, appointmentTypes } = useEHRSession();
  const [patientId, setPatientId] = useState<string | null>(initialPatientId || null);
  const [showSearch, setShowSearch] = useState(!initialPatientId);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  // If no patient in context, show search modal
  useEffect(() => {
    if (!patientId) setShowSearch(true);
  }, [patientId]);

  const patient = patientId ? getPatient(patientId) : null;
  const allAppts = patientId ? getPatientAppointments(patientId) : [];
  const today = new Date().toISOString().split('T')[0];

  const upcomingAppts = allAppts.filter(
    (a) => a.date >= today && a.status !== 'cancelled' && a.status !== 'rescheduled'
  );
  const pastAppts = allAppts.filter(
    (a) => a.date < today || a.status === 'completed' || a.status === 'no-show' || a.status === 'cancelled'
  );

  const displayAppts = tab === 'upcoming' ? upcomingAppts : pastAppts;

  const handleSelectPatient = (id: string) => {
    setPatientId(id);
    setShowSearch(false);
  };

  const handleChangePatient = () => {
    setPatientId(null);
    setShowSearch(true);
  };

  return (
    <div>
      {/* Patient Search Modal */}
      {showSearch && (
        <PatientSearchModal
          onSelectPatient={handleSelectPatient}
          onAddPatient={() => { setShowSearch(false); onAddPatient(); }}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Patient context */}
      {patient ? (
        <>
          {/* Patient banner */}
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <User className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {patient.demographics.lastName}, {patient.demographics.firstName}
                </p>
                <p className="text-xs text-gray-500">
                  {patient.mrn} · DOB: {new Date(patient.demographics.dateOfBirth + 'T12:00:00').toLocaleDateString('en-US')} · {patient.demographics.sexAssignedAtBirth === 'F' ? 'Female' : 'Male'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onScheduleAppointment(patient.id)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-1.5"
              >
                <CalendarPlus className="w-4 h-4" />
                Schedule Appointment
              </button>
              <button
                onClick={handleChangePatient}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Patient
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4">
            <button
              onClick={() => setTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming ({upcomingAppts.length})
            </button>
            <button
              onClick={() => setTab('past')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past ({pastAppts.length})
            </button>
          </div>

          {/* Appointment table */}
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayAppts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                      No {tab} appointments
                    </td>
                  </tr>
                ) : (
                  displayAppts.map((appt) => {
                    const typeConfig = appointmentTypes.find((t) => t.type === appt.appointmentType);
                    const apptDate = new Date(appt.date + 'T12:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    return (
                      <tr
                        key={appt.id}
                        onClick={() => onSelectAppointment(appt.id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{apptDate}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatTime(appt.time)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{typeConfig?.label || appt.appointmentType}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{appt.reasonForVisit}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadgeColors[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                            {appt.status.replace(/-/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* No patient selected — empty state behind modal */
        <div className="text-center py-20 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Search for a patient to view their appointments</p>
        </div>
      )}
    </div>
  );
}
