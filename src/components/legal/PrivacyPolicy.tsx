import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <article className="max-w-3xl mx-auto py-10 px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: February 12, 2026</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. Introduction</h2>
          <p>
            VytalPath Academy ("we," "us," or "our") operates the VytalPath Academy platform at vytalpath.com.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
            use our platform. Please read this policy carefully. By using VytalPath Academy, you consent to the
            practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. Information We Collect</h2>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Information You Provide</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account information:</strong> Email address and password when you create an account</li>
            <li><strong>Profile information:</strong> Name (first and last) for your certificate of completion</li>
            <li><strong>Payment information:</strong> Billing details processed securely through Stripe — we never store your full credit card number</li>
            <li><strong>Communications:</strong> Messages you send to our AI Study Assistant during learning sessions</li>
          </ul>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Information Collected Automatically</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Learning progress:</strong> Lesson completion, quiz scores, and competency tracking data stored in your browser's local storage</li>
            <li><strong>Usage data:</strong> Pages visited, features used, and session duration</li>
            <li><strong>Device information:</strong> Browser type, operating system, and screen resolution</li>
            <li><strong>Practice session data:</strong> Ungraded practice question responses and session statistics stored locally in your browser</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and maintain the VytalPath Academy platform</li>
            <li>To process your subscription and payments through Stripe</li>
            <li>To track your learning progress and competency development</li>
            <li>To generate your certificate of completion</li>
            <li>To power the AI Study Assistant with relevant learning context</li>
            <li>To manage organization memberships and invitations</li>
            <li>To send you important account notifications (subscription status, password resets)</li>
            <li>To improve our platform and training content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. AI Study Assistant</h2>
          <p>
            VytalPath Academy includes an AI-powered Study Assistant. When you interact with this feature:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your messages are sent to our AI service provider (Anthropic) to generate responses</li>
            <li>Conversations include your current learning context (section, lesson, progress) to provide relevant help</li>
            <li>AI conversations are not permanently stored and are not used to train AI models</li>
            <li>The AI assistant is for learning purposes only and should not be relied upon as professional medical or legal advice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Data Storage & Security</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Authentication & database:</strong> Account data is stored securely using Supabase with row-level security (RLS) policies</li>
            <li><strong>Payments:</strong> All payment processing is handled by Stripe, a PCI-DSS compliant payment processor</li>
            <li><strong>Local storage:</strong> Learning progress and practice session data are stored in your browser's local storage on your device</li>
            <li><strong>Certificates:</strong> Certificate records are stored in our database with unique identifiers</li>
            <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using TLS/SSL</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase:</strong> Authentication, database, and file storage</li>
            <li><strong>Stripe:</strong> Payment processing and subscription management</li>
            <li><strong>Anthropic (Claude):</strong> AI Study Assistant responses</li>
            <li><strong>Vercel:</strong> Platform hosting and deployment</li>
          </ul>
          <p className="mt-2">
            Each of these services has its own privacy policy. We encourage you to review them. We do not sell
            your personal information to any third party.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">7. Data Sharing</h2>
          <p>We do not sell, rent, or trade your personal information. We may share your information only in these circumstances:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Organization admins:</strong> If you are part of an organization, your admin may see your name, email, and learning progress</li>
            <li><strong>Service providers:</strong> With our third-party service providers as described above, solely to operate the platform</li>
            <li><strong>Legal requirements:</strong> If required by law, subpoena, or other legal process</li>
            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your learning progress data</li>
            <li>Opt out of non-essential communications</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:hello@vytalpath.com" className="text-blue-600 hover:text-blue-700">hello@vytalpath.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">9. Children's Privacy</h2>
          <p>
            VytalPath Academy is intended for users who are at least 18 years old or the age of majority in
            their jurisdiction. We do not knowingly collect personal information from children under 13. If you
            believe we have collected information from a child under 13, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by
            posting the new policy on this page and updating the "Last updated" date. Your continued use of the
            platform after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:hello@vytalpath.com" className="text-blue-600 hover:text-blue-700">hello@vytalpath.com</a>.
          </p>
        </section>
      </div>

      {/* Related policies */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Related Policies</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/terms-of-service" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Terms of Service</Link>
          <Link to="/cookies" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Cookie Policy</Link>
          <Link to="/acceptable-use" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Acceptable Use</Link>
          <Link to="/returns" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Returns & Refunds</Link>
        </div>
      </div>
    </article>
  );
}
