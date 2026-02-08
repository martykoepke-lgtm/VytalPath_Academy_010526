import { useState, useEffect } from 'react';
import { User, ChevronRight } from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import { PatientSearchModal } from './PatientSearchModal';
import { formOptions, insuranceCarriers } from '../../data/ehr-clinic-data';
import { Save, X } from 'lucide-react';

interface AppointmentsViewProps {
  initialPatientId?: string;
  onSelectAppointment: (appointmentId: string) => void;
  onAddPatient: () => void;
  onPatientContext?: (patientId: string | null) => void;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const statusBadgeColors: Record<string, string> = {
  scheduled: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-50 text-blue-700',
  'checked-in': 'bg-green-50 text-green-700',
  completed: 'bg-gray-50 text-gray-500',
  'no-show': 'bg-red-50 text-red-700',
  cancelled: 'bg-gray-50 text-gray-400',
  rescheduled: 'bg-gray-50 text-gray-400',
};

const planTypes = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'Medicare', 'Medicaid', 'Tricare'] as const;

type ViewTab = 'appointments' | 'demographics' | 'insurance';

export function AppointmentsView({
  initialPatientId,
  onSelectAppointment,
  onAddPatient,
  onPatientContext,
}: AppointmentsViewProps) {
  const { getPatient, getPatientAppointments, appointmentTypes, updatePatient } = useEHRSession();
  const [showSearch, setShowSearch] = useState(!initialPatientId);
  const [activeTab, setActiveTab] = useState<ViewTab>('appointments');
  const [apptTab, setApptTab] = useState<'upcoming' | 'past'>('upcoming');

  // Demographics editing state
  const [demoEditing, setDemoEditing] = useState(false);
  const [demoForm, setDemoForm] = useState<Record<string, string>>({});
  const [demoSaved, setDemoSaved] = useState(false);

  // Insurance editing state
  const [insEditing, setInsEditing] = useState(false);
  const [insForm, setInsForm] = useState<Record<string, string>>({});
  const [insSaved, setInsSaved] = useState(false);

  // Show search when patient context is cleared from lab level
  useEffect(() => {
    if (!initialPatientId) {
      setShowSearch(true);
      setActiveTab('appointments');
      setDemoEditing(false);
      setInsEditing(false);
    } else {
      setShowSearch(false);
    }
  }, [initialPatientId]);

  const patient = initialPatientId ? getPatient(initialPatientId) : null;
  const allAppts = initialPatientId ? getPatientAppointments(initialPatientId) : [];
  const today = new Date().toISOString().split('T')[0];

  const upcomingAppts = allAppts.filter(
    (a) => a.date >= today && a.status !== 'cancelled' && a.status !== 'rescheduled'
  );
  const pastAppts = allAppts.filter(
    (a) => a.date < today || a.status === 'completed' || a.status === 'no-show' || a.status === 'cancelled'
  );

  const displayAppts = apptTab === 'upcoming' ? upcomingAppts : pastAppts;

  const handleSelectPatient = (id: string) => {
    setShowSearch(false);
    setActiveTab('appointments');
    setDemoEditing(false);
    setInsEditing(false);
    onPatientContext?.(id);
  };

  // === Demographics editing ===
  const startDemoEdit = () => {
    if (!patient) return;
    setDemoForm({
      firstName: patient.demographics.firstName,
      middleName: patient.demographics.middleName,
      lastName: patient.demographics.lastName,
      preferredName: patient.demographics.preferredName,
      dateOfBirth: patient.demographics.dateOfBirth,
      sexAssignedAtBirth: patient.demographics.sexAssignedAtBirth,
      genderIdentity: patient.demographics.genderIdentity,
      pronouns: patient.demographics.pronouns,
      ssn: patient.demographics.ssn,
      race: patient.demographics.race,
      ethnicity: patient.demographics.ethnicity,
      preferredLanguage: patient.demographics.preferredLanguage,
      maritalStatus: patient.demographics.maritalStatus,
      homePhone: patient.contact.homePhone,
      cellPhone: patient.contact.cellPhone,
      workPhone: patient.contact.workPhone,
      email: patient.contact.email,
      preferredContactMethod: patient.contact.preferredContactMethod,
      street: patient.contact.homeAddress.street,
      apt: patient.contact.homeAddress.apt,
      city: patient.contact.homeAddress.city,
      state: patient.contact.homeAddress.state,
      zip: patient.contact.homeAddress.zip,
    });
    setDemoEditing(true);
    setDemoSaved(false);
  };

  const saveDemoEdit = () => {
    if (!patient) return;
    updatePatient(patient.id, {
      demographics: {
        ...patient.demographics,
        firstName: demoForm.firstName || patient.demographics.firstName,
        middleName: demoForm.middleName ?? patient.demographics.middleName,
        lastName: demoForm.lastName || patient.demographics.lastName,
        preferredName: demoForm.preferredName ?? patient.demographics.preferredName,
        dateOfBirth: demoForm.dateOfBirth || patient.demographics.dateOfBirth,
        sexAssignedAtBirth: (demoForm.sexAssignedAtBirth as 'M' | 'F') || patient.demographics.sexAssignedAtBirth,
        genderIdentity: demoForm.genderIdentity || patient.demographics.genderIdentity,
        pronouns: demoForm.pronouns || patient.demographics.pronouns,
        ssn: demoForm.ssn || patient.demographics.ssn,
        race: demoForm.race || patient.demographics.race,
        ethnicity: demoForm.ethnicity || patient.demographics.ethnicity,
        preferredLanguage: demoForm.preferredLanguage || patient.demographics.preferredLanguage,
        maritalStatus: demoForm.maritalStatus || patient.demographics.maritalStatus,
      },
      contact: {
        ...patient.contact,
        homePhone: demoForm.homePhone ?? patient.contact.homePhone,
        cellPhone: demoForm.cellPhone ?? patient.contact.cellPhone,
        workPhone: demoForm.workPhone ?? patient.contact.workPhone,
        email: demoForm.email ?? patient.contact.email,
        preferredContactMethod: (demoForm.preferredContactMethod as 'cell' | 'home' | 'email' | 'portal') || patient.contact.preferredContactMethod,
        homeAddress: {
          street: demoForm.street || patient.contact.homeAddress.street,
          apt: demoForm.apt ?? patient.contact.homeAddress.apt,
          city: demoForm.city || patient.contact.homeAddress.city,
          state: demoForm.state || patient.contact.homeAddress.state,
          zip: demoForm.zip || patient.contact.homeAddress.zip,
        },
      },
    });
    setDemoEditing(false);
    setDemoSaved(true);
    setTimeout(() => setDemoSaved(false), 2000);
  };

  // === Insurance editing ===
  const startInsEdit = () => {
    if (!patient) return;
    const primary = patient.insurances.find((i) => i.type === 'primary');
    if (primary) {
      setInsForm({
        carrier: primary.carrier,
        planType: primary.planType,
        memberId: primary.memberId,
        groupNumber: primary.groupNumber,
        subscriberName: primary.subscriberName,
        subscriberRelationship: primary.subscriberRelationship,
        copayOfficeVisit: String(primary.copayOfficeVisit),
        copaySpecialist: String(primary.copaySpecialist),
        deductible: String(primary.deductible),
        deductibleMet: String(primary.deductibleMet),
      });
    }
    setInsEditing(true);
    setInsSaved(false);
  };

  const saveInsEdit = () => {
    if (!patient) return;
    const primary = patient.insurances.find((i) => i.type === 'primary');
    if (!primary) return;
    const updatedInsurances = patient.insurances.map((ins) =>
      ins.id === primary.id
        ? {
            ...ins,
            carrier: insForm.carrier || ins.carrier,
            planType: (insForm.planType || ins.planType) as typeof ins.planType,
            memberId: insForm.memberId || ins.memberId,
            groupNumber: insForm.groupNumber || ins.groupNumber,
            subscriberName: insForm.subscriberName || ins.subscriberName,
            subscriberRelationship: (insForm.subscriberRelationship || ins.subscriberRelationship) as typeof ins.subscriberRelationship,
            copayOfficeVisit: insForm.copayOfficeVisit ? Number(insForm.copayOfficeVisit) : ins.copayOfficeVisit,
            copaySpecialist: insForm.copaySpecialist ? Number(insForm.copaySpecialist) : ins.copaySpecialist,
            deductible: insForm.deductible ? Number(insForm.deductible) : ins.deductible,
            deductibleMet: insForm.deductibleMet ? Number(insForm.deductibleMet) : ins.deductibleMet,
          }
        : ins
    );
    updatePatient(patient.id, { insurances: updatedInsurances });
    setInsEditing(false);
    setInsSaved(true);
    setTimeout(() => setInsSaved(false), 2000);
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all';
  const selectCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all bg-white';
  const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

  return (
    <div>
      {/* Patient Search Modal — shown when no patient in context */}
      {showSearch && (
        <PatientSearchModal
          onSelectPatient={handleSelectPatient}
          onAddPatient={() => { setShowSearch(false); onAddPatient(); }}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Patient in context — show tabs & content */}
      {patient ? (
        <>
          {/* Tabs: Appointments | Demographics | Insurance */}
          <div className="flex items-center gap-1 mb-4">
            <button
              onClick={() => { setActiveTab('appointments'); setDemoEditing(false); setInsEditing(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'appointments' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => { setActiveTab('demographics'); if (!demoEditing) startDemoEdit(); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'demographics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Demographics
            </button>
            <button
              onClick={() => { setActiveTab('insurance'); if (!insEditing) startInsEdit(); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'insurance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Insurance
            </button>
          </div>

          {/* === Appointments Tab === */}
          {activeTab === 'appointments' && (
            <>
              <div className="flex items-center gap-1 mb-4">
                <button
                  onClick={() => setApptTab('upcoming')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    apptTab === 'upcoming' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upcoming ({upcomingAppts.length})
                </button>
                <button
                  onClick={() => setApptTab('past')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    apptTab === 'past' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Past ({pastAppts.length})
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayAppts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                          No {apptTab} appointments
                        </td>
                      </tr>
                    ) : (
                      displayAppts.map((appt) => {
                        const typeConfig = appointmentTypes.find((t) => t.type === appt.appointmentType);
                        const apptDate = new Date(appt.date + 'T12:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                        return (
                          <tr
                            key={appt.id}
                            onClick={() => onSelectAppointment(appt.id)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{apptDate}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatTime(appt.time)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{typeConfig?.label || appt.appointmentType}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{appt.reasonForVisit}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadgeColors[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                                {appt.status.replace(/-/g, ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* === Demographics Tab === */}
          {activeTab === 'demographics' && (
            <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-900">Patient Demographics</h3>
                <div className="flex items-center gap-2">
                  {demoSaved && (
                    <span className="text-sm text-green-600 font-medium">Saved</span>
                  )}
                  {demoEditing ? (
                    <>
                      <button onClick={() => setDemoEditing(false)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button onClick={saveDemoEdit} className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-1.5">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </>
                  ) : (
                    <button onClick={startDemoEdit} className="px-3 py-1.5 rounded-lg text-sm font-medium text-teal-600 border border-teal-300 hover:bg-teal-50 transition-colors">
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Info */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</p>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className={labelCls}>First Name</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.firstName || ''} onChange={(e) => setDemoForm({ ...demoForm, firstName: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Middle Name</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.middleName || ''} onChange={(e) => setDemoForm({ ...demoForm, middleName: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.middleName || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.lastName || ''} onChange={(e) => setDemoForm({ ...demoForm, lastName: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Preferred Name</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.preferredName || ''} onChange={(e) => setDemoForm({ ...demoForm, preferredName: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.preferredName || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    {demoEditing ? (
                      <input type="date" className={inputCls} value={demoForm.dateOfBirth || ''} onChange={(e) => setDemoForm({ ...demoForm, dateOfBirth: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{new Date(patient.demographics.dateOfBirth + 'T12:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Sex Assigned at Birth</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.sexAssignedAtBirth || ''} onChange={(e) => setDemoForm({ ...demoForm, sexAssignedAtBirth: e.target.value })}>
                        {formOptions.sexAssignedAtBirth.map((o) => <option key={o} value={o}>{o === 'M' ? 'Male' : 'Female'}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.sexAssignedAtBirth === 'M' ? 'Male' : 'Female'}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Gender Identity</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.genderIdentity || ''} onChange={(e) => setDemoForm({ ...demoForm, genderIdentity: e.target.value })}>
                        {formOptions.genderIdentity.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.genderIdentity}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Pronouns</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.pronouns || ''} onChange={(e) => setDemoForm({ ...demoForm, pronouns: e.target.value })}>
                        {formOptions.pronouns.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.pronouns}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>SSN</label>
                    <p className="text-sm text-gray-900">{patient.demographics.ssn}</p>
                  </div>
                  <div>
                    <label className={labelCls}>Race</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.race || ''} onChange={(e) => setDemoForm({ ...demoForm, race: e.target.value })}>
                        {formOptions.race.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.race}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Ethnicity</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.ethnicity || ''} onChange={(e) => setDemoForm({ ...demoForm, ethnicity: e.target.value })}>
                        {formOptions.ethnicity.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.ethnicity}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Preferred Language</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.preferredLanguage || ''} onChange={(e) => setDemoForm({ ...demoForm, preferredLanguage: e.target.value })}>
                        {formOptions.preferredLanguage.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.preferredLanguage}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Marital Status</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.maritalStatus || ''} onChange={(e) => setDemoForm({ ...demoForm, maritalStatus: e.target.value })}>
                        {formOptions.maritalStatus.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900">{patient.demographics.maritalStatus}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact Information</p>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className={labelCls}>Cell Phone</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.cellPhone || ''} onChange={(e) => setDemoForm({ ...demoForm, cellPhone: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.cellPhone || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Home Phone</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.homePhone || ''} onChange={(e) => setDemoForm({ ...demoForm, homePhone: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.homePhone || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Work Phone</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.workPhone || ''} onChange={(e) => setDemoForm({ ...demoForm, workPhone: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.workPhone || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    {demoEditing ? (
                      <input type="email" className={inputCls} value={demoForm.email || ''} onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.email || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Preferred Contact</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.preferredContactMethod || ''} onChange={(e) => setDemoForm({ ...demoForm, preferredContactMethod: e.target.value })}>
                        {formOptions.contactMethod.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900 capitalize">{patient.contact.preferredContactMethod}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Home Address</p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>Street</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.street || ''} onChange={(e) => setDemoForm({ ...demoForm, street: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.homeAddress.street}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Apt/Suite</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.apt || ''} onChange={(e) => setDemoForm({ ...demoForm, apt: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.homeAddress.apt || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.city || ''} onChange={(e) => setDemoForm({ ...demoForm, city: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.homeAddress.city}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>State</label>
                    {demoEditing ? (
                      <select className={selectCls} value={demoForm.state || ''} onChange={(e) => setDemoForm({ ...demoForm, state: e.target.value })}>
                        {formOptions.states.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.homeAddress.state}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>ZIP</label>
                    {demoEditing ? (
                      <input className={inputCls} value={demoForm.zip || ''} onChange={(e) => setDemoForm({ ...demoForm, zip: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-900">{patient.contact.homeAddress.zip}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === Insurance Tab === */}
          {activeTab === 'insurance' && (
            <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-900">Primary Insurance</h3>
                <div className="flex items-center gap-2">
                  {insSaved && (
                    <span className="text-sm text-green-600 font-medium">Saved</span>
                  )}
                  {insEditing ? (
                    <>
                      <button onClick={() => setInsEditing(false)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button onClick={saveInsEdit} className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-1.5">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </>
                  ) : (
                    <button onClick={startInsEdit} className="px-3 py-1.5 rounded-lg text-sm font-medium text-teal-600 border border-teal-300 hover:bg-teal-50 transition-colors">
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {(() => {
                const primary = patient.insurances.find((i) => i.type === 'primary');
                if (!primary) return <p className="text-sm text-gray-400">No primary insurance on file</p>;
                return (
                  <>
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Plan Details</p>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-2">
                          <label className={labelCls}>Carrier</label>
                          {insEditing ? (
                            <select className={selectCls} value={insForm.carrier || ''} onChange={(e) => setInsForm({ ...insForm, carrier: e.target.value })}>
                              <option value="">Select carrier</option>
                              {insuranceCarriers.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-900">{primary.carrier}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Plan Type</label>
                          {insEditing ? (
                            <select className={selectCls} value={insForm.planType || ''} onChange={(e) => setInsForm({ ...insForm, planType: e.target.value })}>
                              {planTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-900">{primary.planType}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Plan Name</label>
                          <p className="text-sm text-gray-900">{primary.planName}</p>
                        </div>
                        <div>
                          <label className={labelCls}>Member ID</label>
                          {insEditing ? (
                            <input className={inputCls} value={insForm.memberId || ''} onChange={(e) => setInsForm({ ...insForm, memberId: e.target.value })} />
                          ) : (
                            <p className="text-sm text-gray-900">{primary.memberId}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Group Number</label>
                          {insEditing ? (
                            <input className={inputCls} value={insForm.groupNumber || ''} onChange={(e) => setInsForm({ ...insForm, groupNumber: e.target.value })} />
                          ) : (
                            <p className="text-sm text-gray-900">{primary.groupNumber}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Subscriber Name</label>
                          {insEditing ? (
                            <input className={inputCls} value={insForm.subscriberName || ''} onChange={(e) => setInsForm({ ...insForm, subscriberName: e.target.value })} />
                          ) : (
                            <p className="text-sm text-gray-900">{primary.subscriberName}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Subscriber Relationship</label>
                          {insEditing ? (
                            <select className={selectCls} value={insForm.subscriberRelationship || ''} onChange={(e) => setInsForm({ ...insForm, subscriberRelationship: e.target.value })}>
                              {formOptions.subscriberRelationship.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-900 capitalize">{primary.subscriberRelationship}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Copays & Cost Sharing</p>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className={labelCls}>Office Visit Copay</label>
                          {insEditing ? (
                            <input type="number" className={inputCls} value={insForm.copayOfficeVisit || ''} onChange={(e) => setInsForm({ ...insForm, copayOfficeVisit: e.target.value })} />
                          ) : (
                            <p className="text-sm text-gray-900">${primary.copayOfficeVisit}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Specialist Copay</label>
                          {insEditing ? (
                            <input type="number" className={inputCls} value={insForm.copaySpecialist || ''} onChange={(e) => setInsForm({ ...insForm, copaySpecialist: e.target.value })} />
                          ) : (
                            <p className="text-sm text-gray-900">${primary.copaySpecialist}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Urgent Care Copay</label>
                          <p className="text-sm text-gray-900">${primary.copayUrgentCare}</p>
                        </div>
                        <div>
                          <label className={labelCls}>ER Copay</label>
                          <p className="text-sm text-gray-900">${primary.copayER}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Deductible & Out-of-Pocket</p>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className={labelCls}>Annual Deductible</label>
                          {insEditing ? (
                            <input type="number" className={inputCls} value={insForm.deductible || ''} onChange={(e) => setInsForm({ ...insForm, deductible: e.target.value })} />
                          ) : (
                            <p className="text-sm text-gray-900">${primary.deductible.toLocaleString()}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Deductible Met</label>
                          {insEditing ? (
                            <input type="number" className={inputCls} value={insForm.deductibleMet || ''} onChange={(e) => setInsForm({ ...insForm, deductibleMet: e.target.value })} />
                          ) : (
                            <p className="text-sm text-gray-900">${primary.deductibleMet.toLocaleString()}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Coinsurance</label>
                          <p className="text-sm text-gray-900">{(primary.coinsuranceRate * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <label className={labelCls}>OOP Max</label>
                          <p className="text-sm text-gray-900">${primary.oopMax.toLocaleString()} (${primary.oopMet.toLocaleString()} met)</p>
                        </div>
                        <div>
                          <label className={labelCls}>Effective Date</label>
                          <p className="text-sm text-gray-900">{new Date(primary.effectiveDate + 'T12:00:00').toLocaleDateString('en-US')}</p>
                        </div>
                        <div>
                          <label className={labelCls}>Referral Required</label>
                          <p className="text-sm text-gray-900">{primary.referralRequired ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <label className={labelCls}>Prior Auth Required</label>
                          <p className="text-sm text-gray-900">{primary.priorAuthRequired ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <label className={labelCls}>Insurance Phone</label>
                          <p className="text-sm text-gray-900">{primary.insurancePhone}</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Secondary insurance (read-only display) */}
              {patient.insurances.filter((i) => i.type === 'secondary').map((sec) => (
                <div key={sec.id} className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Secondary Insurance</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div><label className={labelCls}>Carrier</label><p className="text-sm text-gray-900">{sec.carrier}</p></div>
                    <div><label className={labelCls}>Plan Type</label><p className="text-sm text-gray-900">{sec.planType}</p></div>
                    <div><label className={labelCls}>Member ID</label><p className="text-sm text-gray-900">{sec.memberId}</p></div>
                    <div><label className={labelCls}>Group Number</label><p className="text-sm text-gray-900">{sec.groupNumber}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Search for a patient to view their appointments</p>
        </div>
      )}
    </div>
  );
}
