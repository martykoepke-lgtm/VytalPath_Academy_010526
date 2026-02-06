import { CreditCard } from 'lucide-react';

export function InsuranceCardExplorer() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sample Insurance Card</h3>
            <p className="text-sm text-gray-500">Front and back of a typical insurance card</p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="p-4">
        <img
          src="/images/insurance/sample-insurance-card.png"
          alt="Sample BlueCross BlueShield Insurance Card - Front and Back"
          className="w-full h-auto rounded-lg border border-gray-200"
        />
      </div>
    </div>
  );
}
