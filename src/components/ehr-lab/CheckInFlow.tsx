import { useState } from 'react';
import {
  CheckCircle, ChevronRight, CreditCard, FileText, Shield, User,
  AlertCircle, AlertTriangle, DollarSign, Clock, Edit3, X,
} from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import { formOptions, insuranceCarriers } from '../../data/ehr-clinic-data';
import type { ConsentMethod } from '../../types/ehr';

interface CheckInFlowProps {
  appointmentId: string;
  onComplete: () => void;
  onCancel: () => void;
}

type Step = 'verify-id' | 'verify-demographics' | 'verify-insurance' | 'payment-balance' | 'check-forms' | 'complete';

const steps: { key: Step; label: string }[] = [
  { key: 'verify-id', label: 'Verify ID' },
  { key: 'verify-demographics', label: 'Verify Demographics' },
  { key: 'verify-insurance', label: 'Verify Insurance' },
  { key: 'payment-balance', label: 'Payment & Balance' },
  { key: 'check-forms', label: 'Check Forms' },
  { key: 'complete', label: 'Complete' },
];

type ConsentKey = 'hipaaNotice' | 'consentToTreat' | 'financialResponsibility' | 'releaseOfInformation';

const consentLabels: Record<ConsentKey, { label: string; required: boolean }> = {
  hipaaNotice: { label: 'HIPAA Notice of Privacy Practices', required: true },
  consentToTreat: { label: 'Consent to Treat', required: true },
  financialResponsibility: { label: 'Financial Responsibility Agreement', required: true },
  releaseOfInformation: { label: 'Release of Information', required: false },
};

const planTypes = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'Medicare', 'Medicaid', 'Tricare'] as const;

export function CheckInFlow({ appointmentId, onComplete, onCancel }: CheckInFlowProps) {
  const { getAppointment, getPatient, updatePatient, checkInAppointment, getNoShowCount } = useEHRSession();
  const [currentStep, setCurrentStep] = useState<Step>('verify-id');
  const [idType, setIdType] = useState('');
  const [idVerified, setIdVerified] = useState(false);
  const [demoConfirmed, setDemoConfirmed] = useState(false);
  const [insuranceConfirmed, setInsuranceConfirmed] = useState(false);
  const [copayAmount, setCopayAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [copayCollected, setCopayCollected] = useState(false);
  const [balanceAcknowledged, setBalanceAcknowledged] = useState(false);

  // Insurance inline editing state
  const [editingInsurance, setEditingInsurance] = useState(false);
  const [insCarrier, setInsCarrier] = useState('');
  const [insPlanType, setInsPlanType] = useState('');
  const [insMemberId, setInsMemberId] = useState('');
  const [insGroupNumber, setInsGroupNumber] = useState('');
  const [insSubscriberName, setInsSubscriberName] = useState('');
  const [insCopay, setInsCopay] = useState('');

  // Form collection state — tracks per-form actions taken during this check-in
  const [formActions, setFormActions] = useState<Record<ConsentKey, {
    collected: boolean;
    method: ConsentMethod;
    date: string;
  }>>({
    hipaaNotice: { collected: false, method: null, date: '' },
    consentToTreat: { collected: false, method: null, date: '' },
    financialResponsibility: { collected: false, method: null, date: '' },
    releaseOfInformation: { collected: false, method: null, date: '' },
  });
  const [recollecting, setRecollecting] = useState<Set<ConsentKey>>(new Set());
  const [formsVerified, setFormsVerified] = useState(false);

  const appt = getAppointment(appointmentId);
  const patient = appt ? getPatient(appt.patientId) : undefined;
  if (!appt || !patient) return <div className="p-8 text-center text-gray-500">Appointment not found</div>;

  const primaryIns = patient.insurances.find((i) => i.type === 'primary');
  const expectedCopay = primaryIns?.copayOfficeVisit || 0;
  const noShows = getNoShowCount(patient.id);

  const stepIdx = steps.findIndex((s) => s.key === currentStep);
  const progress = Math.round(((stepIdx) / (steps.length - 1)) * 100);

  const now = new Date();
  const arrivalTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const todayStr = now.toISOString().split('T')[0];

  const nextStep = () => {
    const idx = steps.findIndex((s) => s.key === currentStep);
    if (idx < steps.length - 1) setCurrentStep(steps[idx + 1].key);
  };

  const startEditingInsurance = () => {
    if (primaryIns) {
      setInsCarrier(primaryIns.carrier);
      setInsPlanType(primaryIns.planType);
      setInsMemberId(primaryIns.memberId);
      setInsGroupNumber(primaryIns.groupNumber);
      setInsSubscriberName(primaryIns.subscriberName);
      setInsCopay(String(primaryIns.copayOfficeVisit));
    }
    setEditingInsurance(true);
  };

  const saveInsuranceUpdate = () => {
    if (!primaryIns) return;
    const updatedInsurances = patient.insurances.map((ins) =>
      ins.id === primaryIns.id
        ? {
          ...ins,
          carrier: insCarrier || ins.carrier,
          planType: (insPlanType || ins.planType) as typeof ins.planType,
          memberId: insMemberId || ins.memberId,
          groupNumber: insGroupNumber || ins.groupNumber,
          subscriberName: insSubscriberName || ins.subscriberName,
          copayOfficeVisit: insCopay ? Number(insCopay) : ins.copayOfficeVisit,
        }
        : ins
    );
    updatePatient(patient.id, { insurances: updatedInsurances });
    setEditingInsurance(false);
  };

  const updateFormAction = (key: ConsentKey, field: string, value: string | boolean) => {
    setFormActions((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleComplete = () => {
    // Persist any form collections to the patient record
    const updatedConsents = { ...patient.consents };
    for (const [key, action] of Object.entries(formActions) as [ConsentKey, typeof formActions[ConsentKey]][]) {
      if (action.collected && action.method) {
        updatedConsents[key] = {
          signed: true,
          date: action.date || todayStr,
          method: action.method,
        };
      }
    }
    updatePatient(patient.id, { consents: updatedConsents });

    checkInAppointment(
      appointmentId,
      arrivalTime,
      copayCollected,
      copayCollected ? Number(copayAmount) : null
    );
    onComplete();
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';
  const checkboxCls = 'w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500';

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Patient Check-In</h2>
      <p className="text-sm text-gray-500 mb-6">
        {patient.demographics.lastName}, {patient.demographics.firstName} — {appt.appointmentType.replace('-', ' ')} at{' '}
        {(() => { const [h, m] = appt.time.split(':').map(Number); return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; })()}
      </p>

      {/* Allergy alert */}
      {patient.medicalSummary.allergies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-800 font-medium">
            Allergies: {patient.medicalSummary.allergies.map((a) => a.name).join(', ')}
          </span>
        </div>
      )}

      {/* No-show warning */}
      {noShows > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-800">Patient has {noShows} previous no-show{noShows > 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Step {stepIdx + 1} of {steps.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              s.key === currentStep ? 'bg-blue-100 text-blue-700' :
              i < stepIdx ? 'bg-green-50 text-green-600' :
              'bg-gray-50 text-gray-400'
            }`}
          >
            {i < stepIdx && <CheckCircle className="w-3 h-3" />}
            {s.label}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 mb-6">
        {/* ===== STEP 1: VERIFY ID ===== */}
        {currentStep === 'verify-id' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-blue-600" /> Step 1: Verify Photo ID</h3>
            <p className="text-sm text-gray-500">Ask the patient for a valid photo ID and verify it matches their record.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                <select className={inputCls} value={idType} onChange={(e) => setIdType(e.target.value)}>
                  <option value="">Select ID type...</option>
                  {formOptions.idType.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className={checkboxCls} checked={idVerified} onChange={(e) => setIdVerified(e.target.checked)} />
              Photo ID verified — name and photo match patient record
            </label>
          </div>
        )}

        {/* ===== STEP 2: VERIFY DEMOGRAPHICS ===== */}
        {currentStep === 'verify-demographics' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Step 2: Verify Demographics</h3>
            <p className="text-sm text-gray-500">Confirm the following information is still current.</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> {patient.demographics.firstName} {patient.demographics.lastName}</p>
              <p><span className="text-gray-500">DOB:</span> {new Date(patient.demographics.dateOfBirth + 'T12:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</p>
              <p><span className="text-gray-500">Address:</span> {patient.contact.homeAddress.street}, {patient.contact.homeAddress.city}, {patient.contact.homeAddress.state} {patient.contact.homeAddress.zip}</p>
              <p><span className="text-gray-500">Cell:</span> {patient.contact.cellPhone}</p>
              <p><span className="text-gray-500">Email:</span> {patient.contact.email || 'Not on file'}</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <span className="font-medium">Note:</span> In a real PM/EHR system, you would have the ability to edit all demographics fields directly from this screen. This simulation allows editing of insurance information but not demographics.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className={checkboxCls} checked={demoConfirmed} onChange={(e) => setDemoConfirmed(e.target.checked)} />
              Demographics confirmed — no changes needed
            </label>
          </div>
        )}

        {/* ===== STEP 3: VERIFY INSURANCE ===== */}
        {currentStep === 'verify-insurance' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600" /> Step 3: Verify Insurance</h3>
            <p className="text-sm text-gray-500">Verify the insurance card matches what is on file. If the patient has a new card, update the information below.</p>

            {primaryIns && !editingInsurance ? (
              <>
                <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm border border-blue-200">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-blue-900">{primaryIns.carrier} — {primaryIns.planType}</p>
                    <button
                      onClick={startEditingInsurance}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Edit3 className="w-3 h-3" /> Update
                    </button>
                  </div>
                  <p><span className="text-blue-600">Plan:</span> {primaryIns.planName}</p>
                  <p><span className="text-blue-600">Member ID:</span> {primaryIns.memberId}</p>
                  <p><span className="text-blue-600">Group #:</span> {primaryIns.groupNumber}</p>
                  <p><span className="text-blue-600">Subscriber:</span> {primaryIns.subscriberName} ({primaryIns.subscriberRelationship})</p>
                  <p><span className="text-blue-600">Copay (Office Visit):</span> ${primaryIns.copayOfficeVisit}</p>
                  <p><span className="text-blue-600">Effective:</span> {primaryIns.effectiveDate}</p>
                  {primaryIns.referralRequired && <p className="text-amber-700 font-medium">⚠ Referral Required</p>}
                  {primaryIns.priorAuthRequired && <p className="text-amber-700 font-medium">⚠ Prior Authorization Required</p>}
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className={checkboxCls} checked={insuranceConfirmed} onChange={(e) => setInsuranceConfirmed(e.target.checked)} />
                  Insurance card verified — matches records
                </label>
              </>
            ) : primaryIns && editingInsurance ? (
              <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-900">Update Insurance Information</p>
                  <button onClick={() => setEditingInsurance(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Insurance Carrier</label>
                    <select className={inputCls} value={insCarrier} onChange={(e) => setInsCarrier(e.target.value)}>
                      <option value="">Select carrier...</option>
                      {insuranceCarriers.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Plan Type</label>
                    <select className={inputCls} value={insPlanType} onChange={(e) => setInsPlanType(e.target.value)}>
                      <option value="">Select type...</option>
                      {planTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Member ID</label>
                    <input type="text" className={inputCls} value={insMemberId} onChange={(e) => setInsMemberId(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Group Number</label>
                    <input type="text" className={inputCls} value={insGroupNumber} onChange={(e) => setInsGroupNumber(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subscriber Name</label>
                    <input type="text" className={inputCls} value={insSubscriberName} onChange={(e) => setInsSubscriberName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Office Visit Copay ($)</label>
                    <input type="number" className={inputCls} value={insCopay} onChange={(e) => setInsCopay(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={saveInsuranceUpdate} className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all">
                    Save Changes
                  </button>
                  <button onClick={() => setEditingInsurance(false)} className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-amber-600 text-sm">No insurance on file</p>
            )}
          </div>
        )}

        {/* ===== STEP 4: PAYMENT & BALANCE (merged) ===== */}
        {currentStep === 'payment-balance' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-600" /> Step 4: Payment & Balance</h3>

            {/* Copay section */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Copay Collection</p>
              {expectedCopay > 0 ? (
                <>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-lg font-semibold text-green-800">Expected Copay: ${expectedCopay}</p>
                    <p className="text-sm text-green-600">Based on {primaryIns?.carrier} {primaryIns?.planType} plan</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Collected</label>
                      <input type="number" className={inputCls} value={copayAmount} onChange={(e) => setCopayAmount(e.target.value)} placeholder={`$${expectedCopay}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select className={inputCls} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">Select method...</option>
                        {formOptions.paymentMethod.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className={checkboxCls} checked={copayCollected} onChange={(e) => setCopayCollected(e.target.checked)} />
                    Copay collected
                  </label>
                </>
              ) : (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-sm text-gray-600">No copay due for this visit type/plan</p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4" />

            {/* Balance section */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Account Balance</p>
              <div className={`rounded-xl p-4 border ${patient.accountBalance > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className={`text-2xl font-semibold ${patient.accountBalance > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                  ${patient.accountBalance.toFixed(2)}
                </p>
                {patient.accountBalance > 0 && (
                  <p className="text-sm text-amber-600 mt-1">Inform patient of outstanding balance</p>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className={checkboxCls} checked={balanceAcknowledged} onChange={(e) => setBalanceAcknowledged(e.target.checked)} />
                {patient.accountBalance > 0 ? 'Patient informed of balance' : 'No balance — confirmed'}
              </label>
            </div>
          </div>
        )}

        {/* ===== STEP 5: CHECK FORMS ===== */}
        {currentStep === 'check-forms' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Step 5: Check Forms</h3>
            <p className="text-sm text-gray-500">Verify required forms are signed and on file. Collect any missing or expired forms.</p>

            <div className="space-y-3">
              {(Object.entries(consentLabels) as [ConsentKey, { label: string; required: boolean }][]).map(([key, cfg]) => {
                const existing = patient.consents[key];
                const action = formActions[key];
                const isRecollecting = recollecting.has(key);
                const isOnFile = existing.signed && existing.date && !isRecollecting;
                const isCollectedNow = action.collected && action.method;

                return (
                  <div key={key} className={`rounded-xl border p-4 ${
                    isOnFile || isCollectedNow ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    {/* Form header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {(isOnFile || isCollectedNow)
                          ? <CheckCircle className="w-4 h-4 text-green-600" />
                          : <AlertCircle className="w-4 h-4 text-red-500" />}
                        <span className="text-sm font-medium text-gray-900">{cfg.label}</span>
                        {cfg.required && <span className="text-xs text-red-500 font-medium">Required</span>}
                      </div>
                    </div>

                    {/* On-file status */}
                    {isOnFile && !isCollectedNow && (
                      <div className="ml-6 text-xs text-gray-600 space-y-0.5">
                        <p>Signed: {existing.date}</p>
                        <p>Received via: <span className="font-medium capitalize">{existing.method || 'Unknown'}</span></p>
                      </div>
                    )}

                    {/* Collected during this check-in */}
                    {isCollectedNow && (
                      <div className="ml-6 text-xs text-green-700 space-y-0.5">
                        <p>Collected today: {action.date || todayStr}</p>
                        <p>Received via: <span className="font-medium capitalize">{action.method === 'paper' ? 'Paper / Scanned' : 'Electronic'}</span></p>
                      </div>
                    )}

                    {/* Not on file — collection UI */}
                    {!isOnFile && !isCollectedNow && (
                      <div className="ml-6 mt-2 space-y-2">
                        <p className="text-xs text-red-600 font-medium">Not on file — collect from patient</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="text-xs text-gray-600">Method:</label>
                          <button
                            onClick={() => updateFormAction(key, 'method', 'paper')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              action.method === 'paper' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Paper / Scanned
                          </button>
                          <button
                            onClick={() => updateFormAction(key, 'method', 'electronic')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              action.method === 'electronic' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Electronic
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">Date:</label>
                          <input
                            type="date"
                            className="px-2 py-1 rounded-lg border border-gray-200 text-xs"
                            value={action.date || todayStr}
                            onChange={(e) => updateFormAction(key, 'date', e.target.value)}
                          />
                        </div>
                        {action.method && (
                          <button
                            onClick={() => updateFormAction(key, 'collected', true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
                          >
                            Mark as Collected
                          </button>
                        )}
                      </div>
                    )}

                    {/* Already on file but allow re-collection (e.g., expired/stale) */}
                    {isOnFile && !isCollectedNow && (
                      <div className="ml-6 mt-2">
                        <button
                          onClick={() => {
                            setRecollecting((prev) => new Set(prev).add(key));
                            setFormActions((prev) => ({
                              ...prev,
                              [key]: { collected: false, method: null, date: todayStr },
                            }));
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 transition-colors underline"
                        >
                          Re-collect (new copy received)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 mt-4">
              <input type="checkbox" className={checkboxCls} checked={formsVerified} onChange={(e) => setFormsVerified(e.target.checked)} />
              All required forms verified and on file
            </label>
          </div>
        )}

        {/* ===== STEP 6: COMPLETE ===== */}
        {currentStep === 'complete' && (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Check In</h3>
            <p className="text-gray-500 mb-1">
              {patient.demographics.firstName} {patient.demographics.lastName} — arrival time: {(() => { const [h, m] = arrivalTime.split(':').map(Number); return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; })()}
            </p>
            <p className="text-sm text-gray-400">Patient will appear as "Checked In" on the schedule board</p>

            {/* Summary */}
            <div className="mt-6 text-left bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
              <p className="font-medium text-gray-700 mb-2">Check-In Summary</p>
              <p className="text-gray-600">ID: {idVerified ? `Verified (${idType})` : 'Not verified'}</p>
              <p className="text-gray-600">Demographics: {demoConfirmed ? 'Confirmed' : 'Not confirmed'}</p>
              <p className="text-gray-600">Insurance: {insuranceConfirmed ? 'Verified' : editingInsurance ? 'Updated' : 'Not verified'}</p>
              <p className="text-gray-600">Copay: {copayCollected ? `$${copayAmount} (${paymentMethod})` : expectedCopay > 0 ? 'Not collected' : 'None due'}</p>
              <p className="text-gray-600">Balance: ${patient.accountBalance.toFixed(2)} {balanceAcknowledged ? '— acknowledged' : ''}</p>
              <p className="text-gray-600">Forms: {formsVerified ? 'All verified' : 'Review needed'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Cancel Check-In
        </button>
        <div className="flex gap-3">
          {stepIdx > 0 && currentStep !== 'complete' && (
            <button
              onClick={() => setCurrentStep(steps[stepIdx - 1].key)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              Previous
            </button>
          )}
          {currentStep !== 'complete' ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 shadow-apple-sm transition-all"
            >
              <CheckCircle className="w-4 h-4" /> Complete Check-In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
