import { useState } from 'react';
import { ChevronRight, Eye, CheckCircle2, XCircle, Lightbulb, HelpCircle, Trophy, RotateCcw, MessageSquare, Monitor } from 'lucide-react';
import { SpotScene, Violation } from '../../types/interactive';
import { spotScenes } from '../../data/interactiveScenarios';

interface SpotTheViolationProps {
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

export function SpotTheViolation({ onComplete, onBack }: SpotTheViolationProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [foundViolations, setFoundViolations] = useState<Set<string>>(new Set());
  const [incorrectGuesses, setIncorrectGuesses] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [totalFound, setTotalFound] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);

  const scene = spotScenes[currentSceneIndex];
  const totalScenes = spotScenes.length;
  const allFound = foundViolations.size === scene.violations.length;

  const handleViolationClick = (violation: Violation) => {
    if (showResults) return;

    if (!foundViolations.has(violation.id)) {
      setFoundViolations(prev => new Set([...prev, violation.id]));
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    if (scene.hints && hintIndex < scene.hints.length - 1) {
      setHintIndex(prev => prev + 1);
    }
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const handleNextScene = () => {
    // Update totals before moving on
    setTotalFound(prev => prev + foundViolations.size);
    setTotalPossible(prev => prev + scene.violations.length);

    if (currentSceneIndex < totalScenes - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setFoundViolations(new Set());
      setIncorrectGuesses(new Set());
      setShowHint(false);
      setHintIndex(0);
      setShowResults(false);
    } else {
      // Calculate final score
      const finalFound = totalFound + foundViolations.size;
      const finalPossible = totalPossible + scene.violations.length;
      setTotalFound(finalFound);
      setTotalPossible(finalPossible);
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentSceneIndex(0);
    setFoundViolations(new Set());
    setIncorrectGuesses(new Set());
    setShowHint(false);
    setHintIndex(0);
    setShowResults(false);
    setIsComplete(false);
    setTotalFound(0);
    setTotalPossible(0);
  };

  const handleFinish = () => {
    onComplete(totalFound, totalPossible);
  };

  // Completion Screen
  if (isComplete) {
    const percentage = Math.round((totalFound / totalPossible) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-purple-100">
            <Trophy className="w-10 h-10 text-purple-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sharp Eyes!
          </h2>

          <p className="text-gray-600 mb-6">
            You spotted <span className="font-semibold">{totalFound} of {totalPossible}</span> violations ({percentage}%)
          </p>

          <p className="text-purple-700 bg-purple-50 rounded-lg p-4 mb-6">
            Great practice! Being able to spot potential violations in your environment helps keep patient information safe.
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
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
          <h1 className="text-2xl font-bold text-gray-900">Spot the Violation</h1>
          <span className="text-sm text-gray-500">
            Scene {currentSceneIndex + 1} of {totalScenes}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${((currentSceneIndex + 1) / totalScenes) * 100}%` }}
          />
        </div>
      </div>

      {/* Scene Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Scene Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            {scene.sceneType === 'visual' ? (
              <Monitor className="w-6 h-6" />
            ) : (
              <MessageSquare className="w-6 h-6" />
            )}
            <h2 className="text-xl font-semibold">{scene.title}</h2>
          </div>
          <p className="text-purple-100">{scene.description}</p>
        </div>

        {/* Scene Content */}
        <div className="p-6">
          {/* For conversation scenes, show the dialogue */}
          {scene.sceneType === 'conversation' && scene.conversationLines && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
              {scene.conversationLines.map((line, index) => (
                <p key={index} className="text-gray-800 italic">
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* For visual scenes, show a description placeholder */}
          {scene.sceneType === 'visual' && (
            <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                Imagine this scene and click the violations you notice below.
              </p>
            </div>
          )}

          {/* Violations to Find */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Click on each violation you notice ({foundViolations.size}/{scene.violations.length} found)
              </p>
              {scene.hints && scene.hints.length > 0 && !allFound && !showResults && (
                <button
                  onClick={handleShowHint}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  <Lightbulb className="w-4 h-4" />
                  Need a hint?
                </button>
              )}
            </div>

            {/* Hint Display */}
            {showHint && scene.hints && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <strong>Hint:</strong> {scene.hints[hintIndex]}
              </div>
            )}

            {/* Violation Buttons */}
            <div className="grid gap-3">
              {scene.violations.map((violation) => {
                const isFound = foundViolations.has(violation.id);

                return (
                  <button
                    key={violation.id}
                    onClick={() => handleViolationClick(violation)}
                    disabled={showResults}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isFound
                        ? 'border-green-500 bg-green-50'
                        : showResults
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isFound ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : showResults ? (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${isFound ? 'text-green-800' : showResults ? 'text-red-800' : 'text-gray-800'}`}>
                          {violation.description}
                        </p>
                        {(isFound || showResults) && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">{violation.explanation}</p>
                            {violation.lawReference && (
                              <p className="text-xs text-gray-500 mt-1">
                                Reference: {violation.lawReference}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          {!showResults ? (
            <div className="flex gap-4">
              <button
                onClick={handleCheckAnswers}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Show All Answers
              </button>
              <button
                onClick={handleNextScene}
                disabled={!allFound}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {allFound ? (
                  <>
                    {currentSceneIndex < totalScenes - 1 ? 'Next Scene' : 'See Results'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  `Find ${scene.violations.length - foundViolations.size} more`
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handleNextScene}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              {currentSceneIndex < totalScenes - 1 ? 'Next Scene' : 'See Results'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Total violations found so far: {totalFound + foundViolations.size}
      </div>
    </div>
  );
}
