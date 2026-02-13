import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft } from 'lucide-react';

export function CookiePolicy() {
  return (
    <article className="max-w-3xl mx-auto py-10 px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
          <Cookie className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Cookie Policy</h1>
          <p className="text-sm text-gray-500">Last updated: February 12, 2026</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your browser or device when you visit a website.
            VytalPath Academy uses cookies and similar technologies (such as local storage) to provide,
            protect, and improve the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. How We Use Cookies & Local Storage</h2>
          <p>
            VytalPath Academy uses a minimal set of cookies and browser storage. We prioritize your privacy
            and only store what is necessary to operate the Platform.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-6 mb-3">Essential Cookies</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b">Name</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b">Purpose</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 font-mono text-xs">sb-*-auth-token</td>
                  <td className="px-4 py-2">Supabase authentication session — keeps you signed in</td>
                  <td className="px-4 py-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-medium text-gray-800 mt-6 mb-3">Local Storage</h3>
          <p className="mb-3">
            We use your browser's local storage (not cookies) to store learning data directly on your device:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b">Key</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b">Purpose</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 font-mono text-xs">vytalpath_progress</td>
                  <td className="px-4 py-2">Lesson completion status and quiz scores</td>
                  <td className="px-4 py-2">Persistent</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-mono text-xs">vytalpath_practice_sessions</td>
                  <td className="px-4 py-2">Ungraded practice question sessions and statistics</td>
                  <td className="px-4 py-2">Persistent</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">sb-*-auth-token</td>
                  <td className="px-4 py-2">Authentication token for Supabase</td>
                  <td className="px-4 py-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. Third-Party Cookies</h2>
          <p>
            Our third-party service providers may set their own cookies:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Stripe:</strong> May set cookies for payment fraud prevention when you access the checkout or customer portal</li>
            <li><strong>Supabase:</strong> Sets authentication cookies to manage your session</li>
          </ul>
          <p className="mt-2">
            We do not use advertising cookies, tracking pixels, or social media cookies. We do not
            participate in ad networks or cross-site tracking.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <p className="mt-2">
            Please note that blocking essential cookies or clearing local storage will log you out and
            reset your locally-stored learning progress.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy to reflect changes in our practices or for other operational,
            legal, or regulatory reasons. We will post the updated policy on this page with a revised
            "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Contact</h2>
          <p>
            If you have questions about our use of cookies, contact us at{' '}
            <a href="mailto:hello@vytalpath.com" className="text-blue-600 hover:text-blue-700">hello@vytalpath.com</a>.
          </p>
        </section>
      </div>

      {/* Related policies */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Related Policies</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/privacy" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Terms of Service</Link>
          <Link to="/acceptable-use" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Acceptable Use</Link>
          <Link to="/returns" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Returns & Refunds</Link>
        </div>
      </div>
    </article>
  );
}
