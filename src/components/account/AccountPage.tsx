import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, HelpCircle, Shield, AlertTriangle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useProgress } from '../../contexts/ProgressContext';
import { calculateCompletionPercent } from '../../utils/completionCalculator';
import { calculateRefundEligibility, getDaysSinceStart, isWithinGuaranteePeriod } from '../../utils/refundPolicy';
import { FAQ } from './FAQ';

type Tab = 'billing' | 'faq' | 'legal';

export function AccountPage() {
  const { user } = useAuth();
  const subscription = useSubscription();
  const progress = useProgress();
  const [activeTab, setActiveTab] = useState<Tab>('billing');

  // Cancel flow state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelResult, setCancelResult] = useState<{ success: boolean; refundAmount: number; error?: string } | null>(null);

  const completion = useMemo(() =>
    calculateCompletionPercent(progress.isLessonCompleted, progress.hasPassedQuiz),
    [progress]
  );

  const refundTier = useMemo(() => {
    if (!subscription.currentPeriodStart) return null;
    return calculateRefundEligibility(subscription.currentPeriodStart);
  }, [subscription.currentPeriodStart]);

  const daysSinceStart = subscription.currentPeriodStart
    ? getDaysSinceStart(subscription.currentPeriodStart)
    : null;

  const handleCancel = async () => {
    setCancelLoading(true);
    const result = await subscription.cancelSubscription();
    setCancelResult(result);
    setCancelLoading(false);
    setShowCancelConfirm(false);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { key: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { key: 'legal', label: 'Legal', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Account</h1>
        <p className="text-gray-500">{user?.email}</p>
      </header>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Subscription Status Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-apple-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>

            {subscription.hasAccess ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {subscription.cancelAtPeriodEnd ? 'Cancels at period end' : 'Active'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Plan</p>
                    <p className="text-sm font-medium text-gray-900">
                      {subscription.accessType === 'organization'
                        ? `${subscription.orgName} (Organization)`
                        : 'Individual ($327/year)'}
                    </p>
                  </div>
                  {subscription.currentPeriodStart && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Started</p>
                      <p className="text-sm text-gray-700">
                        {subscription.currentPeriodStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {subscription.currentPeriodEnd && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Renews</p>
                      <p className="text-sm text-gray-700">
                        {subscription.currentPeriodEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress summary */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Course Progress</p>
                    <span className="text-sm font-semibold text-gray-900">{completion.percent}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${completion.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {completion.completedLessons}/{completion.totalLessons} lessons, {completion.passedQuizzes}/{completion.totalQuizzes} quizzes
                  </p>
                </div>

                {/* 3-Day Guarantee Status */}
                {subscription.accessType === 'individual' && daysSinceStart !== null && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">3-Day No-Risk Guarantee</p>
                    {subscription.currentPeriodStart && isWithinGuaranteePeriod(subscription.currentPeriodStart) ? (
                      <p className="text-sm text-green-700">
                        You're within your 3-day guarantee window. If you cancel now, you'll receive a full $327 refund.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Your 3-day guarantee window has passed. Cancellations after day 3 do not include a refund.
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Day {daysSinceStart + 1} of enrollment
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-4">No active subscription</p>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  View Plans
                </a>
              </div>
            )}
          </div>

          {/* Cancel Subscription */}
          {subscription.hasAccess && subscription.accessType === 'individual' && !subscription.cancelAtPeriodEnd && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-apple-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cancel Subscription</h2>
              <div className="text-sm text-gray-500 mb-4 space-y-2">
                <p>
                  We offer a <strong className="text-gray-700">3-day no-risk guarantee</strong>. If you cancel within 3 days of your purchase, you'll receive a full refund of $327 — no questions asked.
                </p>
                <p>
                  After 3 days, you can still cancel anytime, but no refund will be issued. Access ends immediately upon cancellation.
                </p>
              </div>

              {cancelResult?.success ? (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Subscription cancelled</p>
                    <p className="text-sm text-green-700 mt-1">
                      {cancelResult.refundAmount > 0
                        ? `A refund of $${cancelResult.refundAmount.toFixed(2)} has been initiated to your payment method. Allow 5-10 business days for it to appear.`
                        : 'Your subscription has been cancelled. No refund applies after the 3-day guarantee window.'}
                    </p>
                  </div>
                </div>
              ) : cancelResult?.error ? (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Cancellation failed</p>
                    <p className="text-sm text-red-700 mt-1">{cancelResult.error}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Cancel My Subscription
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-apple-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <FAQ />
        </div>
      )}

      {activeTab === 'legal' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-apple-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal & Policies</h2>
          <p className="text-sm text-gray-500 mb-5">
            Review our platform policies. These documents govern your use of VytalPath Academy.
          </p>
          <div className="space-y-3">
            {[
              { to: '/privacy', label: 'Privacy Policy', desc: 'How we collect, use, and protect your data' },
              { to: '/terms-of-service', label: 'Terms of Service', desc: 'Agreement governing your use of the platform' },
              { to: '/cookies', label: 'Cookie Policy', desc: 'How we use cookies and local storage' },
              { to: '/acceptable-use', label: 'Acceptable Use Policy', desc: 'Rules for using the platform' },
              { to: '/returns', label: 'Returns & Refund Policy', desc: 'Cancellation and refund details' },
            ].map((policy) => (
              <Link
                key={policy.to}
                to={policy.to}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{policy.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{policy.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-red-50 border-b border-red-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Cancel Subscription?</h2>
                  <p className="text-sm text-red-800">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Your access to all course content will end immediately.
              </p>

              {refundTier && (
                <div className={`border rounded-xl p-4 mb-5 ${refundTier.percent > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Refund</span>
                    <span className={`text-lg font-semibold ${refundTier.percent > 0 ? 'text-green-700' : 'text-gray-900'}`}>
                      {refundTier.amount > 0 ? `$${refundTier.amount} full refund` : 'No refund'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {refundTier.percent > 0
                      ? 'Within 3-day guarantee window'
                      : '3-day guarantee window has passed'}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={cancelLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 rounded-xl transition-colors"
                >
                  {cancelLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
