import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ChevronDown, ChevronUp, Info, LogIn, XCircle, LogOut, RefreshCw } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import { scheduleTypeDescriptions } from '../../data/ehr-clinic-data';
import type { ScheduleType, AppointmentStatus } from '../../types/ehr';

interface ProviderScheduleViewProps {
  onSelectAppointment: (appointmentId: string) => void;
  onCheckIn: (appointmentId: string) => void;
  onCheckOut: (appointmentId: string) => void;
  onReschedule: (patientId: string, date: string, time: string) => void;
  onAddAppointment: () => void;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const statusBadgeColors: Record<string, string> = {
  scheduled: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-50 text-blue-700',
  'checked-in': 'bg-green-50 text-green-700',
  roomed: 'bg-emerald-50 text-emerald-700',
  'with-provider': 'bg-indigo-50 text-indigo-700',
  'check-out': 'bg-amber-50 text-amber-700',
  completed: 'bg-gray-50 text-gray-500',
  'no-show': 'bg-red-50 text-red-700',
  cancelled: 'bg-gray-50 text-gray-400 line-through',
  rescheduled: 'bg-gray-50 text-gray-400',
  lwbs: 'bg-orange-50 text-orange-700',
};

export function ProviderScheduleView({
  onSelectAppointment,
  onCheckIn,
  onCheckOut,
  onReschedule,
  onAddAppointment,
}: ProviderScheduleViewProps) {
  const {
    getDayAppointments,
    provider,
    patients,
    clinic,
    appointmentTypes,
    activeScheduleType,
    setActiveScheduleType,
    noShowAppointment,
  } = useEHRSession();

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('');
  const [showScheduleInfo, setShowScheduleInfo] = useState(false);

  const dayAppts = getDayAppointments(currentDate);
  const template = provider.scheduleTemplate;

  // Filter appointments
  const filteredAppts = filter.trim()
    ? dayAppts.filter((a) => {
        const patient = patients.find((p) => p.id === a.patientId);
        const name = patient ? `${patient.demographics.firstName} ${patient.demographics.lastName}` : '';
        const q = filter.toLowerCase();
        return name.toLowerCase().includes(q) || a.reasonForVisit.toLowerCase().includes(q);
      })
    : dayAppts;

  // Add lunch row between morning and afternoon
  const lunchStart = template.lunchStart;
  const lunchEnd = template.lunchEnd;

  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };
  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };
  const goToday = () => setCurrentDate(new Date().toISOString().split('T')[0]);

  const isToday = currentDate === new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
  const displayDate = new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const scheduleTypes: ScheduleType[] = ['time-specified', 'wave', 'modified-wave', 'block', 'open-booking'];

  // Determine which actions are available per status
  const canCheckIn = (status: AppointmentStatus) => status === 'confirmed' || status === 'scheduled';
  const canNoShow = (status: AppointmentStatus) => status === 'confirmed' || status === 'scheduled';
  const canCheckOut = (status: AppointmentStatus) => status === 'checked-in' || status === 'roomed' || status === 'with-provider' || status === 'check-out';
  const canReschedule = (status: AppointmentStatus) => status === 'scheduled' || status === 'confirmed';

  // Split into before-lunch, lunch, after-lunch
  const beforeLunch = filteredAppts.filter((a) => a.time < lunchStart);
  const afterLunch = filteredAppts.filter((a) => a.time >= lunchEnd);

  const renderRow = (appt: typeof dayAppts[0]) => {
    const patient = patients.find((p) => p.id === appt.patientId);
    const typeConfig = appointmentTypes.find((t) => t.type === appt.appointmentType);
    const patientName = patient ? `${patient.demographics.lastName}, ${patient.demographics.firstName}` : 'Unknown';

    return (
      <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
          {formatTime(appt.time)}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => onSelectAppointment(appt.id)}
            className="text-sm font-medium text-gray-900 hover:text-teal-700 transition-colors"
          >
            {patientName}
          </button>
          {patient && <p className="text-xs text-gray-400">{patient.mrn}</p>}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
          {appt.reasonForVisit}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
          {appt.durationMinutes}m · {typeConfig?.label || appt.appointmentType}
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusBadgeColors[appt.status] || 'bg-gray-100 text-gray-600'}`}>
            {appt.status.replace(/-/g, ' ')}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
          {clinic.name.split(' ').slice(0, 2).join(' ')}
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-1">
            {canCheckIn(appt.status) && (
              <button
                onClick={(e) => { e.stopPropagation(); onCheckIn(appt.id); }}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                title="Check In"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
            {canNoShow(appt.status) && (
              <button
                onClick={(e) => { e.stopPropagation(); noShowAppointment(appt.id); }}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                title="No Show"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
            {canCheckOut(appt.status) && (
              <button
                onClick={(e) => { e.stopPropagation(); onCheckOut(appt.id); }}
                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                title="Check Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            {canReschedule(appt.status) && (
              <button
                onClick={(e) => { e.stopPropagation(); onReschedule(appt.patientId, appt.date, appt.time); }}
                className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                title="Reschedule"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      {/* Date navigation + filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={prevDay} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center min-w-[200px]">
            <p className="font-medium text-gray-900">{dayOfWeek}</p>
            <p className="text-sm text-gray-500">{displayDate}</p>
          </div>
          <button onClick={nextDay} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          {!isToday && (
            <button onClick={goToday} className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-600 hover:bg-teal-100 transition-all">
              Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name or reason..."
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={onAddAppointment}
            className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Schedule table */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Reason</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration/Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAppts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  {filter ? 'No matching appointments' : 'No appointments scheduled for this day'}
                </td>
              </tr>
            ) : (
              <>
                {beforeLunch.map(renderRow)}
                {/* Lunch break row */}
                {(beforeLunch.length > 0 || afterLunch.length > 0) && (
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-400 font-medium">{formatTime(lunchStart)}</td>
                    <td colSpan={6} className="px-4 py-2 text-sm text-gray-400 italic text-center">
                      Lunch Break ({formatTime(lunchStart)} — {formatTime(lunchEnd)})
                    </td>
                  </tr>
                )}
                {afterLunch.map(renderRow)}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Schedule Type info panel (collapsible) */}
      <div className="mt-4">
        <button
          onClick={() => setShowScheduleInfo(!showScheduleInfo)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Info className="w-4 h-4" />
          Schedule Type Training
          {showScheduleInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showScheduleInfo && (
          <div className="mt-3 bg-white rounded-2xl shadow-apple border border-gray-200/50 p-4">
            <div className="flex gap-2 flex-wrap mb-3">
              {scheduleTypes.map((st) => {
                const desc = scheduleTypeDescriptions[st];
                return (
                  <button
                    key={st}
                    onClick={() => setActiveScheduleType(st)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      activeScheduleType === st
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {desc?.name || st}
                  </button>
                );
              })}
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
              <p className="text-sm font-medium text-teal-900">{scheduleTypeDescriptions[activeScheduleType]?.name}</p>
              <p className="text-sm text-teal-700 mt-1">{scheduleTypeDescriptions[activeScheduleType]?.howItWorks}</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
        <span>{filteredAppts.length} appointment{filteredAppts.length !== 1 ? 's' : ''}</span>
        <span>{filteredAppts.filter((a) => a.status === 'checked-in' || a.status === 'roomed' || a.status === 'with-provider').length} in office</span>
        <span>{filteredAppts.filter((a) => a.status === 'completed').length} completed</span>
        <span>{filteredAppts.filter((a) => a.status === 'no-show').length} no-show</span>
      </div>
    </div>
  );
}
