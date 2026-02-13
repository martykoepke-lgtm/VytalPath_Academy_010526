import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export function TermsOfService() {
  return (
    <article className="max-w-3xl mx-auto py-10 px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: February 12, 2026</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. Agreement to Terms</h2>
          <p>
            By accessing or using VytalPath Academy ("the Platform"), you agree to be bound by these Terms of
            Service ("Terms"). If you do not agree to these Terms, you may not use the Platform. These Terms
            constitute a legally binding agreement between you and VytalPath Academy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. Description of Service</h2>
          <p>
            VytalPath Academy is an online training platform for healthcare front office professionals. The Platform provides:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Video and reading-based lessons across 9 training sections</li>
            <li>Interactive quizzes and competency assessments</li>
            <li>A simulated EHR Practice Lab environment</li>
            <li>Standard Operating Procedure (SOP) guides</li>
            <li>AI-powered Study Assistant</li>
            <li>Job readiness tools (phone simulator, mock interviews, resume builder)</li>
            <li>Competency progress tracking and completion certificates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. Account Registration</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must create an account to access paid content on the Platform</li>
            <li>You must provide a valid email address and create a secure password</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You are responsible for all activity that occurs under your account</li>
            <li>You must notify us immediately of any unauthorized access to your account</li>
            <li>You must be at least 18 years old or the age of majority in your jurisdiction to create an account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Subscription & Payment</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Individual plan:</strong> $327 per year, providing full access to all Platform content</li>
            <li><strong>Organization plans:</strong> Volume pricing available for teams — contact us for details</li>
            <li>Payments are processed securely through Stripe</li>
            <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
            <li>Prices are subject to change with 30 days' notice to existing subscribers</li>
            <li>You authorize us to charge your payment method on file for subscription renewals</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Cancellation & Refunds</h2>
          <p>
            Our cancellation and refund policy is designed to be fair and transparent:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>3-day guarantee:</strong> Full refund within 3 days of payment, no questions asked</li>
            <li><strong>Progress-based refunds:</strong> After 3 days, refunds are based on your course completion percentage</li>
            <li>Access ends immediately upon cancellation</li>
            <li>Refunds are processed to your original payment method within 5-10 business days</li>
          </ul>
          <p className="mt-2">
            See our full <Link to="/returns" className="text-blue-600 hover:text-blue-700">Returns & Refund Policy</Link> for complete details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Intellectual Property</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All content on the Platform — including lessons, videos, quizzes, SOPs, simulations, and written materials — is the intellectual property of VytalPath Academy</li>
            <li>Your subscription grants you a personal, non-transferable, non-exclusive license to access and use the content for your own educational purposes</li>
            <li>You may not copy, reproduce, distribute, sell, or share any Platform content without our written permission</li>
            <li>You may not record, screenshot, or otherwise capture video lessons for redistribution</li>
            <li>The VytalPath Academy name, logo, and branding are our trademarks</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">7. Certificates</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Certificates of completion are issued upon completing all required lessons and passing all quizzes</li>
            <li>Certificates are non-transferable and linked to your account</li>
            <li>The certificate name you enter is permanent — it cannot be changed after generation</li>
            <li>VytalPath Academy certificates represent completion of training, not professional certification or licensure</li>
            <li>We reserve the right to revoke certificates if they were obtained through fraudulent means</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">8. AI Study Assistant</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>The AI Study Assistant is provided as a learning aid and is not a substitute for professional medical, legal, or clinical advice</li>
            <li>AI responses may occasionally contain inaccuracies — always verify information with your supervisor or authoritative sources</li>
            <li>You agree not to use the AI assistant for purposes outside of your VytalPath Academy learning</li>
            <li>Usage of the AI assistant is subject to rate limits to ensure fair access for all users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">9. EHR Practice Lab</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>The EHR Practice Lab is a simulated environment for educational purposes only</li>
            <li>All patient data in the simulation is fictional — no real patient information is used or stored</li>
            <li>Skills practiced in the simulation should be applied under supervision in real clinical settings</li>
            <li>The simulation does not represent any specific commercial EHR product</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">10. Acceptable Use</h2>
          <p>
            Your use of the Platform is subject to our <Link to="/acceptable-use" className="text-blue-600 hover:text-blue-700">Acceptable Use Policy</Link>,
            which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">11. Disclaimers</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>VytalPath Academy is an educational platform, not a healthcare provider or certification body</li>
            <li>Completing our training does not guarantee employment or professional certification</li>
            <li>Content is provided "as is" — while we strive for accuracy, we cannot guarantee that all information is error-free</li>
            <li>We are not responsible for decisions you make based on the training content</li>
            <li>The Platform may experience downtime for maintenance or updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">12. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, VytalPath Academy shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
            whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible
            losses resulting from your use of the Platform. Our total liability for any claim arising from
            these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of
            Washington, United States, without regard to its conflict of law provisions. Any disputes arising
            from these Terms shall be resolved in the courts located in the State of Washington.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">14. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of material
            changes by posting the updated Terms on this page. Your continued use of the Platform after
            changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">15. Contact</h2>
          <p>
            For questions about these Terms, contact us at{' '}
            <a href="mailto:hello@vytalpath.com" className="text-blue-600 hover:text-blue-700">hello@vytalpath.com</a>.
          </p>
        </section>
      </div>

      {/* Related policies */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Related Policies</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/privacy" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Privacy Policy</Link>
          <Link to="/cookies" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Cookie Policy</Link>
          <Link to="/acceptable-use" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Acceptable Use</Link>
          <Link to="/returns" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Returns & Refunds</Link>
        </div>
      </div>
    </article>
  );
}
