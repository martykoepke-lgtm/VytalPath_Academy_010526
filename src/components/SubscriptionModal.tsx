import { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface SubscriptionModalProps {
  onClose?: () => void;
  dismissible?: boolean;
}

export function SubscriptionModal({ onClose, dismissible = false }: SubscriptionModalProps) {
  const { createCheckoutSession } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'full' | 'installment'>('full');

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const url = await createCheckoutSession('individual', undefined, undefined, selectedPlan);
      if (url) {
        window.location.href = url;
      } else {
        alert('Failed to create checkout session. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-1">
            <img
              src="/vp-checkmark.png"
              alt="VytalPath"
              className="h-9 w-9"
            />
            <h2 className="text-2xl font-bold text-white">
              Welcome to VytalPath Academy!
            </h2>
          </div>
          <p className="text-blue-100 text-sm">
            Subscribe to unlock all training content and start your journey
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* What's included */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              What You'll Get:
            </h3>
            <div className="space-y-1.5">
              {[
                '9 comprehensive training sections',
                '80+ video and reading lessons',
                '23 interactive quizzes',
                'Built-in EHR Practice Lab simulation',
                '24 SOP workflow guides',
                'Job readiness tools & mock interviews',
                'AI study assistant on every page',
                'Completion certificate',
                'New content added regularly'
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Pay in Full */}
            <button
              type="button"
              onClick={() => setSelectedPlan('full')}
              className={`rounded-xl p-5 relative text-left transition-all duration-200 ${
                selectedPlan === 'full'
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 ring-2 ring-blue-200'
                  : 'bg-gray-50 border-2 border-gray-200 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap">
                Best Value
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-0.5">
                  $327
                </div>
                <p className="text-sm text-gray-600 font-medium">One-time payment</p>
                <p className="text-xs text-gray-500 mt-1">Full year of access</p>
              </div>
            </button>

            {/* 3-Payment Plan */}
            <button
              type="button"
              onClick={() => setSelectedPlan('installment')}
              className={`rounded-xl p-5 relative text-left transition-all duration-200 ${
                selectedPlan === 'installment'
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 ring-2 ring-blue-200'
                  : 'bg-gray-50 border-2 border-gray-200 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-0.5">
                  3 <span className="text-xl">x</span> $109
                </div>
                <p className="text-sm text-gray-600 font-medium">3 monthly payments</p>
                <p className="text-xs text-gray-500 mt-1">Same full access</p>
              </div>
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 mb-4">
            3-day no-risk guarantee • Full refund if canceled within 3 days
          </p>

          {/* CTA Button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting to checkout...
              </>
            ) : selectedPlan === 'full' ? (
              'Pay $327 — Full Year Access'
            ) : (
              'Start 3 Monthly Payments of $109'
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Secure payment powered by Stripe • Access all content immediately after payment
          </p>
        </div>

        {/* Optional close button */}
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
