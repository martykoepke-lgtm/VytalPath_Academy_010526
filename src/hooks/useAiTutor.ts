import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { ChatMessage, SectionContext } from '../types/ai-tutor';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface UseAiTutorReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  rateLimitRemaining: number | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  cancelRequest: () => void;
}

export function useAiTutor(sectionContext: SectionContext): UseAiTutorReturn {
  const { session } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!session?.access_token) {
      setError('Please sign in to use the AI tutor.');
      return;
    }

    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Build messages array for API (without id/timestamp)
    const apiMessages = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          sectionContext,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('You\'ve reached the message limit. Please wait a few minutes.');
          setRateLimitRemaining(0);
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        return;
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.rateLimitRemaining !== undefined) {
        setRateLimitRemaining(data.rateLimitRemaining);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Request was cancelled by user
        return;
      }
      setError('Unable to reach the AI tutor. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [session, messages, sectionContext, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    rateLimitRemaining,
    sendMessage,
    clearMessages,
    cancelRequest,
  };
}
