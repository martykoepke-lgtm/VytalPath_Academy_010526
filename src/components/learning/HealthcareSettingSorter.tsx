import { useState, useCallback } from 'react';
import {
  Building2, CheckCircle, XCircle, RotateCcw,
  Trophy, ArrowRight, Stethoscope
} from 'lucide-react';
import {
  settingSorterScenarios,
  type ScenarioCard
} from '../../data/foundationsExercises';

const STORAGE_KEY = 'vytalpath_foundations_sorter';

interface StoredProgress {
  score: number;
  total: number;
  completed: boolean;
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Migrate old two-phase format
      if ('phase1Score' in data) {
        return { score: data.phase1Score, total: data.phase1Total, completed: data.completed };
      }
      return data;
    }
  } catch { /* ignore */ }
  return { score: 0, total: 0, completed: false };
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

type Phase = 'intro' | 'sorting' | 'results';

export function HealthcareSettingSorter() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [cards, setCards] = useState<ScenarioCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'inpatient' | 'ambulatory'>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);

  const startSorting = useCallback(() => {
    setCards(shuffleArray(settingSorterScenarios));
    setCurrentCardIndex(0);
    setAnswers({});
    setShowFeedback(false);
    setPhase('sorting');
  }, []);

  const handleSort = (category: 'inpatient' | 'ambulatory') => {
    if (showFeedback) return;
    const card = cards[currentCardIndex];
    setAnswers(prev => ({ ...prev, [card.id]: category }));
    setShowFeedback(true);
  };

  const nextCard = () => {
    setShowFeedback(false);
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      const score = cards.filter(c => answers[c.id] === c.correctCategory).length;
      const newProgress: StoredProgress = {
        score: Math.max(progress.score, score),
        total: cards.length,
        completed: true,
      };
      setProgress(newProgress);
      saveProgress(newProgress);
      setPhase('results');
    }
  };

  const runningScore = cards.filter(c => answers[c.id] === c.correctCategory).length;

  // --- INTRO ---
  if (phase === 'intro') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Healthcare Setting Sorter</h2>
            <p className="text-sm text-gray-500">Classify 12 scenarios as Inpatient or Ambulatory care</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 space-y-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            You'll see real healthcare scenarios one at a time. Decide whether each one takes place in an
            <strong className="text-blue-700"> inpatient</strong> (overnight stay) or
            <strong className="text-emerald-700"> ambulatory</strong> (same-day) setting.
          </p>

          {progress.completed && (
            <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-700">
              Previous best: {progress.score}/{progress.total} correct
            </div>
          )}

          <button
            onClick={startSorting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-all shadow-apple-sm font-medium"
          >
            {progress.completed ? 'Play Again' : 'Start Exercise'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // --- SORTING ---
  if (phase === 'sorting') {
    const card = cards[currentCardIndex];
    const userAnswer = answers[card.id];
    const isCorrect = userAnswer === card.correctCategory;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Healthcare Setting Sorter</h2>
              <p className="text-sm text-gray-500">Card {currentCardIndex + 1} of {cards.length}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">{runningScore} correct</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all"
            style={{ width: `${((currentCardIndex + (showFeedback ? 1 : 0)) / cards.length) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6">
          <p className="text-gray-800 text-center leading-relaxed mb-6">{card.text}</p>

          {!showFeedback ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSort('inpatient')}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all"
              >
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-blue-700">Inpatient</span>
                <span className="text-xs text-blue-500">Overnight stay</span>
              </button>
              <button
                onClick={() => handleSort('ambulatory')}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all"
              >
                <Stethoscope className="w-6 h-6 text-emerald-600" />
                <span className="font-medium text-emerald-700">Ambulatory</span>
                <span className="text-xs text-emerald-500">Same-day care</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : `Incorrect — this is ${card.correctCategory} care`}
                  </p>
                  <p className={`text-sm mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {card.explanation}
                  </p>
                </div>
              </div>
              <button
                onClick={nextCard}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium text-sm"
              >
                {currentCardIndex < cards.length - 1 ? 'Next Card' : 'See Results'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  const finalScore = cards.filter(c => answers[c.id] === c.correctCategory).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 text-center">
        <Trophy className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h2 className="text-2xl font-semibold text-gray-900">Exercise Complete!</h2>
        <p className="text-4xl font-bold text-rose-600 mt-2">{finalScore}/{cards.length}</p>
        <p className="text-sm text-gray-500 mt-1">scenarios classified correctly</p>

        {finalScore === cards.length && (
          <p className="mt-3 text-sm font-medium text-green-600">
            Perfect score! You know your care settings.
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={() => setPhase('intro')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
