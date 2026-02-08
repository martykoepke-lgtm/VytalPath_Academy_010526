import { useState } from 'react';
import {
  FileText,
  Pill,
  AlertTriangle,
  ClipboardList,
  History,
  Syringe,
  FlaskConical,
  FolderOpen,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import type { EHRPatient } from '../../types/ehr';

interface PatientChartViewProps {
  patientId: string;
  encounterId: string | null;
}

type ChartTab = 'summary' | 'problems' | 'medications' | 'allergies' | 'history' | 'immunizations' | 'lab-results' | 'documents' | 'billing';

const tabs: { id: ChartTab; label: string; icon: typeof FileText }[] = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'problems', label: 'Problems', icon: ClipboardList },
  { id: 'medications', label: 'Medications', icon: Pill },
  { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
  { id: 'history', label: 'History', icon: History },
  { id: 'immunizations', label: 'Immunizations', icon: Syringe },
  { id: 'lab-results', label: 'Lab Results', icon: FlaskConical },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

const severityColors: Record<string, string> = {
  mild: 'bg-yellow-50 text-yellow-700',
  moderate: 'bg-orange-50 text-orange-700',
  severe: 'bg-red-50 text-red-700',
};

const methodLabels: Record<string, string> = {
  paper: 'Paper',
  electronic: 'Electronic',
};

function SummaryTab({ patient }: { patient: EHRPatient }) {
  const { getPatientAppointments } = useEHRSession();
  const appts = getPatientAppointments(patient.id);
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appts.filter((a) => a.date >= today && a.status !== 'cancelled' && a.status !== 'rescheduled');
  const primary = patient.insurances.find((i) => i.type === 'primary');

  return (
    <div className="space-y-4">
      {/* Demographics */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Demographics</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-400">Phone:</span> <span className="text-gray-700">{patient.contact.cellPhone || patient.contact.homePhone}</span></div>
          <div><span className="text-gray-400">Email:</span> <span className="text-gray-700">{patient.contact.email || 'N/A'}</span></div>
          <div><span className="text-gray-400">Address:</span> <span className="text-gray-700">{patient.contact.homeAddress.street}, {patient.contact.homeAddress.city}</span></div>
          <div><span className="text-gray-400">Language:</span> <span className="text-gray-700">{patient.demographics.preferredLanguage}</span></div>
        </div>
      </div>
      {/* Insurance */}
      {primary && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Insurance</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-400">Carrier:</span> <span className="text-gray-700">{primary.carrier}</span></div>
            <div><span className="text-gray-400">Plan:</span> <span className="text-gray-700">{primary.planType}</span></div>
            <div><span className="text-gray-400">Member ID:</span> <span className="text-gray-700">{primary.memberId}</span></div>
            <div><span className="text-gray-400">Copay:</span> <span className="text-gray-700">${primary.copayOfficeVisit}</span></div>
          </div>
        </div>
      )}
      {/* Upcoming appointments */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming Appointments ({upcoming.length})</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-400">None scheduled</p>
        ) : (
          <div className="space-y-1.5">
            {upcoming.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-sm">
                <span className="text-gray-700">
                  {new Date(a.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 truncate">{a.reasonForVisit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemsTab({ patient }: { patient: EHRPatient }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Problem List</h3>
      {patient.medicalSummary.problemList.length === 0 ? (
        <p className="text-sm text-gray-400">No active problems</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Problem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patient.medicalSummary.problemList.map((p, i) => (
              <tr key={i}>
                <td className="py-2 text-sm text-gray-400 w-10">{i + 1}</td>
                <td className="py-2 text-sm text-gray-700">{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function MedicationsTab({ patient }: { patient: EHRPatient }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Current Medications</h3>
      {patient.medicalSummary.medications.length === 0 ? (
        <p className="text-sm text-gray-400">No medications on file</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Dose</th>
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patient.medicalSummary.medications.map((m, i) => (
              <tr key={i}>
                <td className="py-2 text-sm text-gray-700 font-medium">{m.name}</td>
                <td className="py-2 text-sm text-gray-600">{m.strength}</td>
                <td className="py-2 text-sm text-gray-600">{m.frequency}</td>
                <td className="py-2 text-sm text-gray-500">{m.route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AllergiesTab({ patient }: { patient: EHRPatient }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Allergies</h3>
      {patient.medicalSummary.allergies.length === 0 ? (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">NKDA — No Known Drug Allergies</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Allergen</th>
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Reaction</th>
              <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patient.medicalSummary.allergies.map((a, i) => (
              <tr key={i}>
                <td className="py-2 text-sm text-gray-700 font-medium">{a.name}</td>
                <td className="py-2 text-sm text-gray-600">{a.reaction}</td>
                <td className="py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColors[a.severity]}`}>
                    {a.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function HistoryTab({ patient }: { patient: EHRPatient }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Surgical History</h3>
        {patient.medicalSummary.pastSurgicalHistory.length === 0 ? (
          <p className="text-sm text-gray-400">None documented</p>
        ) : (
          <ul className="space-y-1">
            {patient.medicalSummary.pastSurgicalHistory.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-gray-400" /> {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Family History</h3>
        <ul className="space-y-1">
          {patient.medicalSummary.familyHistory.map((f, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-gray-400" /> {f}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Social History</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-400">Smoking:</span> <span className="text-gray-700">{patient.medicalSummary.socialHistory.smokingStatus}</span></div>
          <div><span className="text-gray-400">Alcohol:</span> <span className="text-gray-700">{patient.medicalSummary.socialHistory.alcoholUse}</span></div>
        </div>
      </div>
    </div>
  );
}

function ImmunizationsTab() {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Immunization Records</h3>
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <Syringe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Immunization records would be imported from the state registry</p>
        <p className="text-xs text-gray-300 mt-1">This is a simulated placeholder</p>
      </div>
    </div>
  );
}

function LabResultsTab() {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Lab Results</h3>
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <FlaskConical className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Lab results are received via electronic interfaces</p>
        <p className="text-xs text-gray-300 mt-1">This is a simulated placeholder</p>
      </div>
    </div>
  );
}

function DocumentsTab({ patient }: { patient: EHRPatient }) {
  const consentItems = [
    { key: 'hipaaNotice', label: 'HIPAA Notice of Privacy Practices' },
    { key: 'consentToTreat', label: 'Consent to Treat' },
    { key: 'financialResponsibility', label: 'Financial Responsibility Agreement' },
    { key: 'releaseOfInformation', label: 'Release of Information' },
  ] as const;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Consent Documents</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
            <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {consentItems.map(({ key, label }) => {
            const item = patient.consents[key];
            return (
              <tr key={key}>
                <td className="py-2 text-sm text-gray-700">{label}</td>
                <td className="py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.signed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {item.signed ? 'Signed' : 'Not Signed'}
                  </span>
                </td>
                <td className="py-2 text-sm text-gray-500">{item.date || '—'}</td>
                <td className="py-2 text-sm text-gray-500">{item.method ? methodLabels[item.method] : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="text-gray-400">Advance Directive:</span>
        <span className={patient.consents.advanceDirectiveOnFile ? 'text-green-600' : 'text-gray-500'}>
          {patient.consents.advanceDirectiveOnFile ? 'On File' : 'Not on File'}
        </span>
        <span className="text-gray-400">Patient Portal:</span>
        <span className={patient.consents.patientPortalEnrolled ? 'text-green-600' : 'text-gray-500'}>
          {patient.consents.patientPortalEnrolled ? 'Enrolled' : 'Not Enrolled'}
        </span>
      </div>
    </div>
  );
}

function BillingTab({ patient }: { patient: EHRPatient }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Account Balance</h3>
        <p className={`text-2xl font-semibold ${patient.accountBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
          ${patient.accountBalance.toFixed(2)}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Insurance Coverage</h3>
        {patient.insurances.map((ins) => (
          <div key={ins.id} className="bg-gray-50 rounded-xl p-3 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{ins.carrier} — {ins.planName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">{ins.type}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div>Copay: ${ins.copayOfficeVisit}</div>
              <div>Deductible: ${ins.deductibleMet}/${ins.deductible}</div>
              <div>OOP: ${ins.oopMet}/${ins.oopMax || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PatientChartView({ patientId, encounterId }: PatientChartViewProps) {
  const { getPatient, getEncounter } = useEHRSession();
  const [activeTab, setActiveTab] = useState<ChartTab>('summary');

  const patient = getPatient(patientId);
  // Keep encounter reference available for future use
  encounterId && getEncounter(encounterId);

  if (!patient) {
    return <div className="p-8 text-center text-gray-400">Patient not found</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary': return <SummaryTab patient={patient} />;
      case 'problems': return <ProblemsTab patient={patient} />;
      case 'medications': return <MedicationsTab patient={patient} />;
      case 'allergies': return <AllergiesTab patient={patient} />;
      case 'history': return <HistoryTab patient={patient} />;
      case 'immunizations': return <ImmunizationsTab />;
      case 'lab-results': return <LabResultsTab />;
      case 'documents': return <DocumentsTab patient={patient} />;
      case 'billing': return <BillingTab patient={patient} />;
    }
  };

  return (
    <div>
      <div className="flex gap-4">
        {/* Left sidebar */}
        <div className="w-52 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5 min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
