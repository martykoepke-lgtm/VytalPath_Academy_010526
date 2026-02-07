import { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle, ChevronRight, ChevronLeft,
  RotateCcw, Eye, Trophy, AlertTriangle, Lightbulb,
  FileText, Monitor, Mail, Printer, ClipboardList
} from 'lucide-react';
import { documentScenes, type DocumentScene, type PHIField } from '../../data/phiChallengeData';

const STORAGE_KEY = 'vytalpath_phi_challenge';

interface StoredProgress {
  completedScenes: string[];
  bestScores: Record<string, number>;
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { completedScenes: [], bestScores: {} };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

const sceneIcons: Record<string, React.ElementType> = {
  'sign-in-sheet': ClipboardList,
  'break-room-whiteboard': FileText,
  'email-thread': Mail,
  'computer-screen': Monitor,
  'fax-cover-sheet': Printer,
};

export function PHIIdentifierChallenge() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [classifications, setClassifications] = useState<Record<string, boolean | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTeachingPoint, setShowTeachingPoint] = useState(false);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);

  const scene = documentScenes[currentIndex];
  const allClassified = scene.fields.every(f => classifications[f.id] !== undefined && classifications[f.id] !== null);

  useEffect(() => {
    setClassifications({});
    setSubmitted(false);
    setShowTeachingPoint(false);
  }, [currentIndex]);

  const handleClassify = (fieldId: string, isPHI: boolean) => {
    if (submitted) return;
    setClassifications(prev => ({ ...prev, [fieldId]: isPHI }));
  };

  const handleSubmit = () => {
    setSubmitted(true);

    const correctCount = scene.fields.filter(
      f => classifications[f.id] === f.isPHI
    ).length;
    const percentage = Math.round((correctCount / scene.fields.length) * 100);

    const newProgress = { ...progress };
    if (!newProgress.completedScenes.includes(scene.id)) {
      newProgress.completedScenes.push(scene.id);
    }
    const prevBest = newProgress.bestScores[scene.id] || 0;
    if (percentage > prevBest) {
      newProgress.bestScores[scene.id] = percentage;
    }
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const handleRetry = () => {
    setClassifications({});
    setSubmitted(false);
    setShowTeachingPoint(false);
  };

  const correctCount = submitted
    ? scene.fields.filter(f => classifications[f.id] === f.isPHI).length
    : 0;
  const allCorrect = correctCount === scene.fields.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">PHI Identifier Challenge</h2>
            <p className="text-sm text-gray-500">Identify what's PHI and what isn't in real workplace scenarios</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {progress.completedScenes.length}/{documentScenes.length} completed
        </div>
      </div>

      {/* Scene Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {documentScenes.map((s, i) => {
          const isComplete = progress.completedScenes.includes(s.id);
          const isCurrent = i === currentIndex;
          const Icon = sceneIcons[s.id] || FileText;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 border whitespace-nowrap ${
                isCurrent
                  ? 'bg-blue-600 text-white border-blue-600'
                  : isComplete
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {isComplete && !isCurrent ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Icon className="w-3 h-3" />
              )}
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Scene Card */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
        {/* Scene Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {scene.context}
            </span>
            <span className="text-xs text-gray-400">Scene {currentIndex + 1} of {documentScenes.length}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{scene.title}</h3>
          <p className="text-sm text-gray-600">{scene.description}</p>
        </div>

        {/* Instructions */}
        {!submitted && (
          <div className="mx-5 mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700">
              <Eye className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Classify each item below as <strong>PHI</strong> (Protected Health Information) or <strong>Not PHI</strong>.
            </p>
          </div>
        )}

        {/* Fields */}
        <div className="p-5 space-y-3">
          {scene.fields.map((field) => {
            const userAnswer = classifications[field.id];
            const isCorrect = submitted && userAnswer === field.isPHI;
            const isWrong = submitted && userAnswer !== field.isPHI;

            return (
              <div
                key={field.id}
                className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                  isCorrect
                    ? 'border-green-200 bg-green-50/50'
                    : isWrong
                      ? 'border-red-200 bg-red-50/50'
                      : 'border-gray-200 bg-white'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        {field.label}
                      </p>
                      <p className="text-sm text-gray-900 font-medium">{field.value}</p>
                    </div>

                    {/* Classification Buttons */}
                    <div className="flex-shrink-0 flex gap-2">
                      <button
                        onClick={() => handleClassify(field.id, true)}
                        disabled={submitted}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          submitted
                            ? field.isPHI
                              ? 'bg-green-100 text-green-800 ring-2 ring-green-300'
                              : userAnswer === true
                                ? 'bg-red-100 text-red-800 ring-2 ring-red-300'
                                : 'bg-gray-100 text-gray-400'
                            : userAnswer === true
                              ? 'bg-red-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                      >
                        PHI
                      </button>
                      <button
                        onClick={() => handleClassify(field.id, false)}
                        disabled={submitted}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          submitted
                            ? !field.isPHI
                              ? 'bg-green-100 text-green-800 ring-2 ring-green-300'
                              : userAnswer === false
                                ? 'bg-red-100 text-red-800 ring-2 ring-red-300'
                                : 'bg-gray-100 text-gray-400'
                            : userAnswer === false
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        Not PHI
                      </button>
                    </div>
                  </div>

                  {/* Submitted Feedback */}
                  {submitted && (
                    <div className={`mt-3 flex items-start gap-2 text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        {isWrong && (
                          <p className="font-medium mb-0.5">
                            This is {field.isPHI ? 'PHI' : 'Not PHI'}
                            {field.identifier && ` — HIPAA Identifier: ${field.identifier}`}
                          </p>
                        )}
                        {isCorrect && field.identifier && (
                          <p className="font-medium mb-0.5">HIPAA Identifier: {field.identifier}</p>
                        )}
                        <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>{field.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex items-center gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!allClassified}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                allClassified
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
                onClick={() => setShowTeachingPoint(!showTeachingPoint)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300"
              >
                <Lightbulb className="w-4 h-4" />
                {showTeachingPoint ? 'Hide' : 'Show'} Key Lesson
              </button>
            </>
          )}
        </div>

        {/* Result Banner */}
        {submitted && (
          <div className={`mx-5 mb-5 p-4 rounded-2xl ${allCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center gap-3">
              {allCorrect ? (
                <Trophy className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              <div>
                <p className={`font-medium ${allCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                  {allCorrect
                    ? 'Perfect! You correctly identified all PHI in this scenario.'
                    : `${correctCount} of ${scene.fields.length} correctly classified.`}
                </p>
                {!allCorrect && (
                  <p className="text-sm text-amber-600 mt-0.5">
                    Review the explanations to understand what makes each item PHI or not.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Teaching Point */}
        {showTeachingPoint && submitted && (
          <div className="mx-5 mb-5 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">Key Lesson</h4>
                <p className="text-sm text-blue-700">{scene.teachingPoint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2 pt-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(documentScenes.length - 1, currentIndex + 1))}
            disabled={currentIndex === documentScenes.length - 1}
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
