import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

export function PricingPage() {
  const { user } = useAuth();
  const { hasAccess, accessType, createCheckoutSession } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get the return URL from state if available
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/foundations';

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to sign up
      navigate('/', { state: { showSignIn: true } });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const checkoutUrl = await createCheckoutSession('individual');
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('Failed to create checkout session. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user already has access, show a message
  if (hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h1>
            <p className="text-gray-600 mb-6">
              You have an active {accessType === 'organization' ? 'organization' : 'individual'} subscription.
            </p>
            <Link
              to={from}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Training
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Healthcare Training
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant access to all 10 training modules, 40+ video lessons, and 24 workflow guides.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold mb-1">Individual Access</h2>
              <p className="text-blue-100">Full 1-year access to all content</p>
            </div>

            {/* Price */}
            <div className="px-8 py-8 border-b border-gray-100">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">$327</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-gray-500 mt-2">Billed annually</p>
            </div>

            {/* Features */}
            <div className="px-8 py-6">
              <ul className="space-y-4">
                {[
                  'Complete 10-module curriculum',
                  '40+ professional video lessons',
                  '24 SOP workflow guides',
                  'Interactive exercises & quizzes',
                  'Medical terminology flashcards',
                  'Certificate of completion',
                  'Self-paced learning',
                  '1-year unlimited access',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="px-8 py-6 bg-gray-50">
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>

        {/* Organization CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need access for your team or organization?
          </p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact us for volume pricing →
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">40+</div>
              <div className="text-gray-600">Professional Video Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-gray-600">SOP Workflow Guides</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">7+</div>
              <div className="text-gray-600">Hours of Training</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
