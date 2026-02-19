import { useState, useEffect, useCallback } from 'react';
import {
  Puzzle, CheckCircle, XCircle, RotateCcw, ChevronRight,
  ChevronLeft, Trophy, AlertTriangle, Lightbulb, Volume2
} from 'lucide-react';
import { buildableTerms, type BuildableTerm, type TermComponent } from '../../data/termBuilderData';

const STORAGE_KEY = 'vytalpath_term_builder';

interface StoredProgress {
  completedTerms: string[];
  bestScores: Record<string, boolean>; // termId -> perfect?
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { completedTerms: [], bestScores: {} };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const difficultyColors = {
  basic: { bg: 'bg-green-50', text: 'text-green-700', label: 'Basic' },
  intermediate: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Intermediate' },
  advanced: { bg: 'bg-red-50', text: 'text-red-700', label: 'Advanced' },
};

const typeColors: Record<string, string> = {
  prefix: 'bg-purple-100 text-purple-700 border-purple-200',
  root: 'bg-blue-100 text-blue-700 border-blue-200',
  suffix: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const typeLabels: Record<string, string> = {
  prefix: 'Prefix',
  root: 'Root',
  suffix: 'Suffix',
};

export function TermBuilderWorkshop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState<(TermComponent | null)[]>([]);
  const [pool, setPool] = useState<TermComponent[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const [initializedIndex, setInitializedIndex] = useState(-1);

  const term = buildableTerms[currentIndex];
  const slotCount = term.correctComponents.length;

  // Synchronously reset state when currentIndex changes (prevents stale-render crashes)
  if (initializedIndex !== currentIndex) {
    setSlots(new Array(term.correctComponents.length).fill(null));
    setPool(shuffleArray([...term.correctComponents, ...term.distractors]));
    setSubmitted(false);
    setShowHint(false);
    setInitializedIndex(currentIndex);
  }

  const allFilled = slots.length === slotCount && slots.every(s => s !== null);

  const handleTileClick = (component: TermComponent) => {
    if (submitted) return;
    // Find first empty slot
    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex === -1) return;
    const newSlots = [...slots];
    newSlots[emptyIndex] = component;
    setSlots(newSlots);
    setPool(pool.filter(c => c.id !== component.id));
  };

  const handleSlotClick = (index: number) => {
    if (submitted) return;
    const component = slots[index];
    if (!component) return;
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    setPool([...pool, component]);
  };

  const handleSubmit = () => {
    setSubmitted(true);

    const isCorrect = slots.every(
      (s, i) => s && s.text === term.correctComponents[i].text
    );

    const newProgress = { ...progress };
    if (!newProgress.completedTerms.includes(term.id)) {
      newProgress.completedTerms.push(term.id);
    }
    if (isCorrect) {
      newProgress.bestScores[term.id] = true;
    }
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const isCorrect = submitted && slots.every(
    (s, i) => s && s.text === term.correctComponents[i].text
  );

  const diff = difficultyColors[term.difficulty];
  const completedCount = progress.completedTerms.length;

  // Group terms by difficulty for selector
  const basicTerms = buildableTerms.filter(t => t.difficulty === 'basic');
  const intermediateTerms = buildableTerms.filter(t => t.difficulty === 'intermediate');
  const advancedTerms = buildableTerms.filter(t => t.difficulty === 'advanced');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Puzzle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Term Builder Workshop</h2>
            <p className="text-sm text-gray-500">Build medical terms from their components</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {completedCount}/{buildableTerms.length} built
        </div>
      </div>

      {/* Term Selector by Difficulty */}
      <div className="space-y-2">
        {[
          { label: 'Basic', terms: basicTerms, color: 'green' },
          { label: 'Intermediate', terms: intermediateTerms, color: 'amber' },
          { label: 'Advanced', terms: advancedTerms, color: 'red' },
        ].map(group => (
          <div key={group.label} className="flex items-center gap-2">
            <span className={`text-xs font-medium w-24 text-${group.color}-600`}>{group.label}</span>
            <div className="flex gap-1.5 flex-wrap">
              {group.terms.map((t) => {
                const globalIndex = buildableTerms.indexOf(t);
                const isComplete = progress.completedTerms.includes(t.id);
                const isPerfect = progress.bestScores[t.id];
                const isCurrent = globalIndex === currentIndex;
                return (
                  <button
                    key={t.id}
                    onClick={() => setCurrentIndex(globalIndex)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 border ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isPerfect
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : isComplete
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                    title={t.assembledTerm}
                  >
                    {isPerfect && !isCurrent ? '✓' : globalIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Build Card */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
        {/* Term Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
              {diff.label}
            </span>
            <span className="text-xs text-gray-400">Term {currentIndex + 1} of {buildableTerms.length}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Build the term for: <span className="text-blue-600">"{term.definition}"</span>
          </h3>

          {/* Pronunciation (shown after submit) */}
          {submitted && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Volume2 className="w-4 h-4" />
              <span className="font-mono">{term.pronunciation}</span>
            </div>
          )}
        </div>

        {/* Slots */}
        <div className="p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            {slotCount === 2 ? 'Place 2 components' : 'Place 3 components'} in order
          </p>
          <div className="flex gap-3 mb-6">
            {slots.slice(0, term.correctComponents.length).map((slot, i) => {
              const expected = term.correctComponents[i];
              if (!expected) return null;
              const expectedType = expected.type;
              const isSlotCorrect = submitted && slot && slot.text === expected.text;
              const isSlotWrong = submitted && slot && slot.text !== expected.text;

              return (
                <button
                  key={i}
                  onClick={() => handleSlotClick(i)}
                  disabled={submitted}
                  className={`flex-1 min-h-[72px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                    isSlotCorrect
                      ? 'border-green-300 bg-green-50'
                      : isSlotWrong
                        ? 'border-red-300 bg-red-50'
                        : slot
                          ? 'border-blue-300 bg-blue-50 cursor-pointer hover:bg-blue-100'
                          : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <span className="text-[10px] font-medium text-gray-400 uppercase">{typeLabels[expectedType]}</span>
                  {slot ? (
                    <span className={`text-sm font-medium ${
                      isSlotCorrect ? 'text-green-700' : isSlotWrong ? 'text-red-700' : 'text-blue-700'
                    }`}>
                      {slot.text}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">tap to place</span>
                  )}
                  {submitted && (
                    <div className="mt-0.5">
                      {isSlotCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : isSlotWrong ? (
                        <span className="text-[10px] text-red-600 font-medium">
                          → {expected.text}
                        </span>
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Component Pool */}
          {pool.length > 0 && !submitted && (
            <>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Available Components</p>
              <div className="flex flex-wrap gap-2">
                {pool.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => handleTileClick(comp)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 hover:shadow-sm active:scale-95 ${typeColors[comp.type]}`}
                  >
                    {comp.text}
                    <span className="ml-1.5 text-[10px] opacity-60 uppercase">{comp.type}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex items-center gap-3">
          {!submitted ? (
            <>
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
                Check Term
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300"
              >
                <Lightbulb className="w-4 h-4" />
                Hint
              </button>
            </>
          ) : (
            <button
              onClick={() => setInitializedIndex(-1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>

        {/* Hint */}
        {showHint && !submitted && (
          <div className="mx-5 mb-5 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-sm text-amber-700">{term.hint}</p>
          </div>
        )}

        {/* Result */}
        {submitted && (
          <div className={`mx-5 mb-5 p-4 rounded-2xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <Trophy className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              <div>
                <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                  {isCorrect
                    ? `Correct! ${term.assembledTerm} = ${term.correctComponents.map(c => c.text).join(' + ')}`
                    : `The correct term is: ${term.assembledTerm}`}
                </p>
                <p className={`text-sm mt-1 ${isCorrect ? 'text-green-600' : 'text-amber-600'}`}>
                  {term.hint}
                </p>
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
          {submitted && isCorrect && currentIndex < buildableTerms.length - 1 && (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Next Term
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setCurrentIndex(Math.min(buildableTerms.length - 1, currentIndex + 1))}
            disabled={currentIndex === buildableTerms.length - 1}
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
