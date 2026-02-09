import { Shield, Clock, BookOpen } from 'lucide-react';
import { REFUND_TIERS } from '../../utils/refundPolicy';

const tierColors = {
  green: 'bg-green-50 border-green-200 text-green-800',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  orange: 'bg-orange-50 border-orange-200 text-orange-800',
  red: 'bg-red-50 border-red-200 text-red-800',
};

const dotColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
};

export function CancellationPolicy() {
  return (
    <div className="space-y-6">
      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">3-Day Guarantee</p>
            <p className="text-xs text-blue-700 mt-1">Full refund within 3 days of payment — no questions asked.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
          <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-900">Progress-Based</p>
            <p className="text-xs text-purple-700 mt-1">After 3 days, your refund is based on how much of the course you've completed.</p>
          </div>
        </div>
      </div>

      {/* Tier breakdown */}
      <div className="space-y-2">
        {REFUND_TIERS.map((tier) => (
          <div
            key={tier.label}
            className={`flex items-center justify-between p-3 border rounded-lg ${tierColors[tier.color]}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${dotColors[tier.color]}`} />
              <div>
                <span className="text-sm font-medium">{tier.label}</span>
                <span className="text-xs opacity-75 ml-2">— {tier.condition}</span>
              </div>
            </div>
            <span className="text-sm font-semibold">
              {tier.amount > 0 ? `$${tier.amount}` : '$0'}
            </span>
          </div>
        ))}
      </div>

      {/* Fine print */}
      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
        <Shield className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Refunds are calculated automatically based on your Stripe payment date and course
          completion percentage at the time of cancellation. Refunds are processed to your
          original payment method and typically appear within 5-10 business days. Access
          to course content ends immediately upon cancellation.
        </p>
      </div>
    </div>
  );
}
