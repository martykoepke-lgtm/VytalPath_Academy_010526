import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Clock, Play, FileText,
  BookOpen, ChevronRight, ChevronLeft, MessageCircle, AlertTriangle,
  Lightbulb, User, Phone
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import type { Lesson, Module } from '../../types/course';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// ============================================
// PROGRESSIVE READING SLIDE COMPONENT
// ============================================

interface SlideProps {
  content: string;
  slideIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  isCompleted: boolean;
  isLastSlide: boolean;
  isFirstSlide: boolean;
}

// Parse and render a markdown table
function renderTable(lines: string[]): JSX.Element | null {
  if (lines.length < 2) return null;

  const parseRow = (row: string) =>
    row.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0);

  const headers = parseRow(lines[0]);
  // Skip separator row (line with ---)
  const dataRows = lines.slice(2).map(parseRow).filter(row => row.length > 0);

  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-50 to-blue-50">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-5 py-4 text-left text-sm font-semibold text-blue-800 first:rounded-tl-xl last:rounded-tr-xl"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {dataRows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-4 text-sm text-gray-700">
                  {renderInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Render inline markdown (bold, italic)
function renderInlineMarkdown(text: string): React.ReactNode {
  // Handle bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// Render dialogue (Caller:, Patient:, What to do:, What to say:)
function renderDialogue(label: string, text: string, type: 'caller' | 'response' | 'action'): JSX.Element {
  const configs = {
    caller: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Phone className="w-4 h-4 text-blue-600" />,
      labelColor: 'text-blue-700',
    },
    response: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <MessageCircle className="w-4 h-4 text-green-600" />,
      labelColor: 'text-green-700',
    },
    action: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: <Lightbulb className="w-4 h-4 text-amber-600" />,
      labelColor: 'text-amber-700',
    },
  };

  const config = configs[type];

  return (
    <div className={`${config.bg} ${config.border} border rounded-xl p-4 my-3`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        <div>
          <span className={`font-semibold ${config.labelColor}`}>{label}</span>
          <p className="text-gray-700 mt-1">{text}</p>
        </div>
      </div>
    </div>
  );
}

// Render mistake/reality pairs
function renderMistakeReality(mistake: string, reality: string): JSX.Element {
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="bg-red-50 p-4 border-b border-red-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-red-700">Common Mistake</span>
            <p className="text-red-800 mt-1">{mistake}</p>
          </div>
        </div>
      </div>
      <div className="bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-green-700">The Reality</span>
            <p className="text-green-800 mt-1">{reality}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main slide content renderer
function renderSlideContent(content: string): JSX.Element[] {
  if (!content) return [];
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines at very start
    if (line.trim() === '' && elements.length === 0) {
      i++;
      continue;
    }

    // Handle tables (detect header row followed by separator row with ---)
    if (line.includes('|') && lines[i + 1]?.includes('|') && lines[i + 1]?.includes('---')) {
      const tableLines: string[] = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].includes('|')) {
        tableLines.push(lines[j]);
        j++;
      }
      elements.push(<div key={`table-${i}`}>{renderTable(tableLines)}</div>);
      i = j;
      continue;
    }

    // Skip standalone separator lines (--- without being part of a table)
    if (line.trim().match(/^\|?\s*-+\s*\|/)) {
      i++;
      continue;
    }

    // Handle Mistake/Reality pairs
    if (line.startsWith('**Mistake:**')) {
      const mistake = line.replace('**Mistake:**', '').trim();
      const nextLine = lines[i + 1];
      if (nextLine?.startsWith('**Reality:**')) {
        const reality = nextLine.replace('**Reality:**', '').trim();
        elements.push(<div key={`mistake-${i}`}>{renderMistakeReality(mistake, reality)}</div>);
        i += 2;
        continue;
      }
    }

    // Handle Caller/Patient dialogue
    if (line.startsWith('**Caller:**') || line.startsWith('**Patient:**')) {
      const label = line.startsWith('**Caller:**') ? 'Caller' : 'Patient';
      const text = line.replace(/\*\*(Caller|Patient):\*\*/, '').trim().replace(/^"/, '').replace(/"$/, '');
      elements.push(<div key={`dialogue-${i}`}>{renderDialogue(label, text, 'caller')}</div>);
      i++;
      continue;
    }

    // Handle What to do / What to say
    if (line.startsWith('**What to do:**')) {
      const text = line.replace('**What to do:**', '').trim();
      elements.push(<div key={`action-${i}`}>{renderDialogue('What to do', text, 'action')}</div>);
      i++;
      continue;
    }

    if (line.startsWith('**What to say:**')) {
      const text = line.replace('**What to say:**', '').trim().replace(/^"/, '').replace(/"$/, '');
      elements.push(<div key={`response-${i}`}>{renderDialogue('What to say', text, 'response')}</div>);
      i++;
      continue;
    }

    // Handle When to provide/obtain/use
    if (line.startsWith('**When to')) {
      const match = line.match(/\*\*([^*]+)\*\*/);
      if (match) {
        const label = match[1];
        const text = line.replace(/\*\*[^*]+\*\*/, '').trim();
        elements.push(
          <div key={`when-${i}`} className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-3">
            <span className="font-semibold text-blue-700">{label}</span>
            <span className="text-gray-700"> {text}</span>
          </div>
        );
        i++;
        continue;
      }
    }

    // Handle Your role:
    if (line.startsWith('**Your role:**')) {
      const text = line.replace('**Your role:**', '').trim();
      elements.push(
        <div key={`role-${i}`} className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-3">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-800">Your Role</span>
              <p className="text-gray-700 mt-1">{text}</p>
            </div>
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Handle Verification steps:
    if (line.startsWith('**Verification steps:**')) {
      elements.push(
        <p key={`verify-label-${i}`} className="font-semibold text-gray-900 mt-4 mb-2">
          Verification steps:
        </p>
      );
      i++;
      continue;
    }

    // H1 headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
          {line.slice(2)}
        </h1>
      );
      i++;
      continue;
    }

    // H2 headings
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-6 mb-3 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-500 rounded-full"></span>
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3 headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-gray-800 mt-5 mb-3">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Bullet points
    if (line.startsWith('- ')) {
      elements.push(
        <li key={i} className="flex items-start gap-3 ml-2 text-gray-700 mb-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
          <span>{renderInlineMarkdown(line.slice(2))}</span>
        </li>
      );
      i++;
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <li key={i} className="flex items-start gap-3 ml-2 text-gray-700 mb-3">
          <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {num}
          </span>
          <span className="pt-1">{renderInlineMarkdown(line.replace(/^\d+\. /, ''))}</span>
        </li>
      );
      i++;
      continue;
    }

    // Italic note (usually at end)
    if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      elements.push(
        <p key={i} className="text-sm text-gray-500 italic mt-6 pt-4 border-t border-gray-200">
          {line.slice(1, -1)}
        </p>
      );
      i++;
      continue;
    }

    // Bold definitions like **Consent** = "..."
    if (line.startsWith('**') && line.includes('=')) {
      const match = line.match(/\*\*([^*]+)\*\*\s*=\s*"([^"]+)"/);
      if (match) {
        elements.push(
          <div key={i} className="bg-gray-50 border-l-4 border-blue-500 p-4 my-3 rounded-r-lg">
            <span className="font-bold text-blue-700 text-lg">{match[1]}</span>
            <span className="text-gray-600"> = </span>
            <span className="text-gray-800 italic">"{match[2]}"</span>
          </div>
        );
        i++;
        continue;
      }
    }

    // Empty line (spacer)
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-3"></div>);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-gray-700 mb-3 leading-relaxed">
        {renderInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// The Progressive Reading Slide component
function ReadingSlide({
  content,
  slideIndex,
  totalSlides,
  onNext,
  onPrev,
  onComplete,
  isCompleted,
  isLastSlide,
  isFirstSlide
}: SlideProps) {
  return (
    <div className="flex flex-col min-h-[550px]">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="font-medium">Section {slideIndex + 1} of {totalSlides}</span>
          <span>{Math.round(((slideIndex + 1) / totalSlides) * 100)}% complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm overflow-y-auto">
        {renderSlideContent(content)}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4">
        <button
          onClick={onPrev}
          disabled={isFirstSlide}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
            isFirstSlide
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {/* Slide dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === slideIndex
                  ? 'bg-blue-500 w-8'
                  : idx < slideIndex
                    ? 'bg-blue-300 w-2'
                    : 'bg-gray-200 w-2'
              }`}
            />
          ))}
        </div>

        {isLastSlide ? (
          <button
            onClick={() => {
              if (!isCompleted) onComplete();
              onNext();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <CheckCircle className="w-5 h-5" />
            {isCompleted ? 'Continue' : 'Complete Reading'}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Hook to split content into slides
function useSlides(content: string | null): string[] {
  return useMemo(() => {
    if (!content) return [];
    // Split by --- divider, filter empty slides
    return content
      .split(/\n---\n/)
      .map(slide => slide.trim())
      .filter(slide => slide.length > 0);
  }, [content]);
}

// Temporary hardcoded data - matches CourseDetail structure
const lessonsData: Record<string, { lesson: Lesson; module: Module; courseTitle: string; prevLesson: string | null; nextLesson: string | null; nextIsQuiz: boolean }> = {
  'healthcare-front-office-foundations': {
    lesson: {
      id: 'l1',
      module_id: 'm1',
      slug: 'healthcare-front-office-foundations',
      title: 'Healthcare Front Office Foundations',
      description: 'An introduction to the essential skills and knowledge needed for front office success in healthcare settings.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/healthdelivery_overview.mp4`,
      reading_content: null,
      duration_minutes: 5,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm1',
      course_id: '1',
      slug: 'healthcare-settings',
      title: 'Healthcare Settings',
      description: 'Understand the different types of healthcare environments.',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: null,
    nextLesson: 'acute-vs-ambulatory-care',
    nextIsQuiz: false,
  },
  'acute-vs-ambulatory-care': {
    lesson: {
      id: 'l2',
      module_id: 'm1',
      slug: 'acute-vs-ambulatory-care',
      title: 'Acute vs. Ambulatory Care',
      description: 'Learn the key differences between acute care (hospitals) and ambulatory care (outpatient clinics) settings.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/ip-encounter.mp4`,
      reading_content: null,
      duration_minutes: 5,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm1',
      course_id: '1',
      slug: 'healthcare-settings',
      title: 'Healthcare Settings',
      description: 'Understand the different types of healthcare environments.',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'healthcare-front-office-foundations',
    nextLesson: null,
    nextIsQuiz: true,
  },
  'hipaa-essentials': {
    lesson: {
      id: 'l3',
      module_id: 'm2',
      slug: 'hipaa-essentials',
      title: 'HIPAA Essentials Explained',
      description: 'Understanding HIPAA regulations, patient privacy rights, and your responsibilities in protecting health information.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/hipaa-basics.mp4`,
      reading_content: null,
      duration_minutes: 5,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: null,
    nextLesson: 'phi-explained',
    nextIsQuiz: false,
  },
  'phi-explained': {
    lesson: {
      id: 'l4',
      module_id: 'm2',
      slug: 'phi-explained',
      title: 'PHI Explained',
      description: 'Learn what Protected Health Information is and how to identify it in your daily work.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/phi_explained.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'hipaa-essentials',
    nextLesson: 'hipaa-access-rules',
    nextIsQuiz: false,
  },
  'hipaa-access-rules': {
    lesson: {
      id: 'l4b',
      module_id: 'm2',
      slug: 'hipaa-access-rules',
      title: 'HIPAA Access Rules',
      description: 'Learn about HIPAA access rules and who can access patient health information.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/hipaa_auth_consent.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'phi-explained',
    nextLesson: 'hipaa-violations-fines-penalties',
    nextIsQuiz: false,
  },
  'hipaa-violations-fines-penalties': {
    lesson: {
      id: 'l4c',
      module_id: 'm2',
      slug: 'hipaa-violations-fines-penalties',
      title: 'HIPAA Violations, Fines & Penalties',
      description: 'Learn about the consequences of HIPAA violations, the four penalty tiers, and real enforcement cases.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# HIPAA Violations: Fines & Penalties

## Why This Matters

You handle patient information every day. Knowing what can happen when things go wrong helps you stay safe. This is not meant to scare you. It helps you understand why the rules exist.

**Good news:** Most mistakes can be stopped by following simple steps.

---

## Where This Information Comes From

All penalty amounts in this guide come from official federal law:
- **Civil penalties:** 45 CFR § 160.404 (Code of Federal Regulations)
- **Criminal penalties:** 42 U.S.C. § 1320d-6 (United States Code)
- **Penalty amounts** are adjusted each year for inflation by HHS

---

## Civil Penalty Tiers

The Office for Civil Rights (OCR) uses four levels of fines. The level depends on how the mistake happened:

### Tier 1: Did Not Know
The person did not know they broke the rule. They could not have known.

| Fine Type | Amount |
|-----------|--------|
| Minimum per mistake | $141 |
| Maximum per mistake | $71,162 |
| Maximum per year | $2,134,831 |

**Example:** A worker sends a fax to a wrong number by accident. The number was one digit off. There was no way to catch it ahead of time.

---

### Tier 2: Should Have Known
There was a good reason for the mistake. But it was NOT because the person just didn't care.

| Fine Type | Amount |
|-----------|--------|
| Minimum per mistake | $1,424 |
| Maximum per mistake | $71,162 |
| Maximum per year | $2,134,831 |

**Example:** A clinic had old privacy rules. They did not know the rules needed to be updated. Once told, they fixed it right away.

---

### Tier 3: Ignored the Rules (But Fixed It)
The person knew about the rule. They ignored it. But they fixed the problem within 30 days.

| Fine Type | Amount |
|-----------|--------|
| Minimum per mistake | $14,232 |
| Maximum per mistake | $71,162 |
| Maximum per year | $2,134,831 |

**Example:** A clinic knew patients in the waiting room could see computer screens. They did nothing about it. Then someone complained. They put up privacy screens within 30 days.

---

### Tier 4: Ignored the Rules (Did Not Fix It)
The person knew about the rule. They ignored it. They did NOT fix the problem within 30 days.

| Fine Type | Amount |
|-----------|--------|
| Minimum per mistake | $71,162 |
| Maximum per mistake | $2,134,831 |
| Maximum per year | $2,134,831 |

**Example:** A clinic threw patient papers in the regular trash. They were told this was wrong. They kept doing it anyway.

---

## Criminal Penalties

Some HIPAA mistakes are crimes. This means you can go to jail.

| What You Did | Max Fine | Max Jail Time |
|--------------|----------|---------------|
| Got or shared PHI when you knew you should not | $50,000 | 1 year |
| Lied to get patient info | $100,000 | 5 years |
| Got patient info to make money, hurt someone, or sell it | $250,000 | 10 years |

**This applies to people, not just companies.** A worker can be charged with a crime.

---

## Real Cases

### $16 Million — Anthem Inc. (2018)
**What happened:** Hackers stole data from 78.8 million people.
**Why the fine:** The company did not check for risks. They did not watch their systems closely.
**Lesson:** If hackers steal data, you can still get fined. You must protect data before the breach.

### $5.55 Million — Advocate Health Care (2016)
**What happened:** Laptops were stolen from cars. The laptops were not locked (encrypted). It affected 4 million patients.
**Lesson:** Lock (encrypt) all devices. Never leave laptops in cars.

### $4.3 Million — Cignet Health (2011)
**What happened:** The clinic would not give 41 patients their own medical records.
**Lesson:** Patients have a RIGHT to their records. You must give them.

### $2.3 Million — Jackson Health System (2019)
**What happened:** Workers looked at celebrity patient records out of curiosity.
**Lesson:** Only look at records you need for your job. Curiosity is not a reason.

---

## Common Front Office Mistakes

These are mistakes that get real people in real trouble:

### 1. Talking About Patients in Public
**Mistake:** Talking about a patient in the hall, elevator, or lunch room.
**How to avoid:** Only talk about patients in private areas. Only share what others need to know.

### 2. Screens That Others Can See
**Mistake:** People in the waiting room can see patient info on your screen.
**How to avoid:** Turn your screen away from public view. Use a privacy screen. Lock your computer when you walk away.

### 3. Papers Left Out
**Mistake:** Charts, insurance cards, or papers with patient info left where anyone can see them.
**How to avoid:** Turn papers face down. Use folders. Clear your desk.

### 4. Looking at Records You Don't Need
**Mistake:** Looking up friends, family, famous people, or coworkers because you are curious.
**How to avoid:** Only look at records for your current work task. Being curious is NOT a reason.

### 5. Throwing Away Papers the Wrong Way
**Mistake:** Putting papers with patient info in the regular trash.
**How to avoid:** Shred all papers with patient info. Use the right bins.

### 6. Sending Info to the Wrong Person
**Mistake:** Faxing, emailing, or mailing records to the wrong person.
**How to avoid:** Check the name and number before you send. Double-check fax numbers. Use secure email.

### 7. Sharing Your Password
**Mistake:** Letting a coworker use your login.
**How to avoid:** Never share your password. Each person uses their own login. Always.

### 8. Taking Photos of Records
**Mistake:** Using your phone to take a picture of patient info.
**How to avoid:** Never take photos of patient info. If you need to move info, use the right way.

---

## What Happens If You Make a Mistake

### What to Do Right Away
1. **Tell someone now** — Do not try to hide it
2. **Write down what happened** — Who, what, when, how
3. **Be honest** — Work with anyone who asks questions

### What Could Happen to You
- A warning (spoken or written)
- More training
- Time off without pay
- Losing your job
- Personal fines (if it is a crime)
- Going to jail (if it is very bad)

### Why Telling Someone Matters
If your clinic reports a mistake quickly and fixes it, they often pay less. Hiding a mistake makes everything worse.

---

## Daily Checklist

Ask yourself these questions every day:

- Is my screen turned away from where patients sit?
- Did I lock my computer when I walked away?
- Are papers with patient info face down or in folders?
- Am I only looking at records I need for my work right now?
- Am I talking about patients only in private?
- Did I check the name and number before I sent anything?
- Am I using my own login?
- Did I shred papers with patient info?

---

## The Main Point

HIPAA is not just about fines. It is about real harm to real people. When patient info gets out, it can hurt their job, their family, and their safety.

You are the first line of defense. The good news? Following the rules is not hard once you know them. Now you do.

---

## Quick Look: Fines

| Tier | What Happened | Min Fine | Max Fine |
|------|---------------|----------|----------|
| 1 | Did not know | $141 | $71,162 |
| 2 | Should have known | $1,424 | $71,162 |
| 3 | Ignored rules (fixed in 30 days) | $14,232 | $71,162 |
| 4 | Ignored rules (did not fix) | $71,162 | $2,134,831 |

| Crime | Max Fine | Max Jail |
|-------|----------|----------|
| Got or shared PHI on purpose | $50,000 | 1 year |
| Lied to get PHI | $100,000 | 5 years |
| Did it for money or to hurt someone | $250,000 | 10 years |

---

*Sources: 45 CFR § 160.404, 42 U.S.C. § 1320d-6*`,
      duration_minutes: 12,
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'hipaa-access-rules',
    nextLesson: 'minimum-necessary-standard',
    nextIsQuiz: false,
  },
  'minimum-necessary-standard': {
    lesson: {
      id: 'l4d',
      module_id: 'm2',
      slug: 'minimum-necessary-standard',
      title: 'The Minimum Necessary Standard',
      description: 'Learn the core HIPAA principle: only access and share the minimum PHI needed for the task.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# The Minimum Necessary Standard

## What It Is

The Minimum Necessary Standard is one of HIPAA's core principles. It says:

> **Only access, use, or disclose the minimum amount of PHI needed to accomplish the intended purpose.**

In plain English: Don't look at more than you need. Don't share more than is asked for.

---

## Why It Matters

Think of patient information like keys to someone's house. You wouldn't give a locksmith keys to every room if they only needed to fix the front door. Same principle.

**Every piece of unnecessary information shared is:**
- A potential breach waiting to happen
- A privacy violation
- A liability for you and your organization

---

## When It Applies

The Minimum Necessary Standard applies to:

| Situation | Applies? |
|-----------|----------|
| Requests from other healthcare providers for treatment | Yes |
| Requests from insurance companies | Yes |
| Internal use (e.g., billing, scheduling) | Yes |
| Research requests | Yes |
| Patient requesting their OWN records | **No** — patients get everything |
| Healthcare provider treating the patient | **No** — treatment exception |
| Legally required disclosures (court orders) | **No** — provide what's ordered |

---

## Front Office Examples

### Example 1: Insurance Verification Call
**Situation:** An insurance company calls asking about a patient's visit.

**Wrong approach:** "Let me read you everything in their chart."

**Right approach:** "What specific information do you need for the claim?" Then provide ONLY that information.

---

### Example 2: Employer Calling About Employee
**Situation:** A patient's employer calls asking if they were really at a doctor's appointment.

**Wrong approach:** "Yes, they were here for a migraine."

**Right approach:** "I can only confirm appointments with written patient authorization." (Even confirming they're a patient may violate privacy depending on context.)

---

### Example 3: Family Member Asking for Information
**Situation:** A patient's adult child calls asking about their parent's test results.

**Wrong approach:** "The results showed elevated blood pressure and diabetes concerns."

**Right approach:** "I need to verify that we have authorization on file for me to share this information with you. Can you hold while I check?" If no authorization: "I'm sorry, I can't share that information without authorization from the patient."

---

### Example 4: Another Department Requests Records
**Situation:** The billing department asks for a patient's chart.

**Wrong approach:** Send the entire medical record.

**Right approach:** Ask what specific information they need (likely just diagnosis codes and procedure codes), then send only that.

---

### Example 5: Coworker Curiosity
**Situation:** A coworker says, "Hey, wasn't that Mrs. Johnson who just left? What was she here for?"

**Wrong approach:** "Yeah, she's been having chest pain. Scary stuff."

**Right approach:** "I can't discuss patient information." Full stop.

---

## How to Apply It Daily

### Before Accessing a Record, Ask:
1. Do I need this information to do my job RIGHT NOW?
2. What specific information do I need?
3. Is there a less invasive way to get what I need?

### Before Sharing Information, Ask:
1. Is this person authorized to receive this information?
2. What is the minimum they need?
3. Can I verify their identity and purpose?

### When in Doubt:
- Ask your supervisor
- Provide LESS rather than more
- Get requests in writing

---

## Common Violations

| Violation | Why It's Wrong |
|-----------|----------------|
| Reading the full chart "to get context" | Only read what you need for your task |
| Sending entire records when only a summary was requested | Provide only what's asked |
| Looking up a coworker's appointment | You have no job-related need |
| Discussing case details beyond what's necessary | Limit to need-to-know basis |
| Copying full records "just in case" | Creates unnecessary exposure |

---

## The "Need to Know" Test

Before accessing or sharing ANY patient information, apply this test:

**Do I NEED to KNOW this to do my CURRENT JOB TASK?**

| Answer | Action |
|--------|--------|
| Yes, I need this specific information to complete my current task | Access/share it |
| Maybe, it might be helpful | Do NOT access/share — "maybe" isn't "need" |
| No, I'm just curious | Absolutely do NOT access/share |

---

## Role-Based Access

Most healthcare organizations implement minimum necessary through role-based access:

| Role | Typical Access Level |
|------|---------------------|
| Front desk | Demographics, insurance, scheduling |
| Billing | Diagnosis codes, procedure codes, charges |
| Clinical staff | Full clinical information |
| Providers | Full access for their patients |

**Key point:** Just because you CAN access something doesn't mean you SHOULD.

---

## Key Takeaway

**Less is more.** When it comes to patient information, always err on the side of providing less. If someone needs more, they can ask — and you can verify it's appropriate.

The minimum necessary standard protects:
- **Patients** — their privacy and dignity
- **You** — from violations and liability
- **Your organization** — from fines and reputation damage

---

*Source: 45 CFR § 164.502(b)*`,
      duration_minutes: 10,
      sort_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'hipaa-violations-fines-penalties',
    nextLesson: 'patient-rights-under-hipaa',
    nextIsQuiz: false,
  },
  'patient-rights-under-hipaa': {
    lesson: {
      id: 'l4e',
      module_id: 'm2',
      slug: 'patient-rights-under-hipaa',
      title: 'Patient Rights Under HIPAA',
      description: 'Learn the six core patient rights over their health information and how to help patients exercise them.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# Patient Rights Under HIPAA

## Overview

HIPAA doesn't just protect patient information — it gives patients specific RIGHTS regarding their health information. As front office staff, you'll help patients exercise these rights regularly.

Understanding these rights helps you:
- Respond appropriately to patient requests
- Know when to escalate to your supervisor
- Avoid violations that occur when rights are denied

---

## The Six Core Patient Rights

### 1. Right to Access Their Records

**What it means:** Patients can request copies of their medical records.

**Your role:**
- Accept requests (verbal or written, depending on your policy)
- Know your organization's process for fulfilling requests
- Be aware of the 30-day deadline (can be extended once by 30 days)

**Key points:**
- You CANNOT deny access because the patient owes money
- You CAN charge a reasonable fee for copies
- Electronic records must be provided electronically if requested

**Violation alert:** Denying or unreasonably delaying access is a violation. Cignet Health paid $4.3 million for denying 41 patients access to their records.

---

### 2. Right to Request Amendments

**What it means:** Patients can ask to have errors in their records corrected.

**Your role:**
- Accept amendment requests
- Forward to the appropriate person (usually health information management)
- Understand that providers can DENY amendments if they believe the record is accurate

**Key points:**
- If denied, the patient can submit a statement of disagreement
- The denial and any disagreement become part of the record
- You cannot delete information — only add corrections/amendments

**Example:** A patient notices their allergies are listed incorrectly. They can request an amendment. If approved, the record is corrected with a note about the change.

---

### 3. Right to an Accounting of Disclosures

**What it means:** Patients can request a list of who has received their PHI.

**Your role:**
- Know that this request exists
- Typically forward to your compliance or HIM department

**What's included:**
- Disclosures to other entities (not for treatment, payment, or operations)
- Date, recipient, purpose, and what was shared

**What's NOT included:**
- Disclosures for treatment (doctor to doctor)
- Disclosures for payment (to insurance)
- Disclosures for healthcare operations
- Disclosures the patient authorized

---

### 4. Right to Request Restrictions

**What it means:** Patients can ask you to limit how their information is used or shared.

**Your role:**
- Accept restriction requests
- Forward to the appropriate person
- Understand that most restrictions are optional for the organization to accept

**EXCEPTION — Must Honor:**
If a patient pays out-of-pocket IN FULL and asks you not to bill their insurance, you MUST honor that restriction.

**Example:** A patient pays cash for a visit and asks that it not be reported to their insurance. If they pay the full amount, you cannot send it to insurance.

---

### 5. Right to Request Confidential Communications

**What it means:** Patients can ask to receive communications in a specific way or at a specific location.

**Your role:**
- Honor reasonable requests
- Document the patient's preference
- Follow the preference consistently

**Examples:**
- "Only call me at my work number, not home"
- "Send mail to my P.O. Box, not my home address"
- "Text me, don't leave voicemails"

**Important:** You must accommodate reasonable requests. You CANNOT require an explanation for why they want it.

**Why this matters:** Patients may be in unsafe situations (domestic violence), have privacy concerns at home, or simply prefer certain communication methods.

---

### 6. Right to File a Complaint

**What it means:** Patients can complain to you, to your organization, or directly to HHS if they believe their rights were violated.

**Your role:**
- Take complaints seriously
- Know your organization's complaint process
- Never retaliate against patients who complain

**Complaint destinations:**
- Your organization's Privacy Officer
- Office for Civil Rights (OCR) — the federal enforcement agency
- State attorney general (in some states)

---

## The Notice of Privacy Practices (NPP)

### What It Is
A document explaining how the organization uses and protects patient information, and describing patient rights.

### Your Role
- Provide the NPP to new patients
- Get acknowledgment of receipt (signature)
- Document if patient refuses to sign
- Make NPP available upon request

### Key Points
- Patients must receive this at first service (for in-person care)
- Must be written in plain language
- Must be posted in your facility
- Must be available on your website

---

## Responding to Patient Requests: Quick Guide

| Request Type | Can They Ask? | Must You Comply? | Timeline |
|--------------|---------------|------------------|----------|
| Copy of records | Yes | Yes | 30 days (+ 30 extension) |
| Amendment | Yes | You must respond; can deny if accurate | 60 days |
| Accounting of disclosures | Yes | Yes | 60 days |
| Restriction on use | Yes | Optional (except self-pay rule) | Reasonable |
| Confidential communication | Yes | Must accommodate reasonable requests | Immediately |

---

## Scenarios

### Scenario 1: Records Request
**Patient:** "I want a copy of all my medical records."

**Good response:** "Absolutely. I can help you with that. We have a records request form for you to complete, and we'll have your records ready within 30 days. Would you like them mailed, or would you prefer to pick them up?"

**Bad response:** "You'll have to talk to medical records about that." (You should at least provide the form or direct them specifically.)

---

### Scenario 2: Communication Preference
**Patient:** "Please don't call my home number. Only call my cell."

**Good response:** "No problem. I'll update your record to show your cell phone as the preferred contact. Is there anything else regarding how we reach you?"

**Bad response:** "Why? What's wrong with your home number?" (You cannot require an explanation.)

---

### Scenario 3: Self-Pay Privacy
**Patient:** "I'm paying cash for this visit. I don't want it going to my insurance."

**Good response:** "I understand. As long as you pay the full amount today, we won't submit this to your insurance. Let me make sure that's noted in your record."

**Bad response:** "We have to bill insurance for everything." (This is wrong if they pay in full.)

---

## What Patients CANNOT Request

While patients have many rights, there are limits:

- **Cannot demand records be deleted** — only amended
- **Cannot access psychotherapy notes** — these have extra protections
- **Cannot access information compiled for legal proceedings**
- **Cannot access information that could endanger themselves or others** (rare exception)
- **Cannot access records of other patients** — even family members without authorization

---

## Key Takeaway

Patient rights aren't bureaucratic obstacles — they're the foundation of trust in healthcare. When patients know their information is protected AND that they have control over it, they're more likely to be honest with their providers.

Your job is to help patients exercise their rights, not to be a gatekeeper. When in doubt:
- Say "yes" when you can
- Escalate when you're unsure
- Never dismiss a request or concern

---

*Source: 45 CFR §§ 164.520-164.528*`,
      duration_minutes: 12,
      sort_order: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'minimum-necessary-standard',
    nextLesson: 'authorization-consent',
    nextIsQuiz: false,
  },
  'authorization-consent': {
    lesson: {
      id: 'l5',
      module_id: 'm2',
      slug: 'authorization-consent',
      title: 'Authorization & Consent',
      description: 'Understanding patient authorization and consent requirements under HIPAA.',
      content_type: 'video',
      video_url: 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos/hipaa_auth_consent.mp4',
      reading_content: null,
      duration_minutes: 5,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'patient-rights-under-hipaa',
    nextLesson: 'emtala-patient-anti-dumping',
    nextIsQuiz: false,
  },
  'emtala-patient-anti-dumping': {
    lesson: {
      id: 'l5b',
      module_id: 'm2',
      slug: 'emtala-patient-anti-dumping',
      title: 'EMTALA: The Patient Anti-Dumping Law',
      description: 'Understand the federal law requiring emergency screening and stabilization for all patients.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# EMTALA: The Patient Anti-Dumping Law

## What Is EMTALA?

**EMTALA** stands for the Emergency Medical Treatment and Labor Act. It is a federal law.

It says hospitals with emergency rooms must:

1. **Screen** every person who comes to the ER
2. **Stabilize** any emergency before sending them away
3. **Transfer** safely if that hospital cannot help them

This applies to everyone. It does not matter if they can pay.

*Source: 42 U.S.C. § 1395dd*

---

## Why This Law Exists

Before this law (passed in 1986), some hospitals would:
- Turn away people who could not pay
- Send sick people to other hospitals before they were stable
- Wait to help while checking insurance

This was called "patient dumping." People died because of it.

**EMTALA's goal:** Make sure everyone can get emergency care. Money does not matter.

---

## Who Must Follow This Law?

### Which Places
- Hospitals that take Medicare patients
- Hospitals with emergency rooms
- This is almost ALL hospitals in the US

### Who Is Protected
- Anyone who comes to the ER
- Anyone on hospital grounds who asks for emergency help
- Women who are in labor

---

## The Three Rules

### 1. Screen Everyone

**Every person** who comes to the ER must be checked to see if they have an emergency.

**Key points:**
- You cannot ask about insurance or money first
- A doctor or nurse must do the check
- Everyone gets the same check for the same symptoms

**Breaking this rule:** Telling someone without insurance to "try another hospital" before seeing them.

---

### 2. Make Them Stable

If someone has an emergency, the hospital must help them until they are stable.

**What counts as an emergency:**
- Something that could cause serious harm without quick care
- Something that could hurt how the body works
- A woman in active labor who cannot be safely moved

**What counts as stable:**
- The person will not get much worse during or after a move
- For labor: the baby and placenta have been delivered

---

### 3. Transfer Safely

If the hospital cannot make someone stable, they can move them to another hospital ONLY if:
- The patient says okay (or the patient asked to move)
- A doctor says it is safer to move than to stay
- The other hospital agrees to take them
- Medical records go with the patient
- The right people and equipment are used to move them

---

## What You Cannot Do

| Action | Why It Is Wrong |
|--------|-----------------|
| Ask about insurance before checking them | Delays care |
| Refuse to check someone because they cannot pay | Breaks the law |
| Move an unstable patient because of money | Patient dumping |
| Turn people away because the ER is busy | You still must screen them |
| Ask for money before helping | Delays care |

---

## Fines and Penalties

Penalty amounts are adjusted each year. These are 2024 amounts.

### Hospital Fines
| Type | Fine |
|------|------|
| Each violation | Up to $133,420 |
| Small hospital (under 100 beds) | Up to $66,712 |
| Pattern of violations | Kicked out of Medicare |

### Doctor Fines
| Type | Fine |
|------|------|
| Doctor who broke the rule | Up to $133,420 |
| On-call doctor who did not come in | Up to $133,420 |

### Lawsuits
- Patients can sue hospitals for harm
- If Hospital A sent an unstable patient to Hospital B, Hospital B can sue Hospital A

---

## Real Cases

### $1.26 Million — Turned Away (2020)
**What happened:** A woman came in with chest pain. Staff told her to go somewhere else because the ER was busy. She died from a heart attack.
**Lesson:** "We are too busy" is never okay. You must screen everyone.

### $475,000 — Asked About Insurance First (2019)
**What happened:** Staff asked about insurance before checking the patient.
**Lesson:** Check the patient first. Ask about insurance later.

### $250,000 — Bad Transfer (2018)
**What happened:** A sick patient was moved to another hospital because they had Medicaid.
**Lesson:** You cannot make transfer choices based on money or insurance.

---

## Your Role in the Front Office

You are not giving medical care. But you still play a part in EMTALA.

### Do This
- Send anyone who needs emergency help to the ER right away
- Start paperwork AFTER they are being checked (not before)
- Ask about insurance AFTER they are stable
- Treat every person the same, no matter how they look or if they can pay

### Do Not Do This
- Ask about insurance before they are seen
- Tell people to go somewhere else if they cannot pay
- Hold up paperwork while someone waits to be checked
- Guess who "really" needs help

---

## Examples

### Example 1: No Insurance
**What happens:** A person comes in and says, "I do not have insurance, but my chest hurts."

**Right thing to do:** Send them to be checked right away. They must be screened no matter what.

**Wrong thing to do:** "Have you tried the urgent care?" — This could break the law.

---

### Example 2: Busy ER
**What happens:** The ER is full. Someone comes in asking for help.

**Right thing to do:** They still must be checked. The hospital cannot turn them away.

**Wrong thing to do:** "We are very full. You might wait less at another hospital."

---

### Example 3: Patient Wants to Leave
**What happens:** A patient waits a long time and wants to leave before being seen.

**Right thing to do:** Write down that they left on their own (called LWBS - Left Without Being Seen). Offer to see them. If they say no, write that down too.

**Remember:** You cannot push them to leave or make them feel unwanted.

---

## Where Does EMTALA Apply?

**EMTALA does apply to:**
- Hospitals with emergency rooms

**EMTALA does NOT apply to:**
- Doctor offices
- Most urgent care centers
- Outpatient clinics

But even places not covered by EMTALA should:
- Not leave a patient in the middle of care
- Help patients find the right place
- Do what is best for patients

---

## The Main Point

EMTALA makes sure emergency care is for everyone. Rich or poor. Insured or not. Citizen or not. This law exists because people died when hospitals cared more about money than patients.

**Remember:**
- Check the patient FIRST, paperwork SECOND
- Never tell someone not to get emergency care
- Money or insurance NEVER decides emergency care

---

## Quick Look

| Rule | What It Means |
|------|---------------|
| Screen | Check everyone who comes to the ER |
| Stabilize | Treat emergencies before they leave |
| Transfer | Only move people safely, with their okay |

| Fine | Amount (2024) |
|------|---------------|
| Each violation (large hospital) | Up to $133,420 |
| Each violation (small hospital) | Up to $66,712 |
| Pattern of violations | Kicked out of Medicare |

---

*Source: 42 U.S.C. § 1395dd, 42 CFR § 489.24*`,
      duration_minutes: 12,
      sort_order: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'authorization-consent',
    nextLesson: 'fraud-abuse-stark-law',
    nextIsQuiz: false,
  },
  'fraud-abuse-stark-law': {
    lesson: {
      id: 'l5c',
      module_id: 'm2',
      slug: 'fraud-abuse-stark-law',
      title: 'Healthcare Fraud, Abuse & The Stark Law',
      description: 'Learn about healthcare fraud, the Anti-Kickback law, and self-referral rules that protect patients.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# Healthcare Fraud, Abuse & The Stark Law

## Why This Matters to You

You might think fraud laws only apply to doctors and billing people. But front office staff can be part of fraud without knowing it. You might be asked to do things that break the law.

Knowing these basics helps you:
- See warning signs
- Keep yourself safe
- Know when to speak up

---

## What These Words Mean

### Healthcare Fraud
Lying or tricking someone **on purpose** to get money you should not have.

**Examples:**
- Billing for care that was never given
- Changing codes to get more money
- Signing someone else's name

### Healthcare Abuse
Doing things wrong, but **not always on purpose**. This still costs money.

**Examples:**
- Billing for a more expensive service than what was done (called upcoding)
- Giving care that was not needed
- Charging too much for services

### Waste
**Using too much** without trying to cheat anyone.

**Examples:**
- Ordering the same test twice because no one checked the chart
- Slow steps that cost more money

---

## The False Claims Act

### What It Is
This law makes it illegal to send fake or false bills to government programs like Medicare, Medicaid, and Tricare.

*Source: 31 U.S.C. §§ 3729-3733*

### Fines
| Type | Amount (2024) |
|------|---------------|
| Each false claim | $13,946 to $27,894 |
| Plus | 3x the money the government lost |
| Criminal | Up to 5 years in prison |

### Whistleblower Rule
If you report fraud, you may get 15-30% of the money the government gets back.

**Example:** If you report fraud and the government gets back $1 million, you could get $150,000 to $300,000.

**Protection:** If you report fraud, they cannot fire you, demote you, or treat you badly because of it.

---

## The Anti-Kickback Law

### What It Is
This law makes it illegal to give, take, or ask for anything valuable to get patient referrals for government programs.

*Source: 42 U.S.C. § 1320a-7b(b)*

**In simple words:** You cannot pay someone to send patients to you. You cannot take money for sending patients somewhere else.

### Examples of Kickbacks
| What Happened | Why It Is Wrong |
|---------------|-----------------|
| A lab gives free supplies if the clinic sends patients there | Paying for referrals |
| A doctor gets paid for each patient sent to a hospital | Paying for referrals |
| A company pays for "training" at a fancy resort | A hidden kickback |
| A pharmacy gives gift cards to patients who fill prescriptions | Paying patients to use services |

### Fines
| Type | Amount |
|------|--------|
| Criminal | Up to $100,000 + up to 10 years in prison |
| Civil | Up to $100,000 + 3x the damages |
| Other | Banned from Medicare and Medicaid |

---

## The Stark Law (Self-Referral)

### What It Is
Doctors cannot send patients to places where they or their close family make money, for services paid by Medicare or Medicaid.

*Source: 42 U.S.C. § 1395nn*

**In simple words:** A doctor cannot send you to a lab they own (with some exceptions).

### Services Covered by This Law
- Lab tests
- Physical therapy
- X-rays and imaging
- Medical equipment
- Home health care
- Outpatient drugs
- Hospital services

### How This Is Different from Anti-Kickback
- **Anti-Kickback:** You must mean to break the rule
- **Stark:** It does not matter if you meant to. If the money link exists and you make a referral, it is a violation.

### Fines
| Type | Amount |
|------|--------|
| Each claim | No payment |
| If you got paid too much | Pay it back |
| Civil fine | Up to $15,000 per service |
| If you tried to get around the rules | Up to $100,000 per deal |
| False claims | 3x damages + per-claim fines |
| Other | Banned from Medicare and Medicaid |

---

## What This Means for You

### Warning Signs

**About Billing:**
- Asked to change the date of a visit
- Asked to bill for people who never came in
- Told to use certain codes even if they do not match the chart
- Billing for more time than the visit took

**About Referrals:**
- Pushed to send patients to certain places for no good reason
- Gifts from companies that want your referrals
- Strange payments or deals with other healthcare places

**About Paperwork:**
- Asked to sign someone else's name
- Asked to put an old date on something
- Told to make up records for visits that did not happen

---

## Real Cases

### $260 Million — Lab Kickbacks (2021)
**What happened:** A lab paid doctors for referrals. They called the payments "consultation fees."
**Lesson:** Calling it something else does not make it legal.

### $155 Million — Upcoding (2020)
**What happened:** A health system billed Medicare for more expensive care than they gave.
**Lesson:** Bills must match what really happened.

### $17 Million — Stark Violation (2019)
**What happened:** A health system had money deals with doctors who sent them patients.
**Lesson:** Even if you did not mean to break Stark, you still pay big fines.

### Hospital CEO Went to Prison (2022)
**What happened:** The CEO approved a kickback plan to get more patients.
**Lesson:** People, not just companies, can go to jail.

---

## What You Should Do

### Do This
- Follow billing steps exactly as you were trained
- Only write down what really happened
- Tell your supervisor or compliance officer if something seems wrong
- If it feels wrong, ask questions before you do it

### Do Not Do This
- Do not change paperwork just because someone asked you to
- Do not take gifts from vendors (check your rules about limits)
- Do not be part of deals that feel wrong
- Do not think someone else will catch the problem

### When You Are Not Sure
- Ask your supervisor
- Call your compliance department
- Use your company's hotline if you are worried about being punished

---

## Compliance Programs

Healthcare places must have compliance programs. These include:

1. **Written rules** — How to do things the right way
2. **Compliance officer** — Someone in charge of watching for problems
3. **Training** — Classes for all staff, usually every year
4. **Ways to report** — Hotlines, open-door policies
5. **Checking** — Regular looks at how things are going
6. **Consequences** — What happens if someone breaks the rules
7. **Fixing problems** — Steps to take when problems are found

**Know who your compliance officer is. Know the hotline number.**

---

## Protection If You Report Fraud

If you report fraud and you are being honest:

### They Cannot:
- Fire you
- Demote you
- Treat you badly
- Cut your hours
- Punish you in any way

### How to Report:
1. **Start inside** (usually) — Tell your supervisor, compliance officer, or call the hotline
2. **Outside options:**
   - HHS Office of Inspector General
   - Your state Medicaid Fraud Unit
   - Department of Justice
   - A lawyer (for qui tam lawsuits)

### Remember:
- Write everything down
- Keep copies of papers
- Talk to a lawyer if you want to report outside
- If they punish you for reporting, you can get more money

---

## The Main Point

You do not need to know all the rules. But you DO need to know when something feels wrong. Trust your gut. If someone asks you to do something that feels bad:

- **Ask questions**
- **Get it in writing**
- **Report it**
- **Do not do it**

Companies pay millions in fines. People pay fines and go to jail. But the real reason these laws exist is to protect patients and keep healthcare honest.

---

## Quick Look: Fines

| Law | Max Jail | Max Fine |
|-----|----------|----------|
| False Claims Act | 5 years | $27,894/claim + 3x damages |
| Anti-Kickback | 10 years | $100,000/violation |
| Stark Law | None (civil only) | $15,000/service + no payment |

All of these can also ban you from Medicare and Medicaid.

---

*Sources: 31 U.S.C. §§ 3729-3733, 42 U.S.C. § 1320a-7b, 42 U.S.C. § 1395nn*`,
      duration_minutes: 15,
      sort_order: 9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm2',
      course_id: '1',
      slug: 'medical-law-ethics',
      title: 'Medical Law & Ethics',
      description: 'Essential legal and ethical guidelines for healthcare professionals.',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'emtala-patient-anti-dumping',
    nextLesson: null,
    nextIsQuiz: true,
  },
  // Healthcare Foundations - Insurance Overview Module
  'introduction-health-insurance': {
    lesson: {
      id: 'l6',
      module_id: 'm3',
      slug: 'introduction-health-insurance',
      title: 'Introduction to Health Insurance',
      description: 'A broad overview of how health insurance works in the US healthcare system.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/whyinsexists.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm3',
      course_id: '1',
      slug: 'insurance-fundamentals',
      title: 'Insurance Overview',
      description: 'A high-level introduction to health insurance concepts.',
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: null,
    nextLesson: 'payer-types-plan-types',
    nextIsQuiz: false,
  },
  'payer-types-plan-types': {
    lesson: {
      id: 'l7',
      module_id: 'm3',
      slug: 'payer-types-plan-types',
      title: 'Types of Payers & Plan Types',
      description: 'Learn about different insurance payers and plan types like HMO, PPO, and EPO.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/payers_plans.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm3',
      course_id: '1',
      slug: 'insurance-fundamentals',
      title: 'Insurance Overview',
      description: 'A high-level introduction to health insurance concepts.',
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'introduction-health-insurance',
    nextLesson: 'key-insurance-terms',
    nextIsQuiz: false,
  },
  'key-insurance-terms': {
    lesson: {
      id: 'l8',
      module_id: 'm3',
      slug: 'key-insurance-terms',
      title: 'Key Insurance Terms',
      description: 'Define essential insurance vocabulary: premium, deductible, copay, coinsurance, and out-of-pocket maximum.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/ins_terms.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm3',
      course_id: '1',
      slug: 'insurance-fundamentals',
      title: 'Insurance Overview',
      description: 'A high-level introduction to health insurance concepts.',
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'payer-types-plan-types',
    nextLesson: null,
    nextIsQuiz: true,
  },
  // Healthcare Foundations - Medical Terminology Module
  'intro-medical-terminology': {
    lesson: {
      id: 'l9',
      module_id: 'm4',
      slug: 'intro-medical-terminology',
      title: 'Introduction to Medical Terminology',
      description: 'Learn how medical terms are constructed from prefixes, roots, and suffixes.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# Introduction to Medical Terminology

## Word Building Fundamentals

---

### Why Learn Medical Terminology?

Every profession has its own language, and healthcare is no different. Medical terminology might seem intimidating at first—those long, complex words that seem impossible to pronounce. But here's the secret: **most medical terms are built from simple building blocks**.

Once you understand how these building blocks work, you can decode almost any medical term you encounter, even ones you've never seen before.

---

## The Three Building Blocks

Medical terms are constructed from three types of word parts:

### 1. Prefixes
A prefix comes at the **beginning** of a word and modifies its meaning.

| Prefix | Meaning | Example |
| --- | --- | --- |
| pre- | before | prenatal (before birth) |
| post- | after | postoperative (after surgery) |
| hyper- | excessive, above | hypertension (high blood pressure) |
| hypo- | deficient, below | hypoglycemia (low blood sugar) |

---

### 2. Root Words (Word Roots)
The root is the **foundation** of the word—it identifies the body part or system involved.

| Root | Meaning | Example |
| --- | --- | --- |
| cardi/o | heart | cardiology (study of the heart) |
| gastr/o | stomach | gastritis (inflammation of stomach) |
| derm/o | skin | dermatology (study of skin) |
| neur/o | nerve | neurology (study of nerves) |

**Note:** Most roots have a combining vowel (usually "o") that makes pronunciation easier when connecting to suffixes.

---

### 3. Suffixes
A suffix comes at the **end** of a word and often indicates a condition, procedure, or specialty.

| Suffix | Meaning | Example |
| --- | --- | --- |
| -itis | inflammation | arthritis (joint inflammation) |
| -ectomy | surgical removal | appendectomy (removal of appendix) |
| -ology | study of | cardiology (study of heart) |
| -algia | pain | neuralgia (nerve pain) |

---

## How to Build Medical Terms

Let's break down a few examples:

### Example 1: Gastroenteritis
- **Gastr/o** = stomach
- **enter/o** = intestine
- **-itis** = inflammation
- **Meaning:** Inflammation of the stomach and intestines

### Example 2: Hypertension
- **Hyper-** = excessive, above normal
- **tens** = pressure
- **-ion** = condition
- **Meaning:** Condition of high blood pressure

### Example 3: Electrocardiogram (ECG/EKG)
- **Electr/o** = electrical
- **cardi/o** = heart
- **-gram** = record
- **Meaning:** A record of the heart's electrical activity

---

## Tips for Learning Medical Terms

1. **Break words apart** - When you see a new term, divide it into prefix, root, and suffix
2. **Learn the common parts first** - Many prefixes and suffixes repeat across hundreds of terms
3. **Practice pronunciation** - Say terms out loud to build confidence
4. **Use context clues** - The medical setting often hints at the meaning
5. **Don't memorize blindly** - Understanding the parts helps you remember and decode new terms

---

## Common Combining Forms

When a root connects to a suffix beginning with a consonant, we use a **combining vowel** (usually "o"):

- cardi + -logy = cardi**o**logy (not "cardilogy")
- gastr + -scope = gastr**o**scope (not "gastrscope")

When the suffix begins with a vowel, the combining vowel is usually dropped:
- gastr + -itis = gastritis (not "gastroitis")

---

## Key Takeaways

1. Medical terms are built from **prefixes**, **roots**, and **suffixes**
2. The **root** tells you the body part or system
3. The **prefix** modifies the meaning (location, size, quantity)
4. The **suffix** often indicates a condition, procedure, or specialty
5. Understanding these building blocks lets you decode unfamiliar terms

*In the following lessons, we'll explore the most common prefixes, roots, and suffixes you'll encounter in clinic settings.*

---

## Ready to Practice?

After completing the Medical Terminology lessons, you can reinforce your learning with our **Study Mode** feature.

### What Study Mode Offers

- **Flashcards** for each terminology type (Roots, Prefixes, Suffixes, Directions, Positions)
- **Category buttons** to focus on specific word parts
- **Random quiz mode** to test your recall
- **Search functionality** to find specific terms

**To access Study Mode:** Navigate to the **Medical Terminology** section in the main navigation, then select the **Study Mode** tab.

*Complete the lessons first to build your foundation, then use Study Mode for practice and review!*`,
      duration_minutes: 8,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm4',
      course_id: '1',
      slug: 'medical-terminology-basics',
      title: 'Medical Terminology Basics',
      description: 'Learn essential medical terminology for clinic operations.',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: null,
    nextLesson: 'common-prefixes',
    nextIsQuiz: false,
  },
  'common-prefixes': {
    lesson: {
      id: 'l10',
      module_id: 'm4',
      slug: 'common-prefixes',
      title: 'Common Prefixes',
      description: 'Master essential prefixes for size, position, quantity, and more.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# Common Medical Prefixes

## Essential Prefixes for Healthcare

---

### What Are Prefixes?

Prefixes are word parts added to the **beginning** of a root word to modify its meaning. Learning common prefixes allows you to quickly understand medical terms even when you encounter them for the first time.

---

## Size and Quantity Prefixes

| Prefix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| macro- | large | macrocyte | abnormally large cell |
| micro- | small | microscope | instrument to view small objects |
| mega- | enlarged | megacolon | abnormally enlarged colon |
| poly- | many | polyuria | excessive urination |
| oligo- | few, scanty | oliguria | decreased urine output |
| mono- | one | monocyte | type of white blood cell |
| bi- | two | bilateral | affecting both sides |
| tri- | three | tricuspid | having three cusps |
| quad- | four | quadriplegia | paralysis of four limbs |

---

## Position and Direction Prefixes

| Prefix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| sub- | under, below | subcutaneous | under the skin |
| supra- | above | suprapubic | above the pubic bone |
| epi- | upon, above | epidermis | outer layer of skin |
| endo- | within | endoscopy | viewing inside the body |
| peri- | around | pericardium | membrane around the heart |
| trans- | across, through | transdermal | through the skin |
| inter- | between | intercostal | between the ribs |
| intra- | within | intravenous | within a vein |
| extra- | outside | extracellular | outside the cell |
| retro- | behind, backward | retroperitoneal | behind the peritoneum |

---

## Time and Speed Prefixes

| Prefix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| pre- | before | prenatal | before birth |
| post- | after | postoperative | after surgery |
| ante- | before | antepartum | before labor/delivery |
| brady- | slow | bradycardia | slow heart rate |
| tachy- | fast | tachycardia | fast heart rate |

---

## Negation and Opposition Prefixes

| Prefix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| a-, an- | without, absence | apnea | absence of breathing |
| anti- | against | antibiotic | against bacteria |
| contra- | against, opposite | contraindicated | not recommended |
| de- | removal, down | dehydration | removal of water |
| dys- | difficult, painful | dyspnea | difficult breathing |

---

## Excess and Deficiency Prefixes

| Prefix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| hyper- | excessive, above | hyperglycemia | high blood sugar |
| hypo- | deficient, below | hypotension | low blood pressure |
| eu- | normal, good | eupnea | normal breathing |

---

## Color Prefixes

| Prefix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| cyan/o- | blue | cyanosis | bluish skin discoloration |
| erythr/o- | red | erythrocyte | red blood cell |
| leuk/o- | white | leukocyte | white blood cell |
| melan/o- | black | melanoma | dark-pigmented tumor |
| xanth/o- | yellow | xanthoma | yellowish skin growth |

---

## Practice: Decode These Terms

Try breaking down these terms using the prefixes you learned:

1. **Hyperthyroidism** = hyper (excessive) + thyroid + ism (condition) = overactive thyroid
2. **Bradypnea** = brady (slow) + pnea (breathing) = abnormally slow breathing
3. **Anemia** = a/an (without) + emia (blood condition) = deficiency of red blood cells
4. **Postmortem** = post (after) + mortem (death) = after death
5. **Subcutaneous** = sub (under) + cutaneous (skin) = under the skin

---

## Key Takeaways

1. **Size prefixes** (macro-, micro-, poly-) tell you about quantity or magnitude
2. **Position prefixes** (sub-, supra-, endo-) indicate location in the body
3. **Time prefixes** (pre-, post-, brady-, tachy-) relate to timing or speed
4. **Negation prefixes** (a-, anti-, dys-) indicate absence or opposition
5. **Hyper/hypo** are among the most common—they indicate excess or deficiency

*Practice identifying these prefixes whenever you see medical terms. Soon they'll become second nature!*`,
      duration_minutes: 10,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm4',
      course_id: '1',
      slug: 'medical-terminology-basics',
      title: 'Medical Terminology Basics',
      description: 'Learn essential medical terminology for clinic operations.',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'intro-medical-terminology',
    nextLesson: 'common-root-words',
    nextIsQuiz: false,
  },
  'common-root-words': {
    lesson: {
      id: 'l11a',
      module_id: 'm4',
      slug: 'common-root-words',
      title: 'Common Root Words',
      description: 'Learn the root words for body systems, organs, and anatomical structures.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# Common Medical Root Words

## Body Systems and Organs

---

### Understanding Root Words

The root word is the **core** of any medical term. It identifies the body part, organ, or system being discussed. Most roots need a **combining vowel** (usually "o") when connected to suffixes that begin with a consonant.

---

## Cardiovascular System

| Root | Meaning | Example | Definition |
| --- | --- | --- | --- |
| cardi/o | heart | cardiologist | heart specialist |
| angi/o | vessel | angiogram | image of blood vessels |
| arteri/o | artery | arteriosclerosis | hardening of arteries |
| phleb/o, ven/o | vein | phlebotomy | drawing blood from a vein |
| hem/o, hemat/o | blood | hematology | study of blood |

---

## Respiratory System

| Root | Meaning | Example | Definition |
| --- | --- | --- | --- |
| pulmon/o | lung | pulmonologist | lung specialist |
| pneum/o | lung, air | pneumonia | lung infection |
| bronch/o | bronchus | bronchitis | inflammation of bronchi |
| thorac/o | chest | thoracic | pertaining to the chest |
| laryng/o | larynx (voice box) | laryngitis | inflammation of larynx |
| trache/o | trachea (windpipe) | tracheostomy | opening in the trachea |

---

## Digestive System

| Root | Meaning | Example | Definition |
| --- | --- | --- | --- |
| gastr/o | stomach | gastritis | stomach inflammation |
| enter/o | intestine | enteritis | intestinal inflammation |
| col/o | colon | colonoscopy | examination of colon |
| hepat/o | liver | hepatitis | liver inflammation |
| pancreat/o | pancreas | pancreatitis | pancreas inflammation |
| chol/e | bile, gallbladder | cholecystectomy | gallbladder removal |

---

## Musculoskeletal System

| Root | Meaning | Example | Definition |
| --- | --- | --- | --- |
| oste/o | bone | osteoporosis | porous, brittle bones |
| arthr/o | joint | arthritis | joint inflammation |
| my/o | muscle | myalgia | muscle pain |
| chondr/o | cartilage | chondromalacia | cartilage softening |
| tend/o | tendon | tendinitis | tendon inflammation |

---

## Nervous System

| Root | Meaning | Example | Definition |
| --- | --- | --- | --- |
| neur/o | nerve | neurology | study of nervous system |
| encephal/o | brain | encephalitis | brain inflammation |
| mening/o | meninges | meningitis | inflammation of brain membranes |
| cerebr/o | cerebrum | cerebrovascular | pertaining to brain blood vessels |
| psych/o | mind | psychiatry | treatment of mental disorders |

---

## Urinary System

| Root | Meaning | Example | Definition |
| --- | --- | --- | --- |
| ren/o, nephr/o | kidney | nephrology | study of kidneys |
| cyst/o | bladder | cystitis | bladder inflammation |
| ur/o | urine, urinary tract | urology | study of urinary system |
| ureter/o | ureter | ureterectomy | removal of ureter |
| urethr/o | urethra | urethritis | urethra inflammation |

---

## Skin and Sensory Organs

| Root | Meaning | Example | Definition |
| --- | --- | --- | --- |
| derm/o, dermat/o | skin | dermatology | study of skin |
| ophthalm/o | eye | ophthalmologist | eye specialist |
| ot/o | ear | otitis | ear inflammation |
| rhin/o | nose | rhinitis | nose inflammation |

---

## Reproductive System

| Root | Meaning | Example | Definition |
| --- | --- | --- | --- |
| gyn/o | female | gynecology | study of female reproductive system |
| hyster/o | uterus | hysterectomy | uterus removal |
| oophor/o | ovary | oophorectomy | ovary removal |
| orchid/o | testis | orchiectomy | testis removal |
| prostat/o | prostate | prostatitis | prostate inflammation |

---

## Practice: Identify the Root

What body part does each term refer to?

1. **Cardiology** → cardi/o = heart
2. **Nephritis** → nephr/o = kidney
3. **Arthroscopy** → arthr/o = joint
4. **Gastroenterologist** → gastr/o (stomach) + enter/o (intestine)
5. **Dermatitis** → dermat/o = skin

---

## Key Takeaways

1. Root words identify the **body part or system** involved
2. Most roots use **combining vowel "o"** when adding suffixes
3. Some body parts have **multiple roots** (ren/o and nephr/o both mean kidney)
4. Learning roots by **body system** helps organize your knowledge
5. Recognizing roots lets you understand terms you've never seen before

*In the next lesson, we'll learn about suffixes—the word endings that tell you what's happening to these body parts.*`,
      duration_minutes: 12,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm4',
      course_id: '1',
      slug: 'medical-terminology-basics',
      title: 'Medical Terminology Basics',
      description: 'Learn essential medical terminology for clinic operations.',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'common-prefixes',
    nextLesson: 'common-suffixes',
    nextIsQuiz: false,
  },
  'common-suffixes': {
    lesson: {
      id: 'l12a',
      module_id: 'm4',
      slug: 'common-suffixes',
      title: 'Common Suffixes',
      description: 'Understand suffixes that indicate conditions, procedures, and specialties.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# Common Medical Suffixes

## Conditions, Procedures, and Specialties

---

### Understanding Suffixes

Suffixes are word endings that typically indicate:
- A **condition** or disease state
- A **procedure** or treatment
- A **medical specialty** or practitioner
- A **diagnostic test** or instrument

---

## Condition Suffixes

These suffixes describe what's happening to the body:

| Suffix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| -itis | inflammation | appendicitis | inflammation of appendix |
| -osis | abnormal condition | osteoporosis | abnormal bone condition |
| -emia | blood condition | anemia | deficiency of red blood cells |
| -algia | pain | neuralgia | nerve pain |
| -dynia | pain | pleurodynia | chest wall pain |
| -megaly | enlargement | cardiomegaly | enlarged heart |
| -malacia | softening | chondromalacia | cartilage softening |
| -pathy | disease | neuropathy | nerve disease |
| -plegia | paralysis | hemiplegia | paralysis of one side |
| -paresis | partial paralysis | hemiparesis | weakness on one side |
| -rrhea | flow, discharge | diarrhea | loose bowel movements |
| -rrhage | bursting forth | hemorrhage | bleeding |

---

## Procedure Suffixes

These suffixes indicate surgical or therapeutic interventions:

| Suffix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| -ectomy | surgical removal | appendectomy | removal of appendix |
| -otomy | cutting into | tracheotomy | incision into trachea |
| -ostomy | creating an opening | colostomy | opening in colon |
| -plasty | surgical repair | rhinoplasty | nose reconstruction |
| -pexy | surgical fixation | gastropexy | stomach fixation |
| -rrhaphy | suturing | herniorrhaphy | hernia repair |
| -tripsy | crushing | lithotripsy | stone crushing |
| -centesis | surgical puncture | thoracentesis | fluid removal from chest |
| -desis | binding, fusion | arthrodesis | joint fusion |

---

## Diagnostic Suffixes

These suffixes relate to examining or measuring:

| Suffix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| -scopy | visual examination | endoscopy | looking inside body |
| -scope | instrument for viewing | stethoscope | listening instrument |
| -gram | record, image | electrocardiogram | heart electrical record |
| -graph | recording instrument | electrocardiograph | EKG machine |
| -graphy | process of recording | radiography | taking X-rays |
| -metry | measurement | spirometry | breathing measurement |
| -meter | measuring instrument | thermometer | temperature measurer |

---

## Specialty and Practitioner Suffixes

| Suffix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| -ology | study of | cardiology | study of heart |
| -ologist | specialist | cardiologist | heart specialist |
| -ist | specialist | dermatologist | skin specialist |
| -ician | practitioner | physician | medical practitioner |
| -iatry | treatment, medicine | psychiatry | mental health treatment |
| -iatrist | specialist in treatment | psychiatrist | mental health doctor |

---

## Descriptive Suffixes

| Suffix | Meaning | Example | Definition |
| --- | --- | --- | --- |
| -ic, -al, -ous | pertaining to | cardiac | pertaining to heart |
| -oid | resembling | fibroid | fiber-like |
| -genesis | producing, forming | pathogenesis | disease development |
| -lysis | breakdown, destruction | hemolysis | red blood cell destruction |
| -stasis | stopping, controlling | hemostasis | stopping bleeding |

---

## Practice: Build Medical Terms

Using suffixes, what do these terms mean?

1. **Gastrectomy** = gastr (stomach) + ectomy (removal) = stomach removal
2. **Bronchoscopy** = bronch (bronchus) + scopy (visual exam) = examination of bronchi
3. **Nephrology** = nephr (kidney) + ology (study of) = study of kidneys
4. **Cardiomegaly** = cardi (heart) + megaly (enlargement) = enlarged heart
5. **Arthrocentesis** = arthr (joint) + centesis (puncture) = joint fluid aspiration

---

## Suffix Patterns to Remember

### -ectomy vs. -otomy vs. -ostomy
- **-ectomy** = removal (appendectomy removes the appendix)
- **-otomy** = cutting into (tracheotomy cuts into trachea but doesn't remove it)
- **-ostomy** = creating a permanent opening (colostomy creates an opening in the colon)

### -scope vs. -scopy vs. -graphy
- **-scope** = the instrument (endoscope)
- **-scopy** = the procedure using that instrument (endoscopy)
- **-graphy** = recording images (radiography)

---

## Key Takeaways

1. **-itis** means inflammation (one of the most common suffixes)
2. **-ectomy** means surgical removal
3. **-ology** indicates a field of study; **-ologist** is the specialist
4. **-scopy** means visual examination
5. **-gram** is a record; **-graphy** is the process of recording

*Combining prefixes, roots, and suffixes gives you the power to decode virtually any medical term!*`,
      duration_minutes: 10,
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm4',
      course_id: '1',
      slug: 'medical-terminology-basics',
      title: 'Medical Terminology Basics',
      description: 'Learn essential medical terminology for clinic operations.',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'common-root-words',
    nextLesson: 'common-abbreviations',
    nextIsQuiz: false,
  },
  'common-abbreviations': {
    lesson: {
      id: 'l13a',
      module_id: 'm4',
      slug: 'common-abbreviations',
      title: 'Common Medical Abbreviations',
      description: 'Master the abbreviations you will see daily in clinic settings.',
      content_type: 'reading',
      video_url: null,
      reading_content: `# Common Medical Abbreviations

## Essential Abbreviations for Front Office Staff

---

### Why Learn Abbreviations?

Medical abbreviations save time in documentation but can be confusing if you don't know them. As front office staff, you'll see these on:
- Provider notes and orders
- Prescription instructions
- Appointment scheduling notes
- Insurance authorizations
- Lab and imaging orders

---

## Timing and Frequency Abbreviations

These appear frequently on prescriptions and orders:

| Abbreviation | Meaning | Example Use |
| --- | --- | --- |
| QD | once daily | "Take QD with breakfast" |
| BID | twice daily | "BID - morning and evening" |
| TID | three times daily | "TID with meals" |
| QID | four times daily | "QID - every 6 hours" |
| PRN | as needed | "PRN for pain" |
| QHS | at bedtime | "QHS - before sleep" |
| STAT | immediately | "STAT - urgent order" |
| AC | before meals | "Take AC" |
| PC | after meals | "Take PC" |
| Q4H | every 4 hours | "Q4H around the clock" |
| Q6H | every 6 hours | "Q6H as needed" |

---

## Route of Administration

How medication is given:

| Abbreviation | Meaning | Example |
| --- | --- | --- |
| PO | by mouth (oral) | "PO with water" |
| IV | intravenous | "IV fluids" |
| IM | intramuscular | "IM injection" |
| SQ, SubQ | subcutaneous | "SubQ insulin" |
| PR | per rectum | "PR suppository" |
| SL | sublingual (under tongue) | "SL nitroglycerin" |
| TOP | topical | "TOP cream" |
| INH | inhaled | "INH medication" |

---

## Common Diagnosis Abbreviations

| Abbreviation | Meaning |
| --- | --- |
| HTN | Hypertension (high blood pressure) |
| DM | Diabetes Mellitus |
| CHF | Congestive Heart Failure |
| COPD | Chronic Obstructive Pulmonary Disease |
| CAD | Coronary Artery Disease |
| CVA | Cerebrovascular Accident (stroke) |
| MI | Myocardial Infarction (heart attack) |
| UTI | Urinary Tract Infection |
| URI | Upper Respiratory Infection |
| GERD | Gastroesophageal Reflux Disease |
| RA | Rheumatoid Arthritis |
| OA | Osteoarthritis |

---

## Laboratory and Diagnostic Abbreviations

| Abbreviation | Meaning |
| --- | --- |
| CBC | Complete Blood Count |
| BMP | Basic Metabolic Panel |
| CMP | Comprehensive Metabolic Panel |
| UA | Urinalysis |
| CXR | Chest X-Ray |
| EKG/ECG | Electrocardiogram |
| MRI | Magnetic Resonance Imaging |
| CT | Computed Tomography |
| US | Ultrasound |
| ABG | Arterial Blood Gas |
| HbA1c | Hemoglobin A1c (diabetes test) |
| TSH | Thyroid Stimulating Hormone |
| PSA | Prostate-Specific Antigen |
| LFT | Liver Function Tests |

---

## Healthcare Setting Abbreviations

| Abbreviation | Meaning |
| --- | --- |
| ED, ER | Emergency Department/Room |
| OR | Operating Room |
| ICU | Intensive Care Unit |
| PACU | Post-Anesthesia Care Unit |
| OPD | Outpatient Department |
| SNF | Skilled Nursing Facility |
| PCP | Primary Care Provider |
| NP | Nurse Practitioner |
| PA | Physician Assistant |
| RN | Registered Nurse |
| MA | Medical Assistant |
| LPN | Licensed Practical Nurse |

---

## Documentation Abbreviations

| Abbreviation | Meaning |
| --- | --- |
| Hx | History |
| Dx | Diagnosis |
| Tx | Treatment |
| Rx | Prescription |
| Sx | Symptoms |
| Px | Prognosis |
| c/o | Complains of |
| s/p | Status post (after) |
| w/o | Without |
| w/ | With |
| N/A | Not applicable |
| WNL | Within normal limits |
| NAD | No acute distress |
| NKA | No known allergies |
| NKDA | No known drug allergies |

---

## Vital Signs Abbreviations

| Abbreviation | Meaning |
| --- | --- |
| BP | Blood Pressure |
| HR | Heart Rate |
| RR | Respiratory Rate |
| T, Temp | Temperature |
| O2 Sat, SpO2 | Oxygen Saturation |
| Wt | Weight |
| Ht | Height |
| BMI | Body Mass Index |

---

## Practice: What Do These Mean?

1. **"HTN, DM - taking meds PO BID"**
   - High blood pressure and diabetes, taking medications by mouth twice daily

2. **"Pt c/o URI sx x 3 days"**
   - Patient complains of upper respiratory infection symptoms for 3 days

3. **"Order: CBC, BMP, UA - STAT"**
   - Order complete blood count, basic metabolic panel, and urinalysis immediately

4. **"Rx: Amoxicillin 500mg PO TID x 10 days"**
   - Prescription for Amoxicillin 500mg by mouth three times daily for 10 days

5. **"F/U in 2 wks, PRN sooner"**
   - Follow up in 2 weeks, or sooner if needed

---

## Key Takeaways

1. **Timing abbreviations** (QD, BID, TID) tell you how often
2. **Route abbreviations** (PO, IV, IM) tell you how medication is given
3. **Diagnosis abbreviations** (HTN, DM, COPD) are common conditions
4. **Lab abbreviations** (CBC, CMP, UA) refer to common tests
5. Always ask if you're unsure—patient safety comes first

*When in doubt about any abbreviation, ask a clinical team member or provider for clarification.*`,
      duration_minutes: 10,
      sort_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm4',
      course_id: '1',
      slug: 'medical-terminology-basics',
      title: 'Medical Terminology Basics',
      description: 'Learn essential medical terminology for clinic operations.',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Healthcare Foundations',
    prevLesson: 'common-suffixes',
    nextLesson: null,
    nextIsQuiz: true,
  },
  // Front Office Specialist - Insurance Operations Module
  'reading-insurance-card': {
    lesson: {
      id: 'l11',
      module_id: 'm5',
      slug: 'reading-insurance-card',
      title: 'Reading an Insurance Card',
      description: 'Learn to identify key information on insurance cards: member ID, group number, plan type, and contact numbers.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/Read_ins_card.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm5',
      course_id: '2',
      slug: 'insurance-operations',
      title: 'Insurance Operations',
      description: 'Master the day-to-day insurance tasks.',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Front Office Specialist',
    prevLesson: null,
    nextLesson: 'real-time-eligibility',
    nextIsQuiz: false,
  },
  'real-time-eligibility': {
    lesson: {
      id: 'l12',
      module_id: 'm5',
      slug: 'real-time-eligibility',
      title: 'Real-Time Eligibility Verification',
      description: 'Step-by-step process for verifying patient insurance eligibility before appointments.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/Realtime_eligibility.mp4`,
      reading_content: null,
      duration_minutes: 5,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm5',
      course_id: '2',
      slug: 'insurance-operations',
      title: 'Insurance Operations',
      description: 'Master the day-to-day insurance tasks.',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Front Office Specialist',
    prevLesson: 'reading-insurance-card',
    nextLesson: 'understanding-copays',
    nextIsQuiz: false,
  },
  'understanding-copays': {
    lesson: {
      id: 'l13',
      module_id: 'm5',
      slug: 'understanding-copays',
      title: 'Understanding Copays',
      description: 'What copays are, how to identify them, when to collect, and how to handle discrepancies.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/Understand_copay.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm5',
      course_id: '2',
      slug: 'insurance-operations',
      title: 'Insurance Operations',
      description: 'Master the day-to-day insurance tasks.',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Front Office Specialist',
    prevLesson: 'real-time-eligibility',
    nextLesson: 'deductibles-oop-max',
    nextIsQuiz: false,
  },
  'deductibles-oop-max': {
    lesson: {
      id: 'l14',
      module_id: 'm5',
      slug: 'deductibles-oop-max',
      title: 'Deductibles & Out-of-Pocket Maximum',
      description: 'Understanding deductibles, tracking patient progress, and out-of-pocket maximums.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/Deduct_OOPmax.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm5',
      course_id: '2',
      slug: 'insurance-operations',
      title: 'Insurance Operations',
      description: 'Master the day-to-day insurance tasks.',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Front Office Specialist',
    prevLesson: 'understanding-copays',
    nextLesson: 'coinsurance-calculations',
    nextIsQuiz: false,
  },
  'coinsurance-calculations': {
    lesson: {
      id: 'l15',
      module_id: 'm5',
      slug: 'coinsurance-calculations',
      title: 'Coinsurance Calculations',
      description: 'How to calculate patient coinsurance responsibility and explain it to patients.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/coinsurance_operations.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm5',
      course_id: '2',
      slug: 'insurance-operations',
      title: 'Insurance Operations',
      description: 'Master the day-to-day insurance tasks.',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Front Office Specialist',
    prevLesson: 'deductibles-oop-max',
    nextLesson: 'collecting-patient-payments',
    nextIsQuiz: false,
  },
  'collecting-patient-payments': {
    lesson: {
      id: 'l16',
      module_id: 'm5',
      slug: 'collecting-patient-payments',
      title: 'Collecting Patient Payments',
      description: 'Best practices for collecting copays, coinsurance, and outstanding balances.',
      content_type: 'video',
      video_url: `${VIDEO_BASE_URL}/Collect_copay.mp4`,
      reading_content: null,
      duration_minutes: 4,
      sort_order: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    module: {
      id: 'm5',
      course_id: '2',
      slug: 'insurance-operations',
      title: 'Insurance Operations',
      description: 'Master the day-to-day insurance tasks.',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    courseTitle: 'Front Office Specialist',
    prevLesson: 'coinsurance-calculations',
    nextLesson: null,
    nextIsQuiz: true,
  },
  // ─── SECTION PAGE LESSON ENTRIES ───
  // Foundations Section
  'understanding-healthcare-delivery': {
    lesson: {
      id: 'fs-l1', module_id: 'fs-m1', slug: 'understanding-healthcare-delivery',
      title: 'Understanding How Healthcare is Delivered',
      description: 'Explore the two main healthcare delivery models and why understanding them matters for your career.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/healthdelivery_overview.mp4`,
      reading_content: null, duration_minutes: 3, sort_order: 1,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'fs-m1', course_id: 'foundations', slug: 'healthcare-delivery', title: 'Healthcare Delivery', description: 'Healthcare delivery models.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Foundations of Healthcare', prevLesson: null, nextLesson: 'the-inpatient-encounter', nextIsQuiz: false,
  },
  'the-inpatient-encounter': {
    lesson: {
      id: 'fs-l2', module_id: 'fs-m1', slug: 'the-inpatient-encounter',
      title: 'The Inpatient Encounter',
      description: 'Learn what makes inpatient care unique - the continuous episode, contained services, and administrative touchpoints.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/ip-encounter.mp4`,
      reading_content: null, duration_minutes: 5, sort_order: 2,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'fs-m1', course_id: 'foundations', slug: 'healthcare-delivery', title: 'Healthcare Delivery', description: 'Healthcare delivery models.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Foundations of Healthcare', prevLesson: 'understanding-healthcare-delivery', nextLesson: 'the-ambulatory-care-journey', nextIsQuiz: false,
  },
  'the-ambulatory-care-journey': {
    lesson: {
      id: 'fs-l3', module_id: 'fs-m1', slug: 'the-ambulatory-care-journey',
      title: 'The Ambulatory Care Journey',
      description: 'Discover how ambulatory care works through multiple discrete encounters and why the front office is the essential communication hub.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/ambjourney.mp4`,
      reading_content: null, duration_minutes: 5, sort_order: 3,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'fs-m1', course_id: 'foundations', slug: 'healthcare-delivery', title: 'Healthcare Delivery', description: 'Healthcare delivery models.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Foundations of Healthcare', prevLesson: 'the-inpatient-encounter', nextLesson: null, nextIsQuiz: true,
  },
  // ─── EHR & Practice Management Section ───
  'encounters-and-identifiers': {
    lesson: {
      id: 'ehr-l1', module_id: 'ehr-m1', slug: 'encounters-and-identifiers',
      title: 'Encounter Types & Patient Identifiers',
      description: 'Learn the different encounter types you\'ll work with in an EHR system and understand the critical difference between MRN and FIN.',
      content_type: 'reading', video_url: null,
      reading_content: `# Encounter Types & Patient Identifiers

## Why This Matters

Every time a patient interacts with a healthcare organization — whether they walk into the clinic, call on the phone, or have lab results entered — the EHR system creates an **encounter**. As front office staff, you'll create, open, and work within encounters every single day.

You also need to understand the two key identifiers that tie everything together: the **MRN** (Medical Record Number) and the **FIN** (Financial Identification Number). Confusing these is one of the most common new-hire mistakes, and it can cause billing errors, misfiled records, and compliance problems.

---

## What Is an Encounter?

An **encounter** is any documented interaction between a patient and the healthcare organization. Think of it as a container — it holds all the notes, orders, charges, and documentation from that specific interaction.

**Key concept:** One patient can have hundreds of encounters over time. Each encounter is a separate event with its own documentation.

### The Four Main Encounter Types

In most EHR systems, you'll work with these encounter types:

| Encounter Type | What It Is | Who Creates It | Front Desk Role |
|---|---|---|---|
| **Appointment** | A scheduled in-person visit (office visit, procedure, follow-up) | Created when the appointment is scheduled | You schedule it, check the patient in, and verify demographics/insurance |
| **Phone** | A documented telephone interaction (nurse triage call, prescription refill request, test result callback) | Created by clinical staff or routed from the phone system | You may transfer the call or create a message; the encounter documents what was discussed |
| **Results Entry** | Lab work, imaging, or other test results entered into the chart | Created by the lab interface or manually by staff | You may notify the patient that results are available or schedule a follow-up |
| **Transcription** | A dictated note converted to text and attached to the patient's record | Created when a provider dictates notes after a visit | Rarely a front desk task, but you should know it exists when you see it in the chart |

---

## Appointment Encounters: Your Primary Focus

As front office staff, **appointment encounters** are where you'll spend most of your time. Here's the lifecycle:

**1. Scheduling** — You create the appointment in the EHR. This reserves a time slot and generates a pending encounter.

**2. Pre-visit** — Before the patient arrives, you (or a colleague) may verify insurance, confirm demographics, and check for outstanding balances. This is called **pre-scrubbing** the schedule.

**3. Check-in** — When the patient arrives, you open the encounter, verify their identity, collect copays, and update any changed information.

**4. During the visit** — The clinical team documents in the encounter: vitals, exam notes, orders, diagnoses.

**5. Check-out** — You may schedule follow-ups, provide visit summaries, or collect remaining balances.

**6. After the visit** — Charges are captured, claims are generated, and the encounter is eventually closed.

> **Remember:** Every appointment encounter generates charges that flow into billing. Accurate check-in information is critical because it determines where the bill goes.

---

## Phone Encounters: More Than Just Answering Calls

Not every phone call becomes a documented encounter, but many do. Phone encounters are created when the call involves:

- A clinical decision (nurse advising a patient about symptoms)
- A prescription refill request
- A callback with test results
- A referral coordination call
- Any interaction that needs to be part of the medical record

**Your role:** You may not create the phone encounter yourself, but you'll route calls to the right person and sometimes document messages that get attached to a phone encounter.

---

## MRN: The Medical Record Number

The **MRN (Medical Record Number)** is the patient's **permanent, unique identifier** within your healthcare organization.

**Key facts about the MRN:**

- **One patient = one MRN** — it never changes, no matter how many times the patient visits
- Assigned at the patient's **very first visit** (or when they are first registered in the system)
- Used to **find the patient** in the EHR — it's like a library card number
- Stays the same whether the patient comes for a routine checkup, an ER visit, or a surgery
- If a patient hasn't visited in 10 years and comes back, their MRN is still the same

**Think of it this way:** The MRN is the patient's "forever ID" at your organization. It links to their entire medical history.

> **Front desk tip:** When a patient calls and says "I'm a patient there," you'll search by name and date of birth, and the system returns their MRN. Always verify you have the right patient — never assume.

---

## FIN: The Financial Identification Number

The **FIN (Financial Identification Number)**, also called an **Account Number** or **Visit Number**, is tied to a **single encounter or visit**.

**Key facts about the FIN:**

- **One visit = one FIN** — every encounter gets its own unique FIN
- A patient who visits 5 times in a year will have 5 different FINs (but the same MRN)
- The FIN links to all the **charges, payments, and insurance claims** for that specific visit
- Insurance companies use the FIN to process claims for that particular encounter
- When billing questions come up about a specific visit, you'll reference the FIN

**Think of it this way:** If the MRN is the patient's "forever ID," the FIN is the "receipt number" for one specific visit.

---

## MRN vs FIN: Side by Side

| | MRN (Medical Record Number) | FIN (Financial Identification Number) |
|---|---|---|
| **Scope** | Entire patient record | One specific encounter/visit |
| **How many per patient?** | One (permanent) | One per visit (many over time) |
| **Created when?** | First-ever registration | Each time an encounter is created |
| **Used for** | Finding the patient, accessing medical history | Billing, insurance claims, visit-specific lookups |
| **Changes?** | Never | New one every visit |
| **Example** | MRN: 00412385 | FIN: 9230017854 |

### Real-World Example

**Maria Garcia** has been a patient at Valley Medical Group for 3 years.

- Her **MRN** is **00412385** — assigned when she first registered. It has never changed.
- Last Tuesday she had a **routine physical**. That visit was assigned **FIN 9230017854**.
- Today she calls about a **prescription refill**. A phone encounter is created with **FIN 9230018201**.
- Next week she has a **follow-up lab draw**. That will get yet another new FIN.

All three FINs link back to MRN 00412385 — the same Maria Garcia.

---

## Why Duplicate Records Are Dangerous

One of the biggest problems in healthcare data is **duplicate MRNs** — when the same patient accidentally gets registered twice with two different MRNs.

**How it happens:**
- Patient gives a nickname ("Liz" instead of "Elizabeth")
- Misspelled name at registration
- Patient doesn't mention they've been seen before
- Staff skips the search step and creates a new record

**Why it's dangerous:**
- **Split medical history** — allergies, medications, and past diagnoses may only appear under one MRN
- **Billing errors** — insurance may deny claims if patient info doesn't match
- **Safety risks** — a provider might not see a critical drug allergy listed under the other MRN

**Your role in prevention:** Always search thoroughly before creating a new patient record. Search by date of birth, last name, phone number, and SSN (last 4). If you find a possible match, verify with the patient before creating a new record.

---

## Quick Reference Summary

**Encounter types you'll see:**
- **Appointment** — scheduled in-person visit (your primary workflow)
- **Phone** — documented phone interaction
- **Results Entry** — lab/imaging results added to chart
- **Transcription** — dictated provider notes

**The two identifiers:**
- **MRN** = patient's permanent ID (one per patient, never changes)
- **FIN** = visit-specific ID (one per encounter, links to billing)

**Your daily responsibilities:**
- Search for existing patients before creating new records
- Verify patient identity at every check-in
- Understand which encounter you're working in
- Know that every encounter generates billing activity tied to its FIN`,
      duration_minutes: 8, sort_order: 4,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m1', course_id: 'ehr-fundamentals', slug: 'ehr-basics', title: 'Understanding Your Systems', description: 'PM and EHR fundamentals.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: null, nextLesson: 'pm-vs-ehr', nextIsQuiz: false,
  },
  'pm-vs-ehr': {
    lesson: {
      id: 'ehr-l2', module_id: 'ehr-m1', slug: 'pm-vs-ehr',
      title: 'Practice Management vs EHR',
      description: 'Understand what PM and EHR systems do, which screens you work in, and how they connect.',
      content_type: 'reading', video_url: null,
      reading_content: `# Practice Management vs EHR

## What is a Practice Management System?

A **Practice Management (PM) system** handles the **business side** of running a healthcare practice. Think of it as the administrative backbone — it's where the money, scheduling, and patient demographics live.

**What the PM system manages:**

- **Scheduling** — Appointment booking, provider schedule templates, room assignments
- **Patient demographics** — Name, address, phone, DOB, emergency contacts, employer
- **Insurance information** — Payer, plan type, policy/group numbers, subscriber info
- **Billing & claims** — Charge entry, claim submission, payment posting, aging reports
- **Eligibility verification** — Real-time insurance benefit checks
- **Reporting** — Financial reports, productivity dashboards, no-show rates

**As front office staff, you live in the PM system** for most of your day: scheduling appointments, registering patients, verifying insurance, and collecting payments.

> **Key insight:** The PM system doesn't contain clinical notes, lab results, or medication lists. It's purely administrative and financial.

---

## What is an EHR?

An **Electronic Health Record (EHR)** handles the **clinical side** — it's the patient's medical chart in digital form. This is where providers, nurses, and clinical staff document what happens during a patient encounter.

**What the EHR manages:**

- **Clinical documentation** — Progress notes, exam findings, assessments, plans
- **Orders** — Lab orders, imaging orders, referral orders, procedure orders
- **Results** — Lab values, radiology reports, pathology reports
- **Medications** — Current medications, allergies, prescription history, eRx
- **Problem list** — Active diagnoses, past medical history
- **Clinical messaging** — Provider-to-provider messages, patient portal messages, nurse task lists

**Providers and nurses live in the EHR** during patient encounters. Front office staff have **limited access** — you can view demographics, the encounter list, and some summary information, but you typically cannot see full clinical notes.

> **EHR vs EMR:** These terms are often used interchangeably. Technically, an EMR (Electronic Medical Record) is a single practice's digital chart, while an EHR is designed to share data across organizations. In daily conversation, most people say "EHR."

---

## PM vs EHR: Side by Side

| Task | System | Who Does It |
|---|---|---|
| Schedule an appointment | **PM** | Front desk |
| Register a new patient | **PM** | Front desk |
| Verify insurance eligibility | **PM** | Front desk |
| Document vitals (blood pressure, weight) | **EHR** | Medical assistant |
| Write a progress note | **EHR** | Provider |
| Place a lab order | **EHR** | Provider/nurse |
| Submit an insurance claim | **PM** | Billing staff |
| Send an electronic prescription | **EHR** | Provider |
| Post a payment | **PM** | Front desk/billing |
| View lab results | **EHR** | Provider/nurse |
| Check a patient's balance | **PM** | Front desk |
| Route a phone message to a nurse | **EHR** | Front desk |

**Notice the pattern:** PM = business/administrative tasks. EHR = clinical/medical tasks. Front desk primarily works in PM but dips into EHR for messaging and encounter management.

---

## How PM and EHR Connect

In many organizations, PM and EHR are two separate systems that talk to each other through **interfaces** (automated data feeds). In others, they're **integrated** into a single platform.

### Integrated Systems (One Platform)

- **Examples:** Epic, athenahealth, eClinicalWorks
- PM and EHR share the same database
- When you register a patient in PM, the demographic data is instantly available in the EHR
- When a provider enters charges in the EHR, they flow directly to PM billing
- **Advantage:** No data duplication, seamless workflow

### Interfaced Systems (Separate But Connected)

- **Examples:** A practice using one vendor's PM and another's EHR
- Data passes between systems via **HL7 messages** (a healthcare data standard) or **ADT feeds** (Admit-Discharge-Transfer notifications)
- When you update a patient's address in PM, the interface sends the change to the EHR (but there may be a delay)
- **Risk:** Data can get out of sync if interfaces fail

### The Encounter Bridges Both Systems

The **encounter** is the connection point:
1. **PM creates the scheduling container** — date, time, provider, encounter type, expected charges
2. **EHR holds the clinical documentation** — notes, orders, results for that visit
3. **After the visit**, charges flow from EHR back to PM for billing

---

## Your Daily Workflow: PM vs EHR

Here's how a typical front desk day moves between systems:

**Morning (PM focus):**
- Review today's schedule in PM
- Check for pre-registration tasks (new patient forms, insurance updates)
- Run eligibility checks for today's patients

**Patient Check-In (PM → EHR):**
- Verify demographics and insurance in PM
- Collect copay (PM)
- Open/activate the encounter (may trigger in both systems)
- Patient status changes to "Arrived" (visible in both)

**During the Day (EHR for messaging):**
- Route phone messages to clinical pools in EHR
- Check encounter statuses (who's been roomed, who's checking out)
- Handle patient portal messages or route them to the right team

**Patient Check-Out (PM):**
- Schedule follow-up appointments in PM
- Collect any remaining balance in PM
- Provide visit summary (generated from EHR, printed from PM or EHR)

**End of Day (PM):**
- Reconcile payments in PM
- Review tomorrow's schedule
- Flag any missing insurance or incomplete registrations

---

## Common PM/EHR Systems You'll Encounter

| System | Type | Common In |
|---|---|---|
| **Epic** | Integrated PM + EHR | Large health systems, hospitals |
| **Cerner (Oracle Health)** | Integrated PM + EHR | Hospitals, large groups |
| **athenahealth** | Integrated PM + EHR (cloud) | Mid-size practices |
| **eClinicalWorks** | Integrated PM + EHR | Primary care, multi-specialty |
| **NextGen** | Integrated PM + EHR | Specialty practices |
| **Allscripts/Veradigm** | PM + EHR (modular) | Various practice sizes |

**The good news:** While every system looks different, the **workflows are fundamentally the same**. Once you understand PM vs EHR concepts, you can adapt to any system. That's why this foundational knowledge matters more than memorizing one system's buttons.

---

## Quick Reference

**Practice Management (PM):** Business side — scheduling, demographics, insurance, billing, payments. Front desk's primary workspace.

**Electronic Health Record (EHR):** Clinical side — notes, orders, results, medications, messaging. Provider's primary workspace. Front desk has limited access.

**How they connect:** Through interfaces (HL7/ADT) or as an integrated platform. The encounter bridges both systems.

**Your role spans both:** PM for administrative tasks, EHR for encounter management and clinical messaging.`,
      duration_minutes: 7, sort_order: 2,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m1', course_id: 'ehr-fundamentals', slug: 'ehr-basics', title: 'Understanding Your Systems', description: 'PM and EHR fundamentals.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: 'encounters-and-identifiers', nextLesson: 'ehr-navigation', nextIsQuiz: false,
  },
  'ehr-navigation': {
    lesson: {
      id: 'ehr-l3', module_id: 'ehr-m1', slug: 'ehr-navigation',
      title: 'Navigating the EHR',
      description: 'Tour the key EHR sections: patient banner, demographics, encounters, orders, results, and security.',
      content_type: 'reading', video_url: null,
      reading_content: `# Navigating the EHR

## The Patient Banner

Every EHR has a **patient banner** — a strip of critical information displayed at the top of the screen whenever you have a patient's chart open. It's always visible, no matter which tab or section you're viewing.

**What's on the banner:**
- **Patient name** (legal name, preferred name)
- **Date of birth** and **age**
- **MRN** (Medical Record Number)
- **Allergies** (often highlighted in red if present)
- **Preferred pharmacy**
- **Primary care provider**
- **Insurance** (may show plan name)

**Why it matters:** The banner is your safety check. Before doing anything in a patient's chart — scheduling, messaging, updating information — glance at the banner to confirm you're in the **right patient's record**. Wrong-patient errors are serious safety events.

> **Rule of thumb:** If someone walks up to your window, never assume the chart on your screen is theirs. Always verify by asking for their name and DOB, then check the banner.

---

## Demographics & Insurance

This is where front office staff spend most of their EHR time. The demographics section contains all the patient's personal and insurance information.

**What you'll update here:**
- Legal name, preferred name, pronouns
- Home address, mailing address
- Phone numbers (home, cell, work)
- Email address
- Emergency contact
- Employer information
- Insurance cards (primary, secondary)
- Subscriber information
- Guarantor (the person financially responsible)

**Important:** When you update demographics, the changes often flow directly to billing. An incorrect address means mailed statements go to the wrong place. Incorrect insurance means claims get denied. Accuracy here prevents downstream problems.

### Tips for Demographic Updates
- Always ask "Has anything changed since your last visit?" at check-in
- Scan both sides of insurance cards — the back has claims addresses and phone numbers
- If the patient has new insurance, collect old AND new cards (coordination of benefits)
- Verify spelling of names against the photo ID

---

## The Encounter List

The encounter list is a historical record of every interaction the patient has had with your organization. Think of it as a timeline of visits.

**What you'll see:**
- **Date** of each encounter
- **Encounter type** (Office Visit, Phone, Lab Only, etc.)
- **Provider** who was responsible
- **Status** (Open, Closed, Cancelled)
- **Department/location**

**How front desk uses it:**
- "When was the patient last seen?" — Check encounter list
- "Who did they see last time?" — Check the provider column
- "Is there an open encounter from today?" — Check status
- "Were they seen within the last 3 years?" — Determines new vs established

**Open vs Closed encounters:**
- **Open** — Still in progress or awaiting final documentation
- **Closed** — Provider has signed off, charges captured, documentation complete
- Front desk should generally not close encounters (that's the provider's or billing's responsibility)

---

## Clinical Summary

The clinical summary gives an overview of the patient's medical profile. While front desk staff typically don't modify this section, you should know what's here because **patients will ask about it**.

**Key sections:**
- **Problem list** — Active diagnoses (e.g., "Type 2 Diabetes," "Hypertension")
- **Medications** — Current prescriptions with doses
- **Allergies** — Drug allergies, food allergies, environmental allergies
- **Immunizations** — Vaccination history
- **Vitals history** — Blood pressure, weight, height trends
- **Past surgical history**

**What you CAN say to patients:**
- "I can see you have an allergy listed — let me confirm that's still accurate"
- "Your medications are listed in your chart — I'll make sure the nurse reviews them with you"

**What you should NEVER do:**
- Interpret lab results ("Your blood sugar looks high")
- Diagnose or suggest treatments
- Share clinical information with anyone other than the patient (without authorization)

---

## Orders, Results & Documents

### Orders
When a provider decides the patient needs a test, referral, or procedure, they create an **order** in the EHR:
- **Lab orders** — Blood work, urinalysis, cultures
- **Imaging orders** — X-ray, MRI, CT, ultrasound
- **Referral orders** — Send patient to a specialist
- **Procedure orders** — Schedule a minor procedure

**Front desk role with orders:**
- "The doctor ordered labs for you — here's where you can go to get them drawn"
- Schedule imaging or procedure appointments
- Fax or electronically send referral orders to specialists
- Print order sheets if the patient needs a paper copy

### Results
Results flow back into the EHR when tests are completed:
- Lab results appear in the results inbox
- Imaging reports are attached to the order
- Outside records may need to be scanned and uploaded

**Critical rule:** Front desk staff should **NEVER interpret results** for patients. If a patient asks "What did my labs show?", the correct response is: "Your results are in the system. The provider will review them and reach out to you, or you can send a message through the patient portal."

### Documents
The documents section holds:
- Scanned insurance cards, IDs, consent forms
- Uploaded external records
- Letters, referral documents, prior auth approvals
- Visit summaries (After Visit Summary / AVS)

---

## Security & Access Controls

EHR access is governed by **role-based permissions**. Not everyone can see everything.

**What front desk typically CAN access:**
- Patient demographics and insurance
- Scheduling and encounter list
- Message routing and task lists
- Document scanning/uploading
- Basic clinical summary (allergies, problem list)

**What front desk typically CANNOT access:**
- Full clinical notes (progress notes, psychiatry notes)
- Detailed lab result values
- Prescription details beyond what's on the medication list
- Restricted records (VIP patients, employees, behavioral health)

### Audit Trails

**Every action in the EHR is logged.** Every chart you open, every field you view, every change you make creates an audit trail entry with your username, timestamp, and what you did.

**Why this matters:**
- If you access a chart without a business reason (curiosity about a celebrity, looking up a family member, checking a coworker's records), it will be discovered
- HIPAA violations from unauthorized access result in termination and potential fines
- Annual audits review access patterns — random charts are checked against your assigned patients

### Break-the-Glass

Some records have extra protection (employees, VIPs, behavioral health). Accessing them triggers a **"break-the-glass"** alert — you must provide a reason before proceeding. This is logged and reviewed.

**When to break-the-glass:**
- A protected patient checks in at your front desk and you need their demographics
- An emergency where you need to verify allergies

**When NOT to:**
- Curiosity
- A coworker asks you to look something up for them
- You want to check your own records (request your own records through the proper channel)

---

## Quick Reference

| EHR Section | What's There | Front Desk Role |
|---|---|---|
| **Patient Banner** | Name, DOB, MRN, allergies | Verify you're in the right chart |
| **Demographics** | Address, phone, insurance, contacts | Update at every check-in |
| **Encounter List** | All past visits with dates and providers | Look up visit history |
| **Clinical Summary** | Problems, meds, allergies, vitals | Know what's there but don't modify |
| **Orders & Results** | Labs, imaging, referrals, test results | Schedule/print orders, NEVER interpret results |
| **Documents** | Scanned cards, consent forms, letters | Scan and upload documents |
| **Security** | Role-based access, audit trails | Only access charts you have a reason to view |`,
      duration_minutes: 8, sort_order: 3,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m1', course_id: 'ehr-fundamentals', slug: 'ehr-basics', title: 'Understanding Your Systems', description: 'PM and EHR fundamentals.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: 'pm-vs-ehr', nextLesson: null, nextIsQuiz: true,
  },
  // ─── Module 2: Clinic Encounters ───
  'clinic-encounter-types': {
    lesson: {
      id: 'ehr-l4', module_id: 'ehr-m2', slug: 'clinic-encounter-types',
      title: 'Clinic Encounter Types',
      description: 'Deep dive into NP, EST, MAWV, TCM, Preventive, Procedure, and Consult encounters.',
      content_type: 'reading', video_url: null,
      reading_content: `# Clinic Encounter Types

## New Patient (NP) Encounters

A patient is considered **"new"** when they have not been seen by this specific provider (or any provider of the same specialty within the same practice) within the past **3 years**.

**What makes NP encounters unique:**
- **Longer appointment slots** — typically 30-60 minutes vs 15-20 for established
- **Full registration required** — demographics, insurance, medical history questionnaire, consent forms
- **Comprehensive intake forms** — Assignment of Benefits (AOB), Notice of Privacy Practices (NPP), financial responsibility agreement, release of information
- **Higher reimbursement** — NP visit codes (99201-99205) pay more than established visit codes
- **More front desk work** — You're building the patient's record from scratch

**Front desk responsibilities for NP visits:**
1. Verify the patient truly is "new" (search by DOB first, then name)
2. Complete full demographic registration
3. Scan photo ID and insurance cards
4. Collect and process all intake forms
5. Verify insurance eligibility and benefits
6. Collect any applicable copay or deposit

> **Common mistake:** A patient says "I'm new here" but was actually seen 2 years ago by a different provider in the same group. Always search before creating a new record.

---

## Established Patient (EST) Encounters

A patient is **"established"** when they have been seen by the same provider (or same specialty in the group) within the past **3 years**.

**What's different from NP:**
- **Shorter appointment slots** — typically 15-20 minutes
- **Abbreviated check-in** — verify demographics, confirm insurance, collect copay
- **Record already exists** — MRN assigned, history on file, forms previously signed
- **Lower reimbursement** — EST visit codes (99211-99215) pay less than NP codes

**Front desk responsibilities for EST visits:**
1. Verify patient identity (name + DOB)
2. Confirm demographics — "Has your address or phone changed?"
3. Confirm insurance — "Are you still with [payer name]?"
4. Collect copay
5. Check for outstanding balance from prior visits

**Important:** Even though the record exists, you should **verify demographics at every visit**. People move, change phone numbers, get married, and switch insurance. A 30-second verification prevents billing problems later.

---

## Medicare Annual Wellness Visit (MAWV / AWV)

The **Annual Wellness Visit** is a unique Medicare encounter type that is frequently misunderstood — both by patients and by staff.

**What it IS:**
- A **preventive health planning visit** covered by Medicare at no cost to the patient
- Includes: health risk assessment questionnaire, review of medical/family history, list of current providers, advance care planning discussion, personalized prevention plan
- Billed under specific codes: G0438 (initial AWV) or G0439 (subsequent AWV)

**What it is NOT:**
- It is NOT an annual physical exam
- The provider does NOT perform a head-to-toe examination
- It does NOT include labs or diagnostic testing (those are billed separately)

**Why this matters for front desk:**
- Patients often call asking for their "annual physical" or "yearly checkup" — you need to clarify whether they want an AWV or a preventive exam
- **Wrong encounter type = wrong billing = denied claim or patient gets billed**
- If the patient has Medicare, the AWV is $0 copay. If they want a physical exam, different rules apply.
- Some practices schedule both an AWV and a preventive exam on the same day (with proper documentation)

**Front desk tips:**
- When scheduling, confirm: "Are you looking for your Medicare Annual Wellness Visit?"
- Ensure the appointment is built as an AWV encounter type
- Remind the patient: "This is your wellness visit — if you have other concerns, we may need to address those separately"

---

## Transitional Care Management (TCM)

**TCM** encounters occur when a patient is **discharged from a hospital, skilled nursing facility (SNF), or rehab facility** and needs follow-up care.

**Why TCM exists:** Patients are most vulnerable in the days after discharge. Medication errors, missed follow-ups, and readmissions are common. CMS created TCM codes to incentivize timely follow-up.

**Time requirements:**
- **TCM (moderate complexity)** — Face-to-face visit within **14 days** of discharge
- **TCM (high complexity)** — Face-to-face visit within **7 days** of discharge

**Additional requirements:**
- An interactive contact (phone call or face-to-face) within **2 business days** of discharge
- Medication reconciliation within 30 days

**Front desk role in TCM:**
1. Receive discharge notification (fax, electronic feed, or patient call)
2. Schedule follow-up within the required timeframe (7 or 14 days)
3. Attempt phone contact within 2 business days — document all attempts
4. If you can't reach the patient, document: date, time, method, "no answer/voicemail left"
5. Confirm discharge date (this determines the deadline)

> **Revenue impact:** TCM visits reimburse significantly higher than regular office visits. Missing the scheduling window means the practice loses that revenue and the patient loses coordinated care.

---

## Other Common Encounter Types

### Preventive / Well Visit
- Annual physical exam (not the same as AWV)
- Often covered at 100% by commercial insurance
- Includes comprehensive exam, may include routine labs
- Becomes a "problem visit" if the patient raises new complaints (affects billing)

### Procedure
- Minor outpatient procedures: injection, biopsy, skin lesion removal, joint aspiration
- Requires specific encounter setup: procedure consent, supplies, appropriate time block
- Front desk: verify prior authorization if required, ensure procedure slot is long enough

### Consult
- A **specialist evaluation** requested by a referring provider
- Requires: referral on file, referring provider name, reason for consultation
- Front desk: verify referral is active, ensure it matches the consulting provider/specialty

### Pre-Op (Pre-Operative Clearance)
- Medical evaluation before a scheduled surgery
- Must be completed within a specific window (often 30 days before surgery)
- Front desk: confirm surgery date, ensure appointment is timed correctly

### Urgent / Same-Day
- Unscheduled visits worked into the provider's schedule
- Patient calls with acute concern: "I woke up with chest pain" or "My child has a fever of 103"
- Front desk: follow triage protocol — some symptoms require immediate action, not scheduling

---

## Why Encounter Type Matters

Selecting the **correct encounter type** at scheduling isn't just administrative housekeeping — it directly impacts:

| What's Affected | Impact of Wrong Type |
|---|---|
| **Billing codes** | Wrong encounter type → wrong CPT codes → claim denial |
| **Time allocation** | NP booked as EST → not enough time → provider runs behind |
| **Forms & workflow** | NP without intake forms → incomplete record |
| **Reimbursement** | AWV billed as office visit → lost revenue or patient billed incorrectly |
| **Compliance** | TCM outside time window → can't bill TCM codes |
| **Patient experience** | Patient expects one thing, gets another → confusion and complaints |

**Front desk sets the stage.** When you select "New Patient" vs "Established" vs "AWV" vs "Procedure" at the time of scheduling, you're determining the entire downstream workflow. Get it right, and everything flows smoothly.`,
      duration_minutes: 10, sort_order: 1,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m2', course_id: 'ehr-fundamentals', slug: 'clinic-encounters', title: 'Clinic Encounters', description: 'Encounter types and lifecycle.', sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: null, nextLesson: 'encounter-lifecycle', nextIsQuiz: false,
  },
  'encounter-lifecycle': {
    lesson: {
      id: 'ehr-l5', module_id: 'ehr-m2', slug: 'encounter-lifecycle',
      title: 'The Encounter Lifecycle',
      description: 'Follow an encounter from scheduling through check-in, clinical workflow, charge capture, and billing.',
      content_type: 'reading', video_url: null,
      reading_content: `# The Encounter Lifecycle

## Stage 1: Scheduling (PM System)

Every encounter begins when an appointment is created in the Practice Management system.

**What happens:**
- Appointment time slot is reserved on the provider's schedule
- **Encounter type is selected** (NP, EST, AWV, Procedure, etc.)
- Patient demographics are confirmed or entered
- A **pending encounter** is generated in the system

**Pre-visit tasks (before the patient arrives):**
- **Eligibility verification** — Is their insurance active? What's their copay?
- **Referral check** — If specialist visit, is there a valid referral on file?
- **Pre-scrubbing** — Review tomorrow's schedule for missing info, expired insurance, unsigned forms
- **Appointment reminders** — Automated calls, texts, or portal messages sent 24-48 hours before

> **Think of scheduling as building the container.** The encounter type determines the shape of the container — how long it is, what forms are needed, what codes will be used.

---

## Stage 2: Check-In (PM → EHR)

When the patient arrives, the encounter transitions from "Scheduled" to "Active."

**Front desk check-in workflow:**
1. **Greet the patient** — "Hi, can I have your name and date of birth?"
2. **Verify identity** — Check photo ID against the record. Does the name and DOB match the patient banner?
3. **Confirm demographics** — "Has your address, phone, or insurance changed since your last visit?"
4. **Verify insurance** — Scan updated cards if applicable. Run real-time eligibility if not done pre-visit.
5. **Collect copay** — Know the amount from eligibility check. Collect before or after the visit per office policy.
6. **Update encounter status** — Mark patient as "Arrived" or "Checked In" in the system.
7. **Activate the encounter** — In some systems, checking the patient in automatically opens the encounter in the EHR. In others, you manually open it.

**Status flow:**
Scheduled → **Arrived** → Ready for Provider → In Exam → Check-Out → Complete

Each status change is visible on the schedule board, letting the clinical team know where each patient is in the process.

---

## Stage 3: Clinical Workflow (EHR)

Once the patient is roomed, the clinical team takes over in the EHR.

**What happens (not your responsibility, but good to know):**
1. **Medical Assistant rooms the patient** — Takes vitals (BP, weight, temp, pulse), documents chief complaint
2. **Provider enters the room** — Reviews history, performs exam, makes clinical decisions
3. **Orders are placed** — Labs, imaging, referrals, prescriptions
4. **Diagnosis is documented** — ICD-10 codes entered
5. **Treatment plan is created** — Follow-up instructions, medication changes

**What front desk sees during this stage:**
- Patient status changes on the schedule: "In Exam" or "With Provider"
- New orders may appear that require front desk action (scheduling referral, printing lab order)
- The provider may send you a task: "Schedule this patient for follow-up in 2 weeks"

---

## Stage 4: Charge Capture (EHR → PM)

After the visit, the provider documents the charges for the services rendered.

**How charges flow:**
1. Provider selects the **visit level** (E&M code: 99211-99215 for established, 99201-99205 for new)
2. Provider enters **diagnosis codes** (ICD-10) that justify the visit
3. Provider adds any **procedure codes** (CPT) for additional services performed
4. These charges flow from the EHR to the PM system's billing module

**In some practices, front desk is involved:**
- The provider may hand you a **superbill** (encounter form) — a paper or digital checklist of services and diagnoses
- You enter the charges into the PM system
- You verify: Does the encounter type match the charges? Are the diagnosis codes present?

**In other practices, charges are handled entirely by billing staff.** Know your office's workflow.

> **Why this matters:** If charges don't get captured, the practice doesn't get paid. A missed superbill = lost revenue. A wrong diagnosis code = denied claim.

---

## Stage 5: Check-Out & Follow-Up (PM)

When the clinical portion is complete, the patient returns to the front desk.

**Check-out workflow:**
1. **Schedule follow-up** — "The doctor would like to see you in 3 months." Book the next appointment in PM.
2. **Provide visit summary** — Print or electronically send the **After Visit Summary (AVS)**, which includes: visit date, diagnoses discussed, medications, follow-up instructions, scheduled appointments
3. **Process referrals** — If the provider ordered a referral, initiate it: fax to specialist, enter in referral tracking system
4. **Collect remaining balance** — If there's a coinsurance amount or outstanding balance, collect per office policy
5. **Print any orders** — Lab orders, imaging orders, or prescription printouts the patient needs

**Not every practice does formal check-out.** In high-volume clinics, patients may leave without checking out, and follow-up scheduling happens by phone later. Know your office's policy.

---

## Stage 6: Billing & Closure (PM)

The final stage happens after the patient leaves — sometimes days or weeks later.

**The billing cycle:**
1. **Claim scrubbing** — The PM system (or a clearinghouse) checks the claim for errors: missing diagnosis, invalid code combinations, demographic mismatches
2. **Claim submission** — Clean claims are submitted electronically to the insurance payer
3. **Payer processing** — The insurance company adjudicates the claim (typically 14-30 days)
4. **ERA/EOB received** — The payer sends back an **Electronic Remittance Advice (ERA)** showing what they paid and what the patient owes
5. **Payment posting** — Payments are applied to the patient's account in PM
6. **Patient statement** — If there's a remaining balance, a statement is mailed or sent electronically
7. **Encounter closed** — Once all charges are paid and posted, the encounter is marked as closed

**The full cycle — from scheduling to final payment — typically takes 30-90 days.**

---

## The Complete Lifecycle at a Glance

| Stage | System | Owner | Key Action |
|---|---|---|---|
| 1. Scheduling | PM | Front desk | Create appointment, select encounter type |
| 2. Check-In | PM → EHR | Front desk | Verify ID/insurance, collect copay, activate encounter |
| 3. Clinical | EHR | Provider/MA | Document visit, place orders, prescribe |
| 4. Charges | EHR → PM | Provider/billing | Capture E&M codes, diagnoses, procedures |
| 5. Check-Out | PM | Front desk | Schedule follow-up, print AVS, process referrals |
| 6. Billing | PM | Billing staff | Submit claim, post payments, send statements |

**Your touchpoints:** Stages 1, 2, 5, and sometimes 4. You bookend the clinical encounter — what happens before and after the patient sees the provider is primarily your responsibility.`,
      duration_minutes: 8, sort_order: 2,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m2', course_id: 'ehr-fundamentals', slug: 'clinic-encounters', title: 'Clinic Encounters', description: 'Encounter types and lifecycle.', sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: 'clinic-encounter-types', nextLesson: 'scheduling-types-templates', nextIsQuiz: false,
  },
  'scheduling-types-templates': {
    lesson: {
      id: 'ehr-l6', module_id: 'ehr-m2', slug: 'scheduling-types-templates',
      title: 'Scheduling Types & Templates',
      description: 'Learn time-specified, wave, modified wave, block, and open scheduling methods.',
      content_type: 'reading', video_url: null,
      reading_content: `# Scheduling Types & Templates

## Time-Specified Scheduling

**Time-specified scheduling** (also called **stream scheduling**) assigns each patient a specific appointment time with a defined duration.

**How it works:**
- 9:00 AM — Patient A (15 min follow-up)
- 9:15 AM — Patient B (30 min new patient)
- 9:45 AM — Patient C (15 min follow-up)

**Best for:** Specialty practices, procedures, longer consultations

**Pros:**
- Predictable schedule for providers and patients
- Clear expectations for wait times
- Easy to manage appointment length by type

**Cons:**
- One late patient or complex case creates a cascade delay
- No-shows leave empty slots that can't easily be filled
- Less flexibility for same-day requests

---

## Wave Scheduling

**Wave scheduling** books multiple patients at the top of each hour (the "wave"), and they're seen in the order they arrive.

**How it works:**
- 9:00 AM — 3-4 patients all scheduled for 9:00
- Patients are seen in arrival order
- 10:00 AM — Next wave of 3-4 patients

**Best for:** High-volume primary care, clinics with high no-show rates

**Pros:**
- Absorbs no-shows naturally (if one of four doesn't show, three still fill the hour)
- Provider stays busy even if patients arrive late
- Simple to schedule — fewer precise time calculations

**Cons:**
- Longer wait times for patients (especially those who arrive on time)
- Can feel chaotic in the waiting room
- Patient satisfaction may suffer

---

## Modified Wave Scheduling

**Modified wave** is a hybrid — it takes the flexibility of wave scheduling and adds some structure.

**How it works:**
- 9:00 AM — 2 patients scheduled
- 9:20 AM — 1 patient scheduled
- 9:40 AM — open (buffer/catch-up time)
- 10:00 AM — 2 patients scheduled

**Best for:** Practices balancing volume with patient experience

**Pros:**
- Builds in catch-up time
- Reduces wait times compared to pure wave
- Still absorbs some no-show impact
- Balances provider efficiency with patient satisfaction

**Cons:**
- More complex to set up in the PM system
- Requires careful template design
- Staff need to understand the pattern

> **This is the most common scheduling method** in modern ambulatory practices because it balances efficiency with patient experience.

---

## Double-Booking

**Double-booking** places two patients in the same time slot intentionally.

**When it's used:**
- One patient is seeing the **provider** while the other sees the **MA or nurse** for a quick task (injection, blood draw, vitals check)
- A **same-day urgent request** needs to be worked in
- A provider agrees to see an extra patient during a slot

**How it's managed:**
- The PM system shows two appointments stacked in the same slot
- One is tagged as the "primary" appointment, the other may have a flag like "work-in" or "double-book"
- The clinical team is aware and has planned the workflow

**Risks:**
- Extended wait times if both patients need the provider simultaneously
- Provider burnout if double-booking is overused
- Patient complaints about delays

**Front desk rule:** Never double-book without the provider's or office manager's approval. Each provider has their own tolerance for double-booking.

---

## Open Access / Same-Day Scheduling

**Open access** (also called **advanced access** or **same-day scheduling**) reserves a portion of the schedule for same-day appointment requests.

**How it works:**
- Provider has 20 appointment slots per day
- 14 slots are pre-booked (follow-ups, physicals, etc.)
- 6 slots are held open for same-day calls
- When patients call that morning, they're offered one of the open slots

**Best for:** Primary care practices wanting to reduce wait times for acute visits

**Pros:**
- Patients with urgent needs are seen the same day
- Reduces ER visits for non-emergencies
- Improves patient satisfaction and access scores

**Cons:**
- Requires accurate demand forecasting (too many open slots = wasted time; too few = patients still wait)
- Follow-up scheduling competes with same-day demand
- Providers may have unpredictable days

---

## Block Scheduling

**Block scheduling** reserves specific time blocks for specific encounter types or purposes.

**Example daily template:**
| Time | Block Type |
|---|---|
| 8:00 - 9:00 AM | New Patients only |
| 9:00 - 11:00 AM | Established Patients |
| 11:00 - 12:00 PM | Procedures |
| 1:00 - 2:00 PM | Same-Day/Urgent |
| 2:00 - 4:00 PM | Established Patients |
| 4:00 - 4:30 PM | Phone Encounters / Admin |

**Best for:** Multi-specialty practices, procedure-heavy schedules, teaching environments

**Pros:**
- Ensures protected time for specific visit types
- Prevents new patients from being squeezed into quick slots
- Allows resource planning (procedure rooms, equipment, staff)

**Cons:**
- Less flexible — a follow-up patient can't book into a procedure block
- May create access gaps if blocks don't match actual demand
- Requires regular template review and adjustment

---

## Provider Schedule Templates

A **schedule template** is the recurring weekly pattern that defines when a provider is available and what type of visits they accept during each time block.

**Template components:**
- **Days of the week** the provider works
- **Start and end times** for each day
- **Block definitions** — which hours are for which encounter types
- **Appointment durations** — 15 min, 20 min, 30 min, 45 min, 60 min by type
- **Location** — Which office or exam room (for multi-location practices)

**Common template variations:**
| Template | Description |
|---|---|
| Regular Clinic Day | Full day of patient appointments |
| Half-Day | Morning or afternoon only (other half: OR, admin, teaching) |
| Procedure Day | Blocks reserved for procedures, fewer standard visits |
| Telehealth Day | Virtual visits only, no in-person appointments |
| Admin Day | No patients — paperwork, meetings, chart review |

**Front desk must know each provider's template** to schedule correctly. Booking a 30-minute new patient into a 15-minute established slot causes cascading delays.

**Templates change:** Providers may modify their templates for vacation, conferences, holidays, or seasonal demand. Front desk should be notified of template changes in advance.

---

## Quick Reference: Which Method When?

| Method | Best For | Key Advantage |
|---|---|---|
| **Time-Specified** | Specialty, procedures | Predictable timing |
| **Wave** | High-volume primary care | Absorbs no-shows |
| **Modified Wave** | Most ambulatory practices | Balance of efficiency and experience |
| **Double-Booking** | Work-ins, dual workflows | Maximizes provider time |
| **Open Access** | Primary care, urgent needs | Same-day availability |
| **Block** | Multi-specialty, procedures | Protected time for specific types |`,
      duration_minutes: 7, sort_order: 3,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m2', course_id: 'ehr-fundamentals', slug: 'clinic-encounters', title: 'Clinic Encounters', description: 'Encounter types and lifecycle.', sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: 'encounter-lifecycle', nextLesson: null, nextIsQuiz: true,
  },
  // ─── Module 3: Non-Clinic Encounters ───
  'phone-encounters': {
    lesson: {
      id: 'ehr-l7', module_id: 'ehr-m3', slug: 'phone-encounters',
      title: 'Phone Encounters',
      description: 'When and why phone encounters are created, documentation standards, and message routing.',
      content_type: 'reading', video_url: null,
      reading_content: `# Phone Encounters

## When Is a Phone Encounter Created?

Not every phone call creates a documented encounter. A phone encounter is created when the call involves a **clinical decision, medical advice, or action that needs to be part of the patient's permanent medical record**.

**Creates a phone encounter:**
- Nurse provides triage advice for symptoms
- Provider authorizes a medication refill
- Clinical staff calls patient with test results
- Provider gives medical advice or changes a treatment plan
- Referral coordinator discusses referral status with clinical implications

**Does NOT create a phone encounter:**
- Patient calls to schedule or reschedule an appointment (scheduling task, not clinical)
- Patient asks about their bill or account balance (billing inquiry)
- Patient calls to update their address or phone number (demographic update)
- General office questions ("What are your hours?", "Do you accept my insurance?")

> **Rule of thumb:** If the call involves a clinical decision or medical information that should be documented in the chart, it's a phone encounter. If it's purely administrative, it's not.

---

## Anatomy of a Phone Encounter

When a phone encounter is created in the EHR, it contains specific fields:

| Field | What Goes Here |
|---|---|
| **Patient** | Linked by MRN — ensures documentation goes to the right chart |
| **Date/Time** | When the call occurred |
| **Caller** | Who called — patient, spouse, pharmacy, other provider |
| **Reason** | Brief description — "Requesting refill of lisinopril" or "Reporting fever x 3 days" |
| **Conversation notes** | What was discussed, symptoms described, questions asked |
| **Action taken** | What the clinical team did — "Advised to go to ER", "Refill sent to Walgreens", "Scheduled follow-up" |
| **Follow-up needed** | Next steps — "Call back in 48 hours if no improvement", "Lab order placed" |
| **Documented by** | Your name (or whoever documented the encounter) |

**Front desk typically doesn't create the full phone encounter** — but you often create the initial **message** that gets routed to clinical staff, who then complete the encounter documentation.

---

## Routing & Message Pools

When a patient calls with a clinical question, front desk serves as the **triage point** — you determine where the message should go.

**Common message pools (team inboxes) in the EHR:**

| Pool | Routes To | Example Calls |
|---|---|---|
| **Nurse Triage** | RN/LPN team | "I have a rash that's getting worse" |
| **Refill Line** | Pharmacy tech / provider | "I need a refill on my blood pressure medication" |
| **Lab Results** | Nurse / provider | "I had blood work done last week, any results?" |
| **Referrals** | Referral coordinator | "Has my referral to the cardiologist been approved?" |
| **Billing** | Billing department | "I got a bill I don't understand" |
| **Medical Records** | HIM staff | "I need a copy of my records for a new doctor" |
| **Provider Direct** | Specific provider's inbox | Provider requests patient call them directly |

**Your role as front desk:**
1. Answer the call with proper greeting
2. Verify the patient's identity (name + DOB)
3. Determine the nature of the call
4. Create a message in the EHR with: patient link, caller info, reason, urgency level
5. Route to the appropriate pool
6. Let the patient know what to expect: "A nurse will call you back within [timeframe]"

---

## Documenting Patient Messages

Here's a typical phone message workflow:

**Patient calls:** "Hi, I'm a patient of Dr. Smith. I've had a headache for 3 days and it's getting worse. Should I be worried?"

**Front desk creates a message:**
- Patient: Jane Doe (MRN 00384712)
- Caller: Patient
- Reason: Headache x 3 days, worsening
- Urgency: Routine (unless symptoms suggest emergency — then follow triage protocol)
- Routed to: Nurse Triage pool

**Nurse receives the message, calls patient back:**
- Asks screening questions (fever? vision changes? worst headache of life?)
- Provides advice based on protocol
- Documents the full conversation in a **phone encounter**
- If needed, schedules a same-day appointment or directs to ER

**Your accuracy matters.** If you document "headache" but the patient actually said "worst headache of my life with vision changes," the nurse might not prioritize the call appropriately. Write down what the patient tells you — their words, not your interpretation.

---

## Refill Requests & Callbacks

Prescription refill requests are one of the most common phone encounters.

**Refill request workflow:**
1. Patient calls: "I need a refill on my medication"
2. Front desk documents:
   - Medication name (or "the blue pill for blood pressure" — do your best)
   - Pharmacy name and phone number
   - Last fill date (if the patient knows)
   - Number of refills remaining (if known)
3. Route message to refill pool or provider's inbox
4. Provider reviews and either:
   - **Approves** — eRx sent to pharmacy
   - **Denies** — Needs office visit first, or medication change needed
   - **Needs info** — "Which pharmacy? What dose?"
5. Patient is notified of outcome (by phone or portal message)

**Callback encounters:**
When clinical staff calls the patient back about results, refills, or clinical questions, that callback is documented as a phone encounter. The encounter records what was communicated and any actions taken.

**Common refill red flags (route urgently):**
- Insulin, blood thinners, seizure medications — missing doses can be dangerous
- Patient says they've been out of medication for several days
- Controlled substance refill requests — follow your office's specific protocol

---

## Quick Reference

**Phone encounter = clinical call that should be documented in the medical record**

**Your role:**
1. Verify patient identity
2. Document the message accurately (their words, not your interpretation)
3. Route to the correct pool
4. Set expectations for callback timing

**Not every call is a phone encounter** — scheduling, billing, and general questions are handled separately.`,
      duration_minutes: 6, sort_order: 1,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m3', course_id: 'ehr-fundamentals', slug: 'non-clinic-encounters', title: 'Non-Clinic Encounters', description: 'Phone and non-visit encounters.', sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: null, nextLesson: 'non-visit-encounters', nextIsQuiz: false,
  },
  'non-visit-encounters': {
    lesson: {
      id: 'ehr-l8', module_id: 'ehr-m3', slug: 'non-visit-encounters',
      title: 'Non-Visit Encounters',
      description: 'eRx, lab-only orders, imaging orders, prior auth encounters, and letter encounters.',
      content_type: 'reading', video_url: null,
      reading_content: `# Non-Visit Encounters

## What Are Non-Visit Encounters?

Not every encounter requires the patient to walk through your doors. **Non-visit encounters** are documented interactions that happen without a face-to-face clinic appointment. They exist because healthcare activity happens between visits — prescriptions need refilling, lab results need reviewing, and paperwork needs processing.

As front office staff, you'll see these encounter types in the patient's encounter list and may be involved in initiating or tracking some of them.

---

## eRx (Electronic Prescription) Encounters

An **eRx encounter** is created when a provider sends a prescription electronically **without an associated office visit**.

**Common scenarios:**
- Provider reviews lab results and adjusts a medication dose — sends new eRx
- Patient calls requesting a refill — provider authorizes and sends eRx
- After a hospital discharge, the PCP reviews discharge meds and sends maintenance prescriptions
- Provider wants to start a new medication based on a phone consultation

**How it works:**
1. Provider opens the patient's chart
2. Creates or opens an eRx encounter
3. Prescribes the medication electronically (sent directly to pharmacy via Surescripts network)
4. Encounter is documented and closed

**Front desk role:** Minimal. You might take the initial refill request (phone encounter), but the eRx itself is handled by the provider. When patients call asking "Did my doctor send in my prescription?", you can check the encounter list or medication history to confirm.

---

## Lab-Only & Imaging-Only Orders

Sometimes a provider orders tests **outside of a regular visit**. This creates a non-visit encounter specifically for the order.

### Lab-Only Encounters
- **Example:** Provider orders annual bloodwork (CBC, metabolic panel, A1C) without an office visit
- **Workflow:** Order placed in EHR → lab order printed or sent electronically → patient goes to lab draw station or outside lab → results return to EHR → provider reviews
- **Front desk role:** May hand the patient a printed lab order, direct them to the lab, or schedule a lab appointment

### Imaging-Only Encounters
- **Example:** Provider orders a follow-up X-ray or MRI based on prior visit findings
- **Workflow:** Order placed → imaging scheduled (you may do this) → patient goes to imaging center → report returns to EHR → provider reviews
- **Front desk role:** Schedule the imaging appointment, provide the order to the patient, verify prior authorization if required

**Key point:** These encounters generate charges even though no office visit occurred. The lab or imaging facility bills separately for performing the test, and the provider may bill for ordering and interpreting the results.

---

## Results Entry Encounters

A **results entry encounter** is created when external results or records need to be manually entered into the patient's chart.

**When this happens:**
- Patient brings lab results from an outside facility
- Records arrive from a referring provider or hospital
- Pathology reports come from an external lab
- Patient provides records from a specialist not connected to your EHR

**Who creates them:** Usually HIM (Health Information Management) or clinical support staff

**Front desk role:**
- Accept documents from the patient at the front window
- Scan and upload to the patient's chart (or place in the scanning queue)
- Note the document type and source for the staff who will file it
- If urgent (e.g., ER records, critical lab values), flag for immediate clinical review

---

## Prior Authorization Encounters

Some practices create a dedicated encounter to **track the prior authorization process** from request to resolution.

**What prior authorization is:** Certain services, medications, or procedures require insurance company approval before they'll be covered. The practice must submit clinical documentation proving medical necessity.

**Prior auth encounter workflow:**
1. Provider orders a service requiring prior auth (e.g., MRI, specialty medication, surgery)
2. A prior auth encounter is created to track the request
3. Clinical documentation is gathered and submitted to the payer
4. Payer reviews and responds: **Approved**, **Denied**, or **Pending additional info**
5. If denied, an appeal may be filed
6. The encounter tracks all dates, communications, and outcomes

**Front desk / referral coordinator role:**
- Identify when a service requires prior auth (the PM system or EHR may flag this)
- Initiate the auth request or hand off to the auth team
- Track status and follow up with the payer
- Notify the patient and scheduling team when approved
- Document denial reasons if applicable

> **Revenue impact:** A service performed without required prior auth may not be covered — the patient or practice absorbs the cost. This is one of the highest-stakes administrative processes.

---

## Letter & Correspondence Encounters

Healthcare practices handle many types of written correspondence, and each may generate a non-visit encounter for documentation and tracking.

**Common types:**

| Letter Type | Description | Front Desk Role |
|---|---|---|
| **Medical records request** | Patient or attorney requests copies of the medical record | Intake the request, verify authorization, route to HIM |
| **FMLA forms** | Employer-required forms for medical leave | Accept from patient, route to provider for completion |
| **Disability forms** | Short or long-term disability documentation | Accept, create encounter or task for provider |
| **School/camp physicals** | Forms requiring physician signature | Schedule visit or route form to provider |
| **Referral letters** | Summary letters to specialists or other providers | Generated by provider, may need to be faxed by front desk |
| **No-show letters** | Formal notice to patients who missed appointments | Generated per office policy |

**Why these are encounters:** Each generates documentation that should be part of the patient's record. Some are billable (provider time completing forms). The encounter tracks: who requested what, when it was completed, and how it was delivered.

---

## Quick Reference

| Encounter Type | Created When | Front Desk Role |
|---|---|---|
| **eRx** | Provider sends prescription without visit | Take refill request, confirm prescription was sent |
| **Lab-Only** | Provider orders labs without visit | Provide lab order to patient, direct to lab |
| **Imaging-Only** | Provider orders imaging without visit | Schedule imaging, provide order, verify prior auth |
| **Results Entry** | External records need to be added to chart | Scan/upload documents, flag urgent items |
| **Prior Auth** | Service requires insurance pre-approval | Initiate request, track status, notify when approved |
| **Letter/Correspondence** | Written documentation requested | Intake request, route to appropriate staff |`,
      duration_minutes: 6, sort_order: 2,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m3', course_id: 'ehr-fundamentals', slug: 'non-clinic-encounters', title: 'Non-Clinic Encounters', description: 'Phone and non-visit encounters.', sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: 'phone-encounters', nextLesson: 'duplicate-records', nextIsQuiz: false,
  },
  'duplicate-records': {
    lesson: {
      id: 'ehr-l9', module_id: 'ehr-m3', slug: 'duplicate-records',
      title: 'Duplicate Records: Prevention & Resolution',
      description: 'How duplicates happen, the two-identifier rule, MPI, and what to do when you find one.',
      content_type: 'reading', video_url: null,
      reading_content: `# Duplicate Records: Prevention & Resolution

## How Duplicate Records Happen

A **duplicate record** occurs when the same patient has two (or more) separate Medical Record Numbers (MRNs) in your system. Each MRN contains only a portion of the patient's history, creating dangerous gaps.

**Common causes:**

| Cause | Example |
|---|---|
| **Nickname vs legal name** | "Liz" registered as new, but "Elizabeth" already exists |
| **Maiden vs married name** | "Maria Garcia" came back as "Maria Rodriguez" after marriage |
| **Spelling errors** | "Johanson" vs "Johansson" vs "Johnson" |
| **Patient says "I'm new"** | Patient forgets they were seen 4 years ago (or at a different location in the same system) |
| **Skipping the search** | Busy front desk creates a new record without searching first |
| **Transposed DOB** | 03/15/1985 entered as 05/13/1985 — search doesn't find the original |
| **Hyphenated names** | "Smith-Jones" registered once as "Smith" and once as "Smith-Jones" |
| **Multiple family members** | Mother and daughter with same name, different DOB — wrong one selected |

> **The #1 cause of duplicate records is rushing.** When the front desk is busy and a patient says "I'm new," the temptation is to skip the search and create a record immediately. Those 30 seconds saved can create hours of cleanup work.

---

## The Two-Identifier Rule

Before creating any new patient record, always verify with **at least two patient identifiers**.

**Acceptable identifier combinations:**
- Full legal name + date of birth (most common)
- Full legal name + last 4 digits of SSN
- Date of birth + phone number
- Full legal name + address

**Best search strategy:**
1. **Start with DOB** — It's the most unique identifier. Search by date of birth first.
2. **Then verify name** — Look at all results with that DOB. Check for similar names, maiden names, nicknames.
3. **Still not found? Try phone number** — If DOB search returns nothing, try the phone number on file.
4. **Ask the patient** — "Have you ever been seen at any of our locations? Even several years ago?"

**Only create a new record after you've exhausted your search.**

---

## The Master Patient Index (MPI)

The **Master Patient Index** is the master database of every patient ever registered in your healthcare system. It's the single source of truth for patient identity.

**What the MPI contains:**
- Every MRN ever assigned
- Patient demographics associated with each MRN
- Links to encounters, orders, and documents
- Cross-references for enterprise systems (connecting MRNs across facilities)

**Enterprise MPI:** Large health systems with multiple hospitals and clinics may have an **Enterprise MPI (EMPI)** that links patient records across all facilities. If a patient was seen at Hospital A and now visits Clinic B (same health system), the EMPI connects both records.

**How MPI helps prevent duplicates:**
- When you search for a patient, you're searching the MPI
- Good MPI systems flag **potential matches** — "This patient may already exist: [similar name, same DOB]"
- Some systems score match probability: "95% likely match" or "Possible duplicate"

---

## The Dangers of Duplicate Records

Duplicate records aren't just an administrative inconvenience — they're a **patient safety risk**.

### Clinical Safety Risks
- **Split medication list** — Allergies listed under one MRN but not the other. Provider prescribes a drug the patient is allergic to because they're looking at the wrong record.
- **Incomplete medical history** — Prior diagnoses, surgeries, or test results only appear under one MRN. Provider makes decisions without full information.
- **Missed results** — Lab results post to MRN-A, but the provider is looking at MRN-B. Critical abnormal results go unreviewed.

### Financial Risks
- **Claim denials** — Insurance info on one MRN, visit on another. Claim submitted with mismatched data.
- **Duplicate billing** — Same service accidentally billed under both MRNs.
- **Lost revenue** — Time spent identifying and merging duplicates is time not spent on productive work.

### Compliance Risks
- **Joint Commission standards** require accurate patient identification
- **CMS Conditions of Participation** mandate accurate medical records
- **HIPAA implications** — Inaccurate records could lead to wrong-patient disclosures

---

## What To Do When You Find a Duplicate

**Critical rule: NEVER merge records yourself.** Merging MRNs is a specialized process that requires careful review of both records to ensure no data is lost.

**When you suspect a duplicate:**

1. **Document both MRNs** — Write down or screenshot both record numbers
2. **Note how you discovered it** — "Patient checked in, found existing record under different name"
3. **Identify which record is more complete** — Which has more encounters? More recent activity? Which has the correct insurance?
4. **Report to HIM (Health Information Management) or your supervisor** — Follow your office's specific duplicate reporting process
5. **Use the correct record for today's visit** — If one record clearly has more history, use that one (ask your supervisor if unsure)
6. **Flag the record** — Most EHRs have a "potential duplicate" flag or alert feature. Use it.

**What the merge team does:**
- Reviews both records side by side
- Determines which MRN will be the "surviving" record
- Moves all encounters, orders, results, and documents to the surviving MRN
- Deactivates the duplicate MRN (but keeps it linkable for audit purposes)
- Verifies that no data was lost in the merge

---

## Prevention Best Practices

### At Registration
- **Always search before creating.** No exceptions. Even if the patient insists they're new.
- **Search by DOB first** — It's the most reliable search field
- **Try multiple search variations** — If "Johnson" returns nothing, try "Johanson" or "Johnsen"
- **Ask explicitly:** "Have you ever been seen at any of our locations? Even for an ER visit or lab work?"
- **Check for similar names** — If you find "Robert Smith" with the same DOB, ask: "Do you also go by Robert? Bobby? Bob?"

### At Check-In
- **Verify photo ID** against the record — does the name and photo match?
- **Confirm DOB verbally** — "Can you confirm your date of birth for me?"
- **Watch for alerts** — If the system shows a "potential duplicate" warning, investigate before proceeding

### Ongoing Vigilance
- If you notice two patients with very similar demographics during your workday, flag it
- If a patient mentions being seen at another location in your system, verify the records are linked
- If you spot a record that looks like it hasn't been used in years but a similar active record exists, report it

---

## Quick Reference

| Situation | Action |
|---|---|
| Patient says "I'm new" | Search by DOB first. Then verify name. Ask about prior visits. |
| Search returns a possible match | Verify with patient: name, DOB, address. Confirm it's the same person. |
| You find a definite duplicate | Document both MRNs. Report to HIM. Do NOT merge yourself. |
| System shows "potential duplicate" alert | Investigate before proceeding. Do not dismiss the alert. |
| Not sure if it's a duplicate | Ask your supervisor. It's better to check than to create another duplicate. |

**Prevention is always better than cleanup.** The 30 seconds you spend searching thoroughly saves hours of merge work and prevents potential safety risks.`,
      duration_minutes: 6, sort_order: 3,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ehr-m3', course_id: 'ehr-fundamentals', slug: 'non-clinic-encounters', title: 'Non-Clinic Encounters', description: 'Phone and non-visit encounters.', sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'EHR & Practice Management', prevLesson: 'non-visit-encounters', nextLesson: null, nextIsQuiz: true,
  },
  // Medical Law & Ethics Section
  'hipaa-basics': {
    lesson: {
      id: 'mle-l1', module_id: 'mle-m1', slug: 'hipaa-basics',
      title: 'HIPAA Basics',
      description: 'Understanding HIPAA regulations and your responsibilities in protecting health information.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/hipaa-basics.mp4`,
      reading_content: null, duration_minutes: 4, sort_order: 1,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'mle-m1', course_id: 'medical-law-ethics', slug: 'hipaa-foundations', title: 'HIPAA Foundations', description: 'Core HIPAA concepts.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Medical Law & Ethics', prevLesson: null, nextLesson: 'phi-explained', nextIsQuiz: false,
  },
  // Insurance Section
  'why-insurance-exists': {
    lesson: {
      id: 'ins-l1', module_id: 'ins-m1', slug: 'why-insurance-exists',
      title: 'Why Insurance Exists',
      description: 'A broad overview of how health insurance works in the US healthcare system.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/whyinsexists.mp4`,
      reading_content: null, duration_minutes: 4, sort_order: 1,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ins-m1', course_id: 'insurance', slug: 'insurance-fundamentals', title: 'Insurance Fundamentals', description: 'Health insurance basics.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Insurance & Billing', prevLesson: null, nextLesson: 'payer-types-plan-types', nextIsQuiz: false,
  },
  'eligibility-and-payments': {
    lesson: {
      id: 'ins-l4', module_id: 'ins-m1', slug: 'eligibility-and-payments',
      title: 'Eligibility & Payments Overview',
      description: 'Overview of the eligibility verification and payment collection processes.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/elig-and-payments.mp4`,
      reading_content: null, duration_minutes: 5, sort_order: 4,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'ins-m1', course_id: 'insurance', slug: 'insurance-fundamentals', title: 'Insurance Fundamentals', description: 'Health insurance basics.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Insurance & Billing', prevLesson: 'key-insurance-terms', nextLesson: null, nextIsQuiz: true,
  },
  // Terminology Section
  'common-abbreviations-video': {
    lesson: {
      id: 'term-v1', module_id: 'term-m1', slug: 'common-abbreviations-video',
      title: 'Common Abbreviations in Healthcare',
      description: 'Learn the most commonly used abbreviations in healthcare settings.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/term-abbrev.mp4`,
      reading_content: null, duration_minutes: 5, sort_order: 1,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'term-m1', course_id: 'terminology', slug: 'medical-terminology-basics', title: 'Medical Terminology Basics', description: 'Foundation terminology concepts.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Medical Terminology', prevLesson: null, nextLesson: 'word-building-decoding-terms', nextIsQuiz: false,
  },
  'word-building-decoding-terms': {
    lesson: {
      id: 'term-v2', module_id: 'term-m1', slug: 'word-building-decoding-terms',
      title: 'Word Building: Decoding Medical Terms',
      description: 'Learn to break down and build medical terminology using prefixes, roots, and suffixes.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/termbuilding.mp4`,
      reading_content: null, duration_minutes: 5, sort_order: 2,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'term-m1', course_id: 'terminology', slug: 'medical-terminology-basics', title: 'Medical Terminology Basics', description: 'Foundation terminology concepts.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Medical Terminology', prevLesson: 'common-abbreviations-video', nextLesson: 'common-prefixes', nextIsQuiz: false,
  },
  // Workflows Section
  'new-patient-registration': {
    lesson: {
      id: 'wf-l1', module_id: 'wf-m1', slug: 'new-patient-registration',
      title: 'New Patient Registration & Scheduling',
      description: 'Complete registration process including demographics, insurance collection, eligibility verification, and appointment booking.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/new_pt_reg.mp4`,
      reading_content: null, duration_minutes: 5, sort_order: 1,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'wf-m1', course_id: 'workflows', slug: 'registration-scheduling', title: 'Registration & Scheduling', description: 'Patient registration and scheduling workflows.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Front Office Workflows', prevLesson: null, nextLesson: 'existing-patient-scheduling', nextIsQuiz: false,
  },
  'existing-patient-scheduling': {
    lesson: {
      id: 'wf-l2', module_id: 'wf-m1', slug: 'existing-patient-scheduling',
      title: 'Existing Patient Scheduling',
      description: 'Streamlined scheduling for established patients including info verification and insurance updates.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/est-pt-scheduling.mp4`,
      reading_content: null, duration_minutes: 4, sort_order: 2,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'wf-m1', course_id: 'workflows', slug: 'registration-scheduling', title: 'Registration & Scheduling', description: 'Patient registration and scheduling workflows.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Front Office Workflows', prevLesson: 'new-patient-registration', nextLesson: 'appointment-reminders', nextIsQuiz: false,
  },
  'appointment-reminders': {
    lesson: {
      id: 'wf-l3', module_id: 'wf-m1', slug: 'appointment-reminders',
      title: 'Appointment Reminder Calls',
      description: 'Reminder workflows, pre-visit preparation, and reducing no-shows.',
      content_type: 'video', video_url: `${VIDEO_BASE_URL}/reminder-calls.mp4`,
      reading_content: null, duration_minutes: 4, sort_order: 3,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    module: { id: 'wf-m1', course_id: 'workflows', slug: 'registration-scheduling', title: 'Registration & Scheduling', description: 'Patient registration and scheduling workflows.', sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    courseTitle: 'Front Office Workflows', prevLesson: 'existing-patient-scheduling', nextLesson: null, nextIsQuiz: false,
  },
};

// Detect the section prefix from current URL for navigation
function getSectionPrefix(): { prefix: string; backPath: string; backLabel: string } {
  const path = window.location.pathname;
  const sectionPrefixes = [
    { match: '/foundations/', prefix: '/foundations', backPath: '/foundations', backLabel: 'Back to Foundations' },
    { match: '/medical-law-ethics/', prefix: '/medical-law-ethics', backPath: '/medical-law-ethics', backLabel: 'Back to Medical Law & Ethics' },
    { match: '/insurance/', prefix: '/insurance', backPath: '/insurance', backLabel: 'Back to Insurance' },
    { match: '/terminology/', prefix: '/terminology', backPath: '/terminology', backLabel: 'Back to Terminology' },
    { match: '/workflows/lessons/', prefix: '/workflows/lessons', backPath: '/workflows', backLabel: 'Back to Workflows' },
    { match: '/ehr-fundamentals/', prefix: '/ehr-fundamentals', backPath: '/ehr-fundamentals', backLabel: 'Back to EHR & PM' },
  ];
  for (const s of sectionPrefixes) {
    if (path.startsWith(s.match)) return s;
  }
  // Fallback to legacy courses route
  return { prefix: '', backPath: '/courses', backLabel: 'Back to Course' };
}

export function LessonPlayer() {
  const { courseSlug, moduleSlug, lessonSlug } = useParams<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>();
  const navigate = useNavigate();
  const progress = useProgress();

  // Get lesson data
  const lessonData = lessonSlug ? lessonsData[lessonSlug] : null;

  // Check if lesson is already completed from progress context
  const isCompleted = lessonSlug ? progress.isLessonCompleted(lessonSlug) : false;

  // Progressive reading slide state
  const slides = useSlides(lessonData?.lesson.reading_content || null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Detect section for correct navigation
  const sectionInfo = useMemo(() => getSectionPrefix(), []);

  if (!lessonData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h2>
        <p className="text-gray-600 mb-6">This lesson is not yet available or doesn't exist.</p>
        <Link
          to={sectionInfo.backPath}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {sectionInfo.backLabel}
        </Link>
      </div>
    );
  }

  const { lesson, module, courseTitle, prevLesson, nextLesson, nextIsQuiz } = lessonData;

  const handleMarkComplete = () => {
    if (lessonSlug) {
      progress.markLessonComplete(lessonSlug);
    }
  };

  // Video progress handler — mark complete at 90% watched
  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (isCompleted) return;
    const video = e.currentTarget;
    if (video.duration > 0 && video.currentTime / video.duration >= 0.9) {
      handleMarkComplete();
    }
  };

  const handleContinue = () => {
    // Use section-aware navigation instead of legacy /courses/ path
    if (sectionInfo.prefix) {
      if (nextIsQuiz) {
        navigate(`${sectionInfo.prefix}/${moduleSlug}/quiz`);
      } else if (nextLesson) {
        navigate(`${sectionInfo.prefix}/${moduleSlug}/${nextLesson}`);
      } else {
        navigate(sectionInfo.backPath);
      }
    } else {
      // Legacy courses route fallback
      if (nextIsQuiz) {
        navigate(`/courses/${courseSlug}/${moduleSlug}/quiz`);
      } else if (nextLesson) {
        navigate(`/courses/${courseSlug}/${moduleSlug}/${nextLesson}`);
      } else {
        navigate(`/courses/${courseSlug}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to={sectionInfo.prefix ? sectionInfo.backPath : '/courses'} className="hover:text-gray-700">
          {sectionInfo.prefix ? sectionInfo.backLabel.replace('Back to ', '') : 'Courses'}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700">{module.title}</span>
      </nav>

      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            {lesson.content_type === 'video' ? (
              <Play className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="capitalize">{lesson.content_type}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {lesson.duration_minutes} min
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        <p className="text-gray-600">{lesson.description}</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {lesson.content_type === 'video' && lesson.video_url ? (
          <div className="aspect-video bg-black">
            <video
              key={lesson.video_url}
              controls
              className="w-full h-full"
              controlsList="nodownload"
              onEnded={handleMarkComplete}
              onTimeUpdate={handleVideoTimeUpdate}
            >
              <source src={lesson.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : lesson.content_type === 'reading' && lesson.reading_content && slides.length > 0 ? (
          <div className="p-6">
            <ReadingSlide
              content={slides[currentSlide]}
              slideIndex={currentSlide}
              totalSlides={slides.length}
              onNext={() => {
                if (currentSlide < slides.length - 1) {
                  setCurrentSlide(prev => prev + 1);
                } else {
                  handleContinue();
                }
              }}
              onPrev={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              onComplete={handleMarkComplete}
              isCompleted={isCompleted}
              isLastSlide={currentSlide === slides.length - 1}
              isFirstSlide={currentSlide === 0}
            />
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Coming Soon</h3>
            <p className="text-gray-600">This lesson content is being developed.</p>
          </div>
        )}
      </div>

      {/* Completion & Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {/* Previous */}
          <div>
            {prevLesson ? (
              <Link
                to={sectionInfo.prefix ? `${sectionInfo.prefix}/${moduleSlug}/${prevLesson}` : `/courses/${courseSlug}/${moduleSlug}/${prevLesson}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Lesson
              </Link>
            ) : (
              <Link
                to={sectionInfo.prefix ? sectionInfo.backPath : `/courses/${courseSlug}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {sectionInfo.backLabel}
              </Link>
            )}
          </div>

          {/* Complete & Continue */}
          <div className="flex items-center gap-4">
            {/* Only show footer Mark as Complete for reading lessons without slides */}
            {!isCompleted && lesson.content_type === 'reading' && slides.length === 0 && (
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Complete
              </button>
            )}

            {isCompleted && (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Completed
              </span>
            )}

            {/* Gate next/quiz behind completion; always allow "Back to Course" */}
            {(nextLesson || nextIsQuiz) && !isCompleted ? (
              <span className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">
                Complete this lesson to continue
                <ArrowRight className="w-4 h-4" />
              </span>
            ) : (
              <button
                onClick={handleContinue}
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-600 rounded-lg hover:from-blue-700 hover:to-blue-700 transition-all"
              >
                {nextIsQuiz ? 'Take Quiz' : nextLesson ? 'Next Lesson' : sectionInfo.backLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Takeaways (for video lessons) */}
      {lesson.content_type === 'video' && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Key Takeaways
          </h3>
          <p className="text-sm text-gray-600">
            Key points and study notes will appear here after the lesson content is finalized.
          </p>
        </div>
      )}
    </div>
  );
}
