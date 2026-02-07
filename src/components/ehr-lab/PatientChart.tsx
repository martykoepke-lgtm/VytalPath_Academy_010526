import { useState } from 'react';
import {
  User, Shield, Calendar, Heart, FileText, DollarSign,
  AlertTriangle, Phone, Mail, MapPin, Clock, ChevronRight,
  Pill, AlertCircle, CheckCircle, XCircle, Video,
} from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import type { EHRAppointment } from '../../types/ehr';

type ChartTab = 'demographics' | 'insurance' | 'appointments' | 'clinical' | 'documents' | 'balance';

interface PatientChartProps {
  patientId: string;
  onScheduleAppointment: (patientId: string) => void;
  onViewAppointment: (appointmentId: string) => void;
  onCheckIn: (appointmentId: string) => void;
  onCheckOut: (appointmentId: string) => void;
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-50 text-blue-700',
  'checked-in': 'bg-green-50 text-green-700',
  roomed: 'bg-teal-50 text-teal-700',
  'with-provider': 'bg-purple-50 text-purple-700',
  'check-out': 'bg-amber-50 text-amber-700',
  completed: 'bg-gray-50 text-gray-500',
  'no-show': 'bg-red-50 text-red-700',
  cancelled: 'bg-gray-50 text-gray-400 line-through',
  rescheduled: 'bg-orange-50 text-orange-600',
  lwbs: 'bg-red-50 text-red-600',
};

function formatDOB(dob: string): string {
  const [y, m, d] = dob.split('-');
  return `${m}/${d}/${y}`;
}

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function formatDate(date: string): string {
  const [y, m, d] = date.split('-');
  return `${m}/${d}/${y}`;
}

export function PatientChart({ patientId, onScheduleAppointment, onViewAppointment, onCheckIn, onCheckOut }: PatientChartProps) {
  const { getPatient, getPatientAppointments, getNoShowCount, appointmentTypes } = useEHRSession();
  const [tab, setTab] = useState<ChartTab>('demographics');

  const patient = getPatient(patientId);
  if (!patient) {
    return <div className="p-8 text-center text-gray-500">Patient not found</div>;
  }

  const appointments = getPatientAppointments(patientId);
  const noShows = getNoShowCount(patientId);
  const demo = patient.demographics;
  const primaryIns = patient.insurances.find((i) => i.type === 'primary');

  const tabs: { key: ChartTab; label: string; icon: typeof User }[] = [
    { key: 'demographics', label: 'Demographics', icon: User },
    { key: 'insurance', label: 'Insurance', icon: Shield },
    { key: 'appointments', label: 'Appointments', icon: Calendar },
    { key: 'clinical', label: 'Clinical', icon: Heart },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'balance', label: 'Balance', icon: DollarSign },
  ];

  return (
    <div>
      {/* Patient banner */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {demo.lastName}, {demo.firstName} {demo.middleName ? demo.middleName[0] + '.' : ''}
              </h2>
              {noShows > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                  <AlertTriangle className="w-3 h-3" /> {noShows} no-show{noShows > 1 ? 's' : ''}
                </span>
              )}
              {patient.accountBalance > 0 && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                  Balance: ${patient.accountBalance.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-mono">{patient.mrn}</span>
              {' | '}DOB: {formatDOB(demo.dateOfBirth)} ({calculateAge(demo.dateOfBirth)}{demo.sexAssignedAtBirth})
              {' | '}{primaryIns ? `${primaryIns.carrier} ${primaryIns.planType}` : 'No insurance'}
              {' | '}PCP: {patient.providerAssignment.primaryCareProvider}
            </p>
          </div>
        </div>
        <button
          onClick={() => onScheduleAppointment(patientId)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm transition-all"
        >
          <Calendar className="w-4 h-4" />
          Schedule
        </button>
      </div>

      {/* Allergy banner */}
      {patient.medicalSummary.allergies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-red-800">Allergies: </span>
            <span className="text-sm text-red-700">
              {patient.medicalSummary.allergies.map((a) => `${a.name} (${a.reaction})`).join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-2xl p-1 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              tab === key
                ? 'bg-white text-gray-900 shadow-apple-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
        {tab === 'demographics' && <DemographicsTab patient={patient} />}
        {tab === 'insurance' && <InsuranceTab patient={patient} />}
        {tab === 'appointments' && (
          <AppointmentsTab
            appointments={appointments}
            onView={onViewAppointment}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
            appointmentTypes={appointmentTypes}
          />
        )}
        {tab === 'clinical' && <ClinicalTab patient={patient} />}
        {tab === 'documents' && <DocumentsTab patient={patient} />}
        {tab === 'balance' && <BalanceTab patient={patient} />}
      </div>
    </div>
  );
}

// ========================================
// Tab Components
// ========================================

function FieldRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-50">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 col-span-2">{value || '—'}</dd>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mt-6 mb-3 first:mt-0">{children}</h3>;
}

function DemographicsTab({ patient }: { patient: ReturnType<ReturnType<typeof useEHRSession>['getPatient']> & {} }) {
  const demo = patient.demographics;
  const contact = patient.contact;
  const addr = contact.homeAddress;

  return (
    <div className="p-6">
      <SectionHeading>Personal Information</SectionHeading>
      <dl>
        <FieldRow label="Legal Name" value={`${demo.firstName} ${demo.middleName} ${demo.lastName}`} />
        <FieldRow label="Preferred Name" value={demo.preferredName} />
        <FieldRow label="Date of Birth" value={`${formatDOB(demo.dateOfBirth)} (Age ${calculateAge(demo.dateOfBirth)})`} />
        <FieldRow label="Sex Assigned at Birth" value={demo.sexAssignedAtBirth === 'M' ? 'Male' : 'Female'} />
        <FieldRow label="Gender Identity" value={demo.genderIdentity} />
        <FieldRow label="Pronouns" value={demo.pronouns} />
        <FieldRow label="SSN" value={demo.ssn} />
        <FieldRow label="Race" value={demo.race} />
        <FieldRow label="Ethnicity" value={demo.ethnicity} />
        <FieldRow label="Preferred Language" value={demo.preferredLanguage} />
        <FieldRow label="Marital Status" value={demo.maritalStatus} />
      </dl>

      <SectionHeading>Contact Information</SectionHeading>
      <dl>
        <FieldRow label="Home Address" value={`${addr.street}${addr.apt ? ', ' + addr.apt : ''}, ${addr.city}, ${addr.state} ${addr.zip}`} />
        <FieldRow label="Cell Phone" value={contact.cellPhone} />
        <FieldRow label="Home Phone" value={contact.homePhone} />
        <FieldRow label="Work Phone" value={contact.workPhone} />
        <FieldRow label="Email" value={contact.email} />
        <FieldRow label="Preferred Contact" value={contact.preferredContactMethod} />
        <FieldRow label="OK to Leave VM" value={contact.okToLeaveVoicemail ? 'Yes' : 'No'} />
        <FieldRow label="OK to Text" value={contact.okToText ? 'Yes' : 'No'} />
        <FieldRow label="OK to Email" value={contact.okToEmail ? 'Yes' : 'No'} />
      </dl>

      <SectionHeading>Emergency Contacts</SectionHeading>
      {patient.emergencyContacts.map((ec, i) => (
        <dl key={i}>
          <FieldRow label={`Contact ${i + 1}`} value={`${ec.name} (${ec.relationship}) — ${ec.phone}`} />
        </dl>
      ))}

      {patient.guarantor && (
        <>
          <SectionHeading>Guarantor</SectionHeading>
          <dl>
            <FieldRow label="Name" value={patient.guarantor.name} />
            <FieldRow label="Relationship" value={patient.guarantor.relationship} />
            <FieldRow label="DOB" value={formatDOB(patient.guarantor.dateOfBirth)} />
            <FieldRow label="Phone" value={patient.guarantor.phone} />
          </dl>
        </>
      )}

      {patient.employer && (
        <>
          <SectionHeading>Employer</SectionHeading>
          <dl>
            <FieldRow label="Status" value={patient.employer.employmentStatus} />
            <FieldRow label="Employer" value={patient.employer.employerName} />
            <FieldRow label="Occupation" value={patient.employer.occupation} />
          </dl>
        </>
      )}

      <SectionHeading>Pharmacy</SectionHeading>
      <dl>
        <FieldRow label="Pharmacy" value={patient.pharmacy.name} />
        <FieldRow label="Phone" value={patient.pharmacy.phone} />
        <FieldRow label="Fax" value={patient.pharmacy.fax} />
      </dl>
    </div>
  );
}

function InsuranceTab({ patient }: { patient: ReturnType<ReturnType<typeof useEHRSession>['getPatient']> & {} }) {
  return (
    <div className="p-6">
      {patient.insurances.length === 0 ? (
        <p className="text-gray-400 text-center py-6">No insurance on file</p>
      ) : (
        patient.insurances.map((ins) => (
          <div key={ins.id} className="mb-6 last:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <Shield className={`w-5 h-5 ${ins.type === 'primary' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h3 className="font-medium text-gray-900 capitalize">{ins.type} Insurance</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{ins.planType}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <dl>
                <FieldRow label="Carrier" value={ins.carrier} />
                <FieldRow label="Plan Name" value={ins.planName} />
                <FieldRow label="Member ID" value={ins.memberId} />
                <FieldRow label="Group #" value={ins.groupNumber} />
                <FieldRow label="Subscriber" value={`${ins.subscriberName} (${ins.subscriberRelationship})`} />
                <FieldRow label="Effective Date" value={formatDate(ins.effectiveDate)} />
                <FieldRow label="Copay (Office)" value={ins.copayOfficeVisit > 0 ? `$${ins.copayOfficeVisit}` : 'N/A'} />
                <FieldRow label="Copay (Specialist)" value={ins.copaySpecialist > 0 ? `$${ins.copaySpecialist}` : 'N/A'} />
                <FieldRow label="Deductible" value={ins.deductible > 0 ? `$${ins.deductible} (Met: $${ins.deductibleMet})` : 'N/A'} />
                <FieldRow label="Coinsurance" value={ins.coinsuranceRate > 0 ? `${ins.coinsuranceRate * 100}%` : 'N/A'} />
                <FieldRow label="OOP Max" value={ins.oopMax > 0 ? `$${ins.oopMax} (Met: $${ins.oopMet})` : 'N/A'} />
                <FieldRow label="Referral Required" value={ins.referralRequired ? 'Yes' : 'No'} />
                <FieldRow label="Prior Auth Required" value={ins.priorAuthRequired ? 'Yes' : 'No'} />
                <FieldRow label="Member Services" value={ins.insurancePhone} />
              </dl>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AppointmentsTab({
  appointments,
  onView,
  onCheckIn,
  onCheckOut,
  appointmentTypes,
}: {
  appointments: EHRAppointment[];
  onView: (id: string) => void;
  onCheckIn: (id: string) => void;
  onCheckOut: (id: string) => void;
  appointmentTypes: ReturnType<typeof useEHRSession>['appointmentTypes'];
}) {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter((a) => a.date >= today && !['cancelled', 'rescheduled', 'completed', 'no-show'].includes(a.status));
  const past = appointments.filter((a) => a.date < today || ['completed', 'no-show', 'cancelled', 'rescheduled'].includes(a.status));

  function getTypeLabel(type: string) {
    return appointmentTypes.find((t) => t.type === type)?.label || type;
  }

  function ApptRow({ appt }: { appt: EHRAppointment }) {
    const canCheckIn = ['scheduled', 'confirmed'].includes(appt.status) && appt.date === today;
    const canCheckOut = ['checked-in', 'roomed', 'with-provider', 'check-out'].includes(appt.status);

    return (
      <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
        <div className="w-24 text-sm text-gray-600">{formatDate(appt.date)}</div>
        <div className="w-16 text-sm text-gray-600">{formatTime(appt.time)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{getTypeLabel(appt.appointmentType)}</p>
          <p className="text-xs text-gray-400 truncate">{appt.reasonForVisit}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusColors[appt.status] || 'bg-gray-100 text-gray-600'}`}>
          {appt.status.replace('-', ' ')}
        </span>
        <div className="flex items-center gap-1">
          {canCheckIn && (
            <button onClick={() => onCheckIn(appt.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-all">
              Check In
            </button>
          )}
          {canCheckOut && (
            <button onClick={() => onCheckOut(appt.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 text-white hover:bg-amber-700 transition-all">
              Check Out
            </button>
          )}
          <button onClick={() => onView(appt.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {upcoming.length > 0 && (
        <>
          <SectionHeading>Upcoming Appointments</SectionHeading>
          {upcoming.map((a) => <ApptRow key={a.id} appt={a} />)}
        </>
      )}
      {past.length > 0 && (
        <>
          <SectionHeading>Past Appointments</SectionHeading>
          {past.map((a) => <ApptRow key={a.id} appt={a} />)}
        </>
      )}
      {appointments.length === 0 && (
        <p className="text-gray-400 text-center py-6">No appointment history</p>
      )}
    </div>
  );
}

function ClinicalTab({ patient }: { patient: ReturnType<ReturnType<typeof useEHRSession>['getPatient']> & {} }) {
  const ms = patient.medicalSummary;

  return (
    <div className="p-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-800">
        Front desk view — clinical data is read-only. Contact clinical staff to update.
      </div>

      <SectionHeading>Allergies</SectionHeading>
      {ms.allergies.length === 0 ? (
        <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> No known allergies (NKA)</p>
      ) : (
        <div className="space-y-2">
          {ms.allergies.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-red-50 rounded-xl px-4 py-2">
              <AlertCircle className={`w-4 h-4 flex-shrink-0 ${a.severity === 'severe' ? 'text-red-600' : a.severity === 'moderate' ? 'text-amber-600' : 'text-yellow-500'}`} />
              <div>
                <span className="text-sm font-medium text-gray-900">{a.name}</span>
                <span className="text-sm text-gray-600"> — {a.reaction}</span>
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  a.severity === 'severe' ? 'bg-red-100 text-red-700' : a.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{a.severity}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionHeading>Current Medications ({ms.medications.length})</SectionHeading>
      {ms.medications.length === 0 ? (
        <p className="text-sm text-gray-400">No medications on file</p>
      ) : (
        <div className="space-y-1">
          {ms.medications.map((med, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
              <Pill className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">{med.name} {med.strength}</span>
                <span className="text-sm text-gray-500"> — {med.frequency} ({med.route})</span>
              </div>
              <span className="text-xs text-gray-400">{med.prescriber}</span>
            </div>
          ))}
        </div>
      )}

      <SectionHeading>Problem List ({ms.problemList.length})</SectionHeading>
      {ms.problemList.length === 0 ? (
        <p className="text-sm text-gray-400">No active problems</p>
      ) : (
        <ul className="space-y-1">
          {ms.problemList.map((prob, i) => (
            <li key={i} className="text-sm text-gray-700 pl-4 py-1 border-l-2 border-blue-200">{prob}</li>
          ))}
        </ul>
      )}

      <SectionHeading>Past Surgical History</SectionHeading>
      {ms.pastSurgicalHistory.length === 0 ? (
        <p className="text-sm text-gray-400">None reported</p>
      ) : (
        <ul className="space-y-1">
          {ms.pastSurgicalHistory.map((s, i) => (
            <li key={i} className="text-sm text-gray-700 pl-4 py-1 border-l-2 border-gray-200">{s}</li>
          ))}
        </ul>
      )}

      <SectionHeading>Social History</SectionHeading>
      <dl>
        <FieldRow label="Smoking" value={ms.socialHistory.smokingStatus} />
        <FieldRow label="Alcohol" value={ms.socialHistory.alcoholUse} />
      </dl>
    </div>
  );
}

function DocumentsTab({ patient }: { patient: ReturnType<ReturnType<typeof useEHRSession>['getPatient']> & {} }) {
  const consents = patient.consents;

  const items = [
    { label: 'HIPAA Notice of Privacy Practices', ...consents.hipaaNotice },
    { label: 'Consent to Treat', ...consents.consentToTreat },
    { label: 'Financial Responsibility Agreement', ...consents.financialResponsibility },
    { label: 'Release of Information', ...consents.releaseOfInformation },
  ];

  return (
    <div className="p-6">
      <SectionHeading>Signed Consents</SectionHeading>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              {item.signed ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.signed && item.method && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">{item.method === 'paper' ? 'Paper' : 'Electronic'}</span>
              )}
              <span className="text-sm text-gray-400">
                {item.signed && item.date ? `Signed ${formatDate(item.date)}` : 'Not on file'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading>Additional</SectionHeading>
      <dl>
        <FieldRow label="Advance Directive on File" value={consents.advanceDirectiveOnFile ? 'Yes' : 'No'} />
        <FieldRow label="Patient Portal Enrolled" value={consents.patientPortalEnrolled ? 'Yes' : 'No'} />
        {consents.patientPortalEnrolled && <FieldRow label="Portal Email" value={consents.patientPortalEmail} />}
      </dl>
    </div>
  );
}

function BalanceTab({ patient }: { patient: ReturnType<ReturnType<typeof useEHRSession>['getPatient']> & {} }) {
  return (
    <div className="p-6">
      <div className="text-center py-8">
        <p className="text-sm text-gray-500 mb-1">Current Account Balance</p>
        <p className={`text-4xl font-semibold ${patient.accountBalance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
          ${patient.accountBalance.toFixed(2)}
        </p>
        {patient.accountBalance === 0 && (
          <p className="text-sm text-green-500 mt-2 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" /> No outstanding balance
          </p>
        )}
        {patient.accountBalance > 0 && (
          <p className="text-sm text-amber-500 mt-2">Collect at next visit</p>
        )}
      </div>
    </div>
  );
}
