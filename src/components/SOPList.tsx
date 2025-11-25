import { ChevronRight, Lightbulb } from 'lucide-react';
import type { SOP } from '../types/sop';
import { organizeSOPsByCategory, getPatientTypeLabel, getPatientTypeBadgeColor, getSOPIcon } from '../utils/sopOrganization';

interface SOPListProps {
  sops: SOP[];
  onSelectSOP: (slug: string) => void;
}

export function SOPList({ sops, onSelectSOP }: SOPListProps) {
  const categoryGroups = organizeSOPsByCategory(sops);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Front Office Common Workflows</h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Learn the typical steps and concepts behind common clinic procedures so you can follow along when your trainer demonstrates your organization's specific processes
        </p>
      </div>

      <div className="space-y-8">
        {categoryGroups.map((group) => {
          const CategoryIcon = group.icon;
          return (
            <div key={group.key} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <CategoryIcon className="w-8 h-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">{group.title}</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.sops.map((sop) => {
                    const SOPIcon = getSOPIcon(sop.slug);
                    return (
                      <button
                        key={sop.id}
                        onClick={() => onSelectSOP(sop.slug)}
                        className="bg-gray-50 rounded-lg p-5 hover:bg-indigo-50 hover:shadow-md transition-all text-left group border-2 border-transparent hover:border-indigo-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <SOPIcon className="w-6 h-6 text-indigo-600" />
                          </div>
                          <ChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                          {sop.title}
                        </h3>
                        {sop.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{sop.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-indigo-600 font-medium">{sop.steps.length} steps</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPatientTypeBadgeColor(sop.patient_type)}`}>
                            {getPatientTypeLabel(sop.patient_type)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-8 border-l-4 border-indigo-500">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-indigo-600" />
          How to Use These Workflows
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span>Review workflows <strong>before</strong> your training sessions to familiarize yourself with the concepts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span>Check off steps as you learn them to track your understanding</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span>These are <strong>general workflows</strong> - your clinic will have its own specific variations, systems, and policies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span>
              Think of these as the "textbook version" that helps you understand what your trainer is teaching you about your clinic's actual procedures
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
