import { useState } from 'react';
import {
  X,
  Users,
  Building2,
  CalendarDays,
  Clock,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Star,
} from 'lucide-react';

export type QuickRefTab = 'patients' | 'clinic' | 'schedule' | 'appt-types' | 'workflows';
type Tab = QuickRefTab;

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'clinic', label: 'Clinic', icon: Building2 },
  { id: 'schedule', label: "Today's Schedule", icon: CalendarDays },
  { id: 'appt-types', label: 'Appt Types', icon: Clock },
  { id: 'workflows', label: 'Workflows', icon: ClipboardCheck },
];

interface PatientInfo {
  name: string;
  mrn: string;
  dob: string;
  insurance: string;
  complexity: string;
  complexityColor: string;
  conditions: string;
  notes: string;
}

const patients: PatientInfo[] = [
  {
    name: 'Maria Santos',
    mrn: 'MRN-10001',
    dob: '06/15/1993',
    insurance: 'Aetna Choice POS II (PPO)',
    complexity: 'Beginner',
    complexityColor: 'bg-green-100 text-green-700',
    conditions: 'Hypothyroidism, Seasonal allergies',
    notes: 'Simple established patient. Single insurance, no referral required. Good starting point.',
  },
  {
    name: 'James Thompson',
    mrn: 'MRN-10002',
    dob: '11/22/1967',
    insurance: 'UHC HDHP + BCBS PPO (dual)',
    complexity: 'Moderate',
    complexityColor: 'bg-amber-100 text-amber-700',
    conditions: 'Type 2 Diabetes, HTN, HLD, Obesity, Sleep Apnea',
    notes: 'Dual insurance (coordination of benefits). 5 medications, chronic conditions. Has 1 no-show history.',
  },
  {
    name: 'Lily Patel',
    mrn: 'MRN-10003',
    dob: '09/03/2018',
    insurance: 'TX Medicaid STAR Managed Care',
    complexity: 'Moderate',
    complexityColor: 'bg-amber-100 text-amber-700',
    conditions: 'Mild persistent asthma, Allergic rhinitis, Peanut allergy',
    notes: 'Pediatric patient — guarantor is mother Aisha Patel. Medicaid managed care, referral required for specialists.',
  },
  {
    name: 'Robert Washington',
    mrn: 'MRN-10004',
    dob: '03/28/1951',
    insurance: 'Medicare Part B + AARP Supplement Plan F',
    complexity: 'Advanced',
    complexityColor: 'bg-red-100 text-red-700',
    conditions: 'A-Fib, CHF, HTN, Diabetes, CKD Stage 3a, BPH, Neuropathy',
    notes: 'Medicare with supplement (COB). 13 medications, INR monitoring, complex history. Good for AWV practice.',
  },
  {
    name: 'Angela Torres',
    mrn: 'MRN-10005',
    dob: '12/07/1985',
    insurance: 'Cigna SureFit HMO',
    complexity: 'Moderate',
    complexityColor: 'bg-amber-100 text-amber-700',
    conditions: 'GAD, Allergic Rhinitis, Intermittent Asthma, Migraine',
    notes: 'HMO plan — referral and prior auth required for specialists/imaging. Good for prior auth practice.',
  },
];

const todaysSchedule = [
  { time: '08:30 AM', patient: 'Maria Santos', type: 'Follow-Up', reason: 'Thyroid recheck' },
  { time: '09:00 AM', patient: 'Robert Washington', type: 'Follow-Up', reason: 'CHF follow-up, INR check' },
  { time: '10:00 AM', patient: 'James Thompson', type: 'Follow-Up', reason: 'Diabetes management' },
  { time: '10:30 AM', patient: 'Lily Patel', type: 'Follow-Up', reason: 'Asthma follow-up' },
  { time: '02:00 PM', patient: 'Angela Torres', type: 'Telehealth', reason: 'Anxiety medication review' },
  { time: '03:30 PM', patient: 'Maria Santos', type: 'Annual Wellness', reason: 'Annual physical exam' },
];

const appointmentTypes = [
  { type: 'New Patient Visit', duration: '30 min', notes: 'Full intake, registration, history' },
  { type: 'Follow-Up Visit', duration: '15 min', notes: 'Established patient return visit' },
  { type: 'Annual Physical / Wellness', duration: '45 min', notes: 'Preventive care, screenings' },
  { type: 'Urgent / Same-Day', duration: '15 min', notes: 'Acute issue, walk-in slot' },
  { type: 'Telehealth Visit', duration: '20 min', notes: 'Virtual video appointment' },
  { type: 'Procedure', duration: '30 min', notes: 'Minor in-office procedure' },
  { type: 'Lab Only', duration: '10 min', notes: 'Blood draw or specimen collection' },
  { type: 'Nurse Visit', duration: '15 min', notes: 'Vitals, injections, wound care' },
  { type: 'Consultation', duration: '30 min', notes: 'New referral evaluation' },
  { type: 'Pre-Op Clearance', duration: '30 min', notes: 'Surgical clearance workup' },
];

interface WorkflowStep {
  step: string;
  detail?: string;
}

interface Workflow {
  title: string;
  steps: WorkflowStep[];
}

const workflows: Workflow[] = [
  {
    title: 'New Patient Check-In',
    steps: [
      { step: 'Greet patient, verify identity (name + DOB + photo ID)' },
      { step: 'Collect insurance card and photo ID (scan/copy)' },
      { step: 'Collect copay at time of service' },
      { step: 'Provide new patient forms (demographics, history, HIPAA NPP, consent, financial policy)' },
      { step: 'Collect completed forms, review for completeness' },
      { step: 'Mark patient as "Checked In" in the system' },
      { step: 'Notify clinical staff patient is ready' },
    ],
  },
  {
    title: 'Existing Patient Check-In',
    steps: [
      { step: 'Greet and identify (name + DOB)' },
      { step: 'Confirm demographics are current ("Any changes to address, phone, or insurance?")' },
      { step: 'If insurance changed: collect new card, update system' },
      { step: 'Collect copay' },
      { step: 'Provide any visit-specific screening forms' },
      { step: 'Mark as checked in, notify clinical staff' },
    ],
  },
  {
    title: 'Patient Check-Out',
    steps: [
      { step: 'Confirm provider orders (follow-ups, referrals, labs, imaging)' },
      { step: 'Schedule follow-up appointments' },
      { step: 'Process referrals/prior authorizations if ordered' },
      { step: 'Collect any remaining payments' },
      { step: 'Provide visit summary and after-visit instructions' },
      { step: 'Confirm patient has everything before leaving' },
    ],
  },
  {
    title: 'Schedule New Appointment',
    steps: [
      { step: 'Search for patient (or register if new)' },
      { step: 'Determine appointment type and provider' },
      { step: 'Check referral/authorization requirements' },
      { step: 'Find available slot and book' },
      { step: 'Confirm details with patient' },
      { step: 'Set up appointment reminders' },
    ],
  },
  {
    title: 'New Patient Registration',
    steps: [
      { step: 'Confirm patient is not already in the system' },
      { step: 'Collect demographics (legal name, DOB, contact, emergency contact, employer)' },
      { step: 'Collect insurance info (cards front/back, payer, plan, member ID, group #)' },
      { step: 'Run insurance eligibility verification' },
      { step: 'Schedule the appointment' },
      { step: 'Explain financial responsibility and what to expect' },
      { step: 'Provide pre-visit instructions (what to bring, arrive early)' },
    ],
  },
];

function PatientsTab() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 mb-3">
        These test patients are pre-loaded in your session. Search by last name, MRN, or DOB.
      </p>
      {patients.map((pt, i) => (
        <div key={pt.mrn} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-medium text-sm text-gray-900 truncate">{pt.name}</span>
              <span className="text-xs text-gray-500 flex-shrink-0">{pt.mrn}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${pt.complexityColor}`}>
                {pt.complexity}
              </span>
            </div>
            {expandedIdx === i ? (
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </button>
          {expandedIdx === i && (
            <div className="px-4 pb-3 border-t border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 text-xs">
                <div>
                  <span className="text-gray-500">DOB:</span>{' '}
                  <span className="text-gray-800">{pt.dob}</span>
                </div>
                <div>
                  <span className="text-gray-500">Insurance:</span>{' '}
                  <span className="text-gray-800">{pt.insurance}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Conditions:</span>{' '}
                  <span className="text-gray-800">{pt.conditions}</span>
                </div>
              </div>
              <div className="mt-2 flex items-start gap-1.5">
                <Star className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-teal-700">{pt.notes}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ClinicTab() {
  return (
    <div className="space-y-4">
      <div className="bg-teal-50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-teal-900 mb-2">Provider</h4>
        <div className="space-y-1 text-sm text-teal-800">
          <p><span className="font-medium">Dr. Sarah Chen, MD</span> — Family Medicine</p>
          <p className="text-xs text-teal-600">NPI: 1234567890 &middot; DEA: FC1234567</p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Clinic</h4>
        <div className="space-y-1 text-sm text-gray-700">
          <p className="font-medium">Mountain View Family Practice</p>
          <p>123 Wellness Blvd, Suite 200</p>
          <p>Austin, TX 78745</p>
          <p className="text-xs text-gray-500 mt-1">Phone: (512) 555-0100 &middot; NPI: 1234567890</p>
        </div>
      </div>
    </div>
  );
}

function ScheduleTab() {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        These appointments are pre-loaded for today. You can also schedule new ones.
      </p>
      <div className="space-y-2">
        {todaysSchedule.map((appt, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
            <span className="text-sm font-mono font-medium text-teal-700 w-20 flex-shrink-0">
              {appt.time}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">{appt.patient}</p>
              <p className="text-xs text-gray-500">
                {appt.type} &middot; {appt.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApptTypesTab() {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        Available when scheduling appointments in the lab.
      </p>
      <div className="space-y-1.5">
        {appointmentTypes.map((at) => (
          <div key={at.type} className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-100 bg-white">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900">{at.type}</span>
              <span className="text-xs text-gray-400 ml-2">{at.notes}</span>
            </div>
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full flex-shrink-0">
              {at.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowsTab() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 mb-3">
        Step-by-step checklists for common front office workflows.
      </p>
      {workflows.map((wf, i) => (
        <div key={wf.title} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-gray-900">{wf.title}</span>
              <span className="text-xs text-gray-400">{wf.steps.length} steps</span>
            </div>
            {expandedIdx === i ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedIdx === i && (
            <div className="px-4 pb-3 border-t border-gray-100 bg-gray-50/50">
              <ol className="mt-2 space-y-1.5">
                {wf.steps.map((s, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-medium text-[10px]">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{s.step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface EHRQuickReferenceProps {
  onClose: () => void;
  defaultTab?: Tab;
}

export function EHRQuickReference({ onClose, defaultTab = 'patients' }: EHRQuickReferenceProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Quick Reference</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 flex-shrink-0 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === 'patients' && <PatientsTab />}
          {activeTab === 'clinic' && <ClinicTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'appt-types' && <ApptTypesTab />}
          {activeTab === 'workflows' && <WorkflowsTab />}
        </div>
      </div>
    </div>
  );
}
