import { Link } from 'react-router-dom';
import { RotateCcw, ArrowLeft, Shield, Clock } from 'lucide-react';

export function ReturnsPolicy() {
  return (
    <article className="max-w-3xl mx-auto py-10 px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Returns & Refund Policy</h1>
          <p className="text-sm text-gray-500">Last updated: February 13, 2026</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <p>
          Since VytalPath Academy, operated by Practical Informatics LLC, offers non-tangible,
          irrevocable digital goods (immediate access to an online training platform), we do not
          generally issue refunds after a purchase is made. However, we want you to feel confident
          in your purchase, so we offer a straightforward guarantee.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3-Day No-Risk Guarantee</h2>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200 mb-4">
            <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Full refund within 3 days — no questions asked</p>
              <p className="text-xs text-green-700 mt-1">
                If you cancel within 3 calendar days of your purchase, you will receive a complete
                refund of $327 to your original payment method.
              </p>
            </div>
          </div>
          <p>
            We want you to try VytalPath Academy with confidence. If the program isn't the right fit
            for any reason, simply cancel from
            your <Link to="/account" className="text-blue-600 hover:text-blue-700">Account page</Link> within
            3 days and you'll get your money back.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">After 3 Days</h2>
          <p>
            After the 3-day guarantee window, you may still cancel your subscription at any time, but
            no refund will be issued. Upon cancellation, your access to all course content ends
            immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">How to Cancel</h2>
          <p>You can cancel your subscription in two ways:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Self-service:</strong> Go to your <Link to="/account" className="text-blue-600 hover:text-blue-700">Account page</Link>, open the Billing tab, and click "Cancel My Subscription."</li>
            <li><strong>Email:</strong> Contact us at <a href="mailto:contact@practicalinformatics.com" className="text-blue-600 hover:text-blue-700">contact@practicalinformatics.com</a> with your account email and we will process the cancellation for you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Refund Processing</h2>
          <p>
            Refunds are processed to your original payment method (the card used for purchase).
            Please allow 5-10 business days for the refund to appear, depending on your bank or
            card issuer. You will receive a confirmation email when your refund is initiated.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">After Cancellation</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your access to lessons, quizzes, the EHR Practice Lab, and all premium features ends immediately</li>
            <li>Your locally-stored progress data remains on your device unless you clear your browser data</li>
            <li>If you resubscribe in the future, your locally-stored progress will be available</li>
            <li>Certificates that were generated before cancellation remain valid</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Organization Subscriptions</h2>
          <p>
            Refund policies for organization (team) subscriptions are handled on a case-by-case
            basis. Organization administrators should contact us
            at <a href="mailto:contact@practicalinformatics.com" className="text-blue-600 hover:text-blue-700">contact@practicalinformatics.com</a> to
            discuss cancellation and refund terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Exceptions</h2>
          <p>
            In exceptional circumstances (billing errors, duplicate charges, technical issues
            preventing access), we may offer refunds outside of the standard policy. Contact us
            at <a href="mailto:contact@practicalinformatics.com" className="text-blue-600 hover:text-blue-700">contact@practicalinformatics.com</a> and
            we will work with you to resolve the issue.
          </p>
        </section>

        {/* Fine print */}
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg mt-6">
          <Shield className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Refund eligibility is determined by the date of your Stripe payment. All refund
            calculations are performed server-side based on your subscription start date.
            Practical Informatics LLC reserves the right to modify this policy with 30 days'
            notice to existing subscribers.
          </p>
        </div>
      </div>

      {/* Related policies */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Related Policies</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/privacy" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Terms of Service</Link>
          <Link to="/cookies" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Cookie Policy</Link>
          <Link to="/acceptable-use" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Acceptable Use</Link>
        </div>
      </div>
    </article>
  );
}
