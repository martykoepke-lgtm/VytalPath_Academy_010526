import { useState } from 'react';
import { Save, X, ChevronRight, User, Phone, Shield, Users, Heart, Building2, FileText } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import { formOptions, localPharmacies, insuranceCarriers } from '../../data/ehr-clinic-data';
import type { EHRPatient, Address, PatientInsurance } from '../../types/ehr';

type RegTab = 'demographics' | 'contact' | 'emergency' | 'insurance' | 'guarantor' | 'additional' | 'consents';

interface PatientRegistrationProps {
  onComplete: (patientId: string) => void;
  onCancel: () => void;
}

const emptyAddress: Address = { street: '', apt: '', city: '', state: 'TX', zip: '' };

function createEmptyInsurance(type: 'primary' | 'secondary'): PatientInsurance {
  return {
    id: `ins-new-${type}`,
    type,
    carrier: '',
    planName: '',
    planType: 'PPO',
    memberId: '',
    groupNumber: '',
    subscriberName: '',
    subscriberDob: '',
    subscriberRelationship: 'self',
    effectiveDate: '',
    terminationDate: null,
    copayOfficeVisit: 0,
    copaySpecialist: 0,
    copayUrgentCare: 0,
    copayER: 0,
    deductible: 0,
    deductibleMet: 0,
    coinsuranceRate: 0,
    oopMax: 0,
    oopMet: 0,
    referralRequired: false,
    priorAuthRequired: false,
    insurancePhone: '',
    claimsAddress: { ...emptyAddress },
  };
}

export function PatientRegistration({ onComplete, onCancel }: PatientRegistrationProps) {
  const { addPatient, provider } = useEHRSession();
  const [tab, setTab] = useState<RegTab>('demographics');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('F');
  const [gender, setGender] = useState('Female');
  const [pronouns, setPronouns] = useState('She/Her');
  const [ssn, setSsn] = useState('');
  const [race, setRace] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [language, setLanguage] = useState('English');
  const [marital, setMarital] = useState('Single');

  // Contact
  const [address, setAddress] = useState<Address>({ ...emptyAddress });
  const [mailingDifferent, setMailingDifferent] = useState(false);
  const [mailingAddress, setMailingAddress] = useState<Address>({ ...emptyAddress });
  const [homePhone, setHomePhone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<'cell' | 'home' | 'email' | 'portal'>('cell');
  const [okVM, setOkVM] = useState(true);
  const [okText, setOkText] = useState(true);
  const [okEmail, setOkEmail] = useState(true);

  // Emergency
  const [ec1Name, setEc1Name] = useState('');
  const [ec1Rel, setEc1Rel] = useState('Spouse');
  const [ec1Phone, setEc1Phone] = useState('');
  const [ec2Name, setEc2Name] = useState('');
  const [ec2Rel, setEc2Rel] = useState('Parent');
  const [ec2Phone, setEc2Phone] = useState('');

  // Insurance
  const [primaryIns, setPrimaryIns] = useState(createEmptyInsurance('primary'));
  const [hasSecondary, setHasSecondary] = useState(false);
  const [secondaryIns, setSecondaryIns] = useState(createEmptyInsurance('secondary'));
  const [isSelfSubscriber, setIsSelfSubscriber] = useState(true);

  // Guarantor
  const [isOwnGuarantor, setIsOwnGuarantor] = useState(true);
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorDob, setGuarantorDob] = useState('');
  const [guarantorRel, setGuarantorRel] = useState('Parent');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorSsn, setGuarantorSsn] = useState('');
  const [guarantorEmployer, setGuarantorEmployer] = useState('');

  // Additional
  const [empStatus, setEmpStatus] = useState<string>('employed');
  const [empName, setEmpName] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [pharmacyIdx, setPharmacyIdx] = useState(0);
  const [referralSource, setReferralSource] = useState('');
  const [referringProvider, setReferringProvider] = useState('');

  // Consents
  const [hipaa, setHipaa] = useState(false);
  const [hipaaMethod, setHipaaMethod] = useState<'paper' | 'electronic' | ''>('');
  const [consent, setConsent] = useState(false);
  const [consentMethod, setConsentMethod] = useState<'paper' | 'electronic' | ''>('');
  const [financial, setFinancial] = useState(false);
  const [financialMethod, setFinancialMethod] = useState<'paper' | 'electronic' | ''>('');
  const [roi, setRoi] = useState(false);
  const [roiMethod, setRoiMethod] = useState<'paper' | 'electronic' | ''>('');
  const [advDir, setAdvDir] = useState(false);
  const [portal, setPortal] = useState(false);

  const tabs: { key: RegTab; label: string; icon: typeof User }[] = [
    { key: 'demographics', label: 'Demographics', icon: User },
    { key: 'contact', label: 'Contact', icon: Phone },
    { key: 'emergency', label: 'Emergency', icon: Users },
    { key: 'insurance', label: 'Insurance', icon: Shield },
    { key: 'guarantor', label: 'Guarantor', icon: Heart },
    { key: 'additional', label: 'Additional', icon: Building2 },
    { key: 'consents', label: 'Consents', icon: FileText },
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSave = () => {
    const patientData: Omit<EHRPatient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'> = {
      demographics: {
        firstName, middleName, lastName, preferredName: preferredName || firstName,
        dateOfBirth: dob, sexAssignedAtBirth: sex, genderIdentity: gender, pronouns,
        ssn: ssn ? `XXX-XX-${ssn.slice(-4)}` : '', race, ethnicity,
        preferredLanguage: language, maritalStatus: marital,
      },
      contact: {
        homeAddress: address,
        mailingAddress: mailingDifferent ? mailingAddress : null,
        homePhone, cellPhone, workPhone, email,
        preferredContactMethod: contactMethod,
        okToLeaveVoicemail: okVM, okToText: okText, okToEmail: okEmail,
      },
      emergencyContacts: [
        ...(ec1Name ? [{ name: ec1Name, relationship: ec1Rel, phone: ec1Phone }] : []),
        ...(ec2Name ? [{ name: ec2Name, relationship: ec2Rel, phone: ec2Phone }] : []),
      ],
      guarantor: isOwnGuarantor ? null : {
        name: guarantorName, dateOfBirth: guarantorDob, relationship: guarantorRel,
        address: { ...address }, phone: guarantorPhone, ssn: guarantorSsn ? `XXX-XX-${guarantorSsn.slice(-4)}` : '',
        employer: guarantorEmployer,
      },
      employer: empStatus !== 'unemployed' ? {
        employmentStatus: empStatus as any,
        employerName: empName,
        employerAddress: { ...emptyAddress },
        employerPhone: empPhone,
        occupation,
      } : null,
      insurances: [
        ...(primaryIns.carrier ? [{
          ...primaryIns,
          subscriberName: isSelfSubscriber ? `${firstName} ${lastName}` : primaryIns.subscriberName,
          subscriberDob: isSelfSubscriber ? dob : primaryIns.subscriberDob,
          subscriberRelationship: isSelfSubscriber ? 'self' as const : primaryIns.subscriberRelationship,
        }] : []),
        ...(hasSecondary && secondaryIns.carrier ? [secondaryIns] : []),
      ],
      pharmacy: localPharmacies[pharmacyIdx],
      providerAssignment: {
        primaryCareProvider: `Dr. ${provider.lastName}`,
        referringProvider,
        referringProviderNPI: '',
        referralSource,
      },
      consents: {
        hipaaNotice: { signed: hipaa, date: hipaa ? todayStr : null, method: hipaa ? (hipaaMethod || 'paper') as 'paper' | 'electronic' : null },
        consentToTreat: { signed: consent, date: consent ? todayStr : null, method: consent ? (consentMethod || 'paper') as 'paper' | 'electronic' : null },
        financialResponsibility: { signed: financial, date: financial ? todayStr : null, method: financial ? (financialMethod || 'paper') as 'paper' | 'electronic' : null },
        releaseOfInformation: { signed: roi, date: roi ? todayStr : null, method: roi ? (roiMethod || 'paper') as 'paper' | 'electronic' : null },
        advanceDirectiveOnFile: advDir,
        patientPortalEnrolled: portal,
        patientPortalEmail: portal ? email : '',
      },
      medicalSummary: {
        allergies: [], medications: [], problemList: [],
        pastSurgicalHistory: [], familyHistory: [],
        socialHistory: { smokingStatus: '', alcoholUse: '' },
      },
      accountBalance: 0,
    };

    const newPatient = addPatient(patientData);
    onComplete(newPatient.id);
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';
  const selectCls = inputCls;
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const checkboxCls = 'w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">New Patient Registration</h2>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm transition-all">
            <Save className="w-4 h-4" /> Save Patient
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-2xl p-1 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              tab === key ? 'bg-white text-gray-900 shadow-apple-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6">
        {tab === 'demographics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelCls}>First Name *</label><input className={inputCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" /></div>
              <div><label className={labelCls}>Middle Name</label><input className={inputCls} value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle name" /></div>
              <div><label className={labelCls}>Last Name *</label><input className={inputCls} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelCls}>Preferred Name</label><input className={inputCls} value={preferredName} onChange={(e) => setPreferredName(e.target.value)} placeholder="Goes by" /></div>
              <div><label className={labelCls}>Date of Birth *</label><input type="date" className={inputCls} value={dob} onChange={(e) => setDob(e.target.value)} /></div>
              <div><label className={labelCls}>SSN</label><input className={inputCls} value={ssn} onChange={(e) => setSsn(e.target.value)} placeholder="XXX-XX-XXXX" /></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div><label className={labelCls}>Sex at Birth *</label><select className={selectCls} value={sex} onChange={(e) => setSex(e.target.value as 'M' | 'F')}>{formOptions.sexAssignedAtBirth.map((s) => <option key={s} value={s}>{s === 'M' ? 'Male' : 'Female'}</option>)}</select></div>
              <div><label className={labelCls}>Gender Identity</label><select className={selectCls} value={gender} onChange={(e) => setGender(e.target.value)}>{formOptions.genderIdentity.map((g) => <option key={g}>{g}</option>)}</select></div>
              <div><label className={labelCls}>Pronouns</label><select className={selectCls} value={pronouns} onChange={(e) => setPronouns(e.target.value)}>{formOptions.pronouns.map((p) => <option key={p}>{p}</option>)}</select></div>
              <div><label className={labelCls}>Marital Status</label><select className={selectCls} value={marital} onChange={(e) => setMarital(e.target.value)}>{formOptions.maritalStatus.map((m) => <option key={m}>{m}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelCls}>Race</label><select className={selectCls} value={race} onChange={(e) => setRace(e.target.value)}><option value="">Select...</option>{formOptions.race.map((r) => <option key={r}>{r}</option>)}</select></div>
              <div><label className={labelCls}>Ethnicity</label><select className={selectCls} value={ethnicity} onChange={(e) => setEthnicity(e.target.value)}><option value="">Select...</option>{formOptions.ethnicity.map((e2) => <option key={e2}>{e2}</option>)}</select></div>
              <div><label className={labelCls}>Preferred Language</label><select className={selectCls} value={language} onChange={(e) => setLanguage(e.target.value)}>{formOptions.preferredLanguage.map((l) => <option key={l}>{l}</option>)}</select></div>
            </div>
          </div>
        )}

        {tab === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Home Address</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2"><label className={labelCls}>Street</label><input className={inputCls} value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} /></div>
              <div><label className={labelCls}>Apt/Suite</label><input className={inputCls} value={address.apt} onChange={(e) => setAddress({ ...address, apt: e.target.value })} /></div>
              <div><label className={labelCls}>City</label><input className={inputCls} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div><label className={labelCls}>State</label><select className={selectCls} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>{formOptions.states.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><label className={labelCls}>ZIP</label><input className={inputCls} value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder="XXXXX" /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className={checkboxCls} checked={mailingDifferent} onChange={(e) => setMailingDifferent(e.target.checked)} />
              <label className="text-sm text-gray-700">Mailing address is different from home address</label>
            </div>
            {mailingDifferent && (
              <div className="grid grid-cols-4 gap-4 pl-6 border-l-2 border-blue-200">
                <div className="col-span-2"><label className={labelCls}>Mailing Street</label><input className={inputCls} value={mailingAddress.street} onChange={(e) => setMailingAddress({ ...mailingAddress, street: e.target.value })} /></div>
                <div><label className={labelCls}>City</label><input className={inputCls} value={mailingAddress.city} onChange={(e) => setMailingAddress({ ...mailingAddress, city: e.target.value })} /></div>
                <div><label className={labelCls}>State</label><select className={selectCls} value={mailingAddress.state} onChange={(e) => setMailingAddress({ ...mailingAddress, state: e.target.value })}>{formOptions.states.map((s) => <option key={s}>{s}</option>)}</select></div>
              </div>
            )}
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider pt-4">Phone Numbers</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelCls}>Cell Phone *</label><input className={inputCls} value={cellPhone} onChange={(e) => setCellPhone(e.target.value)} placeholder="(512) 555-0000" /></div>
              <div><label className={labelCls}>Home Phone</label><input className={inputCls} value={homePhone} onChange={(e) => setHomePhone(e.target.value)} /></div>
              <div><label className={labelCls}>Work Phone</label><input className={inputCls} value={workPhone} onChange={(e) => setWorkPhone(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><label className={labelCls}>Preferred Contact Method</label><select className={selectCls} value={contactMethod} onChange={(e) => setContactMethod(e.target.value as any)}>{formOptions.contactMethod.map((c) => <option key={c} value={c}>{c === 'cell' ? 'Cell Phone' : c === 'home' ? 'Home Phone' : c === 'email' ? 'Email' : 'Patient Portal'}</option>)}</select></div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" className={checkboxCls} checked={okVM} onChange={(e) => setOkVM(e.target.checked)} /> OK to leave voicemail</label>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" className={checkboxCls} checked={okText} onChange={(e) => setOkText(e.target.checked)} /> OK to send text</label>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" className={checkboxCls} checked={okEmail} onChange={(e) => setOkEmail(e.target.checked)} /> OK to email</label>
            </div>
          </div>
        )}

        {tab === 'emergency' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Primary Emergency Contact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelCls}>Name *</label><input className={inputCls} value={ec1Name} onChange={(e) => setEc1Name(e.target.value)} /></div>
                <div><label className={labelCls}>Relationship</label><select className={selectCls} value={ec1Rel} onChange={(e) => setEc1Rel(e.target.value)}>{formOptions.emergencyRelationship.map((r) => <option key={r}>{r}</option>)}</select></div>
                <div><label className={labelCls}>Phone *</label><input className={inputCls} value={ec1Phone} onChange={(e) => setEc1Phone(e.target.value)} /></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Secondary Emergency Contact (Optional)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelCls}>Name</label><input className={inputCls} value={ec2Name} onChange={(e) => setEc2Name(e.target.value)} /></div>
                <div><label className={labelCls}>Relationship</label><select className={selectCls} value={ec2Rel} onChange={(e) => setEc2Rel(e.target.value)}>{formOptions.emergencyRelationship.map((r) => <option key={r}>{r}</option>)}</select></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={ec2Phone} onChange={(e) => setEc2Phone(e.target.value)} /></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'insurance' && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Primary Insurance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelCls}>Insurance Carrier *</label><select className={selectCls} value={primaryIns.carrier} onChange={(e) => setPrimaryIns({ ...primaryIns, carrier: e.target.value })}><option value="">Select carrier...</option>{insuranceCarriers.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div><label className={labelCls}>Plan Type *</label><select className={selectCls} value={primaryIns.planType} onChange={(e) => setPrimaryIns({ ...primaryIns, planType: e.target.value as any })}>{['HMO','PPO','EPO','POS','HDHP','Medicare','Medicaid','Tricare'].map((t) => <option key={t}>{t}</option>)}</select></div>
              <div><label className={labelCls}>Plan Name</label><input className={inputCls} value={primaryIns.planName} onChange={(e) => setPrimaryIns({ ...primaryIns, planName: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelCls}>Member/Policy ID *</label><input className={inputCls} value={primaryIns.memberId} onChange={(e) => setPrimaryIns({ ...primaryIns, memberId: e.target.value })} /></div>
              <div><label className={labelCls}>Group Number</label><input className={inputCls} value={primaryIns.groupNumber} onChange={(e) => setPrimaryIns({ ...primaryIns, groupNumber: e.target.value })} /></div>
              <div><label className={labelCls}>Effective Date</label><input type="date" className={inputCls} value={primaryIns.effectiveDate} onChange={(e) => setPrimaryIns({ ...primaryIns, effectiveDate: e.target.value })} /></div>
            </div>
            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" className={checkboxCls} checked={isSelfSubscriber} onChange={(e) => setIsSelfSubscriber(e.target.checked)} />
              <label className="text-sm text-gray-700">Patient is the subscriber</label>
            </div>
            {!isSelfSubscriber && (
              <div className="grid grid-cols-3 gap-4 pl-6 border-l-2 border-blue-200">
                <div><label className={labelCls}>Subscriber Name</label><input className={inputCls} value={primaryIns.subscriberName} onChange={(e) => setPrimaryIns({ ...primaryIns, subscriberName: e.target.value })} /></div>
                <div><label className={labelCls}>Subscriber DOB</label><input type="date" className={inputCls} value={primaryIns.subscriberDob} onChange={(e) => setPrimaryIns({ ...primaryIns, subscriberDob: e.target.value })} /></div>
                <div><label className={labelCls}>Relationship</label><select className={selectCls} value={primaryIns.subscriberRelationship} onChange={(e) => setPrimaryIns({ ...primaryIns, subscriberRelationship: e.target.value as any })}>{formOptions.subscriberRelationship.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
              </div>
            )}
            <div className="grid grid-cols-4 gap-4">
              <div><label className={labelCls}>Copay (Office)</label><input type="number" className={inputCls} value={primaryIns.copayOfficeVisit || ''} onChange={(e) => setPrimaryIns({ ...primaryIns, copayOfficeVisit: Number(e.target.value) })} placeholder="$" /></div>
              <div><label className={labelCls}>Copay (Specialist)</label><input type="number" className={inputCls} value={primaryIns.copaySpecialist || ''} onChange={(e) => setPrimaryIns({ ...primaryIns, copaySpecialist: Number(e.target.value) })} placeholder="$" /></div>
              <div><label className={labelCls}>Deductible</label><input type="number" className={inputCls} value={primaryIns.deductible || ''} onChange={(e) => setPrimaryIns({ ...primaryIns, deductible: Number(e.target.value) })} placeholder="$" /></div>
              <div><label className={labelCls}>OOP Max</label><input type="number" className={inputCls} value={primaryIns.oopMax || ''} onChange={(e) => setPrimaryIns({ ...primaryIns, oopMax: Number(e.target.value) })} placeholder="$" /></div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" className={checkboxCls} checked={primaryIns.referralRequired} onChange={(e) => setPrimaryIns({ ...primaryIns, referralRequired: e.target.checked })} /> Referral required</label>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" className={checkboxCls} checked={primaryIns.priorAuthRequired} onChange={(e) => setPrimaryIns({ ...primaryIns, priorAuthRequired: e.target.checked })} /> Prior authorization required</label>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <input type="checkbox" className={checkboxCls} checked={hasSecondary} onChange={(e) => setHasSecondary(e.target.checked)} />
              <label className="text-sm font-medium text-gray-700">Patient has secondary insurance</label>
            </div>
            {hasSecondary && (
              <div className="pl-6 border-l-2 border-purple-200 space-y-4">
                <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Secondary Insurance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelCls}>Carrier</label><select className={selectCls} value={secondaryIns.carrier} onChange={(e) => setSecondaryIns({ ...secondaryIns, carrier: e.target.value })}><option value="">Select...</option>{insuranceCarriers.map((c) => <option key={c}>{c}</option>)}</select></div>
                  <div><label className={labelCls}>Plan Type</label><select className={selectCls} value={secondaryIns.planType} onChange={(e) => setSecondaryIns({ ...secondaryIns, planType: e.target.value as any })}>{['HMO','PPO','EPO','POS','HDHP','Medicare','Medicaid','Tricare'].map((t) => <option key={t}>{t}</option>)}</select></div>
                  <div><label className={labelCls}>Member ID</label><input className={inputCls} value={secondaryIns.memberId} onChange={(e) => setSecondaryIns({ ...secondaryIns, memberId: e.target.value })} /></div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'guarantor' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" className={checkboxCls} checked={isOwnGuarantor} onChange={(e) => setIsOwnGuarantor(e.target.checked)} />
              <label className="text-sm font-medium text-gray-700">Patient is their own guarantor</label>
            </div>
            {!isOwnGuarantor && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Required for minors, dependents, or when someone else is financially responsible.</p>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelCls}>Guarantor Name *</label><input className={inputCls} value={guarantorName} onChange={(e) => setGuarantorName(e.target.value)} /></div>
                  <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={guarantorDob} onChange={(e) => setGuarantorDob(e.target.value)} /></div>
                  <div><label className={labelCls}>Relationship</label><select className={selectCls} value={guarantorRel} onChange={(e) => setGuarantorRel(e.target.value)}>{formOptions.guarantorRelationship.map((r) => <option key={r}>{r}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelCls}>Phone</label><input className={inputCls} value={guarantorPhone} onChange={(e) => setGuarantorPhone(e.target.value)} /></div>
                  <div><label className={labelCls}>SSN</label><input className={inputCls} value={guarantorSsn} onChange={(e) => setGuarantorSsn(e.target.value)} /></div>
                  <div><label className={labelCls}>Employer</label><input className={inputCls} value={guarantorEmployer} onChange={(e) => setGuarantorEmployer(e.target.value)} /></div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'additional' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Employment</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelCls}>Employment Status</label><select className={selectCls} value={empStatus} onChange={(e) => setEmpStatus(e.target.value)}>{formOptions.employmentStatus.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}</select></div>
                {empStatus !== 'unemployed' && empStatus !== 'retired' && (
                  <>
                    <div><label className={labelCls}>Employer Name</label><input className={inputCls} value={empName} onChange={(e) => setEmpName(e.target.value)} /></div>
                    <div><label className={labelCls}>Occupation</label><input className={inputCls} value={occupation} onChange={(e) => setOccupation(e.target.value)} /></div>
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Pharmacy</h3>
              <select className={selectCls} value={pharmacyIdx} onChange={(e) => setPharmacyIdx(Number(e.target.value))}>
                {localPharmacies.map((p, i) => (
                  <option key={i} value={i}>{p.name} — {p.address.street}, {p.address.city}{p.isMailOrder ? ' (Mail Order)' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Referral Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>How did you hear about us?</label><select className={selectCls} value={referralSource} onChange={(e) => setReferralSource(e.target.value)}><option value="">Select...</option>{formOptions.referralSource.map((r) => <option key={r}>{r}</option>)}</select></div>
                <div><label className={labelCls}>Referring Provider (if applicable)</label><input className={inputCls} value={referringProvider} onChange={(e) => setReferringProvider(e.target.value)} placeholder="Dr. Name" /></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'consents' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">Check each form that has been signed by the patient (or guardian for minors). Select how the form was received.</p>
            <div className="space-y-3">
              {([
                { label: 'HIPAA Notice of Privacy Practices', desc: 'Patient acknowledges receipt of privacy practices notice', checked: hipaa, setChecked: setHipaa, method: hipaaMethod, setMethod: setHipaaMethod },
                { label: 'Consent to Treat', desc: 'Patient consents to examination and treatment', checked: consent, setChecked: setConsent, method: consentMethod, setMethod: setConsentMethod },
                { label: 'Financial Responsibility Agreement', desc: 'Patient accepts financial responsibility for services', checked: financial, setChecked: setFinancial, method: financialMethod, setMethod: setFinancialMethod },
                { label: 'Release of Information (Optional)', desc: 'Authorization to release medical records to specified parties', checked: roi, setChecked: setRoi, method: roiMethod, setMethod: setRoiMethod },
              ] as const).map((form, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className={checkboxCls} checked={form.checked} onChange={(e) => form.setChecked(e.target.checked)} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{form.label}</p>
                      <p className="text-xs text-gray-500">{form.desc}</p>
                    </div>
                  </label>
                  {form.checked && (
                    <div className="ml-7 mt-2">
                      <label className="text-xs text-gray-500 mb-1 block">How was this form received?</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => form.setMethod('paper')} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${form.method === 'paper' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          Paper / Scanned
                        </button>
                        <button type="button" onClick={() => form.setMethod('electronic')} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${form.method === 'electronic' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          Electronic
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className={checkboxCls} checked={advDir} onChange={(e) => setAdvDir(e.target.checked)} />
                <span className="text-sm text-gray-700">Advance Directive on file</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className={checkboxCls} checked={portal} onChange={(e) => setPortal(e.target.checked)} />
                <span className="text-sm text-gray-700">Enroll in Patient Portal</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Bottom save bar */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel Registration</button>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm transition-all">
          <Save className="w-4 h-4" /> Save Patient Record
        </button>
      </div>
    </div>
  );
}
