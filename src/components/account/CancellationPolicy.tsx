import { Shield, Clock } from 'lucide-react';

export function CancellationPolicy() {
  return (
    <div className="space-y-6">
      {/* 3-Day Guarantee */}
      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
        <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-900">3-Day No-Risk Guarantee</p>
          <p className="text-xs text-green-700 mt-1">
            Cancel within 3 days of your purchase for a full $327 refund — no questions asked.
          </p>
        </div>
      </div>

      {/* After 3 days */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-900">After 3 Days</p>
          <p className="text-xs text-gray-500 mt-1">
            You can still cancel anytime, but no refund will be issued. Access ends immediately upon cancellation.
          </p>
        </div>
      </div>

      {/* Fine print */}
      <p className="text-xs text-gray-400 leading-relaxed">
        Refunds are processed to your original payment method and typically appear within
        5-10 business days. Refund eligibility is determined server-side based on your
        Stripe payment date.
      </p>
    </div>
  );
}
