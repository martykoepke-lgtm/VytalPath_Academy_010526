import { useState } from 'react';
import {
  Calendar,
  ClipboardList,
  FileText,
  Mail,
  Clock,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';
import { EHRSessionProvider, useEHRSession } from './EHRSessionContext';
import { ProviderScheduleView } from './ProviderScheduleView';
import { AppointmentsView } from './AppointmentsView';
import { PatientChartView } from './PatientChartView';
import { MessageInboxView } from './MessageInboxView';
import { PatientRegistration } from './PatientRegistration';
import { AppointmentScheduler } from './AppointmentScheduler';
import { AppointmentDetail } from './AppointmentDetail';
import { CheckInFlow } from './CheckInFlow';
import { CheckOutFlow } from './CheckOutFlow';
import { PatientSearchModal } from './PatientSearchModal';
import { EncounterSelectModal } from './EncounterSelectModal';
import { EncounterTypeModal } from './EncounterTypeModal';
import { EHRQuickReference } from './EHRQuickReference';
import type { QuickRefTab } from './EHRQuickReference';
import type { EncounterType } from '../../types/ehr';

// ========================================
// View state
// ========================================

type EHRView =
  | { type: 'schedule' }
  | { type: 'appointments'; patientId?: string }
  | { type: 'chart'; patientId: string; encounterId: string | null }
  | { type: 'messages' }
  | { type: 'register-patient'; returnTo: 'appointments' | 'chart' }
  | { type: 'book-appointment'; patientId?: string; date?: string; time?: string }
  | { type: 'appointment-detail'; appointmentId: string }
  | { type: 'check-in'; appointmentId: string }
  | { type: 'check-out'; appointmentId: string };

type ToolbarTab = 'schedule' | 'appointments' | 'chart' | 'messages';

const toolbarTabLabels: Record<ToolbarTab, string> = {
  schedule: 'Provider Schedule',
  appointments: 'Appointments',
  chart: 'Patient Chart',
  messages: 'Messages',
};

const toolbarTabIcons: Record<ToolbarTab, typeof Calendar> = {
  schedule: Calendar,
  appointments: ClipboardList,
  chart: FileText,
  messages: Mail,
};

const headerTitles: Record<string, string> = {
  schedule: 'Provider Schedule',
  appointments: 'Appointments',
  chart: 'Patient Chart',
  messages: 'Message Inbox',
  'register-patient': 'New Patient Registration',
  'book-appointment': 'Schedule Appointment',
  'appointment-detail': 'Appointment Detail',
  'check-in': 'Patient Check-In',
  'check-out': 'Patient Check-Out',
};

// ========================================
// Main content
// ========================================

function EHRLabContent() {
  const {
    sessionTimeRemaining,
    isSessionExpired,
    resetSession,
    clinic,
    provider,
    getUnreadMessageCount,
    addEncounter,
  } = useEHRSession();

  const [view, setView] = useState<EHRView>({ type: 'schedule' });
  const [viewHistory, setViewHistory] = useState<EHRView[]>([]);

  const [quickRefOpen, setQuickRefOpen] = useState(false);
  const [quickRefTab, setQuickRefTab] = useState<QuickRefTab>('patients');

  const openQuickRef = (tab: QuickRefTab = 'patients') => {
    setQuickRefTab(tab);
    setQuickRefOpen(true);
  };

  // Chart flow modals
  const [chartSearchOpen, setChartSearchOpen] = useState(false);
  const [chartPatientId, setChartPatientId] = useState<string | null>(null);
  const [encounterSelectOpen, setEncounterSelectOpen] = useState(false);
  const [encounterTypeOpen, setEncounterTypeOpen] = useState(false);

  const unreadCount = getUnreadMessageCount();

  const navigate = (next: EHRView) => {
    setViewHistory((prev) => [...prev, view]);
    setView(next);
  };

  const goBack = () => {
    const prev = viewHistory[viewHistory.length - 1];
    if (prev) {
      setViewHistory((h) => h.slice(0, -1));
      setView(prev);
    } else {
      setView({ type: 'schedule' });
    }
  };

  const goToTab = (tab: ToolbarTab) => {
    if (tab === 'chart') {
      // Chart flow: open patient search modal
      setChartSearchOpen(true);
      return;
    }
    setViewHistory([]);
    if (tab === 'schedule') setView({ type: 'schedule' });
    else if (tab === 'appointments') setView({ type: 'appointments' });
    else if (tab === 'messages') setView({ type: 'messages' });
  };

  // Determine active toolbar tab from current view
  const getActiveTab = (): ToolbarTab | null => {
    switch (view.type) {
      case 'schedule': return 'schedule';
      case 'appointments': return 'appointments';
      case 'chart': return 'chart';
      case 'messages': return 'messages';
      default: return null;
    }
  };

  const activeTab = getActiveTab();
  const isSubFlow = ['register-patient', 'book-appointment', 'appointment-detail', 'check-in', 'check-out'].includes(view.type);

  // Chart flow handlers
  const handleChartPatientSelected = (patientId: string) => {
    setChartSearchOpen(false);
    setChartPatientId(patientId);
    setEncounterSelectOpen(true);
  };

  const handleChartEncounterSelected = (encounterId: string) => {
    setEncounterSelectOpen(false);
    setViewHistory([]);
    setView({ type: 'chart', patientId: chartPatientId!, encounterId });
  };

  const handleChartCreateNewEncounter = () => {
    setEncounterSelectOpen(false);
    setEncounterTypeOpen(true);
  };

  const handleChartEncounterTypeSelected = (type: EncounterType) => {
    setEncounterTypeOpen(false);
    const enc = addEncounter({
      patientId: chartPatientId!,
      appointmentId: null,
      type,
      date: new Date().toISOString().split('T')[0],
      reason: `${type.charAt(0).toUpperCase() + type.slice(1)} encounter`,
      provider: `Dr. ${provider.lastName}`,
      location: clinic.name,
      status: 'open',
    });
    setViewHistory([]);
    setView({ type: 'chart', patientId: chartPatientId!, encounterId: enc.id });
  };

  // Expired session
  if (isSessionExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-apple p-10 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Session Expired</h2>
          <p className="text-gray-500 mb-6">Your 48-hour practice session has ended.</p>
          <button
            onClick={resetSession}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition-all"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Teal header */}
      <header className="bg-teal-700 text-white px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">{headerTitles[view.type] || 'EHR Practice Lab'}</h1>
          </div>
          <div className="flex items-center gap-3 text-teal-100 text-sm">
            <span>{clinic.name}</span>
            <span className="text-teal-300">·</span>
            <span>Dr. {provider.lastName}, {provider.credentials}</span>
          </div>
        </div>
      </header>

      {/* Grey toolbar */}
      <nav className="bg-gray-200 border-b border-gray-300 px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            {(Object.keys(toolbarTabLabels) as ToolbarTab[]).map((tab) => {
              const Icon = toolbarTabIcons[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => goToTab(tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-300/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {toolbarTabLabels[tab]}
                  {tab === 'messages' && unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {sessionTimeRemaining}
            </span>
            <button
              onClick={() => openQuickRef()}
              className="p-1.5 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
              title="Quick Reference"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetSession}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Reset session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Quick-start strip */}
      <div className="bg-gray-100 border-b border-gray-200 px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs text-gray-500">
          <button onClick={() => openQuickRef('patients')} className="hover:text-teal-600 transition-colors underline underline-offset-2 decoration-gray-300 hover:decoration-teal-500">
            View test patients
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => openQuickRef('schedule')} className="hover:text-teal-600 transition-colors underline underline-offset-2 decoration-gray-300 hover:decoration-teal-500">
            Today's schedule
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => openQuickRef('workflows')} className="hover:text-teal-600 transition-colors underline underline-offset-2 decoration-gray-300 hover:decoration-teal-500">
            Workflow guides
          </button>
        </div>
      </div>

      {/* Content area */}
      <main className="flex-1 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button for sub-flows */}
          {isSubFlow && (
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Schedule view */}
          {view.type === 'schedule' && (
            <ProviderScheduleView
              onSelectAppointment={(id) => navigate({ type: 'appointment-detail', appointmentId: id })}
              onCheckIn={(id) => navigate({ type: 'check-in', appointmentId: id })}
              onCheckOut={(id) => navigate({ type: 'check-out', appointmentId: id })}
              onReschedule={(patientId, date, time) => navigate({ type: 'book-appointment', patientId, date, time })}
              onAddAppointment={() => navigate({ type: 'appointments' })}
            />
          )}

          {/* Appointments view */}
          {view.type === 'appointments' && (
            <AppointmentsView
              initialPatientId={view.patientId}
              onSelectAppointment={(id) => navigate({ type: 'appointment-detail', appointmentId: id })}
              onScheduleAppointment={(patientId) => navigate({ type: 'book-appointment', patientId })}
              onAddPatient={() => navigate({ type: 'register-patient', returnTo: 'appointments' })}
            />
          )}

          {/* Patient chart view */}
          {view.type === 'chart' && (
            <PatientChartView
              patientId={view.patientId}
              encounterId={view.encounterId}
              onChangeEncounter={() => {
                setChartPatientId(view.patientId);
                setEncounterSelectOpen(true);
              }}
            />
          )}

          {/* Messages */}
          {view.type === 'messages' && (
            <MessageInboxView
              onOpenChart={(patientId) => {
                setChartPatientId(patientId);
                setEncounterSelectOpen(true);
              }}
            />
          )}

          {/* Sub-flows */}
          {view.type === 'register-patient' && (
            <PatientRegistration
              onComplete={(patientId) => {
                if (view.returnTo === 'appointments') {
                  setViewHistory([]);
                  setView({ type: 'appointments', patientId });
                } else {
                  setChartPatientId(patientId);
                  setEncounterSelectOpen(true);
                  goBack();
                }
              }}
              onCancel={goBack}
            />
          )}

          {view.type === 'book-appointment' && (
            <AppointmentScheduler
              preselectedPatientId={view.patientId}
              preselectedDate={view.date}
              preselectedTime={view.time}
              onComplete={(appointmentId) => navigate({ type: 'appointment-detail', appointmentId })}
              onCancel={goBack}
            />
          )}

          {view.type === 'appointment-detail' && (
            <AppointmentDetail
              appointmentId={view.appointmentId}
              onCheckIn={(id) => navigate({ type: 'check-in', appointmentId: id })}
              onCheckOut={(id) => navigate({ type: 'check-out', appointmentId: id })}
              onReschedule={(patientId, date, time) => navigate({ type: 'book-appointment', patientId, date, time })}
              onViewChart={(patientId) => {
                setChartPatientId(patientId);
                setEncounterSelectOpen(true);
              }}
            />
          )}

          {view.type === 'check-in' && (
            <CheckInFlow
              appointmentId={view.appointmentId}
              onComplete={goBack}
              onCancel={goBack}
            />
          )}

          {view.type === 'check-out' && (
            <CheckOutFlow
              appointmentId={view.appointmentId}
              onComplete={goBack}
              onScheduleFollowUp={(patientId) => navigate({ type: 'book-appointment', patientId })}
              onCancel={goBack}
            />
          )}
        </div>
      </main>

      {/* Quick Reference modal */}
      {quickRefOpen && (
        <EHRQuickReference onClose={() => setQuickRefOpen(false)} defaultTab={quickRefTab} />
      )}

      {/* Chart flow modals */}
      {chartSearchOpen && (
        <PatientSearchModal
          onSelectPatient={handleChartPatientSelected}
          onAddPatient={() => {
            setChartSearchOpen(false);
            navigate({ type: 'register-patient', returnTo: 'chart' });
          }}
          onClose={() => setChartSearchOpen(false)}
        />
      )}

      {encounterSelectOpen && chartPatientId && (
        <EncounterSelectModal
          patientId={chartPatientId}
          onSelectEncounter={handleChartEncounterSelected}
          onCreateNew={handleChartCreateNewEncounter}
          onClose={() => setEncounterSelectOpen(false)}
        />
      )}

      {encounterTypeOpen && (
        <EncounterTypeModal
          allowClinic={false}
          onSelectType={handleChartEncounterTypeSelected}
          onClose={() => setEncounterTypeOpen(false)}
        />
      )}
    </div>
  );
}

export function EHRPracticeLab() {
  return (
    <EHRSessionProvider>
      <EHRLabContent />
    </EHRSessionProvider>
  );
}
