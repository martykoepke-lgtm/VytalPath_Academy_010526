import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { GripVertical, CheckCircle, XCircle, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react';
import { insuranceTerms, shuffleTerms } from '../../data/insuranceTerms';
import { MatchingTerm } from '../../types/learning';
import { useNavigate } from 'react-router-dom';

// Draggable term component
function DraggableCard({ term, isPlaced }: { term: MatchingTerm; isPlaced: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `term-${term.id}`,
    disabled: isPlaced,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-4 rounded-lg border-2 select-none transition-all duration-200
        ${isPlaced
          ? 'border-green-300 bg-green-50 opacity-50 cursor-default'
          : 'border-teal-200 bg-white hover:border-teal-400 hover:shadow-md cursor-grab active:cursor-grabbing'
        }
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <GripVertical className={`w-5 h-5 flex-shrink-0 ${isPlaced ? 'text-green-400' : 'text-gray-400'}`} />
        <span className="font-medium text-gray-800">{term.term}</span>
      </div>
    </div>
  );
}

// Droppable definition zone
function DefinitionZone({
  definition,
  matchedTerm,
  isCorrect,
  showResult,
}: {
  definition: MatchingTerm;
  matchedTerm: MatchingTerm | null;
  isCorrect: boolean | null;
  showResult: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `def-${definition.id}`,
    disabled: showResult,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        p-4 rounded-lg border-2 min-h-[100px] transition-all duration-200
        ${isOver ? 'border-teal-500 bg-teal-50 scale-[1.02]' : 'border-gray-200 bg-gray-50'}
        ${showResult && isCorrect === true ? 'border-green-500 bg-green-50' : ''}
        ${showResult && isCorrect === false ? 'border-red-500 bg-red-50' : ''}
      `}
    >
      <p className="text-sm text-gray-600 mb-3">{definition.definition}</p>
      {matchedTerm ? (
        <div
          className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
            ${showResult && isCorrect ? 'bg-green-100 text-green-800' : ''}
            ${showResult && !isCorrect ? 'bg-red-100 text-red-800' : ''}
            ${!showResult ? 'bg-teal-100 text-teal-800' : ''}
          `}
        >
          {showResult && isCorrect && <CheckCircle className="w-4 h-4" />}
          {showResult && !isCorrect && <XCircle className="w-4 h-4" />}
          {matchedTerm.term}
        </div>
      ) : (
        <div className={`text-sm italic ${isOver ? 'text-teal-600' : 'text-gray-400'}`}>
          {isOver ? 'Release to drop' : 'Drop a term here'}
        </div>
      )}
    </div>
  );
}

export function InsuranceTermMatch() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<MatchingTerm[]>([]);
  const [definitions, setDefinitions] = useState<MatchingTerm[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({}); // defId -> termId
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  useEffect(() => {
    resetExercise();
  }, []);

  const resetExercise = () => {
    setTerms(shuffleTerms(insuranceTerms));
    setDefinitions(shuffleTerms(insuranceTerms));
    setMatches({});
    setShowResults(false);
    setScore(0);
    setActiveTermId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (id.startsWith('term-')) {
      setActiveTermId(id.replace('term-', ''));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTermId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Only process if dragging a term onto a definition
    if (activeId.startsWith('term-') && overId.startsWith('def-')) {
      const termId = activeId.replace('term-', '');
      const defId = overId.replace('def-', '');

      // Remove this term from any previous match
      const newMatches = { ...matches };
      Object.keys(newMatches).forEach((key) => {
        if (newMatches[key] === termId) {
          delete newMatches[key];
        }
      });

      // Set the new match
      newMatches[defId] = termId;
      setMatches(newMatches);
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    definitions.forEach((def) => {
      if (matches[def.id] === def.id) {
        correct++;
      }
    });
    setScore(correct);
    setShowResults(true);
  };

  const allMatched = Object.keys(matches).length === definitions.length;
  const activeTerm = terms.find((t) => t.id === activeTermId);

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Term Matching</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Drag each insurance term to its matching definition. Test your understanding of key insurance concepts.
        </p>
      </div>

      {/* Results banner */}
      {showResults && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            score === definitions.length
              ? 'bg-green-100 border border-green-300'
              : 'bg-amber-100 border border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {score === definitions.length ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-amber-600" />
              )}
              <div>
                <p className={`font-semibold ${score === definitions.length ? 'text-green-800' : 'text-amber-800'}`}>
                  {score === definitions.length
                    ? 'Perfect! All terms matched correctly!'
                    : `You got ${score} out of ${definitions.length} correct.`}
                </p>
                {score < definitions.length && <p className="text-sm text-amber-700">Try again to match them all!</p>}
              </div>
            </div>
            <button
              onClick={resetExercise}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Terms column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Terms</h2>
            <div className="space-y-3">
              {terms.map((term) => {
                const isPlaced = Object.values(matches).includes(term.id);
                return (
                  <DraggableCard key={term.id} term={term} isPlaced={isPlaced || showResults} />
                );
              })}
            </div>
          </div>

          {/* Definitions column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Definitions</h2>
            <div className="space-y-3">
              {definitions.map((def) => {
                const matchedTermId = matches[def.id];
                const matchedTerm = terms.find((t) => t.id === matchedTermId) || null;
                const isCorrect = showResults ? matchedTermId === def.id : null;

                return (
                  <DefinitionZone
                    key={def.id}
                    definition={def}
                    matchedTerm={matchedTerm}
                    isCorrect={isCorrect}
                    showResult={showResults}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeTerm && (
            <div className="p-4 rounded-lg border-2 border-teal-500 bg-white shadow-xl cursor-grabbing">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span className="font-medium text-gray-800">{activeTerm.term}</span>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Check answers button */}
      {!showResults && (
        <div className="mt-8 text-center">
          <button
            onClick={checkAnswers}
            disabled={!allMatched}
            className={`
              inline-flex items-center gap-2 px-8 py-3 text-sm font-medium rounded-lg transition-all
              ${
                allMatched
                  ? 'text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }
            `}
          >
            <CheckCircle className="w-5 h-5" />
            Check Answers
          </button>
          {!allMatched && (
            <p className="text-sm text-gray-500 mt-2">Match all {definitions.length} terms to check your answers</p>
          )}
        </div>
      )}
    </div>
  );
}
