# VytalPath Academy

## Project Overview

**VytalPath Academy** is a comprehensive training platform designed for healthcare front office staff. It provides video lessons, reading lessons with slide-based content, interactive exercises, medical terminology study tools, 24 standard operating procedures (SOPs), a built-in EHR Practice Lab simulation, job readiness tools, and CMAA exam competency tracking.

**Target Users:** Front office staff, medical receptionists, referral coordinators, clinic employees

**Business Model:** $327/year individual access, tiered pricing for organizations

**Competitive Position:** Priced between free platforms (Alison) and expensive certification programs (Stepful at $1,000+). Unique differentiators: built-in EHR Practice Lab simulation, CMAA exam competency tracking, 24 SOP workflow guides, interactive exercises, deep insurance training.

**Live Deployment:** Vercel (connected to `martykoepke-lgtm/VytalPath_Academy_010526`)

## Tech Stack

- **Frontend:** React 18.3 + TypeScript 5.5 + Vite 5.4
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **SEO:** react-helmet-async + JSON-LD structured data
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Video Hosting:** Supabase Storage
- **Deployment:** Vercel

## Project Structure

```
src/
├── components/
│   ├── sections/              # Main navigation sections (one per learning section)
│   │   ├── FoundationsSection.tsx       # Foundations of Healthcare (3 video lessons)
│   │   ├── MedicalLawEthicsSection.tsx  # Medical Law & Compliance (9 lessons)
│   │   ├── InsuranceSection.tsx         # Insurance & Billing (7 lessons)
│   │   ├── WorkflowsSection.tsx         # Front Office Workflows (4 lessons + 24 SOPs)
│   │   ├── EHRSection.tsx               # EHR & Practice Management (9 reading lessons)
│   │   └── TerminologySection.tsx       # Medical Terminology (5 lessons + flashcards)
│   ├── ehr-lab/               # EHR Practice Lab simulation
│   │   ├── EHRPracticeLab.tsx           # Main lab shell (teal header, toolbar, view router)
│   │   ├── EHRSessionContext.tsx        # Session state: patients, appointments, encounters, messages
│   │   ├── ProviderScheduleView.tsx     # Daily provider schedule grid
│   │   ├── AppointmentsView.tsx         # Patient appointment list & search
│   │   ├── PatientChartView.tsx         # Patient chart with encounter detail
│   │   ├── MessageInboxView.tsx         # Message inbox with routing
│   │   ├── PatientRegistration.tsx      # New patient registration form
│   │   ├── AppointmentScheduler.tsx     # Book appointment flow
│   │   ├── AppointmentDetail.tsx        # Single appointment view
│   │   ├── CheckInFlow.tsx              # Patient check-in steps
│   │   ├── CheckOutFlow.tsx             # Patient check-out steps
│   │   ├── PatientSearchModal.tsx       # Search/select patient modal
│   │   ├── EncounterSelectModal.tsx     # Select existing encounter modal
│   │   └── EncounterTypeModal.tsx       # Choose new encounter type modal
│   ├── academy/               # Course components
│   │   └── LessonPlayer.tsx             # Universal lesson renderer (video + reading slides)
│   ├── quiz/                  # Quiz system
│   │   └── QuizPlayer.tsx               # Quiz renderer with scoring & navigation
│   ├── practice/              # Job readiness tools
│   │   ├── PracticeHub.tsx              # Practice section landing page
│   │   ├── PhoneSimulator.tsx           # Phone call simulation
│   │   ├── MockInterview.tsx            # AI mock interview
│   │   ├── ResumeBuilder.tsx            # Resume builder tool
│   │   └── InsuranceHotline.tsx         # Insurance hotline practice
│   ├── progress/              # CMAA competency tracking
│   │   └── CMAADashboard.tsx            # Competency dashboard with domain progress
│   ├── reference/             # Reference tools
│   │   ├── SOPLibrary.tsx               # SOP browsing & search
│   │   ├── SOPDetailPage.tsx            # Individual SOP view
│   │   └── MedicalTerminology.tsx       # Terminology reference
│   ├── learning/              # Interactive exercises
│   │   ├── InsuranceTermMatch.tsx       # Insurance term matching game
│   │   ├── HealthcareSettingSorter.tsx  # Drag-sort healthcare settings
│   │   └── HIPAAScenarioSorter.tsx      # HIPAA scenario categorizer
│   ├── admin/                 # Admin dashboards
│   │   ├── SuperAdminDashboard.tsx      # Platform-wide management
│   │   ├── OrgAdminDashboard.tsx        # Organization management
│   │   └── OrgAdminRoute.tsx            # Route protection
│   ├── layout/
│   │   ├── AppLayout.tsx                # Main layout with sidebar
│   │   └── RoleBasedSidebar.tsx         # Grouped sidebar nav (Learn/Practice/Track)
│   ├── LandingPage.tsx        # Public marketing page
│   ├── ProgramIntro.tsx       # Authenticated welcome/overview page
│   └── SEO.tsx                # Dynamic SEO + JSON-LD
├── data/
│   ├── cmaaCompetencyMap.ts   # 101 CMAA knowledge statements mapped to lessons
│   └── phoneCallScenarios.ts  # Phone simulation scenario data
├── contexts/
│   ├── AuthContext.tsx        # Supabase auth provider
│   └── ProgressContext.tsx    # Lesson/quiz progress tracking
├── types/
│   ├── course.ts              # Course, Module, Lesson types
│   ├── ehr.ts                 # EHR Lab types (Patient, Appointment, Encounter, etc.)
│   ├── medical.ts             # MedicalTerm types
│   ├── sop.ts                 # SOP types
│   └── progress.ts            # Progress tracking types
├── router.tsx                 # React Router configuration
└── main.tsx                   # App entry with providers

public/
├── images/                    # Static images (logo, icons)
└── videos/                    # Local video backups

docs/                          # Content documentation (organized by section number)
├── 01-Foundations/            # Healthcare Settings
├── 02-Medical-Law-Ethics/     # HIPAA, patient rights, compliance
├── 03-Insurance/              # Insurance Basics + Operations
├── 04-Workflows/              # Registration, Scheduling, SOPs
├── 06-Terminology/            # Medical terminology lessons
├── 07-EHR-PM/                 # EHR & Practice Management
│   └── scripts/ehr-heyGen-scripts.md   # 3 HeyGen video scripts
├── _technical/                # Developer documentation
└── _archive/                  # Archived materials

supabase/
├── migrations/                # Database migrations
└── functions/                 # Edge functions (e.g., provision-user)
```

## Sidebar Navigation Structure

The sidebar (`RoleBasedSidebar.tsx`) uses grouped navigation:

```
Welcome                          (/welcome)
─── Learn ───
  Foundations                    (/foundations)
  Compliance                     (/medical-law-ethics)
  Insurance & Billing            (/insurance)
  Front Office Workflows         (/workflows)
  EHR & PM                       (/ehr-fundamentals)
  Terminology                    (/terminology)
─── Practice ───
  EHR Practice Lab               (/ehr-lab)
  Job Readiness                  (/practice)
─── Track ───
  CMAA Progress                  (/progress)
  Search                         (/search)
```

## Training Curriculum (8 Live Sections)

### Section 1: Foundations of Healthcare (`/foundations`) ✅
Healthcare administration fundamentals.
- **Module: Healthcare Delivery** (3 video lessons)
  - Understanding How Healthcare is Delivered, The Inpatient Encounter, The Ambulatory Care Journey
- Interactive: Healthcare Setting Sorter exercise
- Quiz: Healthcare Delivery (80% pass, 3 attempts)
- ~13 min total

### Section 2: Medical Law & Compliance (`/medical-law-ethics`) ✅
Essential legal and ethical guidelines.
- **Module: Understanding HIPAA** (3 video lessons)
  - HIPAA Essentials, PHI Explained, Access Rules
- **Module: Legal Essentials** (6 reading lessons)
  - Violations & Penalties, Minimum Necessary, Patient Rights, Authorization & Consent, EMTALA, Fraud & Stark Law
- Interactive: HIPAA Scenario Sorter exercise
- 2 Quizzes
- ~90 min total

### Section 3: Insurance & Billing (`/insurance`) ✅
Health insurance from basics to daily operations.
- **Module: Insurance Basics** (3 video lessons)
  - Intro to Health Insurance, Payers & Plan Types, Key Terms
- **Module: Insurance Operations** (4 video lessons)
  - Reading Insurance Cards, Eligibility Verification, Copays/Deductibles/Coinsurance, Payment Collection
- Interactive: Insurance Term Matching exercise
- 2 Quizzes
- ~60 min total

### Section 4: Front Office Workflows (`/workflows`) ✅
Front office procedures with SOPs.
- **Module: Registration & Scheduling** (4 video lessons)
  - Section Intro, New Patient Registration, Existing Patient Scheduling, Appointment Reminder Calls
- Quick Reference: 24 step-by-step SOP guides
- Quiz: Registration & Scheduling
- ~40 min total

### Section 5: EHR & Practice Management (`/ehr-fundamentals`) ✅ NEW
PM/EHR systems and encounter management. Covers 43% of CMAA exam content (Domains 1, 4, 5).
- **Module 1: Understanding Your Systems** (3 reading lessons)
  - Encounter Types & Patient Identifiers, Practice Management vs EHR, Navigating the EHR
- **Module 2: Clinic Encounters** (3 reading lessons)
  - Clinic Encounter Types, The Encounter Lifecycle, Scheduling Types & Templates
- **Module 3: Non-Clinic Encounters** (3 reading lessons)
  - Phone Encounters, Non-Visit Encounters, Duplicate Records: Prevention & Resolution
- Section intro video
- 3 Quizzes (28 questions total)
- ~66 min total

### Section 6: Medical Terminology (`/terminology`) ✅
Medical terminology with dual-mode view.
- **Lessons View:** Prefixes, roots, suffixes, abbreviations
- **Study Mode:** Interactive flashcards by category
- 5 lessons + flashcards
- ~50 min total

### Section 7: EHR Practice Lab (`/ehr-lab`) ✅ NEW
Built-in PM/EHR simulation — the platform's key differentiator.
- **Provider Schedule** — view daily appointment grid
- **Appointments** — search patients, schedule new appointments
- **Patient Chart** — view demographics, encounters, clinical summary
- **Messages** — inbox with routing to message pools
- Full workflows: register patient → schedule → check-in → clinical → check-out
- Encounter types: NP, EST, AWV, TCM, Preventive, Procedure, Consult, Phone, Non-visit
- 48-hour session timer, session reset capability
- No external EHR dependency — fully self-contained simulation

### Section 8: Job Readiness (`/practice`) ✅ NEW
Career preparation tools.
- Phone Simulator (realistic call scenarios)
- Mock Interview (AI-powered)
- Resume Builder
- Insurance Hotline Practice
- Readiness assessments

---

### Planned Sections (Roadmap)

| Section | Description | Status |
|---------|-------------|--------|
| Medications for Front Office | Prescriptions, drug classes, DEA schedules, prior auth | 📋 Planned |
| Referrals & Prior Auth | Authorization workflows, tracking, appeals | 📋 Planned |
| Coding Basics | ICD-10, CPT, E&M levels, reading EOBs | 📋 Planned |
| Patient Communication | Phone etiquette, difficult conversations, empathy | 📋 Planned |
| Telehealth Support | Virtual visit prep, troubleshooting, documentation | 📋 Planned |

### Section Summary

| # | Section | Route | Lessons | Quizzes | Time |
|---|---------|-------|---------|---------|------|
| 1 | Foundations of Healthcare | `/foundations` | 3 video | 1 | 13 min |
| 2 | Medical Law & Compliance | `/medical-law-ethics` | 9 (3 video + 6 reading) | 2 | 90 min |
| 3 | Insurance & Billing | `/insurance` | 7 video | 2 | 60 min |
| 4 | Front Office Workflows | `/workflows` | 4 video + 24 SOPs | 1 | 40 min |
| 5 | EHR & Practice Management | `/ehr-fundamentals` | 9 reading | 3 | 66 min |
| 6 | Medical Terminology | `/terminology` | 5 + flashcards | 0 | 50 min |
| 7 | EHR Practice Lab | `/ehr-lab` | Simulation | 0 | Unlimited |
| 8 | Job Readiness | `/practice` | 6 tools | 0 | Varies |
| **Total** | | | **40+ lessons** | **8 quizzes** | **~5+ hours** |

## Key Features

### CMAA Competency Dashboard (`/progress`)
- Maps 101 NHA CMAA knowledge statements to VytalPath lessons
- 6 competency levels: not_available → not_started → exposed → practiced → assessed → mastered
- Domain-level progress bars (7 CMAA domains)
- Coverage status tracking: gap / partial / covered per knowledge statement
- Data in `src/data/cmaaCompetencyMap.ts`

### EHR Practice Lab (`/ehr-lab`)
- Self-contained PM/EHR simulation (no external dependencies)
- Teal header with clinic/provider info, grey toolbar with 4 tabs
- View state machine with navigation history (back button)
- Modal flows: Patient Search → Encounter Select → Encounter Type
- Session context provides all state: patients, appointments, encounters, messages
- 48-hour session with countdown timer and reset

### Lesson System
- **Video lessons:** Native HTML5 video player with Supabase Storage URLs
- **Reading lessons:** Slide-based content using markdown with `\n---\n` separators
- All lesson data lives in `LessonPlayer.tsx` in the `lessonsData` lookup (keyed by slug)
- Navigation chains: each lesson has `prev`/`next` with `nextIsQuiz` flag for module boundaries
- `getSectionPrefix()` detects current section from URL pathname for breadcrumb/back navigation

### Quiz System
- All quiz data lives in `QuizPlayer.tsx` in the `quizzesData` object (keyed by module slug)
- 80% passing score, 3 attempts per quiz
- Immediate feedback with explanations
- Navigation to next module on completion
- 8 quizzes across 4 sections (28+ questions in EHR section alone)

### Interactive Exercises
- Insurance Term Matching (drag-and-drop)
- Medical Terminology Flashcards (by category)
- Healthcare Setting Sorter (Foundations)
- HIPAA Scenario Sorter (Compliance)

### SEO Optimization
- JSON-LD structured data for courses, organization, FAQ
- Dynamic page titles via react-helmet-async
- Open Graph and Twitter Card meta tags
- Semantic HTML (article, header, section, nav, aside)
- SEO configs in `src/components/SEO.tsx` seoConfigs object

### Progress Tracking
- Lesson completion persisted in localStorage
- Quiz scores and pass status tracked
- Visual progress bars on each section page
- CMAA competency level calculation

## Database Schema (Supabase)

### Core Tables
- `medical_terms` - Terms with full-text search (tsv column)
- `categories` / `subcategories` - Term organization
- `sops` - Standard operating procedures (JSONB steps)
- `user_sop_progress` - Session-based progress tracking

### Organization Tables
- `organizations` - Org details (id, name, slug, settings)
- `org_members` - User-org relationships (user_id, org_id, role, status)
- `invitations` - Unified invitation system (token, email, role, max_uses, expires_at)
- `user_profiles` - User display info (first_name, last_name, display_name)

### Key Types
```typescript
// Content Types
type ContentType = 'video' | 'reading';

// SOP Categories
type SOPCategory = 'opening' | 'opening-closing' | 'scheduling' |
  'insurance' | 'compliance' | 'checkin' | 'checkout' |
  'during-day' | 'closing' | 'admin';

// Patient Types
type PatientType = 'new' | 'existing' | 'both';

// EHR Lab Encounter Types
type EncounterType = 'office-visit' | 'new-patient' | 'follow-up' | 'annual-wellness' |
  'preventive' | 'procedure' | 'urgent' | 'telehealth' | 'phone' | 'nurse-only' |
  'lab-only' | 'imaging-only' | 'referral' | 'prior-auth';
```

## Environment Variables

```env
VITE_SUPABASE_URL=https://vwieorhlcapeeamvltqa.supabase.co
VITE_SUPABASE_ANON_KEY=<key>
```

## Git Remotes

- `origin` - vytalpathdemo (legacy)
- `newrepo` - VytalPath_Academy_010526 (primary, connected to Vercel)
- `academy` - VytalPath-Academy
- `upstream` - mkoepkeci-cmyk/vytalpath-academy (original)

**Use `newrepo` for pushes:** `git push newrepo main`

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run lint         # Run ESLint
```

## Code Patterns

### Adding a New Lesson (Video)
```typescript
// In the appropriate section file (e.g., FoundationsSection.tsx)
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// Add to the module's lessons array:
{
  id: 'unique-id',
  slug: 'lesson-slug',
  title: 'Lesson Title',
  description: 'Brief description.',
  content_type: 'video' as ContentType,
  video_url: `${VIDEO_BASE_URL}/video-filename.mp4`,
  duration_minutes: 4,
}
```

### Adding a New Lesson (Reading with Slides)
```typescript
// In LessonPlayer.tsx lessonsData object:
'lesson-slug': {
  title: 'Lesson Title',
  sectionTitle: 'EHR & Practice Management',
  content: `## Slide 1 Title\n\nContent here...\n---\n## Slide 2 Title\n\nMore content...`,
  prev: { slug: 'previous-lesson', title: 'Previous Lesson' },
  next: { slug: 'next-lesson', title: 'Next Lesson' },
  nextIsQuiz: false, // true if next item is a quiz
}
```

### Adding a New Quiz
```typescript
// In QuizPlayer.tsx quizzesData object:
'module-slug': {
  title: 'Module Quiz Title',
  description: 'Test your knowledge of...',
  passingScore: 80,
  maxAttempts: 3,
  nextModuleSlug: 'next-module-slug',
  nextModuleFirstLesson: 'first-lesson-of-next-module',
  questions: [
    {
      id: 'q1',
      question: 'Question text?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Why this answer is correct.',
    },
  ],
}
```

### Adding SEO to a New Page
```typescript
import { SEO, seoConfigs } from '../SEO';

// In component return:
<>
  <SEO {...seoConfigs.sectionName} />
  <article>...</article>
</>
```

### Adding a New Section
1. Create `src/components/sections/NewSection.tsx` (follow EHRSection.tsx pattern)
2. Add lesson entries to `LessonPlayer.tsx` with navigation chains
3. Add quiz entries to `QuizPlayer.tsx`
4. Add routes to `router.tsx` (section page + lesson player + quiz player)
5. Add nav item to `RoleBasedSidebar.tsx` in the appropriate group
6. Add SEO config to `SEO.tsx`
7. Add `getSectionPrefix()` entry in `LessonPlayer.tsx`
8. Update `cmaaCompetencyMap.ts` if applicable

### Section Color Conventions
Each section uses a distinct Tailwind color for its icon/accent:
- Foundations: `blue`
- Compliance: `purple`
- Insurance: `green`
- Workflows: `amber`
- EHR & PM: `cyan`
- Terminology: `indigo`
- EHR Practice Lab: `teal`
- Job Readiness: `slate`

## Business Strategy

### Pricing Tiers

**Individual:** $327/year (1 year access)
- All 8 training sections
- 40+ lessons, 8 quizzes & 24 SOPs
- Hands-on EHR Practice Lab
- Job readiness tools & mock interviews
- AI study assistant on every page
- New content added regularly

**Organization Pricing (Planned):**
| Tier | Seats | Price/Seat/Year |
|------|-------|-----------------|
| Starter | 1-5 | $327 |
| Team | 6-15 | $245 (25% off) |
| Clinic | 16-50 | $183 (44% off) |
| Enterprise | 51+ | $121 (63% off) |

### Competitive Analysis

| Feature | VytalPath | Stepful | Alison |
|---------|-----------|---------|--------|
| Price | $327/year | ~$1,000+ | Free |
| Training Sections | 8 | ~5-6 | 2-3 |
| Video Lessons | 20+ | 20+ | 0 |
| Reading Lessons | 20+ | Unknown | 0 |
| SOPs/Guides | 24 | 0 | 0 |
| EHR Simulation | ✅ Built-in | ❌ | ❌ |
| CMAA Exam Prep | ✅ Competency tracking | ✅ CMAA cert included | ❌ |
| Insurance Training | ✅ Deep (7 lessons) | ⚠️ Basic | ❌ |
| Interactive Exercises | ✅ 4 types | ⚠️ Basic | ❌ |
| Job Readiness Tools | ✅ 6 tools | ⚠️ Resume only | ❌ |

### Unique Differentiators
1. **EHR Practice Lab** - Only platform with built-in PM/EHR simulation (no external system)
2. **CMAA Competency Dashboard** - Maps all 101 knowledge statements to curriculum
3. **24 SOP Workflow Guides** - Ready-to-use on the job
4. **Deep Insurance Training** - 7 video lessons vs competitors' brief coverage
5. **Job Readiness Suite** - Phone simulator, mock interviews, resume builder, hotline practice
6. **Interactive Exercises** - Term matching, healthcare setting sorter, HIPAA scenarios, flashcards

### Target Market
- New healthcare front office staff
- Career changers entering healthcare
- Clinic trainers needing standardized onboarding
- Staffing agencies placing healthcare admin workers
- CMAA exam candidates needing study support

## Organization & Role System

### Three Roles
1. **Super Admin** - Hardcoded emails (platform owners)
   - Full platform access at `/admin`
   - Create/manage organizations
   - Add Org Admins by email or invite link
   - View all students and progress

2. **Org Admin** - Stored in `org_members` with `role='admin'`
   - Access their org at `/admin/orgs/:slug`
   - Create student invite links
   - Manage students, view progress
   - Remove members

3. **Student** - Default role
   - Access all learning content (8 sections)
   - Access EHR Practice Lab and Job Readiness tools
   - Track CMAA competency progress
   - Can be org-based or self-registered

### Invitation System
- Unified `invitations` table replaces old system
- Two types: email-specific (single use) or shareable link (unlimited/limited uses)
- Flow: Admin creates invite → User visits `/join/:token` → Signs up → Auto-assigned to org
- RPC functions: `create_invitation()`, `get_invitation()`, `accept_invitation()`

## Notes

- Videos are hosted on Supabase Storage (URL: `https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos/`)
- Local video backups in `docs/*/videos/` folders
- Documentation follows the navigation structure
- Progress tracking uses localStorage (per-user persistence planned)
- EHR Practice Lab is fully self-contained (React state, no backend needed)
- HeyGen video scripts stored in `docs/07-EHR-PM/scripts/`
- Reading lessons use markdown slide format separated by `\n---\n`
- Section intro videos auto-play when section page loads (dismissible)
- Landing page uses Problem-Agitation-Solution marketing framework
- Welcome page (`ProgramIntro.tsx`) includes intro video and 8-section learning path
