import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  link?: { to: string; label: string };
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'How long do I have access after I subscribe?',
    a: 'Your subscription gives you 1 year of access to all VytalPath Academy content. This includes all learning sections, the EHR Practice Lab, practice tools, and any new content added during your subscription period.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes. You can cancel anytime from the Billing tab on your Account page. If you cancel within the first 3 days, you get a full refund. After 3 days, you can still cancel but no refund will be issued.',
  },
  {
    q: 'What is your refund policy?',
    a: 'We offer a 3-day no-risk guarantee. Cancel within 3 days of your purchase for a full $327 refund — no questions asked. After 3 days, cancellations do not include a refund. Refunds are processed to your original payment method and typically appear within 5-10 business days.',
    link: { to: '/returns', label: 'View full Returns & Refund Policy' },
  },
  {
    q: 'What happens when my subscription expires?',
    a: 'When your subscription period ends, you will no longer be able to access course content. Your progress is saved, so if you resubscribe, you can pick up where you left off.',
  },
  {
    q: 'What is the EHR Practice Lab?',
    a: 'The EHR Practice Lab is a built-in simulation of a Practice Management / Electronic Health Record system. You can practice registering patients, scheduling appointments, checking patients in and out, and managing encounters — all without needing access to a real EHR system.',
  },
  {
    q: 'How many knowledge checks are there?',
    a: 'There are 18 knowledge checks across the learning sections. We suggest aiming for 80% or higher, but you can retake them as many times as you like.',
  },
  {
    q: 'Can my employer purchase access for our team?',
    a: 'Yes. We offer volume pricing for organizations starting at $245/seat for teams of 6-15. Contact us for details on team and clinic pricing.',
  },
  {
    q: 'Is this a certification program?',
    a: 'No — VytalPath Academy is an educational platform, not a certification or accredited program. Our content covers topics relevant to healthcare front office operations across 101 knowledge areas.',
  },
  {
    q: 'What data do you collect about me?',
    a: 'We collect your email and name for your account, payment information processed through Stripe, and learning progress stored locally in your browser. We do not sell your data to third parties. AI Study Assistant conversations are not permanently stored.',
    link: { to: '/privacy', label: 'View full Privacy Policy' },
  },
  {
    q: 'Does the platform use cookies?',
    a: "We use minimal cookies — only what is needed for authentication. Your learning progress is stored in your browser's local storage, not in cookies. We do not use advertising or tracking cookies.",
    link: { to: '/cookies', label: 'View full Cookie Policy' },
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 pr-4">{item.q}</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                {item.link && (
                  <Link
                    to={item.link.to}
                    className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {item.link.label} &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
