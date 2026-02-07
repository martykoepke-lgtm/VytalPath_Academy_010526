import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, CheckCircle, XCircle, RotateCcw,
  ChevronRight, AlertTriangle, Info, Zap, Trophy, Timer, ListOrdered
} from 'lucide-react';
import { workflowSequences, type WorkflowSequence, type SequenceStep } from '../../data/workflowSequencerData';

const STORAGE_KEY = 'vytalpath_workflow_seq';

interface StoredProgress {
  completedWorkflows: string[];
  bestTimes: Record<string, number>; // workflowId -> seconds
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { completedWorkflows: [], bestTimes: {} };
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

// Sortable step item
function SortableStep({ step, position, submitted, correctPosition }: {
  step: SequenceStep;
  position: number;
  submitted: boolean;
  correctPosition: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id, disabled: submitted });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCorrect = submitted && position === correctPosition;
  const isWrong = submitted && position !== correctPosition;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
        isDragging
          ? 'opacity-50 shadow-lg border-blue-300 bg-blue-50'
          : isCorrect
            ? 'border-green-300 bg-green-50'
            : isWrong
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      } ${!submitted ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {!submitted && (
        <div {...attributes} {...listeners} className="flex-shrink-0 text-gray-400 hover:text-gray-600 touch-none">
          <GripVertical className="w-5 h-5" />
        </div>
      )}

      <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
        isCorrect
          ? 'bg-green-200 text-green-800'
          : isWrong
            ? 'bg-red-200 text-red-800'
            : 'bg-gray-100 text-gray-500'
      }`}>
        {position + 1}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${
          isCorrect ? 'text-green-800' : isWrong ? 'text-red-800' : 'text-gray-900'
        }`}>
          {step.text}
        </p>
        {submitted && (
          <p className={`text-xs mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? step.detail : `Should be step ${correctPosition + 1} — ${step.detail}`}
          </p>
        )}
      </div>

      {submitted && (
        <div className="flex-shrink-0">
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs font-medium text-red-500">→ {correctPosition + 1}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WorkflowSequencer() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>(workflowSequences[0].id);
  const [steps, setSteps] = useState<SequenceStep[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const [speedMode, setSpeedMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const workflow = workflowSequences.find((w) => w.id === selectedWorkflow)!;
  const allCompleted = workflowSequences.every((w) => progress.completedWorkflows.includes(w.id));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const initWorkflow = useCallback((wf: WorkflowSequence) => {
    setSteps(shuffleArray(wf.steps));
    setSubmitted(false);
    setActiveId(null);
    setTimerSeconds(0);
    if (speedMode) setTimerActive(true);
  }, [speedMode]);

  useEffect(() => {
    initWorkflow(workflow);
  }, [selectedWorkflow, workflow, initWorkflow]);

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = steps.findIndex((s) => s.id === active.id);
    const newIndex = steps.findIndex((s) => s.id === over.id);

    setSteps(arrayMove(steps, oldIndex, newIndex));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimerActive(false);

    const correctCount = steps.filter((s, i) => i === s.correctPosition).length;
    const allCorrect = correctCount === steps.length;

    if (allCorrect) {
      const newProgress = { ...progress };
      if (!newProgress.completedWorkflows.includes(workflow.id)) {
        newProgress.completedWorkflows.push(workflow.id);
      }
      if (speedMode) {
        const prev = newProgress.bestTimes[workflow.id];
        if (!prev || timerSeconds < prev) {
          newProgress.bestTimes[workflow.id] = timerSeconds;
        }
      }
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  };

  const correctCount = submitted
    ? steps.filter((s, i) => i === s.correctPosition).length
    : 0;
  const allCorrect = correctCount === steps.length;

  const activeStep = steps.find((s) => s.id === activeId);
  const emphasisStyles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: Info },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: AlertTriangle },
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: Zap },
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Workflow Sequencer</h2>
            <p className="text-sm text-gray-500">Drag the steps into the correct order</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {allCompleted && (
            <button
              onClick={() => { setSpeedMode(!speedMode); setSubmitted(false); initWorkflow(workflow); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                speedMode ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              Speed Challenge
            </button>
          )}
          <span className="text-sm text-gray-500">
            {progress.completedWorkflows.length}/{workflowSequences.length}
          </span>
        </div>
      </div>

      {/* Workflow Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {workflowSequences.map((wf) => {
          const isComplete = progress.completedWorkflows.includes(wf.id);
          const isCurrent = wf.id === selectedWorkflow;
          const bestTime = progress.bestTimes[wf.id];
          return (
            <button
              key={wf.id}
              onClick={() => setSelectedWorkflow(wf.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 border whitespace-nowrap ${
                isCurrent
                  ? 'bg-blue-600 text-white border-blue-600'
                  : isComplete
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {isComplete && !isCurrent && <CheckCircle className="w-3 h-3 inline mr-1" />}
              {wf.title}
              {bestTime && !isCurrent && (
                <span className="ml-1 text-green-500">({formatTime(bestTime)})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scenario Description */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">{workflow.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
          {speedMode && timerActive && (
            <div className="mt-2 flex items-center gap-2 text-amber-600">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-mono font-medium">{formatTime(timerSeconds)}</span>
            </div>
          )}
        </div>

        {/* Sortable Steps */}
        <div className="p-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <SortableStep
                    key={step.id}
                    step={step}
                    position={index}
                    submitted={submitted}
                    correctPosition={step.correctPosition}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeStep && (
                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-blue-400 bg-white shadow-xl">
                  <GripVertical className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-900">{activeStep.text}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex items-center gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm transition-all duration-300"
            >
              <CheckCircle className="w-4 h-4" />
              Check Order
            </button>
          ) : (
            <button
              onClick={() => initWorkflow(workflow)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>

        {/* Result */}
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
                    ? speedMode
                      ? `Perfect! Completed in ${formatTime(timerSeconds)}`
                      : 'Perfect order! Every step is in the right place.'
                    : `${correctCount} of ${steps.length} steps in the correct position.`}
                </p>
                {!allCorrect && (
                  <p className="text-sm text-amber-600 mt-0.5">
                    Review the explanations to understand why order matters.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Critical Order Notes */}
        {submitted && workflow.criticalOrderNotes.length > 0 && (
          <div className="mx-5 mb-5 space-y-3">
            {workflow.criticalOrderNotes.map((note, i) => {
              const style = emphasisStyles[note.emphasis];
              const NoteIcon = style.icon;
              return (
                <div key={i} className={`p-4 rounded-2xl border ${style.bg} ${style.border}`}>
                  <div className="flex items-start gap-3">
                    <NoteIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${style.text}`} />
                    <p className={`text-sm ${style.text}`}>{note.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Next Workflow */}
        {submitted && allCorrect && (
          <div className="px-5 pb-5">
            {(() => {
              const currentIdx = workflowSequences.findIndex((w) => w.id === selectedWorkflow);
              const nextWf = workflowSequences[currentIdx + 1];
              if (!nextWf) return null;
              return (
                <button
                  onClick={() => setSelectedWorkflow(nextWf.id)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Next: {nextWf.title}
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
