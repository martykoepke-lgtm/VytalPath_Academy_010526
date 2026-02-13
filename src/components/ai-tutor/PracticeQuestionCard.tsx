import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PracticeQuestionCardProps {
  question: string;
  options: { label: string; text: string }[];
  onAnswer: (selectedLabel: string, correct: boolean) => void;
  correctAnswer?: string; // Set after answering
  explanation?: string;
}

export function parsePracticeQuestion(content: string): {
  question: string;
  options: { label: string; text: string }[];
} | null {
  // Look for the structured practice question format
  const questionMatch = content.match(/\*\*Practice Question:\*\*\s*(.+?)(?:\n|$)/);
  if (!questionMatch) return null;

  const question = questionMatch[1].trim();
  const optionMatches = content.matchAll(/([A-D])\)\s*(.+?)(?:\n|$)/g);
  const options: { label: string; text: string }[] = [];

  for (const match of optionMatches) {
    options.push({ label: match[1], text: match[2].trim() });
  }

  if (options.length < 2) return null;

  return { question, options };
}

export default function PracticeQuestionCard({
  question,
  options,
  onAnswer,
  correctAnswer,
  explanation,
}: PracticeQuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const hasAnswered = selected !== null && correctAnswer !== undefined;

  const handleSelect = (label: string) => {
    if (hasAnswered) return;
    setSelected(label);
    // The parent will determine correctness from the AI's response
    onAnswer(label, label === correctAnswer);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 my-2 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          Ungraded Practice
        </span>
      </div>

      <p className="text-sm font-medium text-gray-900 mb-3">{question}</p>

      <div className="space-y-2">
        {options.map(opt => {
          let buttonStyle = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
          if (hasAnswered) {
            if (opt.label === correctAnswer) {
              buttonStyle = 'border-green-400 bg-green-50';
            } else if (opt.label === selected) {
              buttonStyle = 'border-red-300 bg-red-50';
            } else {
              buttonStyle = 'border-gray-200 opacity-60';
            }
          } else if (opt.label === selected) {
            buttonStyle = 'border-blue-400 bg-blue-50';
          }

          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              disabled={hasAnswered}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all ${buttonStyle}`}
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs font-medium">
                {opt.label}
              </span>
              <span className="text-gray-800">{opt.text}</span>
              {hasAnswered && opt.label === correctAnswer && (
                <CheckCircle className="w-4 h-4 text-green-600 ml-auto flex-shrink-0" />
              )}
              {hasAnswered && opt.label === selected && opt.label !== correctAnswer && (
                <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {hasAnswered && explanation && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          selected === correctAnswer ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
        }`}>
          {selected === correctAnswer ? 'Correct! ' : 'Not quite. '}
          {explanation}
        </div>
      )}
    </div>
  );
}
