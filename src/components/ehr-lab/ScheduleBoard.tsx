import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, Users, Clock, Plus } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import { scheduleTypeDescriptions } from '../../data/ehr-clinic-data';
import type { ScheduleType } from '../../types/ehr';

interface ScheduleBoardProps {
  onSelectAppointment: (appointmentId: string) => void;
  onBookSlot: (date: string, time: string) => void;
}

const typeColors: Record<string, string> = {
  'new-patient': 'bg-blue-100 border-blue-300 text-blue-800',
  'follow-up': 'bg-green-100 border-green-300 text-green-800',
  'annual-physical': 'bg-purple-100 border-purple-300 text-purple-800',
  'urgent': 'bg-red-100 border-red-300 text-red-800',
  'telehealth': 'bg-teal-100 border-teal-300 text-teal-800',
  'procedure': 'bg-orange-100 border-orange-300 text-orange-800',
  'lab-only': 'bg-gray-100 border-gray-300 text-gray-700',
  'nurse-visit': 'bg-pink-100 border-pink-300 text-pink-800',
  'consultation': 'bg-amber-100 border-amber-300 text-amber-800',
  'pre-op': 'bg-orange-100 border-orange-300 text-orange-700',
};

const statusIcons: Record<string, string> = {
  scheduled: '○',
  confirmed: '◉',
  'checked-in': '●',
  roomed: '▸',
  'with-provider': '▶',
  'check-out': '◀',
  completed: '✓',
  'no-show': '✗',
  cancelled: '—',
  rescheduled: '↻',
};

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function ScheduleBoard({ onSelectAppointment, onBookSlot }: ScheduleBoardProps) {
  const { getDayAppointments, provider, patients, activeScheduleType, setActiveScheduleType, appointmentTypes } = useEHRSession();
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTypeInfo, setShowTypeInfo] = useState(false);

  const dayAppts = getDayAppointments(currentDate);
  const template = provider.scheduleTemplate;

  // Generate time slots
  const slots: string[] = [];
  const [startH] = template.startTime.split(':').map(Number);
  const [endH] = template.endTime.split(':').map(Number);
  const [lunchStartH, lunchStartM] = template.lunchStart.split(':').map(Number);
  const [lunchEndH, lunchEndM] = template.lunchEnd.split(':').map(Number);
  for (let h = startH; h < endH; h++) {
    for (let m = 0; m < 60; m += template.defaultSlotMinutes) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  const isLunchSlot = (time: string): boolean => {
    const [h, m] = time.split(':').map(Number);
    const mins = h * 60 + m;
    return mins >= lunchStartH * 60 + lunchStartM && mins < lunchEndH * 60 + lunchEndM;
  };

  // Get appointment for a given slot
  const getSlotAppointment = (slotTime: string) => {
    return dayAppts.find((a) => a.time === slotTime);
  };

  // Check if a slot is covered by a multi-slot appointment that starts earlier
  const isSlotCovered = (slotTime: string): string | null => {
    const [sh, sm] = slotTime.split(':').map(Number);
    const slotMins = sh * 60 + sm;
    for (const appt of dayAppts) {
      const [ah, am] = appt.time.split(':').map(Number);
      const apptStart = ah * 60 + am;
      const apptEnd = apptStart + appt.durationMinutes;
      if (slotMins > apptStart && slotMins < apptEnd) return appt.id;
    }
    return null;
  };

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

  // Block schedule info
  const blockInfo = activeScheduleType === 'block' ? template.blocks : [];

  const getBlockForTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const mins = h * 60 + m;
    return blockInfo.find((b) => {
      const [bsh, bsm] = b.startTime.split(':').map(Number);
      const [beh, bem] = b.endTime.split(':').map(Number);
      return mins >= bsh * 60 + bsm && mins < beh * 60 + bem;
    });
  };

  const blockColors: Record<string, string> = {
    purple: 'bg-purple-50 border-l-purple-400',
    blue: 'bg-blue-50 border-l-blue-400',
    teal: 'bg-teal-50 border-l-teal-400',
    orange: 'bg-orange-50 border-l-orange-400',
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Schedule Board</h2>
          <p className="text-sm text-gray-500">Dr. {provider.lastName} — {provider.specialty}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{dayAppts.length} appointments</span>
        </div>
      </div>

      {/* Date navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={prevDay} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div className="text-center min-w-[200px]">
            <p className="font-medium text-gray-900">{dayOfWeek}</p>
            <p className="text-sm text-gray-500">{displayDate}</p>
          </div>
          <button onClick={nextDay} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
          {!isToday && (
            <button onClick={goToday} className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
              Today
            </button>
          )}
        </div>
      </div>

      {/* Schedule type selector */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Schedule Template Type</h3>
          <button onClick={() => setShowTypeInfo(!showTypeInfo)} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> {showTypeInfo ? 'Hide' : 'Learn'} about types
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {scheduleTypes.map((st) => {
            const desc = scheduleTypeDescriptions[st];
            return (
              <button
                key={st}
                onClick={() => setActiveScheduleType(st)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  activeScheduleType === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {desc?.name || st}
              </button>
            );
          })}
        </div>
        {showTypeInfo && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-sm font-medium text-indigo-900">{scheduleTypeDescriptions[activeScheduleType]?.name}</p>
            <p className="text-sm text-indigo-700 mt-1">{scheduleTypeDescriptions[activeScheduleType]?.howItWorks}</p>
          </div>
        )}
      </div>

      {/* Provider preferences sidebar info */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
          <p className="text-xs text-amber-600 font-medium">No New Pts After</p>
          <p className="text-sm text-amber-800">{formatTime(provider.preferences.noNewPatientsAfter)}</p>
        </div>
        <div className="bg-purple-50 rounded-xl px-3 py-2 border border-purple-100">
          <p className="text-xs text-purple-600 font-medium">Physicals Before</p>
          <p className="text-sm text-purple-800">{formatTime(provider.preferences.physicalsOnlyBefore)}</p>
        </div>
        <div className="bg-teal-50 rounded-xl px-3 py-2 border border-teal-100">
          <p className="text-xs text-teal-600 font-medium">Telehealth After</p>
          <p className="text-sm text-teal-800">{formatTime(provider.preferences.preferTelehealthAfter)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Max Patients/Day</p>
          <p className="text-sm text-gray-800">{template.maxPatientsPerDay} ({template.maxNewPatientsPerDay} new)</p>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {slots.map((slotTime) => {
            if (isLunchSlot(slotTime)) {
              // Only show lunch label for the first lunch slot
              if (slotTime === template.lunchStart) {
                return (
                  <div key={slotTime} className="flex items-center gap-4 px-4 py-3 bg-gray-50">
                    <div className="w-20 text-sm font-medium text-gray-400">{formatTime(slotTime)}</div>
                    <div className="flex-1 text-center text-sm text-gray-400 italic">Lunch Break (12:00 - 1:00 PM)</div>
                  </div>
                );
              }
              return null;
            }

            const appt = getSlotAppointment(slotTime);
            const coveredBy = isSlotCovered(slotTime);
            if (coveredBy) return null; // Skip slots covered by multi-slot appointments

            const block = activeScheduleType === 'block' ? getBlockForTime(slotTime) : null;
            const blockCls = block ? `border-l-4 ${blockColors[block.color] || ''}` : '';

            if (appt) {
              const patient = patients.find((p) => p.id === appt.patientId);
              const typeConfig = appointmentTypes.find((t) => t.type === appt.appointmentType);
              const colorCls = typeColors[appt.appointmentType] || 'bg-gray-100 border-gray-300 text-gray-700';
              const slotsUsed = Math.ceil(appt.durationMinutes / template.defaultSlotMinutes);

              return (
                <button
                  key={slotTime}
                  onClick={() => onSelectAppointment(appt.id)}
                  className={`w-full flex items-center gap-4 px-4 hover:brightness-95 transition-all text-left ${blockCls}`}
                  style={{ minHeight: `${slotsUsed * 48}px` }}
                >
                  <div className="w-20 text-sm font-medium text-gray-600">{formatTime(slotTime)}</div>
                  <div className={`flex-1 px-3 py-2 rounded-xl border ${colorCls}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs" title={appt.status}>{statusIcons[appt.status] || '?'}</span>
                        <span className="font-medium text-sm">
                          {patient ? `${patient.demographics.lastName}, ${patient.demographics.firstName}` : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <span>{typeConfig?.label || appt.appointmentType}</span>
                        <span>{appt.durationMinutes}m</span>
                      </div>
                    </div>
                    <p className="text-xs opacity-75 mt-0.5 truncate">{appt.reasonForVisit}</p>
                  </div>
                </button>
              );
            }

            // Empty slot
            return (
              <button
                key={slotTime}
                onClick={() => onBookSlot(currentDate, slotTime)}
                className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-blue-50/50 transition-colors group ${blockCls}`}
              >
                <div className="w-20 text-sm text-gray-400">{formatTime(slotTime)}</div>
                <div className="flex-1 flex items-center justify-center border border-dashed border-gray-200 rounded-xl py-2 group-hover:border-blue-300 transition-colors">
                  <Plus className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
                {block && <span className="text-xs text-gray-400">{block.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {appointmentTypes.slice(0, 6).map((t) => (
          <div key={t.type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm border ${typeColors[t.type] || 'bg-gray-100 border-gray-300'}`} />
            <span className="text-xs text-gray-500">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
