import { useState } from 'react';
import { X, Play, ChevronDown, ChevronRight, Printer, BookOpen, ClipboardList } from 'lucide-react';

// Types for structured SOP content
export interface SOPCallout {
  type: 'info' | 'warning' | 'tip';
  text: string;
}

export interface SOPStep {
  number: number;
  title: string;
  details: string[];
  callout?: SOPCallout;
}

export interface SOPContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  companionVideoUrl?: string;
  companionVideoTitle?: string;
  steps: SOPStep[];
  quickReference: string[]; // Condensed version for desk reference
}

interface SOPModalProps {
  sop: SOPContent;
  onClose: () => void;
}

type ViewMode = 'study' | 'reference';

export function SOPModal({ sop, onClose }: SOPModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('study');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSteps(new Set(sop.steps.map((s) => s.number)));
  };

  const collapseAll = () => {
    setExpandedSteps(new Set());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-100">
          <div className="flex items-center justify-between p-5">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">{sop.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{sop.description}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* View Toggle & Actions */}
          <div className="px-5 pb-4 flex items-center justify-between">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              <button
                onClick={() => setViewMode('study')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'study'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Study Mode
              </button>
              <button
                onClick={() => setViewMode('reference')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'reference'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Quick Reference
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'study' ? (
            <div className="p-5">
              {/* Companion Video Link */}
              {sop.companionVideoUrl && (
                <a
                  href={sop.companionVideoUrl}
                  className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center gap-4 hover:border-blue-200 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Watch companion video first</p>
                    <p className="text-xs text-blue-600">{sop.companionVideoTitle || 'Training Video'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </a>
              )}

              {/* Expand/Collapse Controls */}
              <div className="flex items-center justify-end gap-2 mb-4">
                <button
                  onClick={expandAll}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Expand all
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={collapseAll}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Collapse all
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {sop.steps.map((step) => {
                  const isExpanded = expandedSteps.has(step.number);
                  return (
                    <div
                      key={step.number}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleStep(step.number)}
                        className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {step.number}
                        </div>
                        <span className="flex-1 font-medium text-gray-900">{step.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-12">
                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Callout */}
                            {step.callout && (
                              <div
                                className={`mt-4 p-3 rounded-lg text-sm ${
                                  step.callout.type === 'warning'
                                    ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                    : step.callout.type === 'tip'
                                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                                    : 'bg-blue-50 border border-blue-200 text-blue-800'
                                }`}
                              >
                                <span className="font-medium">
                                  {step.callout.type === 'warning' && 'Important: '}
                                  {step.callout.type === 'tip' && 'Tip: '}
                                  {step.callout.type === 'info' && 'Note: '}
                                </span>
                                {step.callout.text}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Quick Reference / Desk Reference View */
            <div className="p-5">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{sop.title}</h3>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Quick Reference</span>
                </div>

                <ol className="space-y-3">
                  {sop.quickReference.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-900 text-white rounded flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-gray-700 pt-0.5">{item}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400 text-center">
                    Print this page for a desk reference
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
