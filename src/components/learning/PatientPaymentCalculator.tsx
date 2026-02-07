import { useState, useEffect } from 'react';
import {
  Calculator, ChevronRight, ChevronLeft, CheckCircle, XCircle,
  RotateCcw, Eye, Trophy, DollarSign, Lightbulb
} from 'lucide-react';
import { paymentScenarios, type PaymentScenario } from '../../data/paymentCalculatorScenarios';

const STORAGE_KEY = 'vytalpath_payment_calc';

interface StoredProgress {
  completedScenarios: string[];
  bestScores: Record<string, number>; // scenarioId -> percentage correct
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { completedScenarios: [], bestScores: {} };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

const difficultyColors = {
  beginner: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Beginner' },
  intermediate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Intermediate' },
  advanced: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Advanced' },
};

export function PatientPaymentCalculator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);

  const scenario = paymentScenarios[currentIndex];
  const allFilled = scenario.steps.every((_, i) => answers[i] !== undefined && answers[i] !== '');
  const completedCount = progress.completedScenarios.length;

  useEffect(() => {
    // Reset state when switching scenarios
    setAnswers({});
    setSubmitted(false);
    setShowWalkthrough(false);
    setShowHint(null);
  }, [currentIndex]);

  const handleSubmit = () => {
    setSubmitted(true);

    const correctCount = scenario.steps.filter(
      (step, i) => Math.abs(parseFloat(answers[i] || '0') - step.correctValue) < 0.01
    ).length;

    const percentage = Math.round((correctCount / scenario.steps.length) * 100);

    const newProgress = { ...progress };
    if (!newProgress.completedScenarios.includes(scenario.id)) {
      newProgress.completedScenarios.push(scenario.id);
    }
    const prevBest = newProgress.bestScores[scenario.id] || 0;
    if (percentage > prevBest) {
      newProgress.bestScores[scenario.id] = percentage;
    }
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setShowWalkthrough(false);
    setShowHint(null);
  };

  const isStepCorrect = (stepIndex: number) => {
    const val = parseFloat(answers[stepIndex] || '0');
    return Math.abs(val - scenario.steps[stepIndex].correctValue) < 0.01;
  };

  const totalCorrect = submitted
    ? scenario.steps.filter((_, i) => isStepCorrect(i)).length
    : 0;
  const allCorrect = totalCorrect === scenario.steps.length;

  const diff = difficultyColors[scenario.difficulty];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Patient Payment Calculator</h2>
            <p className="text-sm text-gray-500">Calculate what the patient owes — step by step</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {completedCount}/{paymentScenarios.length} completed
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {paymentScenarios.map((s, i) => {
          const isComplete = progress.completedScenarios.includes(s.id);
          const isCurrent = i === currentIndex;
          const sDiff = difficultyColors[s.difficulty];
          return (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                isCurrent
                  ? 'bg-blue-600 text-white border-blue-600'
                  : isComplete
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : `${sDiff.bg} ${sDiff.text} ${sDiff.border} hover:opacity-80`
              }`}
            >
              {isComplete && !isCurrent && <CheckCircle className="w-3.5 h-3.5 inline mr-1" />}
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Scenario Card */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
        {/* Scenario Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
              {diff.label}
            </span>
            <span className="text-xs text-gray-400">Scenario {currentIndex + 1} of {paymentScenarios.length}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {scenario.patientName} — {scenario.visitType}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>

          {/* Plan Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <PlanDetail label="Plan Type" value={scenario.planType} />
            <PlanDetail label="Deductible" value={`$${scenario.deductible.toLocaleString()}`} sub={`$${scenario.deductibleMet.toLocaleString()} met`} />
            {scenario.coinsuranceRate > 0 && (
              <PlanDetail label="Coinsurance" value={`${Math.round((1 - scenario.coinsuranceRate) * 100)}/${Math.round(scenario.coinsuranceRate * 100)}`} />
            )}
            {scenario.copay > 0 && (
              <PlanDetail label="Copay" value={`$${scenario.copay}`} />
            )}
            <PlanDetail label="Visit Cost" value={`$${scenario.visitCost.toLocaleString()}`} highlight />
            <PlanDetail label="OOP Max" value={`$${scenario.oopMax.toLocaleString()}`} sub={`$${scenario.oopMet.toLocaleString()} met`} />
          </div>
        </div>

        {/* Calculation Steps */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Calculate Step by Step</h4>
          <div className="space-y-4">
            {scenario.steps.map((step, i) => {
              const correct = submitted && isStepCorrect(i);
              const incorrect = submitted && !isStepCorrect(i);

              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {step.label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={answers[i] ?? ''}
                          onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                          disabled={submitted}
                          placeholder="0.00"
                          className={`w-full pl-7 pr-10 py-2.5 rounded-xl border text-sm transition-all duration-300 ${
                            correct
                              ? 'border-green-300 bg-green-50 text-green-800'
                              : incorrect
                                ? 'border-red-300 bg-red-50 text-red-800'
                                : 'border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                          }`}
                        />
                        {submitted && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {correct ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {!submitted && (
                      <button
                        onClick={() => setShowHint(showHint === i ? null : i)}
                        className="flex-shrink-0 mt-6 p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all duration-300"
                        title="Show hint"
                      >
                        <Lightbulb className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Hint */}
                  {showHint === i && !submitted && (
                    <p className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg ml-0">
                      {step.hint}
                    </p>
                  )}

                  {/* Correction */}
                  {incorrect && (
                    <div className="flex items-start gap-2 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-red-700 font-medium">
                          Correct answer: ${step.correctValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                        {' — '}
                        <span className="text-red-600">{step.explanation}</span>
                      </div>
                    </div>
                  )}

                  {/* Correct explanation */}
                  {correct && (
                    <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                      {step.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex items-center gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!allFilled}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                allFilled
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Check Answers
            </button>
          ) : (
            <>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => setShowWalkthrough(!showWalkthrough)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300"
              >
                <Eye className="w-4 h-4" />
                {showWalkthrough ? 'Hide' : 'Show'} Walkthrough
              </button>
            </>
          )}
        </div>

        {/* Result Banner */}
        {submitted && (
          <div className={`mx-6 mb-6 p-4 rounded-2xl ${allCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center gap-3">
              {allCorrect ? (
                <Trophy className="w-5 h-5 text-green-600" />
              ) : (
                <DollarSign className="w-5 h-5 text-amber-600" />
              )}
              <div>
                <p className={`font-medium ${allCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                  {allCorrect
                    ? 'Perfect! You calculated the patient\'s responsibility correctly.'
                    : `${totalCorrect} of ${scenario.steps.length} steps correct. Review the explanations above.`}
                </p>
                {!allCorrect && (
                  <p className="text-sm text-amber-600 mt-0.5">
                    Tip: Work through each step in order — earlier answers feed into later calculations.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Full Walkthrough */}
        {showWalkthrough && submitted && (
          <div className="mx-6 mb-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Step-by-Step Walkthrough
            </h4>
            <ol className="space-y-3">
              {scenario.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {step.label}: ${step.correctValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">{step.explanation}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3 pt-2 border-t border-blue-200">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  =
                </span>
                <p className="text-sm font-medium text-green-800">
                  Total patient responsibility: ${scenario.correctTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </p>
              </li>
            </ol>
          </div>
        )}

        {/* Navigation */}
        <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-100 mt-2 pt-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(paymentScenarios.length - 1, currentIndex + 1))}
            disabled={currentIndex === paymentScenarios.length - 1}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanDetail({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-xl ${highlight ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
