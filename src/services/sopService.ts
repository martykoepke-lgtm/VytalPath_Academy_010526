import { supabase } from '../lib/supabase';
import type { SOP, SOPProgress } from '../types/sop';

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = localStorage.getItem('medical_hub_session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('medical_hub_session', sessionId);
  }
  return sessionId;
}

export async function getAllSOPs(): Promise<SOP[]> {
  const { data, error } = await supabase
    .from('sops')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('Error fetching SOPs:', error);
    return [];
  }

  return data || [];
}

export async function getSOPBySlug(slug: string): Promise<SOP | null> {
  const { data, error } = await supabase
    .from('sops')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching SOP:', error);
    return null;
  }

  return data;
}

export async function getSOPProgress(sopId: string): Promise<number[]> {
  const sessionId = getSessionId();

  const { data, error } = await supabase
    .from('user_sop_progress')
    .select('completed_steps')
    .eq('session_id', sessionId)
    .eq('sop_id', sopId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching progress:', error);
    return [];
  }

  return data?.completed_steps || [];
}

export async function toggleStepCompletion(
  sopId: string,
  stepIndex: number
): Promise<number[]> {
  const sessionId = getSessionId();
  const currentProgress = await getSOPProgress(sopId);

  const newProgress = currentProgress.includes(stepIndex)
    ? currentProgress.filter((i) => i !== stepIndex)
    : [...currentProgress, stepIndex].sort((a, b) => a - b);

  const { error } = await supabase
    .from('user_sop_progress')
    .upsert(
      {
        session_id: sessionId,
        sop_id: sopId,
        completed_steps: newProgress,
        last_accessed: new Date().toISOString(),
      },
      {
        onConflict: 'session_id,sop_id',
      }
    );

  if (error) {
    console.error('Error updating progress:', error);
    return currentProgress;
  }

  return newProgress;
}

export async function resetSOPProgress(sopId: string): Promise<void> {
  const sessionId = getSessionId();

  await supabase
    .from('user_sop_progress')
    .delete()
    .eq('session_id', sessionId)
    .eq('sop_id', sopId);
}
