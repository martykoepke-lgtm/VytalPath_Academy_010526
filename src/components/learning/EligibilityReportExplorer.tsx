import { FileSearch } from 'lucide-react';

export function EligibilityReportExplorer() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sample Eligibility Report</h3>
            <p className="text-sm text-gray-500">How eligibility information appears in an EHR system</p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="p-4">
        <img
          src="/images/insurance/sample-eligibility-report.png"
          alt="Sample EHR Eligibility Verification Report"
          className="w-full h-auto rounded-lg border border-gray-200"
        />
      </div>
    </div>
  );
}
