import { useState } from 'react';
import { ChevronRight, Shield, CheckCircle2, XCircle, RotateCcw, Trophy, AlertTriangle } from 'lucide-react';
import { RiskScenario, RiskLevel, RISK_LEVELS } from '../../types/interactive';
import { riskScenarios } from '../../data/interactiveScenarios';

interface RiskMeterProps {
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

const riskLevelOrder: RiskLevel[] = ['safe', 'caution', 'risky', 'violation'];

export function RiskMeter({ onComplete, onBack }: RiskMeterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<RiskLevel | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scenario = riskScenarios[currentIndex];
  const totalScenarios = riskScenarios.length;
  const progress = ((currentIndex + 1) / totalScenarios) * 100;

  const handleSelectLevel = (level: RiskLevel) => {
    if (showFeedback) return;
    setSelectedLevel(level);
  };

  const handleSubmit = () => {
    if (!selectedLevel) return;
    setShowFeedback(true);

    if (selectedLevel === scenario.correctLevel) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalScenarios - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedLevel(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedLevel(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setIsComplete(false);
  };

  const handleFinish = () => {
    onComplete(correctCount, totalScenarios);
  };

  // Completion Screen
  if (isComplete) {
    const percentage = Math.round((correctCount / totalScenarios) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-amber-100">
            <Trophy className="w-10 h-10 text-amber-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Risk Assessment Complete!
          </h2>

          <p className="text-gray-600 mb-6">
            You correctly assessed <span className="font-semibold">{correctCount} of {totalScenarios}</span> scenarios ({percentage}%)
          </p>

          <p className="text-amber-700 bg-amber-50 rounded-lg p-4 mb-6">
            Understanding risk levels helps you make quick decisions in real situations. Keep practicing to sharpen your judgment!
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = selectedLevel === scenario.correctLevel;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Experiences
        </button>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Risk Meter</h1>
          <span className="text-sm text-gray-500">
            Scenario {currentIndex + 1} of {totalScenarios}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scenario Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Scenario Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Assess the Risk</h2>
          </div>
          <p className="text-amber-100">How risky is this situation?</p>
        </div>

        {/* Scenario Description */}
        <div className="p-6 border-b border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-800 text-lg text-center">
              {scenario.description}
            </p>
          </div>
        </div>

        {/* Risk Level Selection */}
        <div className="p-6">
          <p className="text-sm font-medium text-gray-500 mb-4">Select the risk level:</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {riskLevelOrder.map((level) => {
              const config = RISK_LEVELS[level];
              const isSelected = selectedLevel === level;
              const isCorrectLevel = level === scenario.correctLevel;

              let buttonStyle = 'border-gray-200 hover:border-gray-300';
              if (isSelected && !showFeedback) {
                buttonStyle = 'border-2 border-gray-800 bg-gray-50';
              }
              if (showFeedback) {
                if (isCorrectLevel) {
                  buttonStyle = 'border-2 border-green-500 bg-green-50';
                } else if (isSelected && !isCorrectLevel) {
                  buttonStyle = 'border-2 border-red-500 bg-red-50';
                }
              }

              return (
                <button
                  key={level}
                  onClick={() => handleSelectLevel(level)}
                  disabled={showFeedback}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${buttonStyle} ${
                    showFeedback ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="text-2xl mb-1">{config.icon}</div>
                  <div className={`font-medium ${config.color}`}>{config.label}</div>
                  {showFeedback && isCorrectLevel && (
                    <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mt-2" />
                  )}
                  {showFeedback && isSelected && !isCorrectLevel && (
                    <XCircle className="w-4 h-4 text-red-500 mx-auto mt-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-6 border-t ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div>
                <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : `Not quite. This is a ${RISK_LEVELS[scenario.correctLevel].label} situation.`}
                </p>
                <p className="text-gray-700 mt-1">{scenario.explanation}</p>
                {scenario.lawReference && (
                  <p className="text-sm text-gray-500 mt-2">
                    Reference: {scenario.lawReference}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedLevel}
              className="w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
            >
              {currentIndex < totalScenarios - 1 ? 'Next Scenario' : 'See Results'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Score Indicator */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Current score: {correctCount} correct
      </div>

      {/* Risk Level Legend */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-600 mb-3">Risk Level Guide:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {riskLevelOrder.map((level) => {
            const config = RISK_LEVELS[level];
            return (
              <div key={level} className={`${config.bgColor} rounded p-2`}>
                <span className="mr-1">{config.icon}</span>
                <span className={config.color}>{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
