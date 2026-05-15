# VytalPath Academy — Architecture

This document is the source of truth for *what parts the app is made of and how they fit together*. Update it whenever a Page, Service, Edge Function, or Database Table is added or removed.

For the *why* behind major architectural decisions, see [DECISIONS.md](./DECISIONS.md).

---

## Current state (2026-05-14, mid-pivot)

The app is currently in the middle of the ADR-001 pivot from multi-tenant to single-tenant. This document describes the **target** architecture. Code still contains org-related modules that are scheduled for removal in Phases 2-4.

---

## Mental model in one paragraph

VytalPath Academy is a paid healthcare front-office training platform. An individual signs up, pays $327/year via Stripe, and gets one year of access to lessons, quizzes, an EHR practice lab, search, certificates, and AI study tools. Authentication is Supabase Auth. Subscription state is mirrored from Stripe via webhooks into Postgres. Lesson and quiz progress lives in Postgres tables protected by Row-Level Security. The only admin is Marty (admin); there is no organization layer.

---

## Roles

| Role | How identified | What they can do |
|---|---|---|
| `admin` | Email matches `ADMIN_EMAILS` in `AuthContext.tsx` | Everything a `student` can do, plus the Admin Dashboard at `/admin`: track all students' progress, view subscriptions and refund status, manage certificates |
| `student` | Any other authenticated identity | Access lessons, EHR lab, search, save own progress, manage own subscription, view own certificate |
| `anon` | Not signed in | Marketing/landing pages, pricing, sign-up, sign-in, password reset only |

**There is no `org_admin` role, no organization scoping, and no "View As" role-preview toggle.** Role is derived from the email check at sign-in — nothing is stored in the database. To test the student experience as admin, use an Incognito browser window with a real test student account.

---

## Pages (routes)

Pages reachable in the React app via `react-router-dom`. Routes are in `src/router.tsx`.

### Public (anonymous accessible)

| Path | Component | Purpose |
|---|---|---|
| `/` | `LandingPage` | Marketing |
| `/pricing` | `PricingPage` | Pricing |
| `/signup`, `/signin` | (Supabase auth UI) | Account creation and login |
| `/reset-password` | `ResetPassword` | Password reset flow |

### Authenticated (any signed-in user)

Routes wrapped in `<AuthOnlyRoute>` — auth required, subscription not required.

| Path | Component | Purpose |
|---|---|---|
| `/account` | `AccountPage` | Subscription details, cancel, billing portal |
| `/account/cancel` | `CancellationPolicy` | Cancellation policy + refund preview |
| `/account/faq` | `FAQ` | Account FAQ |

### Paying user (auth + active subscription)

Routes wrapped in `<AuthRoute>` — both auth and active subscription required.

| Path | Component | Purpose |
|---|---|---|
| `/welcome` | `ProgramIntro` | First-time experience |
| `/ai-guide` | `AiStudyGuide` | AI study assistant guide |
| `/foundations`, `/medical-law-ethics`, `/insurance`, `/workflows`, `/communication`, `/ehr-fundamentals`, `/terminology` | Section components | Lesson sections |
| `/<section>/:moduleSlug/:lessonSlug` | `LessonPlayer` | Individual lesson |
| `/<section>/:moduleSlug/quiz` | `QuizPlayer` | Module quiz |
| `/ehr-lab` | `EHRPracticeLab` | Self-contained PM/EHR simulation |
| `/practice` | `PracticeHub` | Job readiness tools |
| `/progress` | `CMAADashboard` | Competency tracking |
| `/certificate` | `CertificatePage` | Completion certificate |
| `/search` | `SearchPage` | Medical terminology search |

### Admin only

| Path | Component | Purpose |
|---|---|---|
| `/admin` | `SuperAdminDashboard` (renamed to `AdminDashboard` in Phase 2d) | Student progress tracking, subscription / refund status, certificate management |

The Admin Dashboard preserves three sections from the pre-pivot version:
1. **Student Subscriptions & Refund Status** — per-student completion %, last progress sync, days enrolled, refund eligibility.
2. **Certificate management** — view all certificates, generate certificates on the fly, delete certificates.
3. **User list** — all authenticated subscribers.

Removed: the "Organizations" section, "Create Organization" button, and org-scoped invitation management.

---

## Services (client-side modules)

Pure TypeScript modules that wrap Supabase calls. Each service owns one concern.

| Module | Concern |
|---|---|
| `src/lib/supabase.ts` | Singleton Supabase client |
| `src/contexts/AuthContext.tsx` | Session management, admin detection |
| `src/contexts/SubscriptionContext.tsx` | Subscription state, checkout, portal, cancellation |
| `src/contexts/ProgressContext.tsx` | Lesson/quiz progress tracking |
| `src/services/searchService.ts` | Medical terminology search |
| `src/services/progressService.ts` (planned) | Wraps progress RPCs — extracted from contexts for testability |
| `src/services/certificateService.ts` (planned) | Certificate fetch + admin RPCs |

**Removed in this pivot:** `src/services/orgService.ts`.

---

## Edge Functions (Supabase, server-side)

Live in `supabase/functions/`. Run in Deno. Have access to `SUPABASE_SERVICE_ROLE_KEY` and Stripe secrets.

| Function | Purpose | Triggered by |
|---|---|---|
| `create-checkout-session` | Build Stripe Checkout session | Client (`subscribe` button) |
| `create-portal-session` | Build Stripe Customer Portal session | Client (manage subscription) |
| `process-cancellation` | Cancel subscription, calculate prorated refund | Client (cancel flow) |
| `stripe-webhook` | Sync Stripe events into Postgres | Stripe (webhook) |
| `provision-user` | One-time post-signup user setup | Supabase auth trigger |
| `ai-tutor` | Claude-powered AI tutor for lessons | Client (chat panel) |
| `analyze-medical-term` | Claude-powered terminology analysis | Client (terminology agent) |

---

## Database Tables (Postgres / Supabase)

### Content tables

| Table | Owner | Notes |
|---|---|---|
| `medical_terms` | content | Searchable via `tsv` column + `pg_trgm` similarity |
| `categories`, `subcategories` | content | Term hierarchy |
| `sops` | content | Standard operating procedures, JSONB steps |

### User & access tables

| Table | Owner | RLS policy |
|---|---|---|
| `auth.users` | Supabase managed | Managed by Supabase Auth |
| `user_profiles` | per user | `auth.uid() = user_id` |
| `subscriptions` | per user | `auth.uid() = user_id`, plus service_role for webhook writes |
| `certificates` | per user | `auth.uid() = user_id` (read own); admin via RPC |

### Progress tables

| Table | Owner | RLS policy |
|---|---|---|
| `user_lesson_progress` | per user | `auth.uid() = user_id` |
| `user_quiz_attempts` | per user | `auth.uid() = user_id` |
| `user_sop_progress` | per user (session-based) | Local-storage backed, no RLS needed |

### Lead capture

| Table | Owner | RLS policy |
|---|---|---|
| `leads` | service_role read, anon insert | Email capture from marketing page. INSERT `WITH CHECK (true)` for anon is intentional. |

### Removed in this pivot

`organizations`, `org_members`, `org_subscriptions`, `invitations`, `pending_org_admins` — see ADR-001.

**⚠️ Pre-drop dependency:** before these tables can be dropped, three surviving functions (`has_active_access`, `get_user_subscription_status`, `get_students_refund_status`) must have their "or-org-access" branches removed. See [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) Phase 3a. Until that refactor ships, these functions still reference org tables (harmlessly today — they just return zero rows for individual users).

---

## RPC functions (Postgres `SECURITY DEFINER`)

All `SECURITY DEFINER` functions in `public` schema have:
- `SET search_path = pg_catalog, public` (prevents schema-hijack attacks).
- `EXECUTE` revoked from `PUBLIC` and `anon`, granted to `authenticated` only.
- Internal `auth.uid()` check to verify caller identity.

| RPC | Purpose |
|---|---|
| `save_lesson_complete(uuid, text, timestamptz)` | Mark a lesson as completed |
| `save_quiz_attempt(uuid, text, integer, boolean, integer, jsonb, timestamptz)` | Record a quiz attempt and score |
| `load_user_progress(uuid)` | Fetch all progress for a user |
| `bulk_sync_progress(uuid, jsonb, jsonb)` | Sync localStorage progress on login |
| `get_user_subscription_status(uuid)` | Read subscription record |
| `has_active_access(uuid)` | Boolean: is the user paid up |
| `get_all_certificates()` | Admin: list every certificate |
| `admin_delete_certificate(uuid)` | Admin: revoke a certificate |
| `search_terms(text)` | Trigram + tsv search across medical terms |

### Removed in this pivot

All org-related RPCs — see ADR-001 for the full list.

---

## What breaks if you delete X (the "deletion blast radius" map)

| If you delete… | What stops working |
|---|---|
| `medical_terms` table | Search page, terminology lessons |
| `subscriptions` table | All paid routes (every `AuthRoute` check) |
| `user_lesson_progress` table | Progress bars, certificate eligibility, competency map |
| `certificates` table | `/certificate` page; admin certificate list |
| `stripe-webhook` edge function | Subscription state stops syncing with Stripe; payments succeed but app doesn't know |
| `process-cancellation` edge function | Account cancellation UI fails |
| Any `*_progress` RPC | Lesson/quiz completion silently fails |
| `AuthContext.tsx` | Entire app — every route guard depends on it |

---

## Migration phases (in progress, 2026-05-14)

See ADR-001 for context. Each phase is independently shippable.

- **Phase 1:** Document the pivot. **← current phase** (this commit).
- **Phase 2:** Delete org UI + routes + sidebar variants. App still works; org features gone from UI.
- **Phase 3:** Delete `orgService.ts` and unused service code. Smaller bundle.
- **Phase 4:** Drop org tables and unused RPCs via one migration. Schema cleanup.

---

## How to keep this document accurate

- When you add a new Page (route), Service, Edge Function, or Database Table — update this file in the same commit.
- If you delete one, remove it here.
- If a state ownership shifts (e.g., progress moves from localStorage to DB), update the "Owner" column.
- The "deletion blast radius" map is the most useful section in practice — keep it current.
