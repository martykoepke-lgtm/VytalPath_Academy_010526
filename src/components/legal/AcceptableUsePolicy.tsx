import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export function AcceptableUsePolicy() {
  return (
    <article className="max-w-3xl mx-auto py-10 px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Acceptable Use Policy</h1>
          <p className="text-sm text-gray-500">Last updated: February 12, 2026</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. Overview</h2>
          <p>
            This Acceptable Use Policy ("AUP") governs your use of VytalPath Academy. It is part of our
            <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-700 ml-1">Terms of Service</Link> and
            applies to all users, including individual subscribers and organization members.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. Permitted Use</h2>
          <p>VytalPath Academy is designed for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal or professional education in healthcare front office skills</li>
            <li>Employer-sponsored training for healthcare administrative staff</li>
            <li>Individual career development and job preparation</li>
            <li>Competency assessment and progress tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. Prohibited Activities</h2>
          <p>You agree not to:</p>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Account & Access</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Share your account credentials with others or allow others to use your account</li>
            <li>Create multiple accounts to circumvent rate limits, subscription requirements, or policy enforcement</li>
            <li>Use another person's account without their explicit permission</li>
            <li>Attempt to access content or features you are not authorized to use</li>
          </ul>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Content & Intellectual Property</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Copy, reproduce, or redistribute any Platform content (lessons, videos, quizzes, SOPs) without written permission</li>
            <li>Record, download, or screen-capture video lessons for redistribution</li>
            <li>Use content from VytalPath Academy to create a competing product or service</li>
            <li>Remove or alter any copyright, trademark, or other proprietary notices</li>
          </ul>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">AI Study Assistant</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the AI assistant to generate content for purposes outside of your VytalPath learning</li>
            <li>Attempt to manipulate the AI assistant into providing inappropriate, harmful, or off-topic content</li>
            <li>Submit real patient information, protected health information (PHI), or other sensitive data to the AI assistant</li>
            <li>Use automated scripts or bots to interact with the AI assistant</li>
          </ul>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Platform Integrity</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Attempt to circumvent security measures, rate limits, or access controls</li>
            <li>Introduce malicious code, viruses, or other harmful technology</li>
            <li>Interfere with or disrupt the Platform or servers</li>
            <li>Scrape, crawl, or use automated means to access the Platform</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
          </ul>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Academic Integrity</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Share quiz questions or answers with others</li>
            <li>Use external tools to cheat on quizzes or assessments</li>
            <li>Misrepresent your completion status or competency level</li>
            <li>Fraudulently obtain or alter a certificate of completion</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Organization Members</h2>
          <p>If you access VytalPath Academy through an organization:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your organization administrator may have access to your progress and completion data</li>
            <li>Your access is subject to both this AUP and any additional policies set by your organization</li>
            <li>Your organization may revoke your access at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Enforcement</h2>
          <p>
            Violations of this policy may result in:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Warning notification</li>
            <li>Temporary suspension of your account</li>
            <li>Permanent termination of your account</li>
            <li>Revocation of certificates</li>
            <li>Legal action, if warranted</li>
          </ul>
          <p className="mt-2">
            We reserve the right to investigate suspected violations and take action at our discretion. We
            may involve law enforcement if we believe criminal activity has occurred.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Reporting Violations</h2>
          <p>
            If you become aware of a violation of this policy, please report it to{' '}
            <a href="mailto:hello@vytalpath.com" className="text-blue-600 hover:text-blue-700">hello@vytalpath.com</a>.
            We take all reports seriously and will investigate promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">7. Changes</h2>
          <p>
            We may update this Acceptable Use Policy from time to time. Changes will be posted on this page
            with a revised "Last updated" date. Continued use of the Platform constitutes acceptance of the
            updated policy.
          </p>
        </section>
      </div>

      {/* Related policies */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Related Policies</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/privacy" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Terms of Service</Link>
          <Link to="/cookies" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Cookie Policy</Link>
          <Link to="/returns" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Returns & Refunds</Link>
        </div>
      </div>
    </article>
  );
}
