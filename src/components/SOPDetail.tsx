import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import type { SOP } from '../types/sop';
import { getSOPProgress, toggleStepCompletion, resetSOPProgress } from '../services/sopService';
import { getPatientTypeLabel, getPatientTypeBadgeColor, getSOPIcon } from '../utils/sopOrganization';

interface SOPDetailProps {
  sop: SOP;
  onBack: () => void;
}

export function SOPDetail({ sop, onBack }: SOPDetailProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [sop.id]);

  const loadProgress = async () => {
    setIsLoading(true);
    const progress = await getSOPProgress(sop.id);
    setCompletedSteps(progress);
    setIsLoading(false);
  };

  const handleToggleStep = async (stepIndex: number) => {
    const newProgress = await toggleStepCompletion(sop.id, stepIndex);
    setCompletedSteps(newProgress);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all progress for this SOP?')) {
      await resetSOPProgress(sop.id);
      setCompletedSteps([]);
    }
  };

  const progressPercentage = Math.round((completedSteps.length / sop.steps.length) * 100);
  const SOPIcon = getSOPIcon(sop.slug);

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-teal-600 hover:text-teal-800 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={20} />
        Back to All Workflows
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <SOPIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{sop.title}</h1>
                <span className={`text-xs px-3 py-1 rounded-full ${getPatientTypeBadgeColor(sop.patient_type)}`}>
                  {getPatientTypeLabel(sop.patient_type)}
                </span>
              </div>
              {sop.description && <p className="text-gray-600 text-lg">{sop.description}</p>}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            title="Reset progress"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <p className="text-2xl font-bold text-teal-600">
              {completedSteps.length} / {sop.steps.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Complete</p>
            <p className="text-2xl font-bold text-teal-600">{progressPercentage}%</p>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sop.steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            return (
              <div
                key={index}
                className={`bg-white border-2 rounded-lg p-6 transition-all ${
                  isCompleted
                    ? 'border-green-300 bg-green-50 shadow-sm'
                    : 'border-gray-200 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleStep(index)}
                    className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="text-green-600" size={28} />
                    ) : (
                      <Circle className="text-gray-400 hover:text-teal-500" size={28} />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-3 ${
                        isCompleted ? 'text-green-800' : 'text-gray-800'
                      }`}
                    >
                      Step {index + 1}: {step.title}
                    </h3>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className={`flex items-start gap-3 ${
                            isCompleted ? 'text-green-900' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-teal-600 mt-1 flex-shrink-0">▸</span>
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-800">
          <strong className="text-blue-900">Important Note:</strong> These workflows provide
          general guidance and should be adapted to your clinic's specific policies, EHR/PMS
          system, and state regulations. Always follow your facility's protocols when they differ
          from these general guidelines.
        </p>
      </div>
    </div>
  );
}
