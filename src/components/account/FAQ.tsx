import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How long do I have access after I subscribe?',
    a: 'Your subscription gives you 1 year of access to all VytalPath Academy content. This includes all training sections, the EHR Practice Lab, job readiness tools, and any new content added during your subscription period.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes. You can cancel anytime from your Account page. Refunds are based on how far you are in the program — see our Cancellation & Refund Policy for the full breakdown.',
  },
  {
    q: 'What happens when my subscription expires?',
    a: 'When your subscription period ends, you will no longer be able to access course content. Your progress is saved, so if you resubscribe, you can pick up where you left off.',
  },
  {
    q: 'Is there a certificate of completion?',
    a: 'Yes. Once you complete all lessons and pass all quizzes, you can generate a certificate of completion. Your name will be permanently displayed on the certificate, so make sure to enter it correctly.',
  },
  {
    q: 'What is the EHR Practice Lab?',
    a: 'The EHR Practice Lab is a built-in simulation of a Practice Management / Electronic Health Record system. You can practice registering patients, scheduling appointments, checking patients in and out, and managing encounters — all without needing access to a real EHR system.',
  },
  {
    q: 'How many quizzes are there, and what score do I need to pass?',
    a: 'There are 18 quizzes across the training sections. Each quiz requires an 80% score to pass, and you get up to 3 attempts per quiz.',
  },
  {
    q: 'Can my employer purchase access for our team?',
    a: 'Yes. We offer volume pricing for organizations starting at $245/seat for teams of 6-15. Contact us for details on team and clinic pricing.',
  },
  {
    q: 'Is this program a certification?',
    a: 'VytalPath Academy is a competency-based training program, not a certification exam. Our curriculum maps to 101 knowledge statements covering the skills needed for healthcare front office roles. The certificate of completion demonstrates that you have completed comprehensive training.',
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
