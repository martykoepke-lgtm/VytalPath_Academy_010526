import { useState, useEffect } from 'react';
import {
  Award, BarChart3, Calendar, CreditCard, Printer, Users, X,
} from 'lucide-react';
import { calculateRefundEligibility } from '../../utils/refundPolicy';
import { supabase } from '../../lib/supabase';

interface IssuedCertificate {
  id: string;
  user_id: string;
  student_name: string;
  certificate_number: string;
  issued_at: string;
  user_email: string;
}

interface StudentSubscription {
  user_id: string;
  email: string;
  display_name: string;
  subscription_status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  completion_percentage: number;
  last_progress_sync: string | null;
  days_enrolled: number;
  // Note: get_students_refund_status still returns org_name today; field is
  // ignored by the UI and will disappear after MIGRATION_PLAN Phase 3a.
  org_name?: string | null;
}

export function SuperAdminDashboard() {
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [certsLoaded, setCertsLoaded] = useState(false);
  const [subscriptions, setSubscriptions] = useState<StudentSubscription[]>([]);
  const [subsLoaded, setSubsLoaded] = useState(false);
  const [totalActiveSubscribers, setTotalActiveSubscribers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showCertModal, setShowCertModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'certificates'>('subscriptions');

  useEffect(() => {
    loadDashboardData();
    loadSubscriptions();
  }, []);

  async function loadDashboardData() {
    try {
      const { count } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      setTotalActiveSubscribers(count ?? 0);
    } catch (e) {
      console.error('Error loading dashboard data:', e);
    } finally {
      setLoading(false);
    }
  }

  async function loadCertificates() {
    if (certsLoaded) return;
    try {
      const { data, error } = await supabase.rpc('get_all_certificates');
      if (!error && data) {
        setCertificates(data as IssuedCertificate[]);
      }
    } catch (e) {
      console.error('Error loading certificates:', e);
    } finally {
      setCertsLoaded(true);
    }
  }

  async function loadSubscriptions() {
    if (subsLoaded) return;
    try {
      const { data, error } = await (supabase.rpc as any)('get_students_refund_status');
      if (!error && data) {
        setSubscriptions(data as StudentSubscription[]);
      }
    } catch (e) {
      console.error('Error loading subscriptions:', e);
    } finally {
      setSubsLoaded(true);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded-xl max-w-sm"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-teal-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Monitor student progress, manage certificates, and view subscriptions</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Active Subscribers</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalActiveSubscribers}</p>
          <p className="text-xs text-gray-500 mt-1">Students with an active paid subscription</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('subscriptions'); loadSubscriptions(); }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'subscriptions'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CreditCard className="w-4 h-4 inline-block mr-2" />
          Subscriptions ({subscriptions.length})
        </button>
        <button
          onClick={() => { setActiveTab('certificates'); loadCertificates(); }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'certificates'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Award className="w-4 h-4 inline-block mr-2" />
          Certificates ({certificates.length})
        </button>
      </div>

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Student Subscriptions & Refund Status</h2>
                <p className="text-sm text-gray-500 mt-1">View enrollment status, progress, and refund eligibility for all subscribers</p>
              </div>
              <button
                onClick={() => { setSubsLoaded(false); loadSubscriptions(); }}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {!subsLoaded ? (
            <div className="p-12 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active subscriptions</h3>
              <p className="text-gray-500">Student subscriptions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Student</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Progress</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Days</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Refund Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.map((sub) => {
                    const refundTier = calculateRefundEligibility(
                      new Date(sub.current_period_start),
                      sub.completion_percentage
                    );
                    const refundColors = {
                      green: 'bg-green-100 text-green-700',
                      yellow: 'bg-yellow-100 text-yellow-700',
                      orange: 'bg-orange-100 text-orange-700',
                      red: 'bg-red-100 text-red-700',
                    };
                    return (
                      <tr key={sub.user_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{sub.display_name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{sub.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            sub.subscription_status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : sub.subscription_status === 'past_due'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {sub.subscription_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${sub.completion_percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{sub.completion_percentage}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {sub.days_enrolled}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${refundColors[refundTier.color]}`}>
                            {refundTier.label}
                            {refundTier.amount > 0 ? ` ($${refundTier.amount})` : ''}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Issued Certificates</h2>
                <p className="text-sm text-gray-500 mt-1">All certificates generated by students</p>
              </div>
              <button
                onClick={() => { setCertsLoaded(false); loadCertificates(); }}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {!certsLoaded ? (
            <div className="p-12 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ) : certificates.length === 0 ? (
            <div className="p-12 text-center">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates issued yet</h3>
              <p className="text-gray-500">Certificates will appear here when students complete the program</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Student Name</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Certificate #</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Issued Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 text-amber-600" />
                          </div>
                          <span className="font-medium text-gray-900">{cert.student_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{cert.user_email}</td>
                      <td className="px-5 py-4">
                        <code className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">{cert.certificate_number}</code>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quick Action — Generate Certificate */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowCertModal(true)}
          className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 hover:border-amber-200 transition-colors group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Generate Certificate</h3>
              <p className="text-sm text-gray-500">Create one on the fly for any student</p>
            </div>
          </div>
        </button>
      </div>

      {/* Certificate Generator Modal */}
      {showCertModal && (
        <CertificateGeneratorModal onClose={() => setShowCertModal(false)} />
      )}
    </div>
  );
}

// ─── Certificate Generator Modal ───

function getLocalDateString(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getLocalCertNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `VPA-${code}`;
}

function CertificateGeneratorModal({ onClose }: { onClose: () => void }) {
  const [studentName, setStudentName] = useState('');
  const [certNumber] = useState(getLocalCertNumber);
  const [formattedDate] = useState(getLocalDateString);

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full mx-auto my-4">
        {/* Header */}
        <div className="no-print p-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Generate Certificate</h2>
              <p className="text-sm text-gray-500">Create a certificate on the fly for any student</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="no-print p-5 border-b border-gray-200">
          <div className="flex gap-4 items-end max-w-2xl mx-auto">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                disabled={!studentName.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {formattedDate} &middot; Certificate #{certNumber}
          </p>
        </div>

        {/* Certificate Preview */}
        <div className="p-6">
          <div
            className="certificate-printable bg-white mx-auto border border-gray-200 shadow-apple overflow-hidden"
            style={{ aspectRatio: '11 / 8.5', maxWidth: '1056px' }}
          >
            <div className="w-full h-full p-[3%]">
              <div
                className="w-full h-full flex flex-col items-center justify-between py-[4%] px-[6%]"
                style={{
                  border: '3px double #1e3a5f',
                  boxShadow: 'inset 0 0 0 1px #d4af37, inset 0 0 0 4px #fff, inset 0 0 0 5px #1e3a5f',
                }}
              >
                {/* Logo — pinned to top */}
                <div className="w-full flex justify-center pt-[1%]">
                  <img
                    src="/vytalpath-logo.png"
                    alt="VytalPath Academy"
                    className="h-32 object-contain"
                  />
                </div>

                {/* Centered content — pb offsets the taller logo so text feels page-centered */}
                <div className="text-center flex-1 flex flex-col items-center justify-center w-full pb-[4%]">
                  <h2
                    className="text-3xl font-bold tracking-wide mb-1"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
                  >
                    CERTIFICATE OF COMPLETION
                  </h2>
                  <div className="w-48 mx-auto mb-4" style={{ borderTop: '2px solid #d4af37' }} />
                  <p className="text-sm text-gray-500 mb-3 tracking-wide">This certifies that</p>
                  <div className="flex items-center gap-4 mb-3 max-w-lg w-full justify-center">
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #d4af37)' }} />
                    <p
                      className="text-2xl font-semibold min-w-0 px-2"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
                    >
                      {studentName || 'Student Name'}
                    </p>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #d4af37)' }} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">has successfully completed all requirements of the program</p>
                  <h3
                    className="text-xl font-bold tracking-wide mb-3"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
                  >
                    Healthcare Foundations for Front Office Professionals
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                    Including 6 training sections, 13 competency assessments,
                    hands-on EHR simulation, and job readiness preparation.
                  </p>
                </div>

                {/* Bottom row */}
                <div className="w-full flex items-end justify-between mt-4">
                  <div className="text-left">
                    <p className="text-sm font-medium" style={{ color: '#1e3a5f' }}>{formattedDate}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Certificate #{certNumber}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a5f, #2d5a8e)',
                        boxShadow: '0 0 0 3px #d4af37, 0 0 0 5px #1e3a5f, 0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      <span
                        className="text-lg font-bold text-white"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        VP
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <img
                      src="/images/m-koepke-signature.png"
                      alt="M Koepke"
                      className="h-10 ml-auto mb-1 object-contain"
                    />
                    <div className="w-40 mb-1" style={{ borderTop: '1px solid #1e3a5f' }} />
                    <p className="text-sm font-medium" style={{ color: '#1e3a5f' }}>VytalPath Academy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
