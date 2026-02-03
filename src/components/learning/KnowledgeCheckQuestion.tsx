import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { KnowledgeCheckQuestion as QuestionType } from '../../types/learning';

interface Props {
  question: QuestionType;
  onAnswered: () => void;
}

export function KnowledgeCheckQuestion({ question, onAnswered }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSelect = (option: string) => {
    if (hasAnswered) return;
    setSelectedAnswer(option);
    setHasAnswered(true);
  };

  const getOptionStyles = (option: string) => {
    if (!hasAnswered) {
      return 'border-gray-200 hover:border-teal-400 hover:bg-teal-50 cursor-pointer';
    }

    if (option === question.correctAnswer) {
      return 'border-green-500 bg-green-50';
    }

    if (option === selectedAnswer && !isCorrect) {
      return 'border-red-500 bg-red-50';
    }

    return 'border-gray-200 opacity-50';
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <h3 className="text-xl font-semibold text-gray-900">
        {question.questionText}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            disabled={hasAnswered}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${getOptionStyles(option)}`}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-gray-800">{option}</span>
              {hasAnswered && option === question.correctAnswer && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
              {hasAnswered && option === selectedAnswer && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {hasAnswered && (
        <div
          className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
              <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {hasAnswered && (
        <div className="flex justify-end">
          <button
            onClick={onAnswered}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
