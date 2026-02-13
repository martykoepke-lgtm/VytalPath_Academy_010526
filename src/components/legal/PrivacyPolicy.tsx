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
          <p className="text-sm text-gray-500">Effective: February 12, 2026 &middot; Last updated: February 12, 2026</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <p>
          Your privacy is important to us. It is Practical Informatics LLC's policy to respect your privacy
          and comply with any applicable law and regulation regarding any personal information we may collect
          about you, including across our website, VytalPath Academy, and other sites we own and operate.
        </p>
        <p>
          Personal information is any information about you which can be used to identify you. This includes
          information about you as a person (such as name, address, and date of birth), your devices, payment
          details, and even information about how you use a website or online service.
        </p>
        <p>
          In the event our site contains links to third-party sites and services, please be aware that those
          sites and services have their own privacy policies. After following a link to any third-party content,
          you should read their posted privacy policy information about how they collect and use personal
          information. This Privacy Policy does not apply to any of your activities after you leave our site.
        </p>

        {/* ── Information We Collect ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Information We Collect</h2>
          <p>
            Information we collect falls into one of two categories: "voluntarily provided" information and
            "automatically collected" information.
          </p>
          <p>
            "Voluntarily provided" information refers to any information you knowingly and actively provide us
            when using or participating in any of our services and promotions.
          </p>
          <p>
            "Automatically collected" information refers to any information automatically sent by your devices
            in the course of accessing our products and services.
          </p>
        </section>

        {/* ── Personal Information ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Personal Information</h2>
          <p>
            We may ask for personal information — for example, when you create an account, subscribe to our
            platform, or contact us — which may include one or more of the following:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name</li>
            <li>Email</li>
            <li>Payment and billing information (processed securely through Stripe)</li>
          </ul>
        </section>

        {/* ── Legitimate Reasons ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Legitimate Reasons for Processing Your Personal Information</h2>
          <p>
            We only collect and use your personal information when we have a legitimate reason for doing so.
            In which instance, we only collect personal information that is reasonably necessary to provide our
            services to you.
          </p>
        </section>

        {/* ── Collection and Use ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Collection and Use of Information</h2>
          <p>We may collect personal information from you when you do any of the following on our website:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create an account and subscribe to VytalPath Academy</li>
            <li>Complete lessons, quizzes, or interact with the EHR Practice Lab</li>
            <li>Use the AI Study Assistant</li>
            <li>Generate a certificate of completion</li>
            <li>Use a mobile device or web browser to access our content</li>
            <li>Contact us via email or on any similar technologies</li>
          </ul>

          <p className="mt-4">
            We may collect, hold, use, and disclose information for the following purposes, and personal
            information will not be further processed in a manner that is incompatible with these purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide you with our platform's core features and services</li>
            <li>To process your subscription and payments through Stripe</li>
            <li>To track your learning progress and competency development</li>
            <li>To generate your certificate of completion</li>
            <li>To power the AI Study Assistant with relevant learning context</li>
            <li>To manage organization memberships and invitations</li>
            <li>To contact and communicate with you</li>
            <li>For internal record keeping and administrative purposes</li>
            <li>To comply with our legal obligations and resolve any disputes that we may have</li>
          </ul>
        </section>

        {/* ── AI Study Assistant ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">AI Study Assistant</h2>
          <p>VytalPath Academy includes an AI-powered Study Assistant. When you interact with this feature:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your messages are sent to our AI service provider (Anthropic) to generate responses</li>
            <li>Conversations include your current learning context (section, lesson, progress) to provide relevant help</li>
            <li>AI conversations are not permanently stored and are not used to train AI models</li>
            <li>The AI assistant is for learning purposes only and should not be relied upon as professional medical or legal advice</li>
            <li>You should never submit real patient information, protected health information (PHI), or other sensitive data to the AI assistant</li>
          </ul>
        </section>

        {/* ── Security ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Security of Your Personal Information</h2>
          <p>
            When we collect and process personal information, and while we retain this information, we will
            protect it within commercially acceptable means to prevent loss and theft, as well as unauthorised
            access, disclosure, copying, use or modification.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Authentication & database:</strong> Account data is stored securely using Supabase with row-level security (RLS) policies</li>
            <li><strong>Payments:</strong> All payment processing is handled by Stripe, a PCI-DSS compliant payment processor — we never store your full credit card number</li>
            <li><strong>Local storage:</strong> Learning progress and practice session data are stored in your browser's local storage on your device</li>
            <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using TLS/SSL</li>
          </ul>
          <p className="mt-2">
            Although we will do our best to protect the personal information you provide to us, we advise that
            no method of electronic transmission or storage is 100% secure and no one can guarantee absolute
            data security.
          </p>
          <p>
            You are responsible for selecting any password and its overall security strength, ensuring the
            security of your own information within the bounds of our services.
          </p>
        </section>

        {/* ── How Long We Keep Info ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">How Long We Keep Your Personal Information</h2>
          <p>
            We keep your personal information only for as long as we need to. This time period may depend on
            what we are using your information for, in accordance with this privacy policy. For example, if you
            have provided us with personal information such as an email address when creating an account, we
            may retain this information for the duration of your account remaining active as well as for our
            own records so we may effectively address similar enquiries in future. If your personal information
            is no longer required for this purpose, we will delete it or make it anonymous by removing all
            details that identify you.
          </p>
          <p>
            However, if necessary, we may retain your personal information for our compliance with a legal,
            accounting, or reporting obligation or for archiving purposes in the public interest, scientific,
            or historical research purposes or statistical purposes.
          </p>
        </section>

        {/* ── Children's Privacy ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Children's Privacy</h2>
          <p>
            We do not aim any of our products or services directly at children under the age of 13 and we do
            not knowingly collect personal information about children under 13. VytalPath Academy is intended
            for users who are at least 18 years old or the age of majority in their jurisdiction. If you believe
            we have collected information from a child under 13, please contact us immediately.
          </p>
        </section>

        {/* ── Disclosure to Third Parties ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Disclosure of Personal Information to Third Parties</h2>
          <p>We may disclose personal information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A parent, subsidiary or affiliate of our company</li>
            <li>Third-party service providers for the purpose of enabling them to provide their services, including (without limitation) IT service providers, data storage, hosting and server providers, payment systems operators, and professional advisors</li>
            <li>Our employees, contractors, and/or related entities</li>
            <li>Organization administrators, if you access VytalPath Academy through an organization — your admin may see your name, email, and learning progress</li>
            <li>Courts, tribunals, regulatory authorities, and law enforcement officers, as required by law, in connection with any actual or prospective legal proceedings, or in order to establish, exercise, or defend our legal rights</li>
            <li>An entity that buys, or to which we transfer all or substantially all of our assets and business</li>
          </ul>

          <p className="mt-4">Third parties we currently use include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase</strong> — Authentication, database, and file storage</li>
            <li><strong>Stripe</strong> — Payment processing and subscription management</li>
            <li><strong>Anthropic (Claude)</strong> — AI Study Assistant responses</li>
            <li><strong>Vercel</strong> — Platform hosting and deployment</li>
          </ul>
        </section>

        {/* ── Your Rights ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Your Rights and Controlling Your Personal Information</h2>

          <p>
            <strong>Your choice:</strong> By providing personal information to us, you understand we will collect,
            hold, use, and disclose your personal information in accordance with this privacy policy. You do not
            have to provide personal information to us, however, if you do not, it may affect your use of our
            website or the products and/or services offered on or through it.
          </p>
          <p>
            <strong>Information from third parties:</strong> If we receive personal information about you from a
            third party, we will protect it as set out in this privacy policy. If you are a third party providing
            personal information about somebody else, you represent and warrant that you have such person's
            consent to provide the personal information to us.
          </p>
          <p>
            <strong>Access:</strong> You may request details of the personal information that we hold about you.
          </p>
          <p>
            <strong>Correction:</strong> If you believe that any information we hold about you is inaccurate, out
            of date, incomplete, irrelevant, or misleading, please contact us using the details provided in this
            privacy policy. We will take reasonable steps to correct any information found to be inaccurate,
            incomplete, misleading, or out of date.
          </p>
          <p>
            <strong>Non-discrimination:</strong> We will not discriminate against you for exercising any of your
            rights over your personal information. Unless your personal information is required to provide you
            with a particular service or offer, we will not deny you goods or services and/or charge you
            different prices or rates for goods or services, including through granting discounts or other
            benefits, or imposing penalties, or provide you with a different level or quality of goods or services.
          </p>
          <p>
            <strong>Notification of data breaches:</strong> We will comply with laws applicable to us in respect
            of any data breach.
          </p>
          <p>
            <strong>Complaints:</strong> If you believe that we have breached a relevant data protection law and
            wish to make a complaint, please contact us using the details below and provide us with full details
            of the alleged breach. We will promptly investigate your complaint and respond to you, in writing,
            setting out the outcome of our investigation and the steps we will take to deal with your complaint.
            You also have the right to contact a regulatory body or data protection authority in relation to your
            complaint.
          </p>
          <p>
            <strong>Opt out of communications:</strong> You may opt out of receiving communications from us at
            any time. Please be aware that even if you opt out of communications, we may still contact you when
            necessary for non-promotional purposes, including, but not limited to, managing your account,
            responding to service inquiries, or providing important updates related to your use of our services.
          </p>
        </section>

        {/* ── Cookies ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Use of Cookies</h2>
          <p>
            We use "cookies" to collect information about you and your activity across our site. A cookie is a
            small piece of data that our website stores on your computer, and accesses each time you visit, so
            we can understand how you use our site. This helps us serve you content based on preferences you
            have specified.
          </p>
          <p>
            Please refer to our <Link to="/cookies" className="text-blue-600 hover:text-blue-700">Cookie Policy</Link> for
            more information.
          </p>
        </section>

        {/* ── Business Transfers ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Business Transfers</h2>
          <p>
            If we or our assets are acquired, or in the unlikely event that we go out of business or enter
            bankruptcy, we would include data, including your personal information, among the assets transferred
            to any parties who acquire us. You acknowledge that such transfers may occur, and that any parties
            who acquire us may, to the extent permitted by applicable law, continue to use your personal
            information according to this policy, which they will be required to assume as it is the basis for
            any ownership or use rights we have over such information.
          </p>
        </section>

        {/* ── Limits ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Limits of Our Policy</h2>
          <p>
            Our website may link to external sites that are not operated by us. Please be aware that we have no
            control over the content and policies of those sites, and cannot accept responsibility or liability
            for their respective privacy practices.
          </p>
        </section>

        {/* ── Changes ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Changes to This Policy</h2>
          <p>
            At our discretion, we may change our privacy policy to reflect updates to our business processes,
            current acceptable practices, or legislative or regulatory changes. If we decide to change this
            privacy policy, we will post the changes here at the same link by which you are accessing this
            privacy policy.
          </p>
          <p>
            If required by law, we will get your permission or give you the opportunity to opt in to or opt out
            of, as applicable, any new uses of your personal information.
          </p>
        </section>

        {/* ── U.S. States Privacy Law ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Additional Disclosures for U.S. States Privacy Law Compliance</h2>
          <p>
            The following section includes provisions that comply with the privacy laws of these states
            (California, Colorado, Delaware, Florida, Virginia, and Utah) and is applicable only to the
            residents of those states. Specific references to a particular state (in a heading or in the text)
            are only a reference to that state's law and applies only to that state's residents. Non-state
            specific language applies to all of the states listed above.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-6 mb-2">Do Not Track</h3>
          <p>
            Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to have
            your online activities tracked. At this time, we do not respond to browser "Do Not Track" signals.
          </p>
          <p>
            We adhere to the standards outlined in this privacy policy, ensuring we collect and process personal
            information lawfully, fairly, transparently, and with legitimate, legal reasons for doing so.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-6 mb-2">Cookies and Pixels</h3>
          <p>
            At all times, you may decline cookies from our site if your browser permits. Most browsers allow you
            to activate settings on your browser to refuse the setting of all or some cookies. Accordingly, your
            ability to limit cookies is based only on your browser's capabilities. Please refer to
            the <Link to="/cookies" className="text-blue-600 hover:text-blue-700">Cookie Policy</Link> section of
            this privacy policy for more information.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-6 mb-2">California Privacy Laws — CCPA</h3>
          <p>
            Under California Civil Code Section 1798.83, if you live in California and your business
            relationship with us is mainly for personal, family, or household purposes, you may ask us about
            the information we release to other organizations for their marketing purposes. In accordance with
            your right to non-discrimination, we may offer you certain financial incentives permitted by the
            California Consumer Privacy Act, and the California Privacy Rights Act (collectively, CCPA) that can
            result in different prices, rates, or quality levels for the goods or services we provide. Any
            CCPA-permitted financial incentive we offer will reasonably relate to the value of your personal
            information, and we will provide written terms that describe clearly the nature of such an offer.
            Participation in a financial incentive program requires your prior opt-in consent, which you may
            revoke at any time.
          </p>
          <p>
            To make such a request, please contact us using the details provided in this privacy policy with
            "Request for California privacy information" in the subject line. You may make this type of request
            once every calendar year.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-6 mb-2">California Notice of Collection</h3>
          <p>In the past 12 months, we have collected the following categories of personal information enumerated in the CCPA:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Identifiers,</strong> such as name, email address, account name, IP address, and an ID or number assigned to your account.</li>
            <li><strong>Customer records,</strong> such as billing address and credit or debit card data (processed through Stripe).</li>
            <li><strong>Commercial information,</strong> such as subscription history and purchases.</li>
          </ul>
          <p className="mt-2">
            We collect and use these categories of personal information for the business purposes described in
            the "Collection and Use of Information" section, including to provide and manage our Service.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-6 mb-2">Right to Know and Delete</h3>
          <p>
            You have rights to delete your personal information we collected and know certain information about
            our data practices in the preceding 12 months. In particular, you have the right to request the
            following from us:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The categories of personal information we have collected about you</li>
            <li>The categories of sources from which the personal information was collected</li>
            <li>The categories of personal information about you we disclosed for a business purpose or sold</li>
            <li>The categories of third parties to whom the personal information was disclosed for a business purpose or sold</li>
            <li>The business or commercial purpose for collecting or selling the personal information</li>
            <li>The specific pieces of personal information we have collected about you</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us using the details provided in this privacy policy.
          </p>

          <h3 className="text-base font-medium text-gray-800 mt-6 mb-2">Shine the Light</h3>
          <p>
            In addition to the rights discussed above, you have the right to request information from us
            regarding the manner in which we share certain personal information as defined by applicable statute
            with third parties and affiliates for their own direct marketing purposes.
          </p>
          <p>
            To receive this information, send us a request using the contact details provided in this privacy
            policy. Requests must include "Privacy Rights Request" in the first line of the description and
            include your name, street address, city, state, and ZIP code.
          </p>
        </section>

        {/* ── Contact ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Contact Us</h2>
          <p>
            For any questions or concerns regarding your privacy, you may contact us using the following details:
          </p>
          <p className="mt-2">
            <strong>Practical Informatics LLC</strong><br />
            <a href="mailto:contact@practicalinformatics.com" className="text-blue-600 hover:text-blue-700">contact@practicalinformatics.com</a>
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
