import { useState } from 'react';
import {
  CheckCircle, Calendar, FileText, DollarSign, ClipboardList,
} from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';

interface CheckOutFlowProps {
  appointmentId: string;
  onComplete: () => void;
  onScheduleFollowUp: (patientId: string) => void;
  onCancel: () => void;
}

export function CheckOutFlow({ appointmentId, onComplete, onScheduleFollowUp, onCancel }: CheckOutFlowProps) {
  const { getAppointment, getPatient, checkOutAppointment } = useEHRSession();
  const [followUpNeeded, setFollowUpNeeded] = useState<boolean | null>(null);
  const [followUpInterval, setFollowUpInterval] = useState('');
  const [referralsOrdered, setReferralsOrdered] = useState(false);
  const [labsOrdered, setLabsOrdered] = useState(false);
  const [balanceCollected, setBalanceCollected] = useState(false);
  const [avsProvided, setAvsProvided] = useState(false);
  const [completed, setCompleted] = useState(false);

  const appt = getAppointment(appointmentId);
  const patient = appt ? getPatient(appt.patientId) : undefined;
  if (!appt || !patient) return <div className="p-8 text-center text-gray-500">Appointment not found</div>;

  const handleComplete = () => {
    checkOutAppointment(appointmentId);
    setCompleted(true);
    if (followUpNeeded) {
      // Give a moment before navigating to scheduler
      setTimeout(() => onScheduleFollowUp(patient.id), 1500);
    } else {
      setTimeout(onComplete, 1500);
    }
  };

  if (completed) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-10">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check-Out Complete</h2>
          <p className="text-gray-500">
            {patient.demographics.firstName} {patient.demographics.lastName} has been checked out.
          </p>
          {followUpNeeded && (
            <p className="text-sm text-blue-600 mt-2">Redirecting to schedule follow-up...</p>
          )}
        </div>
      </div>
    );
  }

  const checkboxCls = 'w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500';

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Patient Check-Out</h2>
      <p className="text-sm text-gray-500 mb-6">
        {patient.demographics.lastName}, {patient.demographics.firstName} — {appt.reasonForVisit}
      </p>

      <div className="space-y-4">
        {/* Follow-up */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5">
          <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-blue-600" /> Follow-Up Appointment
          </h3>
          <p className="text-sm text-gray-500 mb-3">Does the patient need a follow-up appointment?</p>
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => setFollowUpNeeded(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                followUpNeeded === true ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setFollowUpNeeded(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                followUpNeeded === false ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              No
            </button>
          </div>
          {followUpNeeded && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up interval</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                value={followUpInterval}
                onChange={(e) => setFollowUpInterval(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
              </select>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5">
          <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
            <ClipboardList className="w-5 h-5 text-blue-600" /> Orders to Process
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className={checkboxCls} checked={referralsOrdered} onChange={(e) => setReferralsOrdered(e.target.checked)} />
              Referrals ordered (process after visit)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className={checkboxCls} checked={labsOrdered} onChange={(e) => setLabsOrdered(e.target.checked)} />
              Labs ordered (schedule lab appointment)
            </label>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5">
          <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-blue-600" /> Balance
          </h3>
          <div className={`rounded-xl p-3 mb-3 ${patient.accountBalance > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
            <p className="text-sm text-gray-600">Account Balance</p>
            <p className={`text-xl font-semibold ${patient.accountBalance > 0 ? 'text-amber-700' : 'text-green-700'}`}>
              ${patient.accountBalance.toFixed(2)}
            </p>
          </div>
          {patient.accountBalance > 0 && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className={checkboxCls} checked={balanceCollected} onChange={(e) => setBalanceCollected(e.target.checked)} />
              Payment collected or payment plan discussed
            </label>
          )}
        </div>

        {/* AVS */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5">
          <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" /> After-Visit Summary
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 mb-3 text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-700">Visit Summary for {patient.demographics.firstName} {patient.demographics.lastName}</p>
            <p>Date: {appt.date} | Provider: Dr. {useEHRSession().provider.lastName}</p>
            <p>Visit type: {appt.appointmentType.replace('-', ' ')}</p>
            <p>Reason: {appt.reasonForVisit}</p>
            {followUpNeeded && followUpInterval && <p>Follow-up: {followUpInterval}</p>}
            {referralsOrdered && <p>Referrals: Pending processing</p>}
            {labsOrdered && <p>Labs: Ordered — schedule with front desk</p>}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className={checkboxCls} checked={avsProvided} onChange={(e) => setAvsProvided(e.target.checked)} />
            After-Visit Summary provided to patient
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 shadow-apple-sm transition-all"
        >
          <CheckCircle className="w-4 h-4" /> Complete Check-Out
        </button>
      </div>
    </div>
  );
}
