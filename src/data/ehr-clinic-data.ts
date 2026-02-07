import type {
  ClinicInfo,
  ProviderInfo,
  ScheduleTemplate,
  ProviderPreferences,
  AppointmentTypeConfig,
  ScheduleBlock,
  PharmacyInfo,
} from '../types/ehr';

// ========================================
// CLINIC
// ========================================

export const clinic: ClinicInfo = {
  name: 'Mountain View Family Practice',
  address: {
    street: '123 Wellness Blvd',
    apt: 'Suite 200',
    city: 'Austin',
    state: 'TX',
    zip: '78745',
  },
  phone: '(512) 555-0100',
  fax: '(512) 555-0101',
  email: 'info@mountainviewfp.com',
  taxId: '74-3921845',
  npi: '1234567890',
  hours: {
    open: '08:00',
    close: '17:00',
    days: 'Monday – Friday',
  },
};

// ========================================
// SCHEDULE TEMPLATES
// ========================================

const blockSchedule: ScheduleBlock[] = [
  { label: 'Physicals / Wellness', startTime: '08:00', endTime: '10:00', appointmentTypes: ['annual-physical', 'new-patient'], color: 'purple' },
  { label: 'Sick / Follow-Up', startTime: '10:00', endTime: '12:00', appointmentTypes: ['follow-up', 'urgent', 'nurse-visit'], color: 'blue' },
  { label: 'Telehealth', startTime: '13:00', endTime: '15:00', appointmentTypes: ['telehealth', 'follow-up'], color: 'teal' },
  { label: 'Procedures / Labs', startTime: '15:00', endTime: '17:00', appointmentTypes: ['procedure', 'lab-only', 'pre-op'], color: 'orange' },
];

const scheduleTemplate: ScheduleTemplate = {
  type: 'time-specified',
  daysAvailable: [1, 2, 3, 4, 5], // Mon–Fri
  startTime: '08:00',
  endTime: '17:00',
  lunchStart: '12:00',
  lunchEnd: '13:00',
  defaultSlotMinutes: 15,
  maxPatientsPerDay: 24,
  maxNewPatientsPerDay: 4,
  bufferMinutes: 0,
  blocks: blockSchedule,
};

const providerPreferences: ProviderPreferences = {
  noNewPatientsAfter: '15:00',
  physicalsOnlyBefore: '10:00',
  bufferBeforeProcedures: 10,
  noDoubleBookingDays: [1], // No double booking on Mondays
  preferTelehealthAfter: '13:00',
};

// ========================================
// PROVIDER
// ========================================

export const provider: ProviderInfo = {
  id: 'prov-001',
  firstName: 'Sarah',
  lastName: 'Chen',
  credentials: 'MD',
  specialty: 'Family Medicine',
  npi: '1234567890',
  dea: 'FC1234567',
  scheduleTemplate,
  preferences: providerPreferences,
};

// ========================================
// APPOINTMENT TYPES
// ========================================

export const appointmentTypes: AppointmentTypeConfig[] = [
  {
    type: 'new-patient',
    label: 'New Patient Visit',
    defaultDuration: 30,
    color: 'blue',
    icon: 'UserPlus',
    requiresReferral: false,
    newPatientOnly: true,
  },
  {
    type: 'follow-up',
    label: 'Follow-Up Visit',
    defaultDuration: 15,
    color: 'green',
    icon: 'RefreshCw',
    requiresReferral: false,
    newPatientOnly: false,
  },
  {
    type: 'annual-physical',
    label: 'Annual Physical / Wellness',
    defaultDuration: 45,
    color: 'purple',
    icon: 'HeartPulse',
    requiresReferral: false,
    newPatientOnly: false,
  },
  {
    type: 'urgent',
    label: 'Urgent / Same-Day',
    defaultDuration: 15,
    color: 'red',
    icon: 'AlertCircle',
    requiresReferral: false,
    newPatientOnly: false,
  },
  {
    type: 'telehealth',
    label: 'Telehealth Visit',
    defaultDuration: 20,
    color: 'teal',
    icon: 'Video',
    requiresReferral: false,
    newPatientOnly: false,
  },
  {
    type: 'procedure',
    label: 'Procedure',
    defaultDuration: 30,
    color: 'orange',
    icon: 'Syringe',
    requiresReferral: false,
    newPatientOnly: false,
  },
  {
    type: 'lab-only',
    label: 'Lab Only',
    defaultDuration: 10,
    color: 'gray',
    icon: 'TestTube',
    requiresReferral: false,
    newPatientOnly: false,
  },
  {
    type: 'nurse-visit',
    label: 'Nurse Visit',
    defaultDuration: 15,
    color: 'pink',
    icon: 'Stethoscope',
    requiresReferral: false,
    newPatientOnly: false,
  },
  {
    type: 'consultation',
    label: 'Consultation',
    defaultDuration: 30,
    color: 'amber',
    icon: 'MessageSquare',
    requiresReferral: true,
    newPatientOnly: false,
  },
  {
    type: 'pre-op',
    label: 'Pre-Op Clearance',
    defaultDuration: 30,
    color: 'orange',
    icon: 'ClipboardCheck',
    requiresReferral: false,
    newPatientOnly: false,
  },
];

// ========================================
// SCHEDULE TYPE DESCRIPTIONS (for learning)
// ========================================

export const scheduleTypeDescriptions: Record<string, { name: string; description: string; howItWorks: string }> = {
  'time-specified': {
    name: 'Time-Specified',
    description: 'The most common scheduling method. Each patient is assigned a specific appointment time.',
    howItWorks: 'One patient per time slot. Appointments are booked at fixed intervals (e.g., every 15 minutes). Predictable and easy to manage.',
  },
  'wave': {
    name: 'Wave Scheduling',
    description: 'Multiple patients are scheduled at the top of each hour, then seen in order of arrival.',
    howItWorks: '3-4 patients are scheduled at the start of each hour block. Patients are seen first-come, first-served within the wave. Keeps the provider busy even if one patient is late.',
  },
  'modified-wave': {
    name: 'Modified Wave',
    description: 'A hybrid approach — some patients at the top of the hour, others staggered within the hour.',
    howItWorks: '2 patients at :00, 1 patient at :20, 1 patient at :40. Balances the flexibility of wave scheduling with the predictability of time-specified.',
  },
  'block': {
    name: 'Block / Cluster',
    description: 'Time blocks are reserved for specific appointment types throughout the day.',
    howItWorks: 'Morning: physicals. Late morning: sick visits. Afternoon: telehealth. Late afternoon: procedures. Helps providers focus and ensures equipment/room availability.',
  },
  'open-booking': {
    name: 'Open Booking',
    description: 'Patients are given a general time window (AM or PM) and seen in order of arrival.',
    howItWorks: 'Patients told "Come in during the morning" or "Come after lunch." Seen on a walk-in basis within that window. Simple but harder to predict wait times.',
  },
};

// ========================================
// CANCELLATION REASONS
// ========================================

export const cancellationReasons = [
  'Patient requested',
  'Provider unavailable',
  'Insurance issue',
  'No-show (no contact)',
  'Weather/emergency',
  'Duplicate booking',
  'Patient hospitalized',
  'Other',
] as const;

// ========================================
// LOCAL PHARMACIES (for searchable dropdown)
// ========================================

export const localPharmacies: PharmacyInfo[] = [
  {
    name: 'CVS Pharmacy #4521',
    address: { street: '3200 S Lamar Blvd', apt: '', city: 'Austin', state: 'TX', zip: '78704' },
    phone: '(512) 555-0220',
    fax: '(512) 555-0221',
    isMailOrder: false,
  },
  {
    name: 'CVS Pharmacy #6890',
    address: { street: '4200 S Lamar Blvd', apt: '', city: 'Austin', state: 'TX', zip: '78704' },
    phone: '(512) 555-0660',
    fax: '(512) 555-0661',
    isMailOrder: false,
  },
  {
    name: 'Walgreens #7832',
    address: { street: '1200 N Mays St', apt: '', city: 'Round Rock', state: 'TX', zip: '78664' },
    phone: '(512) 555-0350',
    fax: '(512) 555-0351',
    isMailOrder: false,
  },
  {
    name: 'Walgreens #5590',
    address: { street: '900 E Whitestone Blvd', apt: '', city: 'Cedar Park', state: 'TX', zip: '78613' },
    phone: '(512) 555-0770',
    fax: '(512) 555-0771',
    isMailOrder: false,
  },
  {
    name: 'H-E-B Pharmacy #108',
    address: { street: '2000 S Congress Ave', apt: '', city: 'Austin', state: 'TX', zip: '78704' },
    phone: '(512) 555-0445',
    fax: '(512) 555-0446',
    isMailOrder: false,
  },
  {
    name: 'H-E-B Pharmacy #215',
    address: { street: '6001 W William Cannon Dr', apt: '', city: 'Austin', state: 'TX', zip: '78749' },
    phone: '(512) 555-0480',
    fax: '(512) 555-0481',
    isMailOrder: false,
  },
  {
    name: 'Walmart Pharmacy #1172',
    address: { street: '5017 W US Hwy 290', apt: '', city: 'Austin', state: 'TX', zip: '78735' },
    phone: '(512) 555-0550',
    fax: '(512) 555-0551',
    isMailOrder: false,
  },
  {
    name: 'Express Scripts Mail Order',
    address: { street: 'PO Box 650271', apt: '', city: 'Dallas', state: 'TX', zip: '75265' },
    phone: '1-800-555-0300',
    fax: '1-800-555-0301',
    isMailOrder: true,
  },
];

// ========================================
// INSURANCE CARRIERS (for searchable dropdown)
// ========================================

export const insuranceCarriers = [
  'Aetna',
  'Ambetter',
  'Blue Cross Blue Shield',
  'Cigna',
  'Humana',
  'Kaiser Permanente',
  'Medicaid (Texas)',
  'Medicare',
  'Molina Healthcare',
  'Oscar Health',
  'Superior HealthPlan',
  'Texas Medicaid',
  'Tricare',
  'UnitedHealthcare',
  'AARP/UnitedHealthcare',
] as const;

// ========================================
// FORM SELECT OPTIONS
// ========================================

export const formOptions = {
  sexAssignedAtBirth: ['M', 'F'] as const,
  genderIdentity: ['Male', 'Female', 'Non-binary', 'Transgender Male', 'Transgender Female', 'Other', 'Prefer not to say'] as const,
  pronouns: ['He/Him', 'She/Her', 'They/Them', 'Other'] as const,
  race: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Native Hawaiian or Other Pacific Islander', 'White', 'Two or More Races', 'Other', 'Prefer not to say'] as const,
  ethnicity: ['Hispanic or Latino', 'Not Hispanic or Latino', 'Prefer not to say'] as const,
  preferredLanguage: ['English', 'Spanish', 'Vietnamese', 'Chinese (Mandarin)', 'Chinese (Cantonese)', 'Korean', 'Arabic', 'Hindi', 'Tagalog', 'Other'] as const,
  maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Domestic Partner'] as const,
  contactMethod: ['cell', 'home', 'email', 'portal'] as const,
  emergencyRelationship: ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Guardian', 'Other'] as const,
  guarantorRelationship: ['Self', 'Spouse', 'Parent', 'Guardian', 'Other'] as const,
  subscriberRelationship: ['self', 'spouse', 'child', 'other'] as const,
  employmentStatus: ['employed', 'unemployed', 'student', 'retired', 'disabled', 'self-employed'] as const,
  idType: ["Driver's License", 'State ID', 'Passport', 'Military ID', 'Other'] as const,
  paymentMethod: ['Cash', 'Check', 'Credit Card', 'Debit Card', 'HSA/FSA Card', 'Money Order'] as const,
  referralSource: ['Insurance directory', 'Friend/Family referral', 'Physician referral', 'Online search', 'Drive-by', 'Social media', 'Other'] as const,
  states: ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'] as const,
};
