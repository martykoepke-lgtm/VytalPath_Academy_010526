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
        <p>
          Your access to and use of VytalPath Academy ("the Platform"), operated by Practical
          Informatics LLC ("Company," "we," "us," or "our"), is conditioned on your acceptance of
          and compliance with these Terms of Service. By accessing or using the Platform, you agree
          to be bound by these Terms.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Limitations of Use</h2>
          <p>
            By using the Platform, you warrant on behalf of yourself, your users, and other parties
            you represent that you will not:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Modify, copy, prepare derivative works of, decompile, or reverse engineer any materials or software contained on the Platform</li>
            <li>Remove any copyright or other proprietary notations from any materials and software on the Platform</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            <li>Knowingly or negligently use the Platform in a way that abuses or disrupts our networks or any other service Practical Informatics LLC provides</li>
            <li>Use the Platform to transmit or publish any harassing, indecent, obscene, fraudulent, or unlawful material</li>
            <li>Use the Platform in violation of any applicable laws or regulations</li>
            <li>Use the Platform to send unauthorized advertising or spam</li>
            <li>Harvest, collect, or gather user data without the user's consent</li>
            <li>Use the Platform in conjunction with sending unwanted or unsolicited material</li>
            <li>Share your account credentials with others or allow others to access the Platform using your account</li>
            <li>Create multiple accounts to circumvent rate limits, subscription requirements, or policy enforcement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Intellectual Property</h2>
          <p>
            The intellectual property in the materials contained on the Platform is owned by or
            licensed to Practical Informatics LLC and is protected by applicable copyright and
            trademark law. We grant our users permission to access and use the Platform content
            solely for personal, non-commercial, educational purposes related to their VytalPath
            Academy subscription.
          </p>
          <p className="mt-2">
            This constitutes the grant of a license, not a transfer of title. This license shall
            automatically terminate if you violate any of these restrictions or the Terms of
            Service, and may be terminated by Practical Informatics LLC at any time.
          </p>
          <p className="mt-2">
            All content on the Platform — including lessons, videos, quizzes, standard operating
            procedures, simulations, and written materials — is the intellectual property of
            Practical Informatics LLC. You may not copy, reproduce, distribute, sell, record,
            screen-capture, or share any Platform content without our written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Subscription & Payment</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Individual plan:</strong> $327 per year, providing full access to all Platform content for one year from the date of purchase</li>
            <li><strong>Organization plans:</strong> Volume pricing available for teams — contact us for details</li>
            <li>All payments are processed securely through Stripe. Practical Informatics LLC does not store your credit card information</li>
            <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
            <li>Prices are subject to change with 30 days' notice to existing subscribers</li>
            <li>You authorize us to charge your payment method on file for subscription renewals</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Cancellation & Refunds</h2>
          <p>
            Our cancellation and refund policy is designed to be fair and transparent. Within the
            first 3 days of purchase, you may receive a full refund — no questions asked. After
            3 days, refunds are based on your course completion percentage at the time of
            cancellation.
          </p>
          <p className="mt-2">
            Access to Platform content ends immediately upon cancellation. Refunds are processed
            to your original payment method within 5-10 business days. See our
            full <Link to="/returns" className="text-blue-600 hover:text-blue-700">Returns & Refund Policy</Link> for
            complete details including refund tier amounts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Certificates</h2>
          <p>
            Certificates of completion are issued upon completing all required lessons and passing
            all quizzes. Certificates are non-transferable, linked to your account, and the name
            you enter is permanent and cannot be changed after generation. VytalPath Academy
            certificates represent completion of training — they are not professional
            certifications or licensures. We reserve the right to revoke certificates obtained
            through fraudulent means.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">AI Study Assistant</h2>
          <p>
            The Platform includes an AI-powered Study Assistant provided as a learning aid. AI
            responses may occasionally contain inaccuracies — always verify information with your
            supervisor or authoritative sources. The AI Study Assistant is not a substitute for
            professional medical, legal, or clinical advice. You agree not to submit real patient
            information, protected health information (PHI), or other sensitive data to the AI
            assistant. Usage is subject to rate limits.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">EHR Practice Lab</h2>
          <p>
            The EHR Practice Lab is a simulated environment for educational purposes only. All
            patient data in the simulation is entirely fictional — no real patient information is
            used or stored. Skills practiced in the simulation should be applied under supervision
            in real clinical settings. The simulation does not represent any specific commercial
            EHR product.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Acceptable Use</h2>
          <p>
            Your use of the Platform is subject to
            our <Link to="/acceptable-use" className="text-blue-600 hover:text-blue-700">Acceptable Use Policy</Link>,
            which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Liability</h2>
          <p>
            Our Platform and the materials on our Platform are provided on an "as is" basis. To
            the extent permitted by law, Practical Informatics LLC makes no warranties, expressed
            or implied, and hereby disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability, fitness for a
            particular purpose, or non-infringement of intellectual property, or other violation
            of rights.
          </p>
          <p className="mt-2">
            In no event shall Practical Informatics LLC or its suppliers be liable for any
            consequential loss suffered or incurred by you or any third party arising from the use
            or inability to use the Platform or the materials on the Platform, even if Practical
            Informatics LLC or an authorized representative has been notified, orally or in
            writing, of the possibility of such damage.
          </p>
          <p className="mt-2">
            In the context of this agreement, "consequential loss" includes any consequential
            loss, indirect loss, real or anticipated loss of profit, loss of benefit, loss of
            revenue, loss of business, loss of goodwill, loss of opportunity, loss of savings,
            loss of reputation, loss of use and/or loss or corruption of data, whether under
            statute, contract, equity, tort (including negligence), indemnity, or otherwise.
          </p>
          <p className="mt-2">
            Because some jurisdictions do not allow limitations on implied warranties, or
            limitations of liability for consequential or incidental damages, these limitations
            may not apply to you. Our total liability for any claim arising from these Terms shall
            not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Accuracy of Materials</h2>
          <p>
            The materials appearing on the Platform are not comprehensive and are for general
            educational purposes only. Practical Informatics LLC does not warrant or make any
            representations concerning the accuracy, likely results, or reliability of the use of
            the materials on the Platform, or otherwise relating to such materials or on any
            resources linked to the Platform. Completing our training does not guarantee
            employment or professional certification.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Links</h2>
          <p>
            Practical Informatics LLC has not reviewed all of the sites linked to the Platform and
            is not responsible for the contents of any such linked site. The inclusion of any link
            does not imply endorsement, approval, or control by Practical Informatics LLC of the
            site. Use of any such linked site is at your own risk and we strongly advise you make
            your own investigations with respect to the suitability of those sites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Right to Terminate</h2>
          <p>
            We may suspend or terminate your right to use the Platform and terminate these Terms
            of Service immediately upon written notice to you for any breach of these Terms of
            Service. Upon termination, your right to use the Platform will cease immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Severance</h2>
          <p>
            Any term of these Terms of Service which is wholly or partially void or unenforceable
            is severed to the extent that it is void or unenforceable. The validity of the
            remainder of these Terms of Service is not affected.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Governing Law</h2>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of
            California. You irrevocably submit to the exclusive jurisdiction of the courts in that
            State or location.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Contact Us</h2>
          <p>
            For any questions or concerns regarding these Terms of Service, you may contact us
            using the following details:
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
          <Link to="/cookies" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Cookie Policy</Link>
          <Link to="/acceptable-use" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Acceptable Use</Link>
          <Link to="/returns" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Returns & Refunds</Link>
        </div>
      </div>
    </article>
  );
}
