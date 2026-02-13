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
        <p>
          This Acceptable Use Policy ("AUP") covers the products, services, and technologies
          (collectively referred to as the "Platform") provided by Practical Informatics LLC under
          any ongoing agreement. It is designed to protect us, our customers, and the general
          Internet community from unethical, irresponsible, and illegal activity.
        </p>
        <p>
          Practical Informatics LLC customers found engaging in activities prohibited by this AUP
          can be liable for service suspension and account termination. In extreme cases, we may be
          legally obliged to report such customers to the relevant authorities.
        </p>
        <p>
          This policy was last reviewed on February 12, 2026.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Fair Use</h2>
          <p>
            We provide our Platform and services in the hope that they will be useful to you. We
            ask that you use the Platform in a way that is fair and respectful to others. We provide
            educational training content, an AI Study Assistant, a simulated EHR Practice Lab, and
            related learning tools on terms that are fair and reasonable. We ask that you use these
            services for their intended purpose — personal or employer-sponsored healthcare front
            office education — and in a manner that does not negatively impact the experience of
            other users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Customer Accountability</h2>
          <p>
            We regard our customers as being aware of, and in agreement with, the intentions of this
            Acceptable Use Policy. We treat unauthorized use or misuse of the Platform as a serious
            matter and reserve the right to take remedial action including, but not limited to,
            suspension or termination of your account.
          </p>
          <p className="mt-2">
            If you access VytalPath Academy through an organization, your organization administrator
            may have access to your progress and completion data, and your access is subject to both
            this AUP and any additional policies set by your organization.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Prohibited Activity</h2>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Copyright Infringement and Access to Unauthorized Material</h3>
          <p>
            When using our Platform, you must not access, share, or reproduce materials that infringe
            on another party's copyright or other intellectual property. This includes but is not
            limited to the copying, reproduction, distribution, recording, screen-capture, or
            sharing of VytalPath Academy content (lessons, videos, quizzes, SOPs, simulations, and
            written materials) without our written permission. You may not use content from VytalPath
            Academy to create a competing product or service. You may not remove or alter any
            copyright, trademark, or other proprietary notices.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Spam and Unauthorized Messaging</h3>
          <p>
            You must not use the Platform to send unsolicited messages or content. This includes but
            is not limited to using the AI Study Assistant or any messaging features to distribute
            advertising, promotional material, or other forms of solicitation to other users or
            third parties. You may not use automated scripts or bots to interact with the AI Study
            Assistant or any other Platform feature.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Unethical, Exploitative, and Malicious Activity</h3>
          <p>
            Our Platform must not be used for the purpose of deliberately or recklessly harming
            others. The following activities are explicitly prohibited:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Attempting to manipulate the AI Study Assistant into providing inappropriate, harmful, or off-topic content</li>
            <li>Submitting real patient information, protected health information (PHI), or other sensitive data to the AI assistant or any other Platform feature</li>
            <li>Sharing quiz questions or answers with others</li>
            <li>Using external tools to cheat on quizzes or assessments</li>
            <li>Misrepresenting your completion status or competency level</li>
            <li>Fraudulently obtaining or altering a certificate of completion</li>
            <li>Introducing malicious code, viruses, or other harmful technology to the Platform</li>
            <li>Attempting to circumvent security measures, rate limits, or access controls</li>
          </ul>

          <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">Unauthorized Use of Practical Informatics LLC Property</h3>
          <p>
            We prohibit the impersonation of Practical Informatics LLC, the representation of a
            significant business relationship with Practical Informatics LLC, or ownership of any
            Practical Informatics LLC property (including our Platform, products, and brand assets)
            for the purpose of fraudulently gaining service, custom, patronage, or user trust. This
            includes sharing your account credentials with others, creating multiple accounts to
            circumvent restrictions, or accessing content or features you are not authorized to use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">About This Policy</h2>
          <p>
            This policy outlines a non-exclusive list of activities and intent we deem unacceptable
            and incompatible with our brand. We reserve the right to modify this policy at any time
            by publishing the revised version on the Platform. The revised version will be effective
            from the date of publication.
          </p>
          <p className="mt-2">
            If you have any questions or concerns regarding this policy, contact us using the
            following details:
          </p>
          <p className="mt-2">
            <strong>Practical Informatics LLC</strong>
            <br />
            <a href="mailto:contact@practicalinformatics.com" className="text-blue-600 hover:text-blue-700">contact@practicalinformatics.com</a>
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
