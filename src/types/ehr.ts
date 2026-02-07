// ========================================
// EHR Practice Lab — Type Definitions
// ========================================

// === SHARED ===

export interface Address {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

// === PATIENT ===

export interface PatientDemographics {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  dateOfBirth: string; // YYYY-MM-DD
  sexAssignedAtBirth: 'M' | 'F';
  genderIdentity: string;
  pronouns: string;
  ssn: string; // masked: XXX-XX-1234
  race: string;
  ethnicity: string;
  preferredLanguage: string;
  maritalStatus: string;
}

export interface PatientContact {
  homeAddress: Address;
  mailingAddress: Address | null; // null = same as home
  homePhone: string;
  cellPhone: string;
  workPhone: string;
  email: string;
  preferredContactMethod: 'cell' | 'home' | 'email' | 'portal';
  okToLeaveVoicemail: boolean;
  okToText: boolean;
  okToEmail: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Guarantor {
  name: string;
  dateOfBirth: string;
  relationship: string;
  address: Address;
  phone: string;
  ssn: string;
  employer: string;
}

export interface EmployerInfo {
  employmentStatus: 'employed' | 'unemployed' | 'student' | 'retired' | 'disabled' | 'self-employed';
  employerName: string;
  employerAddress: Address;
  employerPhone: string;
  occupation: string;
}

export type InsurancePlanType = 'HMO' | 'PPO' | 'EPO' | 'POS' | 'HDHP' | 'Medicare' | 'Medicaid' | 'Tricare';

export interface PatientInsurance {
  id: string;
  type: 'primary' | 'secondary';
  carrier: string;
  planName: string;
  planType: InsurancePlanType;
  memberId: string;
  groupNumber: string;
  subscriberName: string;
  subscriberDob: string;
  subscriberRelationship: 'self' | 'spouse' | 'child' | 'other';
  effectiveDate: string;
  terminationDate: string | null;
  copayOfficeVisit: number;
  copaySpecialist: number;
  copayUrgentCare: number;
  copayER: number;
  deductible: number;
  deductibleMet: number;
  coinsuranceRate: number; // 0.20 = 20%
  oopMax: number;
  oopMet: number;
  referralRequired: boolean;
  priorAuthRequired: boolean;
  insurancePhone: string;
  claimsAddress: Address;
}

export interface PharmacyInfo {
  name: string;
  address: Address;
  phone: string;
  fax: string;
  isMailOrder: boolean;
}

export interface ProviderAssignment {
  primaryCareProvider: string;
  referringProvider: string;
  referringProviderNPI: string;
  referralSource: string; // How did you hear about us?
}

export type ConsentMethod = 'paper' | 'electronic' | null;

export interface ConsentItem {
  signed: boolean;
  date: string | null;
  method: ConsentMethod; // how the form was received
}

export interface ConsentTracking {
  hipaaNotice: ConsentItem;
  consentToTreat: ConsentItem;
  financialResponsibility: ConsentItem;
  releaseOfInformation: ConsentItem;
  advanceDirectiveOnFile: boolean;
  patientPortalEnrolled: boolean;
  patientPortalEmail: string;
}

export interface Allergy {
  name: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface Medication {
  name: string;
  strength: string;
  frequency: string;
  route: 'PO' | 'IM' | 'IV' | 'topical' | 'inhaled' | 'SQ' | 'other';
  prescriber: string;
}

export interface MedicalSummary {
  allergies: Allergy[];
  medications: Medication[];
  problemList: string[];
  pastSurgicalHistory: string[];
  familyHistory: string[];
  socialHistory: {
    smokingStatus: string;
    alcoholUse: string;
  };
}

export interface EHRPatient {
  id: string;
  mrn: string; // MRN-10001 format
  demographics: PatientDemographics;
  contact: PatientContact;
  emergencyContacts: EmergencyContact[];
  guarantor: Guarantor | null; // null = patient is own guarantor
  employer: EmployerInfo | null;
  insurances: PatientInsurance[];
  pharmacy: PharmacyInfo;
  providerAssignment: ProviderAssignment;
  consents: ConsentTracking;
  medicalSummary: MedicalSummary;
  accountBalance: number;
  createdAt: string;
  updatedAt: string;
}

// === APPOINTMENTS ===

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked-in'
  | 'roomed'
  | 'with-provider'
  | 'check-out'
  | 'completed'
  | 'no-show'
  | 'cancelled'
  | 'rescheduled'
  | 'lwbs';

export type AppointmentType =
  | 'new-patient'
  | 'follow-up'
  | 'annual-physical'
  | 'urgent'
  | 'telehealth'
  | 'procedure'
  | 'lab-only'
  | 'nurse-visit'
  | 'consultation'
  | 'pre-op';

export interface NoShowFollowUp {
  contactAttempts: number;
  rescheduleOffered: boolean;
  letterSent: boolean;
  letterSentDate: string | null;
  notes: string;
}

export interface EHRAppointment {
  id: string;
  patientId: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  durationMinutes: number;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  reasonForVisit: string;
  referralNumber: string;
  priorAuthNumber: string;
  notes: string;
  confirmationStatus: 'unconfirmed' | 'confirmed' | 'declined';
  reminderPreference: string[];
  isRecurring: boolean;
  recurringInterval: string | null;
  arrivalTime: string | null;
  copayCollected: boolean;
  copayAmount: number | null;
  cancellationReason: string | null;
  rescheduledFrom: string | null;
  rescheduledTo: string | null;
  noShowFollowUp: NoShowFollowUp | null;
  createdAt: string;
  createdBy: string;
}

// === SCHEDULE ===

export type ScheduleType = 'time-specified' | 'wave' | 'modified-wave' | 'block' | 'open-booking';

export interface ScheduleBlock {
  label: string;
  startTime: string;
  endTime: string;
  appointmentTypes: AppointmentType[];
  color: string; // Tailwind color name (e.g., 'blue', 'purple')
}

export interface ScheduleTemplate {
  type: ScheduleType;
  daysAvailable: number[]; // 0=Sun, 1=Mon...6=Sat
  startTime: string;
  endTime: string;
  lunchStart: string;
  lunchEnd: string;
  defaultSlotMinutes: number;
  maxPatientsPerDay: number;
  maxNewPatientsPerDay: number;
  bufferMinutes: number;
  blocks: ScheduleBlock[];
}

export interface ProviderPreferences {
  noNewPatientsAfter: string;
  physicalsOnlyBefore: string;
  bufferBeforeProcedures: number;
  noDoubleBookingDays: number[];
  preferTelehealthAfter: string;
}

// === APPOINTMENT TYPE CONFIG ===

export interface AppointmentTypeConfig {
  type: AppointmentType;
  label: string;
  defaultDuration: number;
  color: string; // Tailwind color name
  icon: string; // Lucide icon name
  requiresReferral: boolean;
  newPatientOnly: boolean;
}

// === CLINIC & PROVIDER ===

export interface ClinicInfo {
  name: string;
  address: Address;
  phone: string;
  fax: string;
  email: string;
  taxId: string;
  npi: string;
  hours: {
    open: string;
    close: string;
    days: string;
  };
}

export interface ProviderInfo {
  id: string;
  firstName: string;
  lastName: string;
  credentials: string;
  specialty: string;
  npi: string;
  dea: string;
  scheduleTemplate: ScheduleTemplate;
  preferences: ProviderPreferences;
}

// === ENCOUNTERS ===

export type EncounterType = 'clinic' | 'non-clinic' | 'phone' | 'abstraction';

export interface EHREncounter {
  id: string;
  patientId: string;
  appointmentId: string | null;
  type: EncounterType;
  date: string;
  reason: string;
  provider: string;
  location: string;
  status: 'open' | 'signed';
  createdAt: string;
}

// === MESSAGES ===

export type MessageType = 'result' | 'referral' | 'rx-refill' | 'general' | 'task';
export type MessagePriority = 'normal' | 'high' | 'urgent';
export type MessageStatus = 'unread' | 'read' | 'archived';

export interface EHRMessage {
  id: string;
  type: MessageType;
  from: string;
  to: string;
  subject: string;
  body: string;
  patientId: string | null;
  priority: MessagePriority;
  status: MessageStatus;
  createdAt: string;
  readAt: string | null;
}

// === SESSION ===

export interface EHRSession {
  createdAt: number; // Date.now() for TTL check
  patients: EHRPatient[];
  appointments: EHRAppointment[];
  encounters: EHREncounter[];
  messages: EHRMessage[];
  nextMRN: number;
  nextAppointmentId: number;
  nextEncounterId: number;
  nextMessageId: number;
}

// === CONTEXT TYPES ===

export interface EHRSessionContextType {
  // Session management
  session: EHRSession;
  resetSession: () => void;
  sessionTimeRemaining: string;
  isSessionExpired: boolean;

  // Patient CRUD
  patients: EHRPatient[];
  getPatient: (id: string) => EHRPatient | undefined;
  searchPatients: (query: string) => EHRPatient[];
  addPatient: (patient: Omit<EHRPatient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'>) => EHRPatient;
  updatePatient: (id: string, updates: Partial<EHRPatient>) => void;

  // Appointment CRUD
  appointments: EHRAppointment[];
  getAppointment: (id: string) => EHRAppointment | undefined;
  getPatientAppointments: (patientId: string) => EHRAppointment[];
  getDayAppointments: (date: string) => EHRAppointment[];
  addAppointment: (appt: Omit<EHRAppointment, 'id' | 'createdAt'>) => EHRAppointment;
  updateAppointment: (id: string, updates: Partial<EHRAppointment>) => void;
  cancelAppointment: (id: string, reason: string) => void;
  noShowAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => EHRAppointment;
  checkInAppointment: (id: string, arrivalTime: string, copayCollected: boolean, copayAmount: number | null) => void;
  checkOutAppointment: (id: string) => void;

  // Encounter CRUD
  encounters: EHREncounter[];
  getEncounter: (id: string) => EHREncounter | undefined;
  getPatientEncounters: (patientId: string) => EHREncounter[];
  addEncounter: (encounter: Omit<EHREncounter, 'id' | 'createdAt'>) => EHREncounter;
  updateEncounter: (id: string, updates: Partial<EHREncounter>) => void;

  // Message CRUD
  messages: EHRMessage[];
  getMessage: (id: string) => EHRMessage | undefined;
  getUnreadMessageCount: () => number;
  addMessage: (message: Omit<EHRMessage, 'id' | 'createdAt' | 'readAt'>) => EHRMessage;
  updateMessage: (id: string, updates: Partial<EHRMessage>) => void;
  markMessageRead: (id: string) => void;
  archiveMessage: (id: string) => void;

  // Clinic data (read-only)
  clinic: ClinicInfo;
  provider: ProviderInfo;
  appointmentTypes: AppointmentTypeConfig[];

  // Schedule template switching
  activeScheduleType: ScheduleType;
  setActiveScheduleType: (type: ScheduleType) => void;

  // Utilities
  getNoShowCount: (patientId: string) => number;
}
