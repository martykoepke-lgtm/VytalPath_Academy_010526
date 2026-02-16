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

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const url = await createCheckoutSession('individual');
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
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/vp-checkmark.png"
              alt="VytalPath"
              className="h-10 w-10"
            />
            <h2 className="text-3xl font-bold text-white">
              Welcome to VytalPath Academy!
            </h2>
          </div>
          <p className="text-blue-100">
            Subscribe to unlock all training content and start your journey
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* What's included */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What You'll Get:
            </h3>
            <div className="space-y-3">
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
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                $327
                <span className="text-lg font-normal text-gray-600">/year</span>
              </div>
              <p className="text-sm text-gray-600">
                Less than $1/day • Cancel anytime
              </p>
              <p className="text-xs text-gray-500 mt-2">
                3-day no-risk guarantee • Full refund if canceled within 3 days
              </p>
            </div>
          </div>

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
            ) : (
              'Subscribe Now & Get Started'
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
