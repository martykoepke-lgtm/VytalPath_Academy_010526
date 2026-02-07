import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  EHRSession,
  EHRSessionContextType,
  EHRPatient,
  EHRAppointment,
  EHREncounter,
  EHRMessage,
  ClinicInfo,
  ProviderInfo,
  AppointmentTypeConfig,
  ScheduleType,
} from '../../types/ehr';
import { seedPatients, seedAppointments, seedEncounters, seedMessages } from '../../data/ehr-seed-patients';
import { clinic as clinicData, provider as providerData, appointmentTypes as apptTypesData } from '../../data/ehr-clinic-data';

const STORAGE_KEY = 'vytalpath_ehr_session';
const SESSION_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours

// ========================================
// Helpers
// ========================================

function createFreshSession(): EHRSession {
  return {
    createdAt: Date.now(),
    patients: JSON.parse(JSON.stringify(seedPatients)),
    appointments: JSON.parse(JSON.stringify(seedAppointments)),
    encounters: JSON.parse(JSON.stringify(seedEncounters)),
    messages: JSON.parse(JSON.stringify(seedMessages)),
    nextMRN: 10006,
    nextAppointmentId: 100,
    nextEncounterId: 100,
    nextMessageId: 100,
  };
}

function loadSession(): EHRSession {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      if (Date.now() - session.createdAt < SESSION_TTL_MS) {
        // Migrate old sessions that lack encounters/messages
        if (!session.encounters || !session.messages) {
          const fresh = createFreshSession();
          return {
            ...session,
            encounters: fresh.encounters,
            messages: fresh.messages,
            nextEncounterId: fresh.nextEncounterId,
            nextMessageId: fresh.nextMessageId,
          };
        }
        return session as EHRSession;
      }
    }
  } catch {
    // ignore
  }
  return createFreshSession();
}

function saveSession(session: EHRSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore — localStorage may be full
  }
}

function formatTimeRemaining(createdAt: number): string {
  const elapsed = Date.now() - createdAt;
  const remaining = Math.max(0, SESSION_TTL_MS - elapsed);
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  if (minutes > 0) return `${minutes}m remaining`;
  return 'Session expired';
}

// ========================================
// Context
// ========================================

const EHRSessionContext = createContext<EHRSessionContextType | null>(null);

export function useEHRSession(): EHRSessionContextType {
  const ctx = useContext(EHRSessionContext);
  if (!ctx) throw new Error('useEHRSession must be used within EHRSessionProvider');
  return ctx;
}

// ========================================
// Provider
// ========================================

export function EHRSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<EHRSession>(loadSession);
  const [activeScheduleType, setActiveScheduleType] = useState<ScheduleType>('time-specified');
  const [timeRemaining, setTimeRemaining] = useState(() => formatTimeRemaining(session.createdAt));

  // Persist to localStorage on every change
  useEffect(() => {
    saveSession(session);
  }, [session]);

  // Update time remaining every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(session.createdAt));
    }, 60_000);
    return () => clearInterval(interval);
  }, [session.createdAt]);

  const isSessionExpired = Date.now() - session.createdAt >= SESSION_TTL_MS;

  // --- Session ---

  const resetSession = useCallback(() => {
    const fresh = createFreshSession();
    setSession(fresh);
    setTimeRemaining(formatTimeRemaining(fresh.createdAt));
  }, []);

  // --- Patients ---

  const getPatient = useCallback(
    (id: string) => session.patients.find((p) => p.id === id),
    [session.patients]
  );

  const searchPatients = useCallback(
    (query: string): EHRPatient[] => {
      if (!query.trim()) return session.patients;
      const q = query.toLowerCase().trim();
      return session.patients.filter((p) => {
        const fullName = `${p.demographics.firstName} ${p.demographics.lastName}`.toLowerCase();
        const dob = p.demographics.dateOfBirth;
        const mrn = p.mrn.toLowerCase();
        return fullName.includes(q) || dob.includes(q) || mrn.includes(q);
      });
    },
    [session.patients]
  );

  const addPatient = useCallback(
    (patientData: Omit<EHRPatient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'>): EHRPatient => {
      const now = new Date().toISOString();
      const newPatient: EHRPatient = {
        ...patientData,
        id: `pt-${Date.now()}`,
        mrn: `MRN-${session.nextMRN}`,
        createdAt: now,
        updatedAt: now,
      };
      setSession((prev) => ({
        ...prev,
        patients: [...prev.patients, newPatient],
        nextMRN: prev.nextMRN + 1,
      }));
      return newPatient;
    },
    [session.nextMRN]
  );

  const updatePatient = useCallback((id: string, updates: Partial<EHRPatient>) => {
    setSession((prev) => ({
      ...prev,
      patients: prev.patients.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, []);

  // --- Appointments ---

  const getAppointment = useCallback(
    (id: string) => session.appointments.find((a) => a.id === id),
    [session.appointments]
  );

  const getPatientAppointments = useCallback(
    (patientId: string) =>
      session.appointments
        .filter((a) => a.patientId === patientId)
        .sort((a, b) => {
          const dateA = `${a.date}T${a.time}`;
          const dateB = `${b.date}T${b.time}`;
          return dateB.localeCompare(dateA); // newest first
        }),
    [session.appointments]
  );

  const getDayAppointments = useCallback(
    (date: string) =>
      session.appointments
        .filter((a) => a.date === date && a.status !== 'cancelled' && a.status !== 'rescheduled')
        .sort((a, b) => a.time.localeCompare(b.time)),
    [session.appointments]
  );

  const addAppointment = useCallback(
    (apptData: Omit<EHRAppointment, 'id' | 'createdAt'>): EHRAppointment => {
      const newAppt: EHRAppointment = {
        ...apptData,
        id: `appt-${session.nextAppointmentId}`,
        createdAt: new Date().toISOString(),
      };
      setSession((prev) => ({
        ...prev,
        appointments: [...prev.appointments, newAppt],
        nextAppointmentId: prev.nextAppointmentId + 1,
      }));
      return newAppt;
    },
    [session.nextAppointmentId]
  );

  const updateAppointment = useCallback((id: string, updates: Partial<EHRAppointment>) => {
    setSession((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  }, []);

  const cancelAppointment = useCallback((id: string, reason: string) => {
    setSession((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as const, cancellationReason: reason } : a
      ),
    }));
  }, []);

  const noShowAppointment = useCallback((id: string) => {
    setSession((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'no-show' as const,
              noShowFollowUp: {
                contactAttempts: 0,
                rescheduleOffered: false,
                letterSent: false,
                letterSentDate: null,
                notes: '',
              },
            }
          : a
      ),
    }));
  }, []);

  const rescheduleAppointment = useCallback(
    (id: string, newDate: string, newTime: string): EHRAppointment => {
      const original = session.appointments.find((a) => a.id === id);
      if (!original) throw new Error(`Appointment ${id} not found`);

      const newAppt: EHRAppointment = {
        ...original,
        id: `appt-${session.nextAppointmentId}`,
        date: newDate,
        time: newTime,
        status: 'scheduled',
        confirmationStatus: 'unconfirmed',
        rescheduledFrom: id,
        rescheduledTo: null,
        arrivalTime: null,
        copayCollected: false,
        copayAmount: null,
        cancellationReason: null,
        noShowFollowUp: null,
        createdAt: new Date().toISOString(),
        createdBy: 'Front Desk',
      };

      setSession((prev) => ({
        ...prev,
        appointments: [
          ...prev.appointments.map((a) =>
            a.id === id ? { ...a, status: 'rescheduled' as const, rescheduledTo: newAppt.id } : a
          ),
          newAppt,
        ],
        nextAppointmentId: prev.nextAppointmentId + 1,
      }));

      return newAppt;
    },
    [session.appointments, session.nextAppointmentId]
  );

  const checkInAppointment = useCallback(
    (id: string, arrivalTime: string, copayCollected: boolean, copayAmount: number | null) => {
      setSession((prev) => ({
        ...prev,
        appointments: prev.appointments.map((a) =>
          a.id === id
            ? { ...a, status: 'checked-in' as const, arrivalTime, copayCollected, copayAmount }
            : a
        ),
      }));
    },
    []
  );

  const checkOutAppointment = useCallback((id: string) => {
    setSession((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) =>
        a.id === id ? { ...a, status: 'completed' as const } : a
      ),
    }));
  }, []);

  // --- Encounters ---

  const getEncounter = useCallback(
    (id: string) => session.encounters.find((e) => e.id === id),
    [session.encounters]
  );

  const getPatientEncounters = useCallback(
    (patientId: string) =>
      session.encounters
        .filter((e) => e.patientId === patientId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [session.encounters]
  );

  const addEncounter = useCallback(
    (encounterData: Omit<EHREncounter, 'id' | 'createdAt'>): EHREncounter => {
      const newEnc: EHREncounter = {
        ...encounterData,
        id: `enc-${session.nextEncounterId}`,
        createdAt: new Date().toISOString(),
      };
      setSession((prev) => ({
        ...prev,
        encounters: [...prev.encounters, newEnc],
        nextEncounterId: prev.nextEncounterId + 1,
      }));
      return newEnc;
    },
    [session.nextEncounterId]
  );

  const updateEncounter = useCallback((id: string, updates: Partial<EHREncounter>) => {
    setSession((prev) => ({
      ...prev,
      encounters: prev.encounters.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, []);

  // --- Messages ---

  const getMessage = useCallback(
    (id: string) => session.messages.find((m) => m.id === id),
    [session.messages]
  );

  const getUnreadMessageCount = useCallback(
    () => session.messages.filter((m) => m.status === 'unread').length,
    [session.messages]
  );

  const addMessage = useCallback(
    (messageData: Omit<EHRMessage, 'id' | 'createdAt' | 'readAt'>): EHRMessage => {
      const newMsg: EHRMessage = {
        ...messageData,
        id: `msg-${session.nextMessageId}`,
        createdAt: new Date().toISOString(),
        readAt: null,
      };
      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, newMsg],
        nextMessageId: prev.nextMessageId + 1,
      }));
      return newMsg;
    },
    [session.nextMessageId]
  );

  const updateMessage = useCallback((id: string, updates: Partial<EHRMessage>) => {
    setSession((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }, []);

  const markMessageRead = useCallback((id: string) => {
    setSession((prev) => ({
      ...prev,
      messages: prev.messages.map((m) =>
        m.id === id ? { ...m, status: 'read' as const, readAt: new Date().toISOString() } : m
      ),
    }));
  }, []);

  const archiveMessage = useCallback((id: string) => {
    setSession((prev) => ({
      ...prev,
      messages: prev.messages.map((m) =>
        m.id === id ? { ...m, status: 'archived' as const } : m
      ),
    }));
  }, []);

  // --- Utilities ---

  const getNoShowCount = useCallback(
    (patientId: string) =>
      session.appointments.filter((a) => a.patientId === patientId && a.status === 'no-show').length,
    [session.appointments]
  );

  // --- Context value ---

  const value: EHRSessionContextType = {
    session,
    resetSession,
    sessionTimeRemaining: timeRemaining,
    isSessionExpired,

    patients: session.patients,
    getPatient,
    searchPatients,
    addPatient,
    updatePatient,

    appointments: session.appointments,
    getAppointment,
    getPatientAppointments,
    getDayAppointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    noShowAppointment,
    rescheduleAppointment,
    checkInAppointment,
    checkOutAppointment,

    encounters: session.encounters,
    getEncounter,
    getPatientEncounters,
    addEncounter,
    updateEncounter,

    messages: session.messages,
    getMessage,
    getUnreadMessageCount,
    addMessage,
    updateMessage,
    markMessageRead,
    archiveMessage,

    clinic: clinicData as ClinicInfo,
    provider: providerData as ProviderInfo,
    appointmentTypes: apptTypesData as AppointmentTypeConfig[],

    activeScheduleType,
    setActiveScheduleType,

    getNoShowCount,
  };

  return <EHRSessionContext.Provider value={value}>{children}</EHRSessionContext.Provider>;
}
