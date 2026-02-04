# VytalPath Academy

## Project Overview

**VytalPath Academy** is a comprehensive training platform designed for healthcare front office staff. It provides video lessons, interactive exercises, medical terminology study tools, standard operating procedures (SOPs), and hands-on EHR practice.

**Target Users:** Front office staff, medical receptionists, referral coordinators, clinic employees

**Business Model:** $267/year individual access, tiered pricing for organizations

**Competitive Position:** Priced between free platforms (Alison) and expensive certification programs (Stepful at $1,000+). Unique differentiators: 24 SOP workflow guides, interactive flashcards, deep insurance training, EHR simulation practice.

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
│   ├── sections/              # Main navigation sections
│   │   ├── FoundationsSection.tsx    # Tab 1: Foundations of Healthcare
│   │   ├── InsuranceSection.tsx      # Tab 2: Insurance Training
│   │   ├── TerminologySection.tsx    # Tab 3: Medical Terminology
│   │   └── WorkflowsSection.tsx      # Tab 4: Navigating Workflows
│   ├── academy/               # Course components
│   │   ├── CourseCatalog.tsx
│   │   ├── CourseDetail.tsx
│   │   └── LessonPlayer.tsx
│   ├── quiz/                  # Quiz system
│   │   └── QuizPlayer.tsx
│   ├── reference/             # Reference tools
│   │   ├── SOPLibrary.tsx
│   │   ├── SOPDetailPage.tsx
│   │   ├── TermsLibrary.tsx
│   │   └── MedicalTerminology.tsx
│   ├── learning/              # Interactive exercises
│   │   └── InsuranceTermMatch.tsx
│   ├── admin/                 # Admin dashboards
│   │   ├── SuperAdminDashboard.tsx   # Platform-wide management
│   │   ├── OrgAdminDashboard.tsx     # Organization management
│   │   └── OrgAdminRoute.tsx         # Route protection
│   ├── join/                  # Organization joining
│   │   └── JoinOrganization.tsx      # Invitation acceptance
│   ├── layout/
│   │   └── AppLayout.tsx      # Main layout with navigation
│   ├── SEO.tsx                # Dynamic SEO component
│   ├── TerminologyView.tsx    # Flashcard study mode
│   └── StudyMode.tsx          # Category-based flashcards
├── contexts/
│   ├── AuthContext.tsx        # Supabase auth provider
│   └── ProgressContext.tsx    # Lesson/quiz progress tracking
├── types/
│   ├── course.ts              # Course, Module, Lesson types
│   ├── medical.ts             # MedicalTerm types
│   ├── sop.ts                 # SOP types
│   └── progress.ts            # Progress tracking types
├── router.tsx                 # React Router configuration
└── main.tsx                   # App entry with providers

public/
└── videos/                    # Production video files (MP4)

docs/                          # Content documentation (organized by section)
├── 01-Foundations/            # Healthcare Settings + Medical Law & Ethics
│   ├── scripts/
│   ├── videos/
│   └── medical-law-ethics/
├── 02-Insurance/              # Insurance Basics + Operations
│   ├── scripts/basics/
│   ├── scripts/operations/
│   └── videos/
├── 03-Terminology/            # Medical terminology lessons
│   └── lessons/
├── 04-Workflows/              # Registration, Scheduling, SOPs
│   ├── scripts/registration-scheduling/
│   └── sops/
├── _technical/                # Developer documentation
└── _archive/                  # Archived materials

supabase/
└── migrations/                # Database migrations
```

## Complete Training Curriculum (10 Modules)

### Current Modules (Live)

#### Module 1: Foundations of Healthcare (`/foundations`) ✅
Healthcare administration fundamentals.
- **Healthcare Settings:** Front Office Foundations, Acute vs. Ambulatory Care
- **Medical Law & Ethics:** HIPAA Essentials, PHI Explained, Access Rules, Authorization & Consent
- 7 lessons, ~45 min total

#### Module 2: Insurance Training (`/insurance`) ✅
Health insurance from basics to daily operations.
- **Insurance Basics:** Intro to Health Insurance, Payers & Plan Types, Key Terms
- **Insurance Operations:** Reading Insurance Cards, Eligibility Verification, Copays, Deductibles, Coinsurance, Payment Collection
- 9 lessons, ~60 min total
- Interactive: Insurance Term Matching exercise

#### Module 3: Medical Terminology (`/terminology`) 🔄 In Progress
Medical terminology training with dual-mode view.
- **Lessons View:** Prefixes, roots, suffixes, abbreviations
- **Study Mode:** Interactive flashcards for practice
- 5 lessons + flashcards, ~50 min total

#### Module 4: Navigating Workflows (`/workflows`) 🔄 In Progress
Front office procedures with dual-mode view.
- **Video Lessons:** Registration & Scheduling workflows (videos pending)
- **Quick Reference:** 24 step-by-step SOP guides
- 4 lessons + 24 SOPs, ~40 min total

---

### Planned Modules (Roadmap)

#### Module 5: Medications for Front Office 📋 Planned
Administrative handling of prescriptions and refills.
- Prescription workflow basics
- Handling refill requests
- Intro to drug classes (pain, cardiac, diabetes, antibiotics, psych)
- Controlled substances basics (DEA schedules)
- Prior auth for medications
- Common medication abbreviations (QD, BID, PRN, PO)
- 6 lessons, ~40 min total

#### Module 6: Referrals & Prior Authorization 📋 Planned
High-demand skill for career advancement.
- What is prior authorization?
- The referral process (internal vs external)
- Initiating a prior auth
- Tracking & managing authorizations
- Handling denials and appeals basics
- Urgent/emergent authorizations
- 6 lessons, ~45 min total

#### Module 7: Coding Basics for Front Office 📋 Planned
Understanding codes (not assigning them - that's coder work).
- Why coding matters for front desk
- ICD-10 basics (structure, common codes)
- CPT code basics
- Understanding E&M visit levels (99211-99215)
- Common procedure codes
- Reading an EOB
- 6 lessons, ~35 min total

#### Module 8: EHR Practice Lab 📋 Planned (Priority)
Hands-on simulation with web-based EHR.
- EHR overview & navigation
- Patient registration in EHR
- Scheduling in EHR
- Chart basics (allergies, meds, problem list)
- Scanning & uploading documents
- Messages & tasks
- 6 simulations, ~60 min total
- **Unique differentiator** - no competitor offers this

#### Module 9: Patient Communication Excellence 📋 Planned
Soft skills that set candidates apart.
- Professional phone etiquette
- Handling difficult conversations
- Breaking bad news (admin context)
- Communicating with empathy
- HIPAA-compliant communication
- Multilingual patient tips
- 6 lessons, ~35 min total

#### Module 10: Telehealth Support 📋 Planned
Future-proofing for modern healthcare.
- Telehealth basics
- Preparing patients for virtual visits
- Troubleshooting common issues
- Check-in for virtual visits
- Documentation for telehealth
- 5 lessons, ~25 min total

---

### Module Summary

| # | Module | Status | Lessons | Time |
|---|--------|--------|---------|------|
| 1 | Foundations of Healthcare | ✅ Complete | 7 | 45 min |
| 2 | Insurance Training | ✅ Complete | 9 | 60 min |
| 3 | Medical Terminology | 🔄 In Progress | 5 + flashcards | 50 min |
| 4 | Navigating Workflows | 🔄 In Progress | 4 + 24 SOPs | 40 min |
| 5 | Medications for Front Office | 📋 Planned | 6 | 40 min |
| 6 | Referrals & Prior Auth | 📋 Planned | 6 | 45 min |
| 7 | Coding Basics | 📋 Planned | 6 | 35 min |
| 8 | EHR Practice Lab | 📋 Planned | 6 simulations | 60 min |
| 9 | Patient Communication | 📋 Planned | 6 | 35 min |
| 10 | Telehealth Support | 📋 Planned | 5 | 25 min |
| **Total** | | | **60+ lessons** | **~7 hours** |

## Key Features

### SEO Optimization
- JSON-LD structured data for courses, organization, FAQ
- Dynamic page titles via react-helmet-async
- Open Graph and Twitter Card meta tags
- Semantic HTML (article, header, section, nav, aside)

### Progress Tracking
- Lesson completion persisted in localStorage
- Quiz scores and pass status tracked
- Visual progress indicators on each module

### Quiz System
- Module-based quizzes (80% passing score)
- 3 attempts allowed per quiz
- Immediate feedback with explanations

### Interactive Exercises
- Insurance Term Matching (drag-and-drop)
- Medical Terminology Flashcards

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

## Recent Changes (February 2026)

### Video Storage Migration
- Migrated all videos from local `public/videos/` to Supabase Storage
- Updated all component video URLs to use `VIDEO_BASE_URL` constant
- 15 videos now streaming from Supabase CDN

### Organization Management System
- Added Super Admin dashboard for platform-wide management
- Added Org Admin dashboard for organization-specific management
- Implemented unified invitation system (email or shareable link)
- Role-based route protection with `OrgAdminRoute` component
- Member removal functionality for admins

### 10-Module Curriculum Plan
- Expanded roadmap from 4 to 10 comprehensive modules
- Added planned modules: Medications, Referrals & Prior Auth, Coding Basics, EHR Practice Lab, Patient Communication, Telehealth Support
- EHR Practice Lab identified as key differentiator (web-based EHR access secured)

### Landing Page Optimization
- Rewrote with Problem-Agitation-Solution marketing framework
- Removed "always free" messaging for paid model transition
- Added "Who This Is For" section targeting career stages
- Updated curriculum preview showcasing 4 core modules

### Navigation Reorganization
- Restructured from course-based to section-based navigation
- Created dedicated section components for each module
- Toggle views within sections (Lessons vs Study Mode, Video Lessons vs Quick Reference)

### SEO Optimization
- JSON-LD structured data for courses, organization, FAQ
- Dynamic page titles via react-helmet-async
- Semantic HTML throughout (article, header, section, nav, aside)

### Color Scheme Update
- Changed from teal to dark blue (matching VytalPath logo)

### Documentation Reorganization
- Reorganized docs/ folder to match navigation structure
- Created README.md index for content tracking

## Code Patterns

### Adding a New Lesson to a Section
```typescript
// In the appropriate section file (e.g., FoundationsSection.tsx)
// Videos use Supabase Storage URL:
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// Add to the module's lessons array:
{
  id: 'unique-id',
  slug: 'lesson-slug',
  title: 'Lesson Title',
  description: 'Brief description.',
  content_type: 'video' as ContentType,
  video_url: `${VIDEO_BASE_URL}/video-filename.mp4`,  // lowercase, hyphens
  duration_minutes: 4,
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

### Adding a New SOP
1. Create SQL migration in `supabase/migrations/`
2. Use JSONB for steps: `[{title: "Step", details: ["Detail 1", "Detail 2"]}]`
3. Add icon mapping in `sopOrganization.ts` if needed

## Business Strategy

### Pricing Tiers

**Individual:** $267/year (1 year access)
- Complete 10-module curriculum
- Certificate of completion
- Self-paced, unlimited access during subscription

**Organization Pricing (Planned):**
| Tier | Seats | Price/Seat/Year |
|------|-------|-----------------|
| Starter | 1-5 | $267 |
| Team | 6-15 | $199 (25% off) |
| Clinic | 16-50 | $149 (44% off) |
| Enterprise | 51+ | $99 (63% off) |

### Competitive Analysis

| Feature | VytalPath | Stepful | Alison |
|---------|-----------|---------|--------|
| Price | $267/year | ~$1,000+ | Free |
| Modules | 10 | ~5-6 | 2-3 |
| Video Lessons | 40+ | 20+ | 0 |
| SOPs/Guides | 24 | 0 | 0 |
| Prior Auth Training | ✅ Deep | ⚠️ Basic | ❌ |
| EHR Simulation | ✅ Hands-on | ❌ | ❌ |
| Coding Basics | ✅ | ⚠️ Brief | ❌ |
| NHA Certification | ❌ | ✅ CMAA | ❌ |

### Unique Differentiators
1. **EHR Practice Lab** - Only platform with hands-on EHR simulation
2. **24 SOP Workflow Guides** - Ready-to-use on the job
3. **Deep Insurance Training** - 9 video lessons vs competitors' brief coverage
4. **Interactive Flashcards** - Medical terminology study mode
5. **Prior Auth/Referral Training** - Career advancement skill

### Target Market
- New healthcare front office staff
- Career changers entering healthcare
- Clinic trainers needing standardized onboarding
- Staffing agencies placing healthcare admin workers

## Notes

- Videos are hosted on Supabase Storage (URL: `https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos/`)
- Local video backups in `docs/*/videos/` folders
- Documentation follows the navigation structure
- Progress tracking uses localStorage (per-user persistence planned)
- EHR Practice Lab will use external web-based EHR (free access available)

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
   - Access learning content (`/foundations`, `/insurance`, `/terminology`, `/workflows`)
   - Can be org-based or self-registered

### Invitation System
- Unified `invitations` table replaces old system
- Two types: email-specific (single use) or shareable link (unlimited/limited uses)
- Flow: Admin creates invite → User visits `/join/:token` → Signs up → Auto-assigned to org
- RPC functions: `create_invitation()`, `get_invitation()`, `accept_invitation()`

### Key Database Tables
- `organizations` - Org details (name, slug, settings)
- `org_members` - User-org relationships with roles
- `invitations` - Unified invitation system
- `user_profiles` - Display names, metadata
