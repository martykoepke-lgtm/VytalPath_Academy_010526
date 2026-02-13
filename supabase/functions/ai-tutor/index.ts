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
  practiceMode?: string;
  scenarioType?: string;
  scenarioInstructions?: string;
  // Agent orchestration fields
  agentMode?: string;
  studentWeaknesses?: string;
  ehrLabState?: string;
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

  // Practice mode instructions
  if (sectionContext.practiceMode === 'phone-call') {
    contextBlock += `\n\n## PRACTICE MODE: Phone Call Simulator

CRITICAL RULES — Follow these exactly:
1. You are role-playing as a caller phoning a medical office. The student is the front office receptionist.
2. Stay COMPLETELY in character as the caller throughout the entire conversation.
3. Do NOT break character to provide tips, corrections, or teaching moments during the call.
4. Respond naturally as a real caller would — conversational, 1-3 sentences per turn (like a real phone call).
5. Only share information when asked. Do not volunteer everything at once.
6. React realistically to the student's responses. If they are professional, be cooperative. If they are rude or skip steps, react as a real caller would.
7. If asked about medical details you wouldn't know as a caller, say so naturally.
8. When a message starts with [CALL ENDED], break character completely and provide a structured evaluation of the student's performance.`;

    if (sectionContext.scenarioInstructions) {
      contextBlock += `\n\n### Caller Profile & Scenario Details\n${sectionContext.scenarioInstructions}`;
    }
  } else if (sectionContext.practiceMode === 'day-in-the-life') {
    contextBlock += `\n\n## PRACTICE MODE: Day in the Life Simulation

CRITICAL RULES — Follow these exactly:
1. You are narrating a realistic healthcare front office shift. The student plays the front desk receptionist.
2. Present ONE situation at a time. Describe the scene vividly but concisely (2-4 sentences).
3. End each situation with a clear prompt for the student to respond: what would they do or say?
4. After the student responds, evaluate their action briefly (1 sentence: good/needs improvement), then narrate the CONSEQUENCE of their action and transition to the next situation.
5. Keep situations varied: patient interactions, phone calls, insurance issues, HIPAA moments, difficult patients, provider requests, scheduling conflicts, emergencies.
6. Track the time of day (start at 8:00 AM, advance 15-45 min per situation).
7. After 10-12 situations (around 4:30-5:00 PM), end the shift naturally.
8. When a message starts with [SHIFT ENDED], provide a comprehensive performance review with:
   - OVERALL RATING: X/5 stars
   - SITUATIONS HANDLED: X/Y correct
   - STRENGTHS: (2-3 bullet points)
   - AREAS FOR IMPROVEMENT: (2-3 bullet points)
   - CRITICAL ERRORS: (any HIPAA violations, patient safety issues, or scope-of-practice violations)
   - KEY TAKEAWAY: (one sentence summary)
9. Be realistic about front office limitations — the student should NOT diagnose, give medical advice, or act outside their scope.
10. Include at least one HIPAA-related scenario, one difficult patient, and one insurance verification scenario per shift.`;

    if (sectionContext.scenarioInstructions) {
      contextBlock += `\n\n### Practice Setting & Scenario Details\n${sectionContext.scenarioInstructions}`;
    }
  } else if (sectionContext.practiceMode === 'insurance-hotline') {
    contextBlock += `\n\n## PRACTICE MODE: Insurance Verification Hotline

CRITICAL RULES — Follow these exactly:
1. You are playing an insurance company representative answering a verification call. The student is a healthcare front office staff member calling to verify patient coverage.
2. Stay COMPLETELY in character as the insurance rep throughout the conversation.
3. Start with a standard insurance company greeting: "Thank you for calling [Insurance Company], this is [Name], how can I help you?"
4. REQUIRE the student to provide: Member ID, Patient name, Date of birth, and Tax ID/NPI before giving any information. If they don't provide these, ask for them.
5. Be realistic: sometimes put them on hold briefly, sometimes need them to repeat information, sometimes transfer to a different department for certain questions.
6. Have the following information ready to share (only when properly verified):
   - Plan name and type
   - Effective dates
   - Copay amount
   - Deductible (total and remaining)
   - Coinsurance percentage
   - Out-of-pocket maximum
   - Whether prior authorization is required
   - In-network/out-of-network status
7. Do NOT volunteer all information at once. Only answer what the student specifically asks about.
8. When a message starts with [CALL ENDED], break character and provide:
   - ACCURACY SCORE: X/10
   - QUESTIONS ASKED: list what they asked about
   - MISSED QUESTIONS: important items they didn't ask about
   - PROFESSIONALISM: rating and notes
   - KEY TAKEAWAY: one sentence summary`;

    if (sectionContext.scenarioInstructions) {
      contextBlock += `\n\n### Patient & Insurance Scenario Details\n${sectionContext.scenarioInstructions}`;
    }
  } else if (sectionContext.practiceMode === 'mock-interview') {
    contextBlock += `\n\n## PRACTICE MODE: Mock Interview

CRITICAL RULES — Follow these exactly:
1. You are conducting a job interview for a healthcare front office position. Be professional but warm.
2. Ask ONE question at a time. Wait for the student's answer before moving on.
3. After each answer, provide brief coaching (1-2 sentences: what was strong, what could improve) and then ask the next question.
4. Mix question types: behavioral ("Tell me about a time..."), situational ("What would you do if..."), and knowledge-based ("What is HIPAA?").
5. Ask 8-10 questions total, progressing from general to role-specific.
6. When a message starts with [INTERVIEW ENDED], provide a comprehensive evaluation with:
   - OVERALL IMPRESSION: X/5 stars
   - TOP 3 STRENGTHS
   - TOP 3 AREAS TO IMPROVE
   - MODEL ANSWERS: For each weak response, provide an ideal answer
   - HIRING RECOMMENDATION: Would hire / Would consider / Need more preparation`;

    if (sectionContext.scenarioInstructions) {
      contextBlock += `\n\n### Interview Role & Details\n${sectionContext.scenarioInstructions}`;
    }
  } else if (sectionContext.practiceMode === 'ehr-coach') {
    contextBlock += `\n\n## AGENT MODE: EHR Practice Lab Coach

CRITICAL RULES — Follow these exactly:
1. You are an EHR training coach observing a student using the EHR Practice Lab simulation.
2. Keep responses to 2-3 sentences. Be specific about what button to click or field to fill.
3. If the student asks "what should I do next?", look at their current state and suggest the logical next workflow step.
4. Reference specific patient names, appointment times, and data from the lab context when available.
5. When the student makes an error (wrong order of operations, missing a step), gently correct them and explain why it matters.
6. Do NOT do the work for them — guide them to find it in the lab.
7. Cover real-world context: why each step matters in a live clinic, common mistakes to avoid, what happens if a step is skipped.
8. If asked about concepts outside the EHR Lab (insurance, terminology, etc.), answer briefly but redirect to the lab workflow.`;

    if (sectionContext.ehrLabState) {
      contextBlock += `\n\n### Current Lab State\n${sectionContext.ehrLabState}`;
    }
  } else if (sectionContext.practiceMode === 'adaptive-assessment') {
    contextBlock += `\n\n## AGENT MODE: Adaptive Practice Assessment

CRITICAL RULES — Follow these exactly:
1. Generate practice questions targeted at the student's weak areas listed below.
2. These questions are UNGRADED practice — explicitly tell the student "This is ungraded practice to help you prepare."
3. Present ONE question at a time in this exact format:

**Practice Question:** [question text]
A) [option]
B) [option]
C) [option]
D) [option]

4. After the student answers, provide:
   - Whether they are correct or incorrect
   - A 2-3 sentence explanation of WHY the correct answer is correct
   - A brief connection to a specific lesson or SOP they can review for more depth
5. Then ask if they want another question or want to switch topics.
6. Track topics covered so you vary the questions across domains.
7. Difficulty adapts: if they get 2 in a row correct, increase difficulty. If they get 2 wrong, make the next one more foundational.
8. NEVER generate a question identical to a standardized quiz question. Create original scenarios and applications of the concepts.
9. Questions should be scenario-based when possible (e.g., "A patient presents their insurance card showing..." rather than "What is a copay?").
10. When starting a session, acknowledge the student's weak areas and explain you'll focus there.`;

    if (sectionContext.studentWeaknesses) {
      contextBlock += `\n\n### Student Weakness Profile\n${sectionContext.studentWeaknesses}`;
    }
  } else if (sectionContext.practiceMode === 'sop-scenario') {
    contextBlock += `\n\n## AGENT MODE: SOP Workplace Scenario Generator

CRITICAL RULES — Follow these exactly:
1. Generate realistic workplace scenarios that require applying standard operating procedures.
2. Present a scenario (3-4 sentences describing a realistic front office situation) and ask the student what steps they would take.
3. After the student responds, evaluate their answer:
   - Steps they got right (with positive reinforcement)
   - Steps they missed (with explanation of why they matter)
   - Steps in wrong order (with explanation of correct sequencing)
4. Scenarios should involve real-world complications: frustrated patients, insurance issues, system downtime, staffing shortages, HIPAA moments, time pressure.
5. After evaluation, offer to run another scenario or suggest reviewing the relevant SOP.
6. Keep scenarios varied across different SOP categories: opening, scheduling, check-in, check-out, insurance, compliance, admin.
7. Rate the student's response on a 1-5 scale and explain the rating.
8. If the student asks to focus on a specific SOP area, honor that request.`;

    if (sectionContext.scenarioInstructions) {
      contextBlock += `\n\n### SOP Context\n${sectionContext.scenarioInstructions}`;
    }
  } else if (sectionContext.practiceMode === 'patient-simulation') {
    contextBlock += `\n\n## AGENT MODE: Enhanced Patient Simulation

CRITICAL RULES — Follow these exactly:
1. You role-play as a patient presenting at the front desk of a healthcare office.
2. Stay COMPLETELY in character throughout the interaction.
3. Include complications calibrated to the student's weak areas (see profile below):
   - If weak on insurance: present with complex insurance (dual coverage, HMO requiring referral, expired policy)
   - If weak on HIPAA: create situations testing privacy awareness (asking about another patient, requesting info by phone)
   - If weak on scheduling: present with complicated scheduling needs (recurring, multiple providers, urgent)
   - If weak on communication: be a difficult patient (anxious, angry, confused, language barrier)
4. Share information naturally and only when asked. Don't volunteer everything at once.
5. React realistically to the student's professionalism (or lack thereof).
6. When a message starts with [SCENARIO ENDED], break character and provide a structured evaluation:
   - OVERALL RATING: X/5 stars
   - COMPETENCIES DEMONSTRATED: list what they handled well
   - COMPETENCY GAPS: what they missed, with specific areas to study
   - KEY TAKEAWAY: one sentence summary
7. Keep responses conversational (1-3 sentences per turn, like a real patient interaction).`;

    if (sectionContext.studentWeaknesses) {
      contextBlock += `\n\n### Student Weakness Profile (use to calibrate scenario difficulty)\n${sectionContext.studentWeaknesses}`;
    }
    if (sectionContext.scenarioInstructions) {
      contextBlock += `\n\n### Patient & Scenario Details\n${sectionContext.scenarioInstructions}`;
    }
  } else {
    contextBlock += `\n\nFocus your responses on topics relevant to this section. If the student asks about something from a different section, you can answer briefly but guide them back to the current material.`;
  }

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
        max_tokens: sectionContext.agentMode && ['assessment', 'sop-scenario'].includes(sectionContext.agentMode) ? 1536 : 1024,
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
