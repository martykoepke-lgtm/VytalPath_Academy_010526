import { useState, useEffect } from 'react';
import {
  FileText, ArrowLeft, Copy, CheckCircle, Loader2,
  RefreshCw, ChevronRight, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAiTutor } from '../../hooks/useAiTutor';
import type { SectionContext } from '../../types/ai-tutor';

const STORAGE_KEY = 'vytalpath_resume';

interface StoredProgress {
  bulletPoints: string[];
  lastGenerated: string | null;
}

function loadProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { bulletPoints: [], lastGenerated: null };
}

function saveProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Scan all localStorage keys for progress
function gatherSkillEvidence(): string {
  const evidence: string[] = [];

  // Lesson progress
  try {
    const prog = localStorage.getItem('vytalpath_progress');
    if (prog) {
      const data = JSON.parse(prog);
      const lessonCount = Object.keys(data.lessonProgress || {}).length;
      const quizCount = Object.keys(data.quizAttempts || {}).length;
      if (lessonCount > 0) evidence.push(`Completed ${lessonCount} educational lessons across healthcare curriculum`);
      if (quizCount > 0) evidence.push(`Passed ${quizCount} knowledge assessment quizzes`);
    }
  } catch { /* ignore */ }

  // Interactive experiences
  try {
    const interactive = localStorage.getItem('vytalpath_interactive_progress');
    if (interactive) {
      const data = JSON.parse(interactive);
      if (data.simulationCompleted) evidence.push('Completed workplace simulation with realistic decision-making scenarios');
      if (data.spotViolationCompleted) evidence.push('Demonstrated ability to identify HIPAA and compliance violations');
      if (data.riskMeterCompleted) evidence.push('Trained in healthcare risk assessment and categorization');
    }
  } catch { /* ignore */ }

  // Phone calls
  try {
    const phone = localStorage.getItem('vytalpath_phone_sim');
    if (phone) {
      const data = JSON.parse(phone);
      if (data.completedCalls?.length > 0) {
        evidence.push(`Practiced ${data.completedCalls.length} AI-simulated phone call scenario(s): patient scheduling, insurance inquiries, difficult callers`);
      }
    }
  } catch { /* ignore */ }

  // Day in the Life
  try {
    const day = localStorage.getItem('vytalpath_day_sim');
    if (day) {
      const data = JSON.parse(day);
      if (data.completedShifts?.length > 0) {
        evidence.push(`Completed ${data.completedShifts.length} full-shift simulation(s) managing front office operations`);
      }
    }
  } catch { /* ignore */ }

  // Insurance Hotline
  try {
    const hotline = localStorage.getItem('vytalpath_ins_hotline');
    if (hotline) {
      const data = JSON.parse(hotline);
      if (data.completedCalls?.length > 0) {
        evidence.push(`Practiced ${data.completedCalls.length} insurance verification call(s) with form completion`);
      }
    }
  } catch { /* ignore */ }

  // Payment Calculator
  try {
    const calc = localStorage.getItem('vytalpath_payment_calc');
    if (calc) {
      const data = JSON.parse(calc);
      if (data.completedScenarios?.length > 0) {
        evidence.push(`Calculated patient financial responsibility across ${data.completedScenarios.length} insurance scenario(s)`);
      }
    }
  } catch { /* ignore */ }

  // PHI Challenge
  try {
    const phi = localStorage.getItem('vytalpath_phi_challenge');
    if (phi) {
      const data = JSON.parse(phi);
      if (data.completedScenes?.length > 0) {
        evidence.push('Demonstrated PHI identification skills across multiple HIPAA document scenarios');
      }
    }
  } catch { /* ignore */ }

  // Term Builder
  try {
    const term = localStorage.getItem('vytalpath_term_builder');
    if (term) {
      const data = JSON.parse(term);
      if (data.completedTerms?.length > 0) {
        evidence.push(`Built ${data.completedTerms.length} medical terms from prefix/root/suffix components`);
      }
    }
  } catch { /* ignore */ }

  // Workflow Sequencer
  try {
    const workflow = localStorage.getItem('vytalpath_workflow_seq');
    if (workflow) {
      const data = JSON.parse(workflow);
      if (data.completedWorkflows?.length > 0) {
        evidence.push(`Correctly sequenced ${data.completedWorkflows.length} front office workflow(s)`);
      }
    }
  } catch { /* ignore */ }

  // Mock Interview
  try {
    const interview = localStorage.getItem('vytalpath_interview');
    if (interview) {
      const data = JSON.parse(interview);
      if (data.completedInterviews?.length > 0) {
        evidence.push(`Completed ${data.completedInterviews.length} mock interview(s) for healthcare front office roles`);
      }
    }
  } catch { /* ignore */ }

  if (evidence.length === 0) {
    evidence.push('Student is just getting started with the healthcare training curriculum');
  }

  return evidence.join('\n- ');
}

export function ResumeBulletBuilder() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const [bullets, setBullets] = useState<string[]>(progress.bulletPoints);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const sectionContext: SectionContext = {
    sectionId: 'practice',
    sectionName: 'Job Readiness Center',
  };

  const { sendMessage, messages, isLoading, clearMessages } = useAiTutor(sectionContext);

  // Watch for AI response
  useEffect(() => {
    if (isGenerating && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        // Parse bullet points from response
        const lines = lastMsg.content.split('\n')
          .map(l => l.replace(/^[\s\-\*•\d.]+/, '').trim())
          .filter(l => l.length > 20); // Only substantial lines

        if (lines.length > 0) {
          setBullets(lines);
          const newProgress: StoredProgress = {
            bulletPoints: lines,
            lastGenerated: new Date().toISOString(),
          };
          setProgress(newProgress);
          saveProgress(newProgress);
        }
        setIsGenerating(false);
      }
    }
  }, [isGenerating, isLoading, messages]);

  const generateBullets = () => {
    const evidence = gatherSkillEvidence();
    setIsGenerating(true);
    clearMessages();

    // Small delay to ensure clearMessages takes effect
    setTimeout(() => {
      sendMessage(
        `Generate 6-8 professional resume bullet points for a healthcare front office position based on these demonstrated skills and training:

- ${evidence}

Format each bullet point to:
1. Start with a strong action verb
2. Be quantifiable where possible
3. Be concise (1 sentence each)
4. Focus on skills relevant to medical receptionist, insurance verification, or front office coordinator roles
5. Sound professional and ready to copy-paste onto a resume

Just provide the bullet points, one per line, with no numbering or extra formatting.`
      );
    }, 100);
  };

  const copyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(bullets.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(bullets[index]);
  };

  const saveEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      const newBullets = [...bullets];
      newBullets[editIndex] = editValue.trim();
      setBullets(newBullets);
      const newProgress: StoredProgress = {
        bulletPoints: newBullets,
        lastGenerated: progress.lastGenerated,
      };
      setProgress(newProgress);
      saveProgress(newProgress);
    }
    setEditIndex(null);
    setEditValue('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/practice')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Job Readiness Center
      </button>

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Resume Bullet Builder</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Generate professional resume bullet points based on the skills you've demonstrated in the program.
        </p>
      </div>

      {/* Generate Button */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">AI Resume Generator</h3>
            <p className="text-sm text-gray-500">
              {bullets.length > 0
                ? 'Click to regenerate based on your latest progress.'
                : 'We\'ll scan your training progress and generate tailored bullet points.'}
            </p>
          </div>
          <button
            onClick={generateBullets}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all shadow-apple-sm disabled:opacity-50 text-sm font-medium"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : bullets.length > 0 ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Bullets
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bullets */}
      {bullets.length > 0 && (
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Your Resume Bullets</h3>
            <button
              onClick={copyAll}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs font-medium transition-all"
            >
              {copiedIndex === -1 ? (
                <><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy All</>
              )}
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {bullets.map((bullet, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors group">
                {editIndex === i ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <p className="flex-1 text-sm text-gray-800 leading-relaxed">{bullet}</p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(i)}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => copyBullet(bullet, i)}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
                      >
                        {copiedIndex === i ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Click any bullet to edit. Generate again after completing more activities for updated bullets.
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {bullets.length === 0 && !isGenerating && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No bullet points generated yet</p>
          <p className="text-sm text-gray-400">Click the generate button above to create your resume bullets.</p>
        </div>
      )}
    </div>
  );
}
