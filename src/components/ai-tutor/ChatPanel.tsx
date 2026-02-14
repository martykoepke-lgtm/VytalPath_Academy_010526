import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { X, Send, Trash2, MessageCircle, Loader2, HelpCircle } from 'lucide-react';
import type { AiTutorTheme, ChatMessage, SectionContext } from '../../types/ai-tutor';
import type { AgentMode } from '../../types/agent';
import { useAgentTutor } from '../../hooks/useAgentTutor';
import { formatMessage } from './formatMessage';
import { defaultSuggestedQuestions, agentModeSuggestedQuestions } from './themes';
import AgentModeIndicator from './AgentModeIndicator';
import SuggestedActionCard from './SuggestedActionCard';
import { useNavigate } from 'react-router-dom';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AiTutorTheme;
  sectionContext: SectionContext;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 px-4 py-2">
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, theme }: { message: ChatMessage; theme: AiTutorTheme }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-1`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? `${theme.userBubbleBg} text-white rounded-tr-sm`
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div
            className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0 [&_br]:block [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
        )}
      </div>
    </div>
  );
}

function WelcomeMessage({ sectionName, sectionId, activeAgent, theme, onQuestionClick, suggestedNextAction, onSuggestedAction }: {
  sectionName: string;
  sectionId: string;
  activeAgent: AgentMode;
  theme: AiTutorTheme;
  onQuestionClick: (q: string) => void;
  suggestedNextAction: ReturnType<typeof useAgentTutor>['suggestedNextAction'];
  onSuggestedAction: () => void;
}) {
  // Use agent-specific questions when in a non-tutor mode
  const questions = activeAgent !== 'tutor' && agentModeSuggestedQuestions[activeAgent]
    ? agentModeSuggestedQuestions[activeAgent]
    : defaultSuggestedQuestions[sectionId] || defaultSuggestedQuestions.workflows;

  const agentLabels: Record<AgentMode, string> = {
    tutor: 'AI Study Assistant',
    'ehr-coach': 'EHR Practice Coach',
    assessment: 'Adaptive Practice',
    'patient-sim': 'Patient Simulation',
    'sop-scenario': 'SOP Scenario Practice',
  };

  const agentDescriptions: Record<AgentMode, string> = {
    tutor: `Ask me anything about ${sectionName.toLowerCase()}. I'm here to help you learn!`,
    'ehr-coach': 'I\'ll guide you through EHR workflows and help you navigate the Practice Lab.',
    assessment: 'I\'ll generate practice questions targeted at your weak areas. These are ungraded!',
    'patient-sim': 'I\'ll role-play as a patient so you can practice front desk interactions.',
    'sop-scenario': 'I\'ll create realistic workplace scenarios to test your SOP knowledge.',
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
      <div className={`w-12 h-12 rounded-2xl ${theme.lightBg} flex items-center justify-center mb-4`}>
        <MessageCircle className={`w-6 h-6 ${theme.iconColor}`} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{agentLabels[activeAgent]}</h3>
      <p className="text-sm text-gray-500 mb-6">
        {agentDescriptions[activeAgent]}
      </p>

      {/* Suggested action from orchestrator */}
      {suggestedNextAction && activeAgent === 'tutor' && (
        <div className="w-full mb-4">
          <SuggestedActionCard action={suggestedNextAction} onAction={onSuggestedAction} />
        </div>
      )}

      <div className="w-full space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Suggested questions</p>
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onQuestionClick(q)}
            className={`w-full text-left text-sm px-4 py-2.5 rounded-xl border ${theme.borderColor} hover:${theme.lightBg.replace('bg-', 'bg-')} transition-all duration-300 text-gray-700`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPanel({ isOpen, onClose, theme, sectionContext }: ChatPanelProps) {
  const {
    messages, isLoading, error, rateLimitRemaining,
    sendMessage, clearMessages, cancelRequest,
    activeAgent, setActiveAgent, suggestedNextAction,
  } = useAgentTutor(sectionContext);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Escape key closes panel
  useEffect(() => {
    const handleEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModeChange = (mode: AgentMode) => {
    setActiveAgent(mode);
    clearMessages();
  };

  const handleSuggestedAction = () => {
    if (suggestedNextAction) {
      if (suggestedNextAction.agentMode) {
        setActiveAgent(suggestedNextAction.agentMode);
        clearMessages();
      }
      if (suggestedNextAction.route) {
        navigate(suggestedNextAction.route);
      }
    }
  };

  return (
    <>
      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-white shadow-apple-lg rounded-l-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className={`${theme.headerBg} text-white px-4 py-3 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium text-sm">AI Study Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onClose(); navigate('/ai-guide'); }}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300"
              title="AI Study Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Agent Mode Indicator */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <AgentModeIndicator activeAgent={activeAgent} onModeChange={handleModeChange} />
          {activeAgent !== 'tutor' && (
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {activeAgent === 'assessment' ? 'Ungraded' : 'Practice Mode'}
            </span>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeMessage
              sectionName={sectionContext.sectionName}
              sectionId={sectionContext.sectionId}
              activeAgent={activeAgent}
              theme={theme}
              onQuestionClick={(q) => sendMessage(q)}
              suggestedNextAction={suggestedNextAction}
              onSuggestedAction={handleSuggestedAction}
            />
          ) : (
            <div className="py-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} theme={theme} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Rate limit warning */}
        {rateLimitRemaining !== null && rateLimitRemaining <= 5 && rateLimitRemaining > 0 && (
          <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-100">
            <p className="text-xs text-amber-600">{rateLimitRemaining} messages remaining in this window</p>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              className={`flex-1 resize-none rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme.focusRing} focus:border-transparent max-h-24`}
              disabled={isLoading}
            />
            {isLoading ? (
              <button
                onClick={cancelRequest}
                className="p-2 rounded-2xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 flex-shrink-0"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2 rounded-2xl ${theme.buttonBg} ${theme.buttonHoverBg} text-white transition-all duration-300 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed`}
                title="Send (Enter)"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">
            AI responses are for learning purposes. Always verify with your supervisor.
          </p>
        </div>
      </div>
    </>
  );
}
