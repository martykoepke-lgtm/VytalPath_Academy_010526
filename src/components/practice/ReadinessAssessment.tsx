import { useState, useRef, useEffect } from 'react';
import {
  ClipboardCheck, Send, ArrowLeft, Star, Loader2,
  ChevronRight, RotateCcw, CheckCircle, XCircle,
  Heart, Scale, DollarSign, BookA, ClipboardList, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAiTutor } from '../../hooks/useAiTutor';
import type { SectionContext } from '../../types/ai-tutor';

const STORAGE_KEY = 'vytalpath_readiness';

interface StoredProgress {
  passed: boolean;
  score: number;
  areas: Record<string, number>;
  lastAttempt: string | null;
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { passed: false, score: 0, areas: {}, lastAttempt: null };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

interface AssessmentTask {
  id: string;
  domain: string;
  icon: React.ElementType;
  color: string;
  title: string;
  prompt: string;
}

const assessmentTasks: AssessmentTask[] = [
  {
    id: 'foundations',
    domain: 'Foundations',
    icon: Heart,
    color: 'rose',
    title: 'Care Setting Identification',
    prompt: `[ASSESSMENT TASK: FOUNDATIONS]
Read this scenario and answer the questions:

"A 45-year-old patient had knee replacement surgery yesterday and is staying overnight in the hospital for monitoring. The surgeon has ordered physical therapy to begin tomorrow morning, and a case manager is coordinating discharge planning for home health visits."

Questions:
1. What type of care setting is this patient in? (Be specific)
2. Name the front office role most likely responsible for coordinating discharge paperwork.
3. Would this visit be classified as inpatient or ambulatory care? Why?
4. Name two other healthcare professionals mentioned or implied in this scenario.

Please answer all 4 questions clearly.`,
  },
  {
    id: 'compliance',
    domain: 'Compliance',
    icon: Scale,
    color: 'blue',
    title: 'HIPAA Scenario Review',
    prompt: `[ASSESSMENT TASK: COMPLIANCE]
Review this day's events at a medical office and identify ALL HIPAA concerns:

Events during the day:
1. The receptionist called out "Maria Johnson, the doctor is ready for your diabetes check" in the full waiting room.
2. A nurse left a patient chart open on the desk while stepping away to use the restroom.
3. A pharmaceutical rep asked to see the list of patients on a specific medication, and the office manager showed it to them.
4. A patient's mother called asking about her 25-year-old daughter's test results, and the receptionist provided the results.
5. During lunch, a medical assistant posted a selfie in the break room, and a patient schedule was visible on the whiteboard behind her.
6. The billing department emailed patient account information to the correct billing company using encrypted email.

For each event:
- State whether it is a HIPAA violation or compliant
- If it's a violation, explain what specific rule was broken
- Suggest what should have been done differently`,
  },
  {
    id: 'insurance',
    domain: 'Insurance',
    icon: DollarSign,
    color: 'emerald',
    title: 'Patient Financial Responsibility',
    prompt: `[ASSESSMENT TASK: INSURANCE]
Calculate the patient's financial responsibility for this scenario:

Patient: Sarah Chen
Insurance: PPO plan through employer
Visit: Specialist office visit — total charge $350
Plan details:
- Annual deductible: $2,000 (she has met $1,600 so far this year)
- Coinsurance: 80/20 (insurance pays 80%, patient pays 20%) — applies AFTER deductible
- Specialist copay: $50 — BUT copay only applies after deductible is met
- Out-of-pocket maximum: $6,000 (she has spent $2,100 so far)

Show your work step by step:
1. How much of her deductible remains?
2. How much of this $350 visit goes toward the remaining deductible?
3. After the deductible portion, how much is left for coinsurance?
4. What is the patient's coinsurance amount (20%) on the remaining balance?
5. What is the TOTAL the patient owes for this visit?

Please work through each step clearly.`,
  },
  {
    id: 'terminology',
    domain: 'Terminology',
    icon: BookA,
    color: 'purple',
    title: 'Medical Term Decoding',
    prompt: `[ASSESSMENT TASK: TERMINOLOGY]
Decode these medical terms from a provider's chart note:

"Patient presents with tachycardia and hypertension. History of cholecystectomy (2022). Currently experiencing dyspnea on exertion. Recommend ECG and CBC. Patient also reports intermittent epigastric pain — r/o gastritis. RTC in 2 weeks."

For each term/abbreviation below, provide:
1. The word parts (prefix, root, suffix) where applicable
2. The meaning

Terms to decode:
1. Tachycardia
2. Hypertension
3. Cholecystectomy
4. Dyspnea
5. ECG
6. CBC
7. Epigastric
8. Gastritis
9. r/o
10. RTC`,
  },
  {
    id: 'workflows',
    domain: 'Workflows',
    icon: ClipboardList,
    color: 'amber',
    title: 'Procedure Description',
    prompt: `[ASSESSMENT TASK: WORKFLOWS]
Describe the correct step-by-step procedure for this situation:

"It's Monday morning at 8:00 AM. You're the front desk receptionist at a busy family practice. A new patient, David Park, arrives for his first appointment. He says he's here for his 8:30 appointment with Dr. Williams."

Describe EVERY step you would take, from greeting to notifying clinical staff. Include:
- What you say to the patient
- What documents you need
- What you check in the system
- How you handle payment
- When and how you update the EHR
- How you notify the back office

Be specific and thorough — this is a real-world procedure.`,
  },
];

type View = 'intro' | 'task' | 'results';

export function ReadinessAssessment() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('intro');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const setupSentRef = useRef(false);
  const [awaitingSetup, setAwaitingSetup] = useState(false);

  const currentTask = assessmentTasks[currentTaskIndex];

  const sectionContext: SectionContext = {
    sectionId: 'practice',
    sectionName: 'Job Readiness Center',
    practiceMode: 'readiness-assessment',
  };

  const { messages, isLoading, sendMessage, clearMessages } = useAiTutor(sectionContext);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send task prompt when starting a task
  useEffect(() => {
    if (awaitingSetup && messages.length === 0 && !setupSentRef.current) {
      setupSentRef.current = true;
      setAwaitingSetup(false);
      sendMessage(currentTask.prompt);
    }
  }, [awaitingSetup, messages, currentTask, sendMessage]);

  // Handle evaluation completion
  useEffect(() => {
    if (isEvaluating && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        setEvaluation(lastMsg.content);
        setIsEvaluating(false);
        setView('results');

        // Parse overall score
        const scoreMatch = lastMsg.content.match(/READINESS SCORE:\s*(\d+)/);
        const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

        // Parse area scores
        const areas: Record<string, number> = {};
        const areaPattern = /(Foundations|Compliance|Insurance|Terminology|Workflows):\s*(\d+)/gi;
        let match;
        while ((match = areaPattern.exec(lastMsg.content)) !== null) {
          areas[match[1].toLowerCase()] = parseInt(match[2]);
        }

        const passed = overallScore >= 80;
        const newProgress: StoredProgress = {
          passed: passed || progress.passed,
          score: Math.max(overallScore, progress.score),
          areas,
          lastAttempt: new Date().toISOString(),
        };
        setProgress(newProgress);
        saveProgress(newProgress);
      }
    }
  }, [isEvaluating, isLoading, messages, progress]);

  const startAssessment = () => {
    setCurrentTaskIndex(0);
    setAnswers({});
    setEvaluation(null);
    setupSentRef.current = false;
    clearMessages();
    setAwaitingSetup(true);
    setView('task');
  };

  const submitAnswer = () => {
    if (!input.trim() || isLoading) return;
    const newAnswers = { ...answers, [currentTask.id]: input.trim() };
    setAnswers(newAnswers);

    if (currentTaskIndex < assessmentTasks.length - 1) {
      // Move to next task
      sendMessage(input.trim());
      setInput('');
      setTimeout(() => {
        setCurrentTaskIndex(currentTaskIndex + 1);
        setupSentRef.current = false;
        clearMessages();
        setAwaitingSetup(true);
      }, 500);
    } else {
      // All tasks complete - request evaluation
      const allAnswers = Object.entries(newAnswers)
        .map(([id, answer]) => `### ${id.toUpperCase()}\n${answer}`)
        .join('\n\n');

      setIsEvaluating(true);
      sendMessage(
        `[ASSESSMENT COMPLETE] Here are all my answers:\n\n${allAnswers}\n\nPlease evaluate all 5 tasks and provide:
READINESS SCORE: X/100
Area scores:
- Foundations: X/20
- Compliance: X/20
- Insurance: X/20
- Terminology: X/20
- Workflows: X/20

For each area, provide brief feedback on what was strong and what needs improvement.
End with: JOB READY BADGE: YES (if 80+) or NO (with recommendation to focus on weak areas).`
      );
      setInput('');
    }
  };

  const displayMessages = messages.filter((m) => {
    if (m.role === 'user' && m.content.startsWith('[ASSESSMENT')) return false;
    return true;
  });

  const colorMap: Record<string, { bg: string; text: string; lightBg: string }> = {
    rose: { bg: 'bg-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50' },
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50' },
    amber: { bg: 'bg-amber-600', text: 'text-amber-600', lightBg: 'bg-amber-50' },
  };

  // --- INTRO VIEW ---
  if (view === 'intro') {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/practice')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Readiness Center
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <ClipboardCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Readiness Assessment</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Five practical tasks covering every domain. Score 80% or higher to earn your "Job Ready" badge.
          </p>
        </div>

        {/* Tasks preview */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">Assessment Tasks</h3>
            <p className="text-sm text-gray-500 mt-1">You'll complete one task per domain, then receive a comprehensive evaluation.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {assessmentTasks.map((task, i) => {
              const Icon = task.icon;
              const colors = colorMap[task.color];
              return (
                <div key={task.id} className="p-4 flex items-center gap-4">
                  <div className={`flex-shrink-0 w-9 h-9 ${colors.lightBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400">Task {i + 1}</span>
                      <span className={`text-xs font-medium ${colors.text}`}>{task.domain}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  </div>
                  <span className="text-xs text-gray-400">20 points</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Previous score */}
        {progress.lastAttempt && (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Previous Best: {progress.score}/100</p>
                <p className="text-xs text-gray-400">
                  {progress.passed ? 'Job Ready badge earned!' : 'Need 80+ to pass'}
                </p>
              </div>
              {progress.passed && <Award className="w-6 h-6 text-emerald-500" />}
            </div>
          </div>
        )}

        <button
          onClick={startAssessment}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-apple-sm font-medium"
        >
          {progress.lastAttempt ? 'Retake Assessment' : 'Begin Assessment'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (view === 'results' && evaluation) {
    const scoreMatch = evaluation.match(/READINESS SCORE:\s*(\d+)/);
    const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    const passed = overallScore >= 80;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
          <div className={`p-8 text-white text-center ${passed ? 'bg-emerald-600' : 'bg-gray-700'}`}>
            {passed ? (
              <Award className="w-12 h-12 mx-auto mb-3" />
            ) : (
              <ClipboardCheck className="w-12 h-12 mx-auto mb-3" />
            )}
            <h2 className="text-2xl font-semibold">
              {passed ? 'Job Ready!' : 'Keep Practicing'}
            </h2>
            <p className="text-4xl font-bold mt-2">{overallScore}/100</p>
            <p className="mt-1 opacity-80">{passed ? 'You earned your Job Ready badge!' : 'Score 80+ to earn your badge'}</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Area scores */}
            {assessmentTasks.map((task) => {
              const colors = colorMap[task.color];
              const areaScore = progress.areas[task.id] || 0;
              return (
                <div key={task.id} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 ${colors.lightBg} rounded-lg flex items-center justify-center`}>
                    <task.icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{task.domain}</span>
                      <span className="text-sm font-medium text-gray-900">{areaScore}/20</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${areaScore >= 16 ? 'bg-green-500' : areaScore >= 12 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${(areaScore / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3 pt-4">
              <button
                onClick={startAssessment}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
              <button
                onClick={() => navigate('/practice')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-sm font-medium shadow-apple-sm"
              >
                Back to Hub <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TASK VIEW ---
  const colors = colorMap[currentTask.color];
  const Icon = currentTask.icon;

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/practice')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Assessment
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 ${colors.lightBg} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            Task {currentTaskIndex + 1} of {assessmentTasks.length}: {currentTask.domain}
          </span>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {assessmentTasks.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i < currentTaskIndex ? 'bg-emerald-500' : i === currentTaskIndex ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Chat / Task Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {displayMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitAnswer();
                }
              }}
              placeholder="Type your answer... (Shift+Enter for new line)"
              disabled={isLoading || isEvaluating}
              rows={3}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 disabled:opacity-50 resize-none"
            />
            <button
              onClick={submitAnswer}
              disabled={!input.trim() || isLoading || isEvaluating}
              className="self-end px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {currentTaskIndex < assessmentTasks.length - 1 ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {currentTaskIndex < assessmentTasks.length - 1
              ? `Submit to move to Task ${currentTaskIndex + 2}: ${assessmentTasks[currentTaskIndex + 1].domain}`
              : 'Submit to complete the assessment and receive your evaluation'}
          </p>
        </div>
      </div>
    </div>
  );
}
