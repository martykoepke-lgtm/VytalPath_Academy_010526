import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Users } from 'lucide-react';
import { getAllSOPs } from '../../services/sopService';
import { organizeSOPsByCategory } from '../../utils/sopOrganization';
import type { SOP } from '../../types/sop';

export function SOPLibrary() {
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadSOPs();
  }, []);

  const loadSOPs = async () => {
    try {
      const data = await getAllSOPs();
      setSOPs(data);
    } catch (error) {
      console.error('Failed to load SOPs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const organizedSOPs = organizeSOPsByCategory(sops);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <img src="/icons/workflow-icon.png" alt="Workflows" className="w-14 h-14" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Common Workflows</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Step-by-step guides for daily front office operations. Use these as reference while you work.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {sops.length} workflows
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            For front office staff
          </span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> These workflows are designed as quick reference guides. For comprehensive training, complete the{' '}
          <Link to="/courses" className="underline hover:text-blue-900">
            Front Office Specialist course
          </Link>.
        </p>
      </div>

      {/* SOP Categories */}
      <div className="space-y-4">
        {organizedSOPs.map((category) => {
          const isExpanded = expandedCategory === category.key;
          const Icon = category.icon;

          return (
            <div
              key={category.key}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.key)}
                className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-500">
                    {category.sops.length} workflow{category.sops.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>

              {/* SOPs List */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {category.sops.map((sop) => (
                    <Link
                      key={sop.id}
                      to={`/workflows/${sop.slug}`}
                      className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{sop.title}</h4>
                        {sop.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">{sop.description}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-3">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {sop.steps.length} steps
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sops.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No workflows available yet.</p>
        </div>
      )}
    </div>
  );
}
