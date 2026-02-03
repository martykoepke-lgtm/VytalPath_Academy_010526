import { useState } from 'react';
import { ChevronRight, CheckCircle2, XCircle, AlertCircle, RotateCcw, Trophy } from 'lucide-react';
import { SimulationScenario, SimulationOption, AnswerSeverity } from '../../types/interactive';
import { simulationScenarios } from '../../data/interactiveScenarios';

interface SimulationExperienceProps {
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

const severityConfig: Record<AnswerSeverity, { icon: typeof CheckCircle2; color: string; bgColor: string }> = {
  correct: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
  partial: { icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' },
  wrong: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' },
};

export function SimulationExperience({ onComplete, onBack }: SimulationExperienceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<SimulationOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredScenarios, setAnsweredScenarios] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const scenario = simulationScenarios[currentIndex];
  const totalScenarios = simulationScenarios.length;
  const progress = ((currentIndex + 1) / totalScenarios) * 100;

  const handleSelectOption = (option: SimulationOption) => {
    if (showFeedback) return; // Prevent changing answer after feedback shown
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setShowFeedback(true);

    if (selectedOption.isCorrect && !answeredScenarios.has(scenario.id)) {
      setCorrectCount(prev => prev + 1);
    }
    setAnsweredScenarios(prev => new Set([...prev, scenario.id]));
  };

  const handleNext = () => {
    if (currentIndex < totalScenarios - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setAnsweredScenarios(new Set());
    setIsComplete(false);
  };

  const handleFinish = () => {
    onComplete(correctCount, totalScenarios);
  };

  // Completion Screen
  if (isComplete) {
    const percentage = Math.round((correctCount / totalScenarios) * 100);
    const passed = percentage >= 70;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            passed ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-green-600" />
            ) : (
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Great Job!' : 'Keep Learning!'}
          </h2>

          <p className="text-gray-600 mb-6">
            You handled <span className="font-semibold">{correctCount} of {totalScenarios}</span> situations correctly ({percentage}%)
          </p>

          {passed ? (
            <p className="text-green-700 bg-green-50 rounded-lg p-4 mb-6">
              You've demonstrated a solid understanding of healthcare compliance. You're ready for your first day!
            </p>
          ) : (
            <p className="text-yellow-700 bg-yellow-50 rounded-lg p-4 mb-6">
              You need 70% to pass. Review the materials and try again - you've got this!
            </p>
          )}

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
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {passed ? 'Continue' : 'Return to Hub'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Your First Day</h1>
          <span className="text-sm text-gray-500">
            Scenario {currentIndex + 1} of {totalScenarios}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scenario Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Scenario Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">{scenario.title}</h2>
          {scenario.context && (
            <p className="text-blue-100 text-sm">{scenario.context}</p>
          )}
        </div>

        {/* Scenario Description */}
        <div className="p-6 border-b border-gray-200">
          <p className="text-gray-800 text-lg leading-relaxed">
            "{scenario.description}"
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          <p className="text-sm font-medium text-gray-500 mb-4">How do you respond?</p>

          {scenario.options.map((option, index) => {
            const isSelected = selectedOption?.id === option.id;
            const letter = String.fromCharCode(65 + index); // A, B, C

            let optionStyle = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
            if (isSelected && !showFeedback) {
              optionStyle = 'border-blue-500 bg-blue-50';
            }
            if (showFeedback && isSelected) {
              const config = severityConfig[option.severity];
              optionStyle = `${config.bgColor} border`;
            }
            if (showFeedback && option.isCorrect && !isSelected) {
              optionStyle = 'border-green-200 bg-green-50';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${optionStyle} ${
                  showFeedback ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {letter}
                  </span>
                  <span className="text-gray-800">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && selectedOption && (
          <div className={`p-6 border-t ${severityConfig[selectedOption.severity].bgColor}`}>
            <div className="flex items-start gap-3">
              {(() => {
                const config = severityConfig[selectedOption.severity];
                const Icon = config.icon;
                return <Icon className={`w-6 h-6 flex-shrink-0 ${config.color}`} />;
              })()}
              <div>
                <p className={`font-medium ${severityConfig[selectedOption.severity].color}`}>
                  {selectedOption.severity === 'correct' && 'Correct!'}
                  {selectedOption.severity === 'partial' && 'Partially Correct'}
                  {selectedOption.severity === 'wrong' && 'Not Quite Right'}
                </p>
                <p className="text-gray-700 mt-1">{selectedOption.feedback}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
    </div>
  );
}
