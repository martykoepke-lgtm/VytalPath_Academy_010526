import { useState } from 'react';
import {
  Calendar, Clock, User, AlertTriangle, CheckCircle, XCircle,
  RefreshCw, Phone, FileText, ChevronRight, ArrowRight,
} from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import { cancellationReasons } from '../../data/ehr-clinic-data';

interface AppointmentDetailProps {
  appointmentId: string;
  onCheckIn: (appointmentId: string) => void;
  onCheckOut: (appointmentId: string) => void;
  onReschedule: (appointmentId: string) => void;
  onViewChart: (patientId: string) => void;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function formatDate(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: 'text-gray-700', bg: 'bg-gray-100' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-50' },
  'checked-in': { label: 'Checked In', color: 'text-green-700', bg: 'bg-green-50' },
  roomed: { label: 'Roomed', color: 'text-teal-700', bg: 'bg-teal-50' },
  'with-provider': { label: 'With Provider', color: 'text-purple-700', bg: 'bg-purple-50' },
  'check-out': { label: 'Check Out', color: 'text-amber-700', bg: 'bg-amber-50' },
  completed: { label: 'Completed', color: 'text-gray-500', bg: 'bg-gray-50' },
  'no-show': { label: 'No-Show', color: 'text-red-700', bg: 'bg-red-50' },
  cancelled: { label: 'Cancelled', color: 'text-gray-400', bg: 'bg-gray-50' },
  rescheduled: { label: 'Rescheduled', color: 'text-orange-600', bg: 'bg-orange-50' },
  lwbs: { label: 'Left Without Being Seen', color: 'text-red-600', bg: 'bg-red-50' },
};

const statusFlow = ['scheduled', 'confirmed', 'checked-in', 'roomed', 'with-provider', 'check-out', 'completed'];

export function AppointmentDetail({ appointmentId, onCheckIn, onCheckOut, onReschedule, onViewChart }: AppointmentDetailProps) {
  const { getAppointment, getPatient, appointmentTypes, updateAppointment, cancelAppointment, noShowAppointment, getNoShowCount } = useEHRSession();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNoShowModal, setShowNoShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [noShowNotes, setNoShowNotes] = useState('');
  const [noShowReschedule, setNoShowReschedule] = useState(false);
  const [noShowLetter, setNoShowLetter] = useState(false);

  const appt = getAppointment(appointmentId);
  if (!appt) return <div className="p-8 text-center text-gray-500">Appointment not found</div>;

  const patient = getPatient(appt.patientId);
  const typeConfig = appointmentTypes.find((t) => t.type === appt.appointmentType);
  const status = statusConfig[appt.status] || statusConfig.scheduled;
  const noShows = patient ? getNoShowCount(patient.id) : 0;
  const today = new Date().toISOString().split('T')[0];

  const canConfirm = appt.status === 'scheduled';
  const canCheckIn = ['scheduled', 'confirmed'].includes(appt.status) && appt.date === today;
  const canAdvance = ['checked-in', 'roomed', 'with-provider'].includes(appt.status);
  const canCheckOut = appt.status === 'check-out' || canAdvance;
  const canCancel = !['completed', 'cancelled', 'no-show', 'rescheduled'].includes(appt.status);
  const canNoShow = ['scheduled', 'confirmed'].includes(appt.status);
  const canReschedule = !['completed', 'cancelled', 'no-show', 'rescheduled'].includes(appt.status);

  const currentStepIdx = statusFlow.indexOf(appt.status);

  const handleAdvanceStatus = () => {
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < statusFlow.length) {
      updateAppointment(appointmentId, { status: statusFlow[nextIdx] as any });
    }
  };

  const handleCancel = () => {
    if (!cancelReason) return;
    cancelAppointment(appointmentId, cancelReason);
    setShowCancelModal(false);
  };

  const handleNoShow = () => {
    noShowAppointment(appointmentId);
    if (noShowNotes || noShowReschedule || noShowLetter) {
      updateAppointment(appointmentId, {
        noShowFollowUp: {
          contactAttempts: 0,
          rescheduleOffered: noShowReschedule,
          letterSent: noShowLetter,
          letterSentDate: noShowLetter ? today : null,
          notes: noShowNotes,
        },
      });
    }
    setShowNoShowModal(false);
    if (noShowReschedule) {
      onReschedule(appointmentId);
    }
  };

  return (
    <div>
      {/* Patient banner */}
      {patient && (
        <button
          onClick={() => onViewChart(patient.id)}
          className="w-full bg-white rounded-2xl shadow-apple border border-gray-200/50 p-4 mb-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{patient.demographics.lastName}, {patient.demographics.firstName}</p>
              <p className="text-sm text-gray-500">{patient.mrn} | DOB: {patient.demographics.dateOfBirth}</p>
            </div>
            {noShows > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                <AlertTriangle className="w-3 h-3" /> {noShows} no-show{noShows > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            View Chart <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main details */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Date</span><p className="font-medium text-gray-900 mt-0.5">{formatDate(appt.date)}</p></div>
              <div><span className="text-gray-500">Time</span><p className="font-medium text-gray-900 mt-0.5">{formatTime(appt.time)} ({appt.durationMinutes} min)</p></div>
              <div><span className="text-gray-500">Type</span><p className="font-medium text-gray-900 mt-0.5">{typeConfig?.label || appt.appointmentType}</p></div>
              <div><span className="text-gray-500">Provider</span><p className="font-medium text-gray-900 mt-0.5">Dr. {useEHRSession().provider.lastName}</p></div>
              <div className="col-span-2"><span className="text-gray-500">Reason for Visit</span><p className="font-medium text-gray-900 mt-0.5">{appt.reasonForVisit}</p></div>
              {appt.referralNumber && <div><span className="text-gray-500">Referral #</span><p className="font-medium text-gray-900 mt-0.5">{appt.referralNumber}</p></div>}
              {appt.notes && <div className="col-span-2"><span className="text-gray-500">Notes</span><p className="text-gray-700 mt-0.5">{appt.notes}</p></div>}
              {appt.arrivalTime && <div><span className="text-gray-500">Arrival Time</span><p className="font-medium text-gray-900 mt-0.5">{formatTime(appt.arrivalTime)}</p></div>}
              {appt.copayCollected && <div><span className="text-gray-500">Copay</span><p className="font-medium text-green-700 mt-0.5">${appt.copayAmount} collected</p></div>}
            </div>
          </div>

          {/* Status timeline */}
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Status Progression</h3>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {statusFlow.map((s, i) => {
                const isCurrent = s === appt.status;
                const isPast = i < currentStepIdx;
                const cfg = statusConfig[s];
                return (
                  <div key={s} className="flex items-center">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                      isCurrent ? `${cfg.bg} ${cfg.color} ring-2 ring-offset-1 ring-blue-300` :
                      isPast ? 'bg-green-50 text-green-600' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {isPast && <CheckCircle className="w-3 h-3" />}
                      {cfg.label}
                    </div>
                    {i < statusFlow.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300 mx-0.5 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* No-show follow-up details (if applicable) */}
          {appt.status === 'no-show' && appt.noShowFollowUp && (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
              <h3 className="font-medium text-red-900 mb-3">No-Show Follow-Up</h3>
              <div className="space-y-2 text-sm">
                <p className="text-red-800">Reschedule offered: {appt.noShowFollowUp.rescheduleOffered ? 'Yes' : 'No'}</p>
                <p className="text-red-800">Letter sent: {appt.noShowFollowUp.letterSent ? `Yes (${appt.noShowFollowUp.letterSentDate})` : 'No'}</p>
                {appt.noShowFollowUp.notes && <p className="text-red-700">Notes: {appt.noShowFollowUp.notes}</p>}
              </div>
            </div>
          )}

          {appt.cancellationReason && (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
              <h3 className="font-medium text-gray-700 mb-1">Cancellation Reason</h3>
              <p className="text-sm text-gray-600">{appt.cancellationReason}</p>
            </div>
          )}
        </div>

        {/* Action sidebar */}
        <div className="space-y-3">
          {canConfirm && (
            <button onClick={() => updateAppointment(appointmentId, { status: 'confirmed', confirmationStatus: 'confirmed' })} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm transition-all">
              <Phone className="w-4 h-4" /> Confirm Appointment
            </button>
          )}
          {canCheckIn && (
            <button onClick={() => onCheckIn(appointmentId)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 shadow-apple-sm transition-all">
              <CheckCircle className="w-4 h-4" /> Check In Patient
            </button>
          )}
          {canAdvance && (
            <button onClick={handleAdvanceStatus} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm transition-all">
              <ArrowRight className="w-4 h-4" /> Advance to {statusConfig[statusFlow[currentStepIdx + 1]]?.label}
            </button>
          )}
          {canCheckOut && (
            <button onClick={() => onCheckOut(appointmentId)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 shadow-apple-sm transition-all">
              <FileText className="w-4 h-4" /> Check Out
            </button>
          )}
          {canReschedule && (
            <button onClick={() => onReschedule(appointmentId)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all">
              <RefreshCw className="w-4 h-4" /> Reschedule
            </button>
          )}
          {canCancel && (
            <button onClick={() => setShowCancelModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
              <XCircle className="w-4 h-4" /> Cancel Appointment
            </button>
          )}
          {canNoShow && (
            <button onClick={() => setShowNoShowModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all">
              <AlertTriangle className="w-4 h-4" /> Mark No-Show
            </button>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Appointment</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason *</label>
            <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm mb-4" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
              <option value="">Select reason...</option>
              {cancellationReasons.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                Go Back
              </button>
              <button onClick={handleCancel} disabled={!cancelReason} className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${cancelReason ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No-Show Modal */}
      {showNoShowModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark as No-Show</h3>
            {noShows >= 2 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">This patient has {noShows} previous no-shows</p>
              </div>
            )}
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" checked={noShowReschedule} onChange={(e) => setNoShowReschedule(e.target.checked)} />
                Reschedule offered
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" checked={noShowLetter} onChange={(e) => setNoShowLetter(e.target.checked)} />
                Send no-show letter
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm h-20 resize-none" value={noShowNotes} onChange={(e) => setNoShowNotes(e.target.value)} placeholder="Contact attempts, messages left..." />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNoShowModal(false)} className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                Go Back
              </button>
              <button onClick={handleNoShow} className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all">
                Confirm No-Show
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
