import { useState, useRef, useEffect } from 'react';
import {
  HeadphonesIcon, Send, ArrowLeft, Star, Loader2,
  PhoneOff, ChevronRight, RotateCcw, CheckCircle, XCircle,
  ClipboardList, Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAiTutor } from '../../hooks/useAiTutor';
import type { SectionContext } from '../../types/ai-tutor';

const STORAGE_KEY = 'vytalpath_ins_hotline';

interface StoredProgress {
  completedCalls: string[];
  bestScores: Record<string, number>;
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { completedCalls: [], bestScores: {} };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

interface InsuranceScenario {
  id: string;
  patientName: string;
  insuranceCompany: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenarioInstructions: string;
}

const scenarios: InsuranceScenario[] = [
  {
    id: 'basic-ppo',
    patientName: 'John Smith',
    insuranceCompany: 'Blue Cross Blue Shield',
    difficulty: 'beginner',
    scenarioInstructions: `You are an insurance representative at Blue Cross Blue Shield.
Patient: John Smith, DOB: 03/15/1978, Member ID: BCB992847561, Group #: GRP-4421
Plan: PPO Gold, Effective: 01/01/2026
Copay: $30 specialist / $20 PCP. Deductible: $1,500 ($400 remaining). Coinsurance: 80/20 after deductible.
OOP Max: $6,000 ($1,800 used). No prior auth needed for office visits.
Provider Dr. Martinez is IN-NETWORK.
Be helpful and straightforward. This is a simple verification.`,
  },
  {
    id: 'hmo-referral',
    patientName: 'Maria Garcia',
    insuranceCompany: 'Kaiser Permanente',
    difficulty: 'intermediate',
    scenarioInstructions: `You are an insurance representative at Kaiser Permanente.
Patient: Maria Garcia, DOB: 07/22/1985, Member ID: KP-11283746, Group #: EMP-8872
Plan: HMO Standard, Effective: 03/01/2025
Copay: $40 specialist. Deductible: $0 (HMO, no deductible). Coinsurance: N/A.
OOP Max: $4,000 ($600 used).
IMPORTANT: This is an HMO — a referral from the PCP is REQUIRED for specialist visits. If the caller doesn't ask about referral requirements, don't volunteer it.
Prior auth IS required for imaging (MRI, CT) and procedures.
Provider Dr. Patel is IN-NETWORK but REQUIRES a referral on file before the appointment.
Be slightly bureaucratic — ask for the Tax ID or NPI of the calling office before providing information.`,
  },
  {
    id: 'high-deductible',
    patientName: 'Robert Chen',
    insuranceCompany: 'Aetna',
    difficulty: 'intermediate',
    scenarioInstructions: `You are an insurance representative at Aetna.
Patient: Robert Chen, DOB: 11/30/1962, Member ID: AET-8847291035, Group #: HDHP-2290
Plan: High Deductible Health Plan (HDHP) with HSA, Effective: 01/01/2026
Copay: No copay — everything goes to deductible first. Deductible: $3,000 individual ($2,750 remaining — almost nothing met).
Coinsurance: 70/30 after deductible. OOP Max: $7,000.
No prior auth for office visits but PRIOR AUTH REQUIRED for any procedures or imaging.
Provider Dr. Williams is IN-NETWORK.
Be informative but make the caller work for details. Don't explain what HDHP means — just give the numbers.`,
  },
  {
    id: 'medicaid',
    patientName: 'Tanya Williams',
    insuranceCompany: 'Molina Healthcare (Medicaid)',
    difficulty: 'advanced',
    scenarioInstructions: `You are a representative at Molina Healthcare managing Medicaid plans.
Patient: Tanya Williams, DOB: 04/18/1990, Member ID: MOL-5592814, Case #: MC-29471
Plan: Medicaid Managed Care, Effective: 06/01/2025
Copay: $0 (Medicaid). Deductible: $0. Coinsurance: $0.
OOP Max: N/A — Medicaid covers everything.
HOWEVER: Patient's eligibility shows a gap — coverage was inactive from 01/15/2026 to 02/01/2026 due to a redetermination delay. It is NOW ACTIVE again as of 02/01/2026.
Prior auth required for specialist visits and ALL imaging.
Provider must accept Medicaid — Dr. Ramirez IS enrolled as a Medicaid provider.
You need to transfer the caller to a different department for prior auth questions. Put them "on hold" briefly before giving coverage details.
Be realistic — Medicaid lines often have holds and transfers.`,
  },
  {
    id: 'workers-comp',
    patientName: 'James Taylor',
    insuranceCompany: 'Hartford Workers\' Compensation',
    difficulty: 'advanced',
    scenarioInstructions: `You are a claims representative at Hartford handling a workers' compensation claim.
Patient/Claimant: James Taylor, DOB: 09/08/1975, Claim #: WC-2026-0847291, Employer: Apex Manufacturing
Date of Injury: 01/28/2026, Injury: Lower back strain (lifting injury at work)
This is a WORKERS' COMP claim — it works completely differently from regular insurance:
- No copay, deductible, or coinsurance for authorized treatment related to the injury.
- ALL treatment must be related to the work injury. Unrelated conditions are not covered.
- The employer/insurer must authorize treatment. An authorization number is required.
- Authorization #: WCA-88471 (valid for initial evaluation and 6 follow-up PT visits)
- Only authorized providers can treat — Dr. Brooks is on the approved provider list.
Be somewhat difficult — ask for the claim number first, then the authorization number. If the caller doesn't ask about authorization limits, don't volunteer them.
This is NOT regular insurance — correct the caller if they use terms like "copay" or "deductible."`,
  },
];

interface FormField {
  key: string;
  label: string;
  value: string;
}

const blankForm: FormField[] = [
  { key: 'planName', label: 'Plan Name / Type', value: '' },
  { key: 'memberId', label: 'Member ID', value: '' },
  { key: 'groupNumber', label: 'Group #', value: '' },
  { key: 'effectiveDate', label: 'Effective Date', value: '' },
  { key: 'copay', label: 'Copay', value: '' },
  { key: 'deductible', label: 'Deductible (Total / Remaining)', value: '' },
  { key: 'coinsurance', label: 'Coinsurance %', value: '' },
  { key: 'oopMax', label: 'Out-of-Pocket Max', value: '' },
  { key: 'priorAuth', label: 'Prior Auth Required?', value: '' },
  { key: 'networkStatus', label: 'Provider Network Status', value: '' },
  { key: 'referralRequired', label: 'Referral Required?', value: '' },
  { key: 'notes', label: 'Additional Notes', value: '' },
];

const difficultyColors = {
  beginner: { bg: 'bg-green-50', text: 'text-green-700', label: 'Beginner' },
  intermediate: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Intermediate' },
  advanced: { bg: 'bg-red-50', text: 'text-red-700', label: 'Advanced' },
};

type View = 'select' | 'active' | 'results';

export function InsuranceHotline() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('select');
  const [scenario, setScenario] = useState<InsuranceScenario | null>(null);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const [form, setForm] = useState<FormField[]>(blankForm.map(f => ({ ...f })));
  const [input, setInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const setupSentRef = useRef(false);
  const [awaitingSetup, setAwaitingSetup] = useState(false);

  const sectionContext: SectionContext = {
    sectionId: 'practice',
    sectionName: 'Job Readiness Center',
    practiceMode: 'insurance-hotline',
    scenarioType: scenario?.id,
    scenarioInstructions: scenario?.scenarioInstructions,
  };

  const { messages, isLoading, sendMessage, clearMessages } = useAiTutor(sectionContext);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (awaitingSetup && messages.length === 0 && scenario && !setupSentRef.current) {
      setupSentRef.current = true;
      setAwaitingSetup(false);
      sendMessage(
        `[CALL START] I'm calling from Dr. Martinez's office to verify insurance coverage for a patient. This is regarding ${scenario.patientName}.`
      );
    }
  }, [awaitingSetup, messages, scenario, sendMessage]);

  useEffect(() => {
    if (isEvaluating && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        setEvaluation(lastMsg.content);
        setIsEvaluating(false);
        setView('results');

        if (scenario) {
          const scoreMatch = lastMsg.content.match(/ACCURACY SCORE:\s*(\d+)/);
          const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
          const newProgress = { ...progress };
          if (!newProgress.completedCalls.includes(scenario.id)) {
            newProgress.completedCalls.push(scenario.id);
          }
          newProgress.bestScores[scenario.id] = Math.max(
            newProgress.bestScores[scenario.id] || 0,
            score
          );
          setProgress(newProgress);
          saveProgress(newProgress);
        }
      }
    }
  }, [isEvaluating, isLoading, messages, scenario, progress]);

  const startCall = (s: InsuranceScenario) => {
    setScenario(s);
    setupSentRef.current = false;
    clearMessages();
    setForm(blankForm.map(f => ({ ...f })));
    setAwaitingSetup(true);
    setEvaluation(null);
    setIsEvaluating(false);
    setView('active');
  };

  const endCall = () => {
    const filledFields = form.filter(f => f.value.trim()).map(f => `${f.label}: ${f.value}`).join('\n');
    setIsEvaluating(true);
    sendMessage(
      `[CALL ENDED]\n\nHere is the verification form I filled out:\n${filledFields || '(No fields filled)'}\n\nPlease evaluate my performance and accuracy.`
    );
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const updateFormField = (key: string, value: string) => {
    setForm(prev => prev.map(f => f.key === key ? { ...f, value } : f));
  };

  const displayMessages = messages.filter((m, i) => {
    if (i === 0 && m.role === 'user' && m.content.startsWith('[CALL START]')) return false;
    if (m.role === 'user' && m.content.startsWith('[CALL ENDED]')) return false;
    return true;
  });

  // --- SELECT VIEW ---
  if (view === 'select') {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/practice')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Readiness Center
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
            <HeadphonesIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Insurance Verification Hotline</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Call an insurance company to verify patient coverage. Ask the right questions and fill out the verification form.
          </p>
        </div>

        <div className="grid gap-4">
          {scenarios.map((s) => {
            const isComplete = progress.completedCalls.includes(s.id);
            const score = progress.bestScores[s.id];
            const diff = difficultyColors[s.difficulty];

            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl shadow-apple-sm border border-gray-200/50 p-5 hover-lift transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-gray-900">{s.patientName}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
                        {diff.label}
                      </span>
                      {isComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-500">{s.insuranceCompany}</p>
                    {score !== undefined && (
                      <p className="text-xs text-gray-400 mt-0.5">Best accuracy: {score}/10</p>
                    )}
                  </div>
                  <button
                    onClick={() => startCall(s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isComplete
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-apple-sm'
                    }`}
                  >
                    {isComplete ? 'Retry' : 'Call'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (view === 'results' && evaluation) {
    const scoreMatch = evaluation.match(/ACCURACY SCORE:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    const askedMatch = evaluation.match(/QUESTIONS ASKED:([\s\S]*?)(?=MISSED QUESTIONS|PROFESSIONALISM|KEY TAKEAWAY|$)/i);
    const missedMatch = evaluation.match(/MISSED QUESTIONS:([\s\S]*?)(?=PROFESSIONALISM|KEY TAKEAWAY|$)/i);
    const profMatch = evaluation.match(/PROFESSIONALISM:([\s\S]*?)(?=KEY TAKEAWAY|$)/i);
    const takeawayMatch = evaluation.match(/KEY TAKEAWAY:([\s\S]*?)$/i);

    const parseBullets = (text: string | undefined) => {
      if (!text) return [];
      return text.split('\n').map(l => l.replace(/^[\s\-\*•]+/, '').trim()).filter(Boolean);
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
          <div className="bg-purple-600 p-6 text-white text-center">
            <HeadphonesIcon className="w-10 h-10 mx-auto mb-3" />
            <h2 className="text-2xl font-semibold">Verification Call Review</h2>
            <p className="text-purple-200 mt-1">{scenario?.patientName} — {scenario?.insuranceCompany}</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Score */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{score}/10</div>
              <p className="text-sm text-gray-500">Accuracy Score</p>
            </div>

            {/* Asked */}
            {parseBullets(askedMatch?.[1]).length > 0 && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Questions Asked
                </h3>
                <ul className="space-y-1">
                  {parseBullets(askedMatch?.[1]).map((s, i) => (
                    <li key={i} className="text-sm text-green-700">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missed */}
            {parseBullets(missedMatch?.[1]).length > 0 && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Missed Questions
                </h3>
                <ul className="space-y-1">
                  {parseBullets(missedMatch?.[1]).map((s, i) => (
                    <li key={i} className="text-sm text-amber-700">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Professionalism */}
            {profMatch?.[1]?.trim() && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-1">Professionalism</h3>
                <p className="text-sm text-blue-700">{profMatch[1].trim()}</p>
              </div>
            )}

            {/* Takeaway */}
            {takeawayMatch?.[1]?.trim() && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-700 font-medium">{takeawayMatch[1].trim()}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => scenario && startCall(scenario)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={() => { setView('select'); setScenario(null); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all text-sm font-medium shadow-apple-sm"
              >
                More Scenarios <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE VIEW (Split Screen) ---
  return (
    <div className="max-w-6xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { setView('select'); setScenario(null); }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Hang Up
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">
            Calling {scenario?.insuranceCompany}
          </span>
        </div>
        <button
          onClick={endCall}
          disabled={isLoading || displayMessages.length < 2}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <PhoneOff className="w-3.5 h-3.5" /> End Call & Submit
        </button>
      </div>

      {/* Split Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Left: Chat */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <HeadphonesIcon className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Insurance Rep</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {displayMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
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
                  <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask the insurance rep..."
                disabled={isLoading || isEvaluating}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isEvaluating}
                className="px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Verification Form */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Verification Form — {scenario?.patientName}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {form.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => updateFormField(field.key, e.target.value)}
                  disabled={isEvaluating}
                  placeholder="..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 disabled:opacity-50"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
