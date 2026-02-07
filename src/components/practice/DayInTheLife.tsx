import { useState, useRef, useEffect } from 'react';
import {
  Clock, Send, ArrowLeft, Star, Loader2,
  Building2, Stethoscope, AlertTriangle,
  ChevronRight, RotateCcw, CheckCircle, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAiTutor } from '../../hooks/useAiTutor';
import type { SectionContext } from '../../types/ai-tutor';

const STORAGE_KEY = 'vytalpath_day_sim';

interface StoredProgress {
  completedShifts: string[];
  ratings: Record<string, number>;
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { completedShifts: [], ratings: {} };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

interface PracticeSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  scenarioInstructions: string;
}

const practiceSettings: PracticeSetting[] = [
  {
    id: 'family-practice',
    title: 'Small Family Practice',
    description: 'A 3-provider family medicine clinic. You\'re the only front desk person today.',
    icon: Building2,
    scenarioInstructions: `Setting: Small family practice with 3 providers (2 MDs, 1 NP). Single front desk.
Daily volume: ~40 patients/day. Mix of new and established patients.
Staff: 2 MAs, 1 LPN, office manager (in back office), 1 biller (part-time).
EHR System: Generic modern EHR.
Common visit types: Well visits, sick visits, chronic disease management, preventive care.
Insurance mix: 40% commercial, 35% Medicare, 15% Medicaid, 10% self-pay.
The student is the sole front desk receptionist today. Start the shift at 8:00 AM with opening duties.
Include realistic scenarios: early arriving patients, phone calls, insurance issues, a walk-in, a difficult patient wanting to be seen without appointment, a provider running late, lunch coverage, afternoon rush, and closing duties.`,
  },
  {
    id: 'multi-specialty',
    title: 'Busy Multi-Specialty Clinic',
    description: 'A large practice with 8 providers across multiple specialties. High patient volume.',
    icon: Stethoscope,
    scenarioInstructions: `Setting: Multi-specialty clinic with 8 providers (Cardiology, Orthopedics, Internal Medicine, Dermatology). Two front desk stations.
Daily volume: ~100 patients/day across all providers. Complex scheduling.
Staff: 4 front desk staff (you + 3 others), 6 MAs, referral coordinator, billing department.
EHR System: Generic modern EHR with multi-provider scheduling.
Common scenarios: Patients seeing multiple providers same day, referrals between departments, prior authorizations, complex insurance verification, high call volume.
Insurance mix: 50% commercial, 25% Medicare, 15% HMO requiring referrals, 10% other.
The student works the main check-in desk. Start at 8:00 AM.
Include scenarios requiring coordination with other departments, referral questions, patients arriving for wrong provider, insurance that doesn't cover certain specialists, and a patient emergency in the waiting room.`,
  },
  {
    id: 'urgent-care',
    title: 'Urgent Care Center',
    description: 'A walk-in urgent care facility. Fast-paced with unpredictable patient flow.',
    icon: AlertTriangle,
    scenarioInstructions: `Setting: Standalone urgent care center, open 8 AM - 8 PM. 2 providers on duty.
Daily volume: 30-50 patients, mostly walk-ins. No appointments — first come, first served with triage priority.
Staff: 2 front desk staff, 2 MAs, 1 X-ray tech.
EHR System: Generic modern EHR with walk-in queue management.
Common visit types: Flu/cold, minor injuries, lacerations, sprains, UTIs, ear infections, rashes.
Insurance mix: 35% commercial, 20% Medicare, 15% Medicaid, 30% self-pay/uninsured.
The student works the front desk. Start at 8:00 AM opening.
Include scenarios: rush of walk-ins, uninsured patient asking about costs, parent with sick child, potential emergency requiring 911, workers' comp injury, a patient who should go to the ER instead, handling wait time complaints, and end-of-day closing with patients still waiting.`,
  },
];

type View = 'select' | 'active' | 'results';

export function DayInTheLife() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('select');
  const [setting, setSetting] = useState<PracticeSetting | null>(null);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const [input, setInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const setupSentRef = useRef(false);
  const [awaitingSetup, setAwaitingSetup] = useState(false);

  const sectionContext: SectionContext = {
    sectionId: 'practice',
    sectionName: 'Job Readiness Center',
    practiceMode: 'day-in-the-life',
    scenarioType: setting?.id,
    scenarioInstructions: setting?.scenarioInstructions,
  };

  const { messages, isLoading, sendMessage, clearMessages } = useAiTutor(sectionContext);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send initial setup message after clearing
  useEffect(() => {
    if (awaitingSetup && messages.length === 0 && setting && !setupSentRef.current) {
      setupSentRef.current = true;
      setAwaitingSetup(false);
      sendMessage(
        `[SHIFT START] I'm starting my shift as the front desk receptionist at this ${setting.title}. Set the scene for 8:00 AM and give me my first situation.`
      );
    }
  }, [awaitingSetup, messages, setting, sendMessage]);

  // Detect evaluation response
  useEffect(() => {
    if (isEvaluating && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        setEvaluation(lastMsg.content);
        setIsEvaluating(false);
        setView('results');

        // Parse rating and save
        if (setting) {
          const ratingMatch = lastMsg.content.match(/OVERALL RATING:\s*(\d)/);
          const rating = ratingMatch ? parseInt(ratingMatch[1]) : 3;
          const newProgress = { ...progress };
          if (!newProgress.completedShifts.includes(setting.id)) {
            newProgress.completedShifts.push(setting.id);
          }
          newProgress.ratings[setting.id] = Math.max(
            newProgress.ratings[setting.id] || 0,
            rating
          );
          setProgress(newProgress);
          saveProgress(newProgress);
        }
      }
    }
  }, [isEvaluating, isLoading, messages, setting, progress]);

  const startShift = (s: PracticeSetting) => {
    setSetting(s);
    setupSentRef.current = false;
    clearMessages();
    setAwaitingSetup(true);
    setEvaluation(null);
    setIsEvaluating(false);
    setView('active');
  };

  const endShift = () => {
    setIsEvaluating(true);
    sendMessage('[SHIFT ENDED] Please provide my comprehensive shift performance review.');
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  // Filter display messages (hide setup message)
  const displayMessages = messages.filter((m, i) => {
    if (i === 0 && m.role === 'user' && m.content.startsWith('[SHIFT START]')) return false;
    if (m.role === 'user' && m.content.startsWith('[SHIFT ENDED]')) return false;
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
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Day in the Life</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Experience a full shift at a healthcare practice. Claude narrates realistic scenarios — you decide how to handle each one.
          </p>
        </div>

        <div className="grid gap-4">
          {practiceSettings.map((s) => {
            const Icon = s.icon;
            const isComplete = progress.completedShifts.includes(s.id);
            const rating = progress.ratings[s.id];

            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl shadow-apple-sm border border-gray-200/50 p-6 hover-lift transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{s.title}</h3>
                      {isComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{s.description}</p>
                    {rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => startShift(s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isComplete
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-apple-sm'
                    }`}
                  >
                    {isComplete ? 'Replay' : 'Start Shift'}
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
    const ratingMatch = evaluation.match(/OVERALL RATING:\s*(\d)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

    // Parse sections
    const strengthsMatch = evaluation.match(/STRENGTHS:([\s\S]*?)(?=AREAS FOR IMPROVEMENT|CRITICAL ERRORS|KEY TAKEAWAY|$)/i);
    const improvementsMatch = evaluation.match(/AREAS FOR IMPROVEMENT:([\s\S]*?)(?=CRITICAL ERRORS|KEY TAKEAWAY|$)/i);
    const criticalMatch = evaluation.match(/CRITICAL ERRORS:([\s\S]*?)(?=KEY TAKEAWAY|$)/i);
    const takeawayMatch = evaluation.match(/KEY TAKEAWAY:([\s\S]*?)$/i);

    const parseBullets = (text: string | undefined) => {
      if (!text) return [];
      return text.split('\n').map(l => l.replace(/^[\s\-\*•]+/, '').trim()).filter(Boolean);
    };

    const strengths = parseBullets(strengthsMatch?.[1]);
    const improvements = parseBullets(improvementsMatch?.[1]);
    const criticals = parseBullets(criticalMatch?.[1]);
    const takeaway = takeawayMatch?.[1]?.trim() || '';

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 p-6 text-white text-center">
            <Clock className="w-10 h-10 mx-auto mb-3" />
            <h2 className="text-2xl font-semibold">Shift Performance Review</h2>
            <p className="text-purple-200 mt-1">{setting?.title}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">Overall Rating</p>
            </div>

            {/* Strengths */}
            {strengths.length > 0 && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h3>
                <ul className="space-y-1">
                  {strengths.map((s, i) => (
                    <li key={i} className="text-sm text-green-700">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {improvements.length > 0 && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-1">
                  {improvements.map((s, i) => (
                    <li key={i} className="text-sm text-amber-700">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Critical Errors */}
            {criticals.length > 0 && criticals[0].toLowerCase() !== 'none' && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Critical Errors
                </h3>
                <ul className="space-y-1">
                  {criticals.map((s, i) => (
                    <li key={i} className="text-sm text-red-700">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Takeaway */}
            {takeaway && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">{takeaway}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setting && startShift(setting)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => { setView('select'); setSetting(null); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all text-sm font-medium shadow-apple-sm"
              >
                Choose Setting
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE VIEW ---
  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { setView('select'); setSetting(null); }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Leave Shift
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">{setting?.title}</span>
        </div>
        <button
          onClick={endShift}
          disabled={isLoading || displayMessages.length < 4}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Clock className="w-3.5 h-3.5" />
          End Shift
        </button>
      </div>

      {/* Chat Area */}
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
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3 h-3 text-purple-500" />
                    <span className="text-[10px] font-medium text-purple-600 uppercase">Narrator</span>
                  </div>
                )}
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

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="What do you do?"
              disabled={isLoading || isEvaluating}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isEvaluating}
              className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
