import { useMemo, useState, useEffect } from 'react';
import { Award, CheckCircle, Circle, Printer, Lock, AlertTriangle, RotateCcw, Zap, Loader2, Trash2 } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth, isSuperAdmin } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { COMPLETION_REQUIREMENTS } from '../../utils/completionCalculator';

// ─── Types ───

interface CertificateRecord {
  id: string;
  user_id: string;
  student_name: string;
  certificate_number: string;
  issued_at: string;
  is_locked: boolean;
}

// ─── Helpers ───

function generateCertNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `VPA-${code}`;
}

function formatDate(dateStr: string | Date): string {
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Certificate Visual ───

function CertificateVisual({ studentName, certDate, certNumber, totalLessons, totalQuizzes }: {
  studentName: string;
  certDate: string;
  certNumber: string;
  totalLessons: number;
  totalQuizzes: number;
}) {
  return (
    <div
      className="certificate-printable bg-white mx-auto border border-gray-200 shadow-apple-lg overflow-hidden"
      style={{ aspectRatio: '11 / 8.5', maxWidth: '1056px' }}
    >
      <div className="w-full h-full p-[3%]">
        <div
          className="w-full h-full flex flex-col items-center justify-between py-[4%] px-[6%]"
          style={{
            border: '3px double #1e3a5f',
            boxShadow: 'inset 0 0 0 1px #d4af37, inset 0 0 0 4px #fff, inset 0 0 0 5px #1e3a5f',
          }}
        >
          {/* Logo */}
          <div className="w-full flex justify-center pt-[1%]">
            <img src="/vytalpath-logo.png" alt="VytalPath Academy" className="h-32 object-contain" />
          </div>

          {/* Content */}
          <div className="text-center flex-1 flex flex-col items-center justify-center w-full pb-[4%]">
            <h2
              className="text-3xl font-bold tracking-wide mb-1"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
            >
              CERTIFICATE OF COMPLETION
            </h2>
            <div className="w-48 mx-auto mb-4" style={{ borderTop: '2px solid #d4af37' }} />
            <p className="text-sm text-gray-500 mb-3 tracking-wide">This certifies that</p>
            <div className="flex items-center gap-4 mb-3 max-w-lg w-full justify-center">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #d4af37)' }} />
              <p
                className="text-2xl font-semibold min-w-0 px-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
              >
                {studentName || 'Your Name'}
              </p>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #d4af37)' }} />
            </div>
            <p className="text-sm text-gray-600 mb-2">has successfully completed all requirements of the program</p>
            <h3
              className="text-xl font-bold tracking-wide mb-3"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
            >
              Healthcare Foundations for Front Office Professionals
            </h3>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed">
              Including {totalLessons} lessons across {COMPLETION_REQUIREMENTS.length} training sections,
              {' '}{totalQuizzes} competency assessments, hands-on EHR simulation,
              and job readiness preparation.
            </p>
          </div>

          {/* Bottom row */}
          <div className="w-full flex items-end justify-between mt-4">
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: '#1e3a5f' }}>{certDate}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Certificate #{certNumber}</p>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1e3a5f, #2d5a8e)',
                  boxShadow: '0 0 0 3px #d4af37, 0 0 0 5px #1e3a5f, 0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <span className="text-lg font-bold text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  VP
                </span>
              </div>
            </div>
            <div className="text-right">
              <img src="/images/m-koepke-signature.png" alt="M Koepke" className="h-10 ml-auto mb-1 object-contain" />
              <div className="w-40 mb-1" style={{ borderTop: '1px solid #1e3a5f' }} />
              <p className="text-sm font-medium" style={{ color: '#1e3a5f' }}>VytalPath Academy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Testing Toolbar ───

function AdminToolbar({ onMarkComplete, onResetCertificate, onResetProgress }: {
  onMarkComplete: () => void;
  onResetCertificate: () => void;
  onResetProgress: () => void;
}) {
  return (
    <div className="no-print mb-6 bg-gray-900 text-white rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-300">Admin Testing</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onMarkComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-medium transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Mark All Complete
          </button>
          <button
            onClick={onResetCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Certificate
          </button>
          <button
            onClick={onResetProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───

export function CertificatePage() {
  const progress = useProgress();
  const { user } = useAuth();
  const isAdmin = isSuperAdmin(user?.email);

  const [studentName, setStudentName] = useState('');
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [certLoading, setCertLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ─── Completion Status ───
  const completionStatus = useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;
    let totalQuizzes = 0;
    let passedQuizzes = 0;
    const sections: { name: string; lessonsComplete: number; lessonsTotal: number; quizzesComplete: number; quizzesTotal: number }[] = [];

    for (const section of COMPLETION_REQUIREMENTS) {
      let sLessons = 0;
      let sLessonsComplete = 0;
      let sQuizzes = 0;
      let sQuizzesComplete = 0;

      for (const mod of section.modules) {
        for (const lessonSlug of mod.lessons) {
          sLessons++;
          if (progress.isLessonCompleted(lessonSlug)) sLessonsComplete++;
        }
        if (mod.hasQuiz) {
          sQuizzes++;
          if (progress.hasPassedQuiz(mod.slug)) sQuizzesComplete++;
        }
      }

      totalLessons += sLessons;
      completedLessons += sLessonsComplete;
      totalQuizzes += sQuizzes;
      passedQuizzes += sQuizzesComplete;
      sections.push({
        name: section.name,
        lessonsComplete: sLessonsComplete,
        lessonsTotal: sLessons,
        quizzesComplete: sQuizzesComplete,
        quizzesTotal: sQuizzes,
      });
    }

    const isComplete = completedLessons === totalLessons && passedQuizzes === totalQuizzes;
    return { totalLessons, completedLessons, totalQuizzes, passedQuizzes, sections, isComplete };
  }, [progress]);

  // ─── Load Certificate from Supabase ───
  useEffect(() => {
    if (!user) {
      setCertLoading(false);
      return;
    }
    loadCertificate();
  }, [user]);

  async function loadCertificate() {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCertificate(data as CertificateRecord);
        setStudentName(data.student_name);
      }
    } catch (err) {
      console.error('Error loading certificate:', err);
    } finally {
      setCertLoading(false);
    }
  }

  // ─── Lock Certificate ───
  async function handleLockCertificate() {
    if (!user || !studentName.trim()) return;
    setSaving(true);
    setSaveError(null);

    try {
      const certNumber = generateCertNumber();
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          user_id: user.id,
          student_name: studentName.trim(),
          certificate_number: certNumber,
          is_locked: true,
        })
        .select()
        .single();

      if (error) throw error;
      setCertificate(data as CertificateRecord);
      setShowConfirmModal(false);
      setNameConfirmed(false);
    } catch (err: any) {
      if (err.code === '23505') {
        setSaveError('A certificate has already been issued for your account.');
      } else {
        setSaveError(err.message || 'Failed to save certificate. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  }

  // ─── Admin Testing Tools ───
  async function adminResetCertificate() {
    if (!user) return;
    try {
      const { error } = await supabase.rpc('admin_delete_certificate', { p_user_id: user.id });
      if (error) throw error;
      setCertificate(null);
      setStudentName('');
    } catch (err) {
      console.error('Error resetting certificate:', err);
    }
  }

  function adminMarkAllComplete() {
    for (const section of COMPLETION_REQUIREMENTS) {
      for (const mod of section.modules) {
        for (const lesson of mod.lessons) {
          if (!progress.isLessonCompleted(lesson)) {
            progress.markLessonComplete(lesson);
          }
        }
        if (mod.hasQuiz && !progress.hasPassedQuiz(mod.slug)) {
          progress.saveQuizAttempt(mod.slug, 100, true, {});
        }
      }
    }
  }

  function adminResetProgress() {
    progress.clearAllProgress();
    setCertificate(null);
    setStudentName('');
    // Also reset certificate in Supabase
    if (user) {
      supabase.rpc('admin_delete_certificate', { p_user_id: user.id }).catch(console.error);
    }
  }

  const handlePrint = () => window.print();

  // ─── Loading State ───
  if (certLoading) {
    return (
      <article className="max-w-3xl mx-auto text-center py-16">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading certificate...</p>
      </article>
    );
  }

  // ─── Locked Certificate (from Supabase) ───
  if (certificate) {
    const certDate = formatDate(certificate.issued_at);

    return (
      <article className="max-w-5xl mx-auto">
        {isAdmin && (
          <AdminToolbar
            onMarkComplete={adminMarkAllComplete}
            onResetCertificate={adminResetCertificate}
            onResetProgress={adminResetProgress}
          />
        )}

        <div className="no-print text-center mb-8">
          <header className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-3xl shadow-apple-sm">
              <Award className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Your Certificate</h1>
            <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Your certificate has been issued and locked. Print it or save as PDF anytime.
            </p>
          </header>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Certificate Locked</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{certificate.student_name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Issued {certDate} &middot; #{certificate.certificate_number}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-apple-sm"
          >
            <Printer className="w-5 h-5" />
            Print Certificate
          </button>
          <p className="text-sm text-gray-400 mt-2">
            Tip: In the print dialog, choose "Save as PDF" to download a copy.
          </p>
        </div>

        <CertificateVisual
          studentName={certificate.student_name}
          certDate={certDate}
          certNumber={certificate.certificate_number}
          totalLessons={completionStatus.totalLessons}
          totalQuizzes={completionStatus.totalQuizzes}
        />
      </article>
    );
  }

  // ─── Course Incomplete ───
  if (!completionStatus.isComplete) {
    return (
      <article className="max-w-3xl mx-auto">
        {isAdmin && (
          <AdminToolbar
            onMarkComplete={adminMarkAllComplete}
            onResetCertificate={adminResetCertificate}
            onResetProgress={adminResetProgress}
          />
        )}

        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-amber-100 rounded-3xl shadow-apple-sm">
            <Award className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Certificate of Completion</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Complete all lessons and quizzes to earn your certificate in Healthcare Foundations for Front Office Professionals.
          </p>
        </header>

        {/* Progress Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-apple-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Lessons</span>
                <span className="text-gray-500">{completionStatus.completedLessons} / {completionStatus.totalLessons}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(completionStatus.completedLessons / completionStatus.totalLessons) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Quizzes Passed</span>
                <span className="text-gray-500">{completionStatus.passedQuizzes} / {completionStatus.totalQuizzes}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(completionStatus.passedQuizzes / completionStatus.totalQuizzes) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Checklist */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-apple-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Section Progress</h2>
          <div className="space-y-3">
            {completionStatus.sections.map((section) => {
              const sectionComplete =
                section.lessonsComplete === section.lessonsTotal &&
                section.quizzesComplete === section.quizzesTotal;
              return (
                <div key={section.name} className="flex items-center gap-3">
                  {sectionComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm ${sectionComplete ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {section.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {section.lessonsComplete}/{section.lessonsTotal} lessons
                    {section.quizzesTotal > 0 && (
                      <> &middot; {section.quizzesComplete}/{section.quizzesTotal} quiz{section.quizzesTotal > 1 ? 'zes' : ''}</>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    );
  }

  // ─── Course Complete — Name Input + Confirmation ───
  return (
    <article className="max-w-5xl mx-auto">
      {isAdmin && (
        <AdminToolbar
          onMarkComplete={adminMarkAllComplete}
          onResetCertificate={adminResetCertificate}
          onResetProgress={adminResetProgress}
        />
      )}

      <div className="no-print text-center mb-8">
        <header className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-3xl shadow-apple-sm">
            <Award className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Congratulations!</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            You've completed all requirements. Enter your name below to generate your certificate.
          </p>
        </header>

        {/* Warning */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 max-w-lg mx-auto mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="font-semibold text-amber-900 mb-1">Enter Your Name Carefully</h3>
              <p className="text-sm text-amber-800">
                The name you enter will be <strong>permanently displayed</strong> on your certificate.
                Double-check spelling and capitalization — <strong>this cannot be changed</strong> after you submit.
              </p>
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div className="max-w-md mx-auto mb-6">
          <label htmlFor="student-name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Your Full Name (as it should appear on the certificate)
          </label>
          <input
            id="student-name"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
          />
        </div>

        <button
          onClick={() => { setShowConfirmModal(true); setNameConfirmed(false); setSaveError(null); }}
          disabled={!studentName.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium shadow-apple-sm"
        >
          <Lock className="w-5 h-5" />
          Save &amp; Lock My Name
        </button>
      </div>

      {/* Certificate Preview */}
      <CertificateVisual
        studentName={studentName}
        certDate={formatDate(new Date())}
        certNumber="VPA-XXXXXX"
        totalLessons={completionStatus.totalLessons}
        totalQuizzes={completionStatus.totalQuizzes}
      />

      {/* ─── Confirmation Modal ─── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-amber-50 border-b border-amber-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Confirm Your Certificate Name</h2>
                  <p className="text-sm text-amber-800">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                The name below will be permanently displayed on your certificate.
                Once saved, it cannot be changed or corrected.
              </p>

              {/* Name preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Certificate Name</p>
                <p
                  className="text-xl font-semibold"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
                >
                  {studentName}
                </p>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={nameConfirmed}
                  onChange={(e) => setNameConfirmed(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I confirm this name is correct and understand it <strong>cannot be changed</strong> after submission.
                </span>
              </label>

              {saveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {saveError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowConfirmModal(false); setNameConfirmed(false); setSaveError(null); }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLockCertificate}
                  disabled={!nameConfirmed || saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Lock &amp; Generate Certificate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
