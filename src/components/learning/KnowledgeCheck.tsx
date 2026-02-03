import { useState } from 'react';
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { getQuestionsForLesson } from '../../data/knowledgeCheckQuestions';
import { KnowledgeCheckQuestion } from './KnowledgeCheckQuestion';

interface Props {
  lessonId: string;
  lessonTitle: string;
  onComplete: () => void;
}

export function KnowledgeCheck({ lessonId, lessonTitle, onComplete }: Props) {
  const questions = getQuestionsForLesson(lessonId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // If no questions for this lesson, show completion immediately
  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h2>
        <p className="text-gray-600 mb-6">You've finished watching {lessonTitle}.</p>
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all"
        >
          Continue to Training
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Job!</h2>
        <p className="text-gray-600 mb-6">
          You've completed the knowledge check for {lessonTitle}.
        </p>
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all"
        >
          Continue to Training
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6">
        <div className="flex items-center gap-3 text-white">
          <BookOpen className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-semibold">Quick Knowledge Check</h2>
            <p className="text-teal-100 text-sm">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <KnowledgeCheckQuestion
          key={questions[currentIndex].id}
          question={questions[currentIndex]}
          onAnswered={handleNext}
        />
      </div>

      {/* Skip option */}
      <div className="px-6 pb-6 text-center">
        <button
          onClick={onComplete}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Skip knowledge check
        </button>
      </div>
    </div>
  );
}
