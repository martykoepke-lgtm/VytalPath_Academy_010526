import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { X, Send, Trash2, MessageCircle, Loader2 } from 'lucide-react';
import type { AiTutorTheme, ChatMessage, SectionContext } from '../../types/ai-tutor';
import { useAiTutor } from '../../hooks/useAiTutor';
import { formatMessage } from './formatMessage';
import { defaultSuggestedQuestions } from './themes';

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

function WelcomeMessage({ sectionName, sectionId, theme, onQuestionClick }: {
  sectionName: string;
  sectionId: string;
  theme: AiTutorTheme;
  onQuestionClick: (q: string) => void;
}) {
  const questions = defaultSuggestedQuestions[sectionId] || defaultSuggestedQuestions.workflows;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
      <div className={`w-12 h-12 rounded-full ${theme.lightBg} flex items-center justify-center mb-4`}>
        <MessageCircle className={`w-6 h-6 ${theme.iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Study Assistant</h3>
      <p className="text-sm text-gray-500 mb-6">
        Ask me anything about {sectionName.toLowerCase()}. I'm here to help you learn!
      </p>
      <div className="w-full space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Suggested questions</p>
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onQuestionClick(q)}
            className={`w-full text-left text-sm px-4 py-2.5 rounded-xl border ${theme.borderColor} hover:${theme.lightBg.replace('bg-', 'bg-')} transition-colors text-gray-700`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPanel({ isOpen, onClose, theme, sectionContext }: ChatPanelProps) {
  const { messages, isLoading, error, rateLimitRemaining, sendMessage, clearMessages, cancelRequest } = useAiTutor(sectionContext);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className={`${theme.headerBg} text-white px-4 py-3 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">AI Study Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeMessage
              sectionName={sectionContext.sectionName}
              sectionId={sectionContext.sectionId}
              theme={theme}
              onQuestionClick={(q) => sendMessage(q)}
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
              className={`flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme.focusRing} focus:border-transparent max-h-24`}
              disabled={isLoading}
            />
            {isLoading ? (
              <button
                onClick={cancelRequest}
                className="p-2 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors flex-shrink-0"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2 rounded-xl ${theme.buttonBg} ${theme.buttonHoverBg} text-white transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed`}
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
