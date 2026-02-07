import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, ArrowLeft, Star, Loader2,
  ChevronRight, RotateCcw, CheckCircle, XCircle,
  Briefcase, User, ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAiTutor } from '../../hooks/useAiTutor';
import type { SectionContext } from '../../types/ai-tutor';

const STORAGE_KEY = 'vytalpath_interview';

interface StoredProgress {
  completedInterviews: string[];
  ratings: Record<string, number>;
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { completedInterviews: [], ratings: {} };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

interface InterviewRole {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  scenarioInstructions: string;
}

const interviewRoles: InterviewRole[] = [
  {
    id: 'receptionist',
    title: 'Medical Receptionist',
    description: 'Entry-level front desk position at a busy family practice.',
    icon: User,
    scenarioInstructions: `You are interviewing the student for a Medical Receptionist position at a busy family practice.
The practice has 3 providers and sees about 40 patients per day.
This is an entry-level position. The ideal candidate should demonstrate:
- Knowledge of HIPAA and patient privacy
- Professional phone manner
- Understanding of insurance basics (copays, deductibles)
- Ability to handle multiple tasks (scheduling, check-in, phones)
- Calm under pressure with difficult patients
- Basic medical terminology
Start with an easy icebreaker, then mix behavioral and situational questions.
Example questions to draw from (pick 8-10):
1. "Tell me about yourself and why you're interested in healthcare."
2. "What do you know about HIPAA?"
3. "A patient is upset because they've been waiting 30 minutes. How do you handle it?"
4. "Walk me through how you'd check in a new patient."
5. "What does 'copay' mean? What about 'deductible'?"
6. "You overhear two nurses discussing a patient in the hallway. What do you do?"
7. "Tell me about a time you handled a stressful situation."
8. "A patient calls asking for their lab results. What do you do?"
9. "What does 'STAT' mean?"
10. "Why should we hire you over other candidates?"`,
  },
  {
    id: 'insurance-specialist',
    title: 'Insurance Verification Specialist',
    description: 'Specialized role focused on insurance verification, prior auth, and billing support.',
    icon: ClipboardList,
    scenarioInstructions: `You are interviewing the student for an Insurance Verification Specialist position at a multi-specialty clinic.
The clinic has 8 providers and processes about 100 insurance verifications per day.
This is a specialized role. The ideal candidate should demonstrate:
- Deep understanding of insurance types (HMO, PPO, POS, EPO)
- Knowledge of prior authorization processes
- Familiarity with eligibility verification workflows
- Understanding of deductibles, coinsurance, copays, and OOP maximums
- Experience with denial management basics
- Strong attention to detail
- Phone skills for calling insurance companies
Example questions (pick 8-10):
1. "Walk me through how you verify a patient's insurance eligibility."
2. "What's the difference between an HMO and a PPO?"
3. "A patient's insurance shows as inactive. What steps do you take?"
4. "Explain the prior authorization process."
5. "What information do you need when calling an insurance company?"
6. "A claim was denied for 'no authorization on file.' What do you do?"
7. "What does 'out-of-network' mean and how does it affect the patient?"
8. "How do you handle a patient who doesn't understand their financial responsibility?"
9. "Tell me about a time you had to pay close attention to details."
10. "How do you prioritize when you have 20 verifications to complete before tomorrow?"`,
  },
  {
    id: 'referral-coordinator',
    title: 'Referral Coordinator',
    description: 'Mid-level role managing specialist referrals and prior authorizations.',
    icon: Briefcase,
    scenarioInstructions: `You are interviewing the student for a Referral Coordinator position at a large multi-specialty practice.
This is a mid-level role requiring coordination between PCPs, specialists, and insurance companies.
The ideal candidate should demonstrate:
- Understanding of the referral process (internal and external)
- Knowledge of prior authorization requirements
- Insurance plan knowledge (which plans require referrals)
- Strong organizational and follow-up skills
- Communication skills for patient education
- Ability to track and manage multiple pending referrals
Example questions (pick 8-10):
1. "Describe the referral process from start to finish."
2. "Which types of insurance plans typically require referrals?"
3. "A patient needs to see a cardiologist but their HMO requires a referral. Walk me through the steps."
4. "How do you track pending authorizations to make sure none fall through the cracks?"
5. "A specialist is not in the patient's network. What options do you present to the patient?"
6. "An authorization was denied. What's your next step?"
7. "How do you communicate with patients about referral status?"
8. "Tell me about a time you had to coordinate between multiple parties."
9. "What's the difference between a referral and a prior authorization?"
10. "How do you handle urgent referrals that need same-day processing?"`,
  },
];

type View = 'select' | 'active' | 'results';

export function MockInterview() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('select');
  const [role, setRole] = useState<InterviewRole | null>(null);
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
    practiceMode: 'mock-interview',
    scenarioType: role?.id,
    scenarioInstructions: role?.scenarioInstructions,
  };

  const { messages, isLoading, sendMessage, clearMessages } = useAiTutor(sectionContext);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (awaitingSetup && messages.length === 0 && role && !setupSentRef.current) {
      setupSentRef.current = true;
      setAwaitingSetup(false);
      sendMessage(
        `[INTERVIEW START] I'm here for the ${role.title} interview. Please begin the interview.`
      );
    }
  }, [awaitingSetup, messages, role, sendMessage]);

  useEffect(() => {
    if (isEvaluating && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        setEvaluation(lastMsg.content);
        setIsEvaluating(false);
        setView('results');

        if (role) {
          const ratingMatch = lastMsg.content.match(/OVERALL IMPRESSION:\s*(\d)/);
          const rating = ratingMatch ? parseInt(ratingMatch[1]) : 3;
          const newProgress = { ...progress };
          if (!newProgress.completedInterviews.includes(role.id)) {
            newProgress.completedInterviews.push(role.id);
          }
          newProgress.ratings[role.id] = Math.max(
            newProgress.ratings[role.id] || 0,
            rating
          );
          setProgress(newProgress);
          saveProgress(newProgress);
        }
      }
    }
  }, [isEvaluating, isLoading, messages, role, progress]);

  const startInterview = (r: InterviewRole) => {
    setRole(r);
    setupSentRef.current = false;
    clearMessages();
    setAwaitingSetup(true);
    setEvaluation(null);
    setIsEvaluating(false);
    setView('active');
  };

  const endInterview = () => {
    setIsEvaluating(true);
    sendMessage('[INTERVIEW ENDED] Please provide your comprehensive evaluation of my interview performance.');
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const displayMessages = messages.filter((m, i) => {
    if (i === 0 && m.role === 'user' && m.content.startsWith('[INTERVIEW START]')) return false;
    if (m.role === 'user' && m.content.startsWith('[INTERVIEW ENDED]')) return false;
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
          <ArrowLeft className="w-4 h-4" /> Back to Job Readiness Center
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Mock Interview</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Practice real job interview questions with AI coaching after each answer.
          </p>
        </div>

        <div className="grid gap-4">
          {interviewRoles.map((r) => {
            const Icon = r.icon;
            const isComplete = progress.completedInterviews.includes(r.id);
            const rating = progress.ratings[r.id];

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-apple-sm border border-gray-200/50 p-6 hover-lift transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{r.title}</h3>
                      {isComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{r.description}</p>
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
                    onClick={() => startInterview(r)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isComplete
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-amber-600 text-white hover:bg-amber-700 shadow-apple-sm'
                    }`}
                  >
                    {isComplete ? 'Retry' : 'Start'}
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
    const ratingMatch = evaluation.match(/OVERALL IMPRESSION:\s*(\d)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

    const strengthsMatch = evaluation.match(/TOP 3 STRENGTHS:([\s\S]*?)(?=TOP 3 AREAS|MODEL ANSWERS|HIRING|$)/i);
    const improvementsMatch = evaluation.match(/TOP 3 AREAS TO IMPROVE:([\s\S]*?)(?=MODEL ANSWERS|HIRING|$)/i);
    const hiringMatch = evaluation.match(/HIRING RECOMMENDATION:([\s\S]*?)$/i);

    const parseBullets = (text: string | undefined) => {
      if (!text) return [];
      return text.split('\n').map(l => l.replace(/^[\s\-\*•\d.]+/, '').trim()).filter(Boolean);
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
          <div className="bg-amber-600 p-6 text-white text-center">
            <MessageSquare className="w-10 h-10 mx-auto mb-3" />
            <h2 className="text-2xl font-semibold">Interview Evaluation</h2>
            <p className="text-amber-200 mt-1">{role?.title}</p>
          </div>

          <div className="p-6 space-y-5">
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
              <p className="text-sm text-gray-500">Overall Impression</p>
            </div>

            {/* Strengths */}
            {parseBullets(strengthsMatch?.[1]).length > 0 && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Strengths
                </h3>
                <ul className="space-y-1">
                  {parseBullets(strengthsMatch?.[1]).map((s, i) => (
                    <li key={i} className="text-sm text-green-700">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {parseBullets(improvementsMatch?.[1]).length > 0 && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Areas to Improve
                </h3>
                <ul className="space-y-1">
                  {parseBullets(improvementsMatch?.[1]).map((s, i) => (
                    <li key={i} className="text-sm text-amber-700">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hiring Recommendation */}
            {hiringMatch?.[1]?.trim() && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                <p className="text-sm font-medium text-blue-800">{hiringMatch[1].trim()}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => role && startInterview(role)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={() => { setView('select'); setRole(null); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all text-sm font-medium shadow-apple-sm"
              >
                Choose Role <ChevronRight className="w-4 h-4" />
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
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { setView('select'); setRole(null); }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Leave Interview
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">{role?.title} Interview</span>
        </div>
        <button
          onClick={endInterview}
          disabled={isLoading || displayMessages.length < 4}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-sm font-medium hover:bg-amber-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          End Interview
        </button>
      </div>

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
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Briefcase className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-medium text-amber-600 uppercase">Interviewer</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Your answer..."
              disabled={isLoading || isEvaluating}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isEvaluating}
              className="px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
