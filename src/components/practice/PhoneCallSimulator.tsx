import { useState, useRef, useEffect } from 'react';
import {
  Phone, PhoneOff, Send, ArrowLeft, Star,
  Shield, MessageSquare, AlertTriangle,
  User, Headphones, Clock, ChevronRight, Loader2,
  CheckCircle, XCircle, Mic, RotateCcw
} from 'lucide-react';
import { useAiTutor } from '../../hooks/useAiTutor';
import type { SectionContext } from '../../types/ai-tutor';
import { phoneCallScenarios, type PhoneCallScenario } from '../../data/phoneCallScenarios';

const STORAGE_KEY = 'vytalpath_phone_sim';

interface StoredProgress {
  completedCalls: string[];
  ratings: Record<string, number>;
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { completedCalls: [], ratings: {} };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

const scenarioIcons: Record<string, React.ElementType> = {
  'new-patient-scheduling': User,
  'insurance-question': MessageSquare,
  'rx-refill': Phone,
  'angry-patient': AlertTriangle,
  'referral-call': Headphones,
  'emergency-triage': Shield,
};

const difficultyColors = {
  beginner: { bg: 'bg-green-50', text: 'text-green-700', label: 'Beginner' },
  intermediate: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Intermediate' },
  advanced: { bg: 'bg-red-50', text: 'text-red-700', label: 'Advanced' },
};

type View = 'select' | 'active' | 'results';

export function PhoneCallSimulator() {
  const [view, setView] = useState<View>('select');
  const [scenario, setScenario] = useState<PhoneCallScenario | null>(null);
  const [input, setInput] = useState('');
  const [callTimer, setCallTimer] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const [awaitingSetup, setAwaitingSetup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setupSentRef = useRef(false);

  const sectionContext: SectionContext = {
    sectionId: 'practice',
    sectionName: 'Job Readiness Practice',
    ...(scenario ? {
      practiceMode: 'phone-call',
      scenarioType: scenario.id,
      scenarioInstructions: scenario.scenarioInstructions,
    } : {}),
  };

  const { messages, isLoading, error, sendMessage, clearMessages } = useAiTutor(sectionContext);

  // Send setup message after messages are cleared
  useEffect(() => {
    if (awaitingSetup && messages.length === 0 && scenario && !setupSentRef.current) {
      setupSentRef.current = true;
      setAwaitingSetup(false);
      sendMessage(
        `[PHONE CALL SIMULATION START]\n\nYou are now ${scenario.callerName}. The receptionist just answered the phone. Open the call in character as this caller would. Stay in character. Keep it to 1-3 sentences.`
      );
    }
  }, [awaitingSetup, messages.length, scenario, sendMessage]);

  // Call timer
  useEffect(() => {
    if (!isCallActive) return;
    const interval = setInterval(() => setCallTimer(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect evaluation response
  useEffect(() => {
    if (!isEvaluating || isLoading) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant' &&
        messages.some(m => m.role === 'user' && m.content.includes('[CALL ENDED'))) {
      setEvaluation(lastMsg.content);
      setIsEvaluating(false);
      setView('results');

      if (scenario) {
        const ratingMatch = lastMsg.content.match(/OVERALL RATING:\s*(\d)/);
        const rating = ratingMatch ? parseInt(ratingMatch[1]) : 3;
        const newProgress = { ...progress };
        if (!newProgress.completedCalls.includes(scenario.id)) {
          newProgress.completedCalls.push(scenario.id);
        }
        const prev = newProgress.ratings[scenario.id] || 0;
        if (rating > prev) {
          newProgress.ratings[scenario.id] = rating;
        }
        setProgress(newProgress);
        saveProgress(newProgress);
      }
    }
  }, [isEvaluating, isLoading, messages, scenario, progress]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const studentTurns = messages.filter(m => m.role === 'user').length - 1; // subtract setup

  const startCall = (selectedScenario: PhoneCallScenario) => {
    setScenario(selectedScenario);
    setView('active');
    setCallTimer(0);
    setIsCallActive(true);
    setIsEvaluating(false);
    setEvaluation(null);
    setInput('');
    clearMessages();
    setupSentRef.current = false;
    setAwaitingSetup(true);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    await sendMessage(message);
    inputRef.current?.focus();
  };

  const handleEndCall = async () => {
    setIsCallActive(false);
    setIsEvaluating(true);
    await sendMessage(
      `[CALL ENDED — EVALUATION REQUEST]\n\nThe student has ended the call after ${studentTurns} responses. Please break character completely and evaluate the student's performance as a front office medical receptionist.\n\nProvide your evaluation in this exact format:\n\nOVERALL RATING: X/5\n\nCATEGORY SCORES:\n- Professionalism: X/5\n- Accuracy: X/5\n- HIPAA Compliance: X/5\n- Completeness: X/5\n- Communication: X/5\n\nSTRENGTHS:\n- [specific things done well]\n\nAREAS FOR IMPROVEMENT:\n- [specific suggestions]\n\nCRITICAL ERRORS:\n- [any serious mistakes, or "None"]\n\nKEY TAKEAWAY:\n[one sentence the student should remember]`
    );
  };

  const handleBack = () => {
    if (view === 'active' && messages.length > 1) {
      if (!confirm('End this call and return to scenario selection?')) return;
    }
    setIsCallActive(false);
    setIsEvaluating(false);
    setView('select');
    setScenario(null);
    clearMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filter display messages: hide setup and evaluation request
  const displayMessages = messages.filter((m, i) => {
    if (i === 0 && m.role === 'user') return false;
    if (m.role === 'user' && m.content.startsWith('[CALL ENDED')) return false;
    if (isEvaluating && i === messages.length - 1 && m.role === 'assistant') return false;
    return true;
  });

  // ─── SCENARIO SELECTION ───
  if (view === 'select') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-apple-sm mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Phone Call Simulator</h1>
          <p className="text-lg font-light text-gray-500 max-w-xl mx-auto">
            Practice handling real phone calls with an AI caller. Build confidence before your first day.
          </p>
        </div>

        {progress.completedCalls.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-apple border border-gray-200/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Calls Completed</span>
              <span className="font-medium text-blue-600">
                {progress.completedCalls.length}/{phoneCallScenarios.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(progress.completedCalls.length / phoneCallScenarios.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <Mic className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-800">AI-Powered Conversations</p>
              <p className="text-xs text-purple-600">Each call is unique — the AI caller responds to your specific words and actions.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {phoneCallScenarios.map((s) => {
            const Icon = scenarioIcons[s.id] || Phone;
            const diff = difficultyColors[s.difficulty];
            const isComplete = progress.completedCalls.includes(s.id);
            const rating = progress.ratings[s.id];

            return (
              <button
                key={s.id}
                onClick={() => startCall(s)}
                className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5 text-left hover-lift transition-all duration-300 hover:border-blue-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isComplete ? 'bg-green-50' : 'bg-blue-50'}`}>
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Icon className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{s.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
                        {diff.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{s.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">{s.callerType}</span>
                      {rating && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── ACTIVE CALL ───
  if (view === 'active') {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Phone Frame */}
        <div className="bg-gray-900 rounded-t-3xl p-4 flex items-center justify-between">
          <button onClick={handleBack} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-white text-sm font-medium">{scenario?.callerName}</p>
            <p className="text-gray-400 text-xs">{scenario?.callerType}</p>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">{formatTime(callTimer)}</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`px-4 py-1.5 flex items-center justify-center gap-2 ${isEvaluating ? 'bg-amber-500' : 'bg-green-600'}`}>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">
            {isEvaluating ? 'Evaluating performance...' : isLoading && displayMessages.length === 0 ? 'Connecting...' : 'Call Active'}
          </span>
        </div>

        {/* Messages Area */}
        <div className="bg-gray-50 min-h-[400px] max-h-[500px] overflow-y-auto p-4 space-y-3">
          {displayMessages.length === 0 && isLoading && (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Connecting call...</span>
              </div>
            </div>
          )}

          {displayMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && displayMessages.length > 0 && !isEvaluating && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!isEvaluating && (
          <div className="bg-white border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your response..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* End Call / Evaluating */}
        <div className="bg-white rounded-b-3xl border-t border-gray-100 p-4 flex flex-col items-center gap-2">
          {isEvaluating ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating your evaluation...</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleEndCall}
                disabled={studentTurns < 2 || isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  studentTurns < 2 || isLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                }`}
              >
                <PhoneOff className="w-4 h-4" />
                End Call
              </button>
              {studentTurns < 2 && displayMessages.length > 0 && (
                <p className="text-xs text-gray-400">Respond at least twice before ending the call</p>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // ─── EVALUATION RESULTS ───
  if (view === 'results' && evaluation) {
    const ratingMatch = evaluation.match(/OVERALL RATING:\s*(\d)/);
    const overallRating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

    const categories = [
      { name: 'Professionalism', pattern: /Professionalism:\s*(\d)/ },
      { name: 'Accuracy', pattern: /Accuracy:\s*(\d)/ },
      { name: 'HIPAA Compliance', pattern: /HIPAA Compliance:\s*(\d)/ },
      { name: 'Completeness', pattern: /Completeness:\s*(\d)/ },
      { name: 'Communication', pattern: /Communication:\s*(\d)/ },
    ].map(cat => {
      const match = evaluation.match(cat.pattern);
      return { name: cat.name, score: match ? parseInt(match[1]) : 0 };
    });

    const extractSection = (start: string, ends: string[]) => {
      const pattern = new RegExp(`${start}:\\n([\\s\\S]*?)(?=${ends.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')}|$)`);
      return evaluation.match(pattern)?.[1]?.trim() || '';
    };

    const strengths = extractSection('STRENGTHS', ['AREAS FOR IMPROVEMENT', 'CRITICAL ERRORS', 'KEY TAKEAWAY']);
    const improvements = extractSection('AREAS FOR IMPROVEMENT', ['CRITICAL ERRORS', 'KEY TAKEAWAY']);
    const criticalErrors = extractSection('CRITICAL ERRORS', ['KEY TAKEAWAY']);
    const takeaway = extractSection('KEY TAKEAWAY', []);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 ${
            overallRating >= 4 ? 'bg-green-100' : overallRating >= 3 ? 'bg-amber-100' : 'bg-red-100'
          }`}>
            {overallRating >= 4 ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : overallRating >= 3 ? (
              <Star className="w-8 h-8 text-amber-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Call Evaluation</h2>
          <p className="text-gray-500 mt-1">{scenario?.title} — {scenario?.callerName}</p>
          <div className="flex items-center justify-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-6 h-6 ${i < overallRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
            ))}
            <span className="ml-2 text-lg font-medium text-gray-700">{overallRating}/5</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Call duration: {formatTime(callTimer)} · {studentTurns} exchanges
          </p>
        </div>

        {/* Category Scores */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-5">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Category Scores</h3>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">{cat.name}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.score >= 4 ? 'bg-green-500' : cat.score >= 3 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(cat.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-8">{cat.score}/5</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
          {strengths && (
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Strengths
              </h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{strengths}</div>
            </div>
          )}

          {improvements && (
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Areas for Improvement
              </h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{improvements}</div>
            </div>
          )}

          {criticalErrors && !criticalErrors.toLowerCase().includes('none') && (
            <div className="p-5 border-b border-gray-100 bg-red-50/50">
              <h3 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Critical Errors
              </h3>
              <div className="text-sm text-red-700 whitespace-pre-wrap">{criticalErrors}</div>
            </div>
          )}

          {takeaway && (
            <div className="p-5 bg-blue-50/50">
              <h3 className="text-sm font-medium text-blue-700 mb-2">Key Takeaway</h3>
              <p className="text-sm text-blue-800 font-medium">{takeaway}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={() => startCall(scenario!)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => {
              setView('select');
              setScenario(null);
              setEvaluation(null);
              clearMessages();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm transition-all duration-300"
          >
            More Scenarios
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
