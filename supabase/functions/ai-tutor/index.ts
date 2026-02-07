// Supabase Edge Function: AI Tutor
// Calls Claude API with healthcare front office knowledge base as system prompt

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { KNOWLEDGE_BASE } from './knowledge-base.ts'

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SectionContext {
  sectionId: string;
  sectionName: string;
  currentPhase?: string;
  currentLesson?: string;
  currentSOP?: string;
}

interface AiTutorRequest {
  messages: ChatMessage[];
  sectionContext: SectionContext;
}

// In-memory rate limiting (resets on cold start - acceptable for v1)
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_MESSAGES = 50;

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (userLimit.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT - userLimit.count };
}

function buildSystemPrompt(sectionContext: SectionContext): string {
  let contextBlock = `\n\n## Current Student Context\nThe student is currently in the "${sectionContext.sectionName}" section.`;

  if (sectionContext.currentPhase) {
    contextBlock += `\nThey are viewing the "${sectionContext.currentPhase}" phase.`;
  }
  if (sectionContext.currentLesson) {
    contextBlock += `\nThey are on the lesson: "${sectionContext.currentLesson}".`;
  }
  if (sectionContext.currentSOP) {
    contextBlock += `\nThey have the SOP "${sectionContext.currentSOP}" open.`;
  }

  contextBlock += `\n\nFocus your responses on topics relevant to this section. If the student asks about something from a different section, you can answer briefly but guide them back to the current material.`;

  return KNOWLEDGE_BASE + contextBlock;
}

function trimMessages(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length <= MAX_MESSAGES) return messages;
  // Keep first 2 messages for context, last 48 for recency
  return [...messages.slice(0, 2), ...messages.slice(-48)];
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(user.id);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a few minutes.', rateLimitRemaining: 0 }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const body: AiTutorRequest = await req.json();
    const { messages, sectionContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!sectionContext || !sectionContext.sectionId) {
      return new Response(
        JSON.stringify({ error: 'Section context is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build system prompt and trim conversation
    const systemPrompt = buildSystemPrompt(sectionContext);
    const trimmedMessages = trimMessages(messages);

    // Call Claude API
    const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
    if (!CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system: systemPrompt,
        messages: trimmedMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', claudeResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable. Please try again.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const claudeData = await claudeResponse.json();
    const assistantMessage = claudeData.content?.[0]?.text || 'I apologize, I was unable to generate a response. Please try again.';

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        rateLimitRemaining: remaining,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI tutor error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
