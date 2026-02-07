import { useState } from 'react';
import { Calendar, Clock, Save, X, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import type { AppointmentType } from '../../types/ehr';

interface AppointmentSchedulerProps {
  preselectedPatientId?: string;
  preselectedDate?: string;
  preselectedTime?: string;
  onComplete: (appointmentId: string) => void;
  onCancel: () => void;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const typeColors: Record<string, string> = {
  'new-patient': 'border-blue-300 bg-blue-50',
  'follow-up': 'border-green-300 bg-green-50',
  'annual-physical': 'border-purple-300 bg-purple-50',
  'urgent': 'border-red-300 bg-red-50',
  'telehealth': 'border-teal-300 bg-teal-50',
  'procedure': 'border-orange-300 bg-orange-50',
  'lab-only': 'border-gray-300 bg-gray-50',
  'nurse-visit': 'border-pink-300 bg-pink-50',
  'consultation': 'border-amber-300 bg-amber-50',
  'pre-op': 'border-orange-300 bg-orange-50',
};

export function AppointmentScheduler({ preselectedPatientId, preselectedDate, preselectedTime, onComplete, onCancel }: AppointmentSchedulerProps) {
  const { patients, searchPatients, provider, appointmentTypes, addAppointment, getDayAppointments, getNoShowCount } = useEHRSession();

  const [patientId, setPatientId] = useState(preselectedPatientId || '');
  const [patientQuery, setPatientQuery] = useState('');
  const [apptType, setApptType] = useState<AppointmentType>('follow-up');
  const [date, setDate] = useState(preselectedDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(preselectedTime || '');
  const [reason, setReason] = useState('');
  const [referral, setReferral] = useState('');
  const [priorAuth, setPriorAuth] = useState('');
  const [notes, setNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const selectedPatient = patients.find((p) => p.id === patientId);
  const selectedType = appointmentTypes.find((t) => t.type === apptType);
  const searchResults = patientQuery ? searchPatients(patientQuery) : [];
  const noShows = patientId ? getNoShowCount(patientId) : 0;

  // Generate available time slots for selected date
  const template = provider.scheduleTemplate;
  const dayAppts = getDayAppointments(date);
  const [startH] = template.startTime.split(':').map(Number);
  const [endH] = template.endTime.split(':').map(Number);
  const [lunchStartH, lunchStartM] = template.lunchStart.split(':').map(Number);
  const [lunchEndH, lunchEndM] = template.lunchEnd.split(':').map(Number);

  const allSlots: string[] = [];
  for (let h = startH; h < endH; h++) {
    for (let m = 0; m < 60; m += template.defaultSlotMinutes) {
      const slotTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const mins = h * 60 + m;
      const isLunch = mins >= lunchStartH * 60 + lunchStartM && mins < lunchEndH * 60 + lunchEndM;
      if (!isLunch) allSlots.push(slotTime);
    }
  }

  const occupiedSlots = new Set<string>();
  dayAppts.forEach((a) => {
    const [ah, am] = a.time.split(':').map(Number);
    const start = ah * 60 + am;
    for (let m = start; m < start + a.durationMinutes; m += template.defaultSlotMinutes) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      occupiedSlots.add(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    }
  });

  const availableSlots = allSlots.filter((s) => !occupiedSlots.has(s));

  // Validation warnings
  const warnings: string[] = [];
  if (time && apptType === 'new-patient') {
    const [h] = time.split(':').map(Number);
    const [cutoffH] = provider.preferences.noNewPatientsAfter.split(':').map(Number);
    if (h >= cutoffH) warnings.push(`Provider prefers no new patients after ${formatTime(provider.preferences.noNewPatientsAfter)}`);
  }
  if (noShows >= 3) warnings.push(`Patient has ${noShows} previous no-shows`);
  if (selectedPatient?.insurances[0]?.referralRequired && !referral) {
    warnings.push(`Patient's insurance (${selectedPatient.insurances[0].carrier} ${selectedPatient.insurances[0].planType}) requires a referral`);
  }

  const canSubmit = patientId && date && time && reason;

  const handleSubmit = () => {
    if (!canSubmit || !selectedType) return;
    const appt = addAppointment({
      patientId,
      providerId: provider.id,
      date,
      time,
      durationMinutes: selectedType.defaultDuration,
      appointmentType: apptType,
      status: 'scheduled',
      reasonForVisit: reason,
      referralNumber: referral,
      priorAuthNumber: priorAuth,
      notes,
      confirmationStatus: 'unconfirmed',
      reminderPreference: ['text'],
      isRecurring: false,
      recurringInterval: null,
      arrivalTime: null,
      copayCollected: false,
      copayAmount: null,
      cancellationReason: null,
      rescheduledFrom: null,
      rescheduledTo: null,
      noShowFollowUp: null,
      createdBy: 'Front Desk',
    });
    setShowConfirmation(true);
    setTimeout(() => onComplete(appt.id), 1500);
  };

  if (showConfirmation) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-10">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Appointment Scheduled</h2>
          <p className="text-gray-500">
            {selectedPatient?.demographics.firstName} {selectedPatient?.demographics.lastName} — {formatTime(time)} on {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    );
  }

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Schedule Appointment</h2>
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column: Patient + Type */}
        <div className="col-span-2 space-y-6">
          {/* Patient selection */}
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5">
            <h3 className="font-medium text-gray-900 mb-3">1. Select Patient</h3>
            {selectedPatient ? (
              <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3 border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">{selectedPatient.demographics.lastName}, {selectedPatient.demographics.firstName}</p>
                  <p className="text-sm text-gray-500">{selectedPatient.mrn} | DOB: {selectedPatient.demographics.dateOfBirth}</p>
                </div>
                <button onClick={() => { setPatientId(''); setPatientQuery(''); }} className="text-sm text-blue-600 hover:text-blue-700">Change</button>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className={`${inputCls} pl-10`} value={patientQuery} onChange={(e) => setPatientQuery(e.target.value)} placeholder="Search patient by name, DOB, or MRN..." autoFocus />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    {searchResults.map((p) => (
                      <button key={p.id} onClick={() => { setPatientId(p.id); setPatientQuery(''); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 transition-colors text-left border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.demographics.lastName}, {p.demographics.firstName}</p>
                          <p className="text-xs text-gray-400">{p.mrn}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Appointment type */}
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5">
            <h3 className="font-medium text-gray-900 mb-3">2. Appointment Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {appointmentTypes.map((t) => (
                <button
                  key={t.type}
                  onClick={() => setApptType(t.type)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium text-left border-2 transition-all ${
                    apptType === t.type
                      ? `${typeColors[t.type]} border-current`
                      : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                  }`}
                >
                  <span>{t.label}</span>
                  <span className="text-xs opacity-60 ml-1">({t.defaultDuration}m)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date, Time, Reason */}
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5 space-y-4">
            <h3 className="font-medium text-gray-900 mb-3">3. Date, Time & Reason</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <select className={inputCls} value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="">Select time...</option>
                  {availableSlots.map((s) => (
                    <option key={s} value={s}>{formatTime(s)}</option>
                  ))}
                </select>
                {availableSlots.length === 0 && <p className="text-xs text-red-500 mt-1">No available slots for this date</p>}
              </div>
            </div>
            <div>
              <label className={labelCls}>Reason for Visit / Chief Complaint *</label>
              <input className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Follow-up for diabetes management, A1C review" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Referral # (if applicable)</label>
                <input className={inputCls} value={referral} onChange={(e) => setReferral(e.target.value)} placeholder="REF-XXXX-XXXX" />
              </div>
              <div>
                <label className={labelCls}>Prior Auth # (if applicable)</label>
                <input className={inputCls} value={priorAuth} onChange={(e) => setPriorAuth(e.target.value)} placeholder="PA-XXXX" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea className={`${inputCls} h-20 resize-none`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal staff notes..." />
            </div>
          </div>
        </div>

        {/* Right column: Summary */}
        <div className="space-y-4">
          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">{w}</p>
                </div>
              ))}
            </div>
          )}

          {/* Summary card */}
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5">
            <h3 className="font-medium text-gray-900 mb-4">Appointment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Patient</span>
                <span className="text-gray-900 font-medium">{selectedPatient ? `${selectedPatient.demographics.lastName}, ${selectedPatient.demographics.firstName}` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-900">{selectedType?.label || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="text-gray-900">{selectedType?.defaultDuration || '—'} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">{date ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="text-gray-900">{time ? formatTime(time) : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider</span>
                <span className="text-gray-900">Dr. {provider.lastName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
              canSubmit
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
