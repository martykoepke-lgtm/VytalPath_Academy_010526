# VytalPath Academy — Decisions Log

A chronological log of architectural decisions (ADRs). Each entry captures the *why* behind a choice so future sessions don't relitigate it.

Format per ADR:
- **Status:** Proposed / Accepted / Superseded
- **Date:** YYYY-MM-DD (absolute, never relative)
- **Context:** What prompted the decision
- **Decision:** What we chose
- **Consequences:** What this means for the code, the schema, and the team

---

## ADR-001 — Pivot from multi-tenant (organizations) to single-tenant (individuals only)

- **Status:** Accepted
- **Date:** 2026-05-14
- **Owner:** Marty Koepke

### Context

VytalPath was originally designed as a dual-tenant platform supporting both:
1. **Individual learners** who self-register and pay $327/year.
2. **Organizations** (clinics, staffing agencies) buying seats in bulk with org admins managing student rosters via invite links.

The org-tenant infrastructure added meaningful complexity:
- A second user role (`org_admin`) with its own dashboard, routing, and sidebar variant.
- Tables: `organizations`, `org_members`, `org_subscriptions`, `invitations`, `pending_org_admins`.
- ~18 `SECURITY DEFINER` RPC functions for invitation lifecycle, member management, and org-scoped queries.
- A "View As" admin toggle that switched the UI between admin / org admin / student perspectives.
- A `/join/:code` invite acceptance flow callable by anonymous users.

In production today: there are **no real organizations and no org subscriptions** — only a single test org Marty created while building the feature. The complexity has cost without producing revenue.

A related observation: the org-admin-add flow had a privilege escalation vulnerability that required a same-day patch (see security audit on 2026-05-14). The complexity of the multi-tenant model is correlated with the surface area of these kinds of bugs.

### Decision

**Remove the organization/multi-tenant feature entirely.** VytalPath becomes a single-tenant individual-learner platform. The two surviving user roles are:

1. **`admin`** — Marty (and any future colleagues), identified by hardcoded email in `AuthContext.tsx`. Has access to the platform-wide Admin Dashboard at `/admin` (student progress, certificates, subscriptions, refunds).
2. **`student`** — every paying individual subscriber. The default role.

No `org_admin`, no orgs, no invitations. Role is **derived from email** at sign-in time, not stored in any database table.

### Consequences

**End-user experience (individual learners): identical to today.**
- Same 9 training sections, same lessons, same quizzes, same EHR Practice Lab, same Job Readiness tools.
- Same progress tracking, same certificate, same account management.
- Same `admin` capabilities for Marty (manage users, manage certificates).

**What gets removed:**
- Routes: `/join/:code`, `/admin/orgs/*`, `/admin/create-organization`.
- Components: `JoinOrganization`, `OrgAdminRoute`, `OrgAdminDashboard`, `CreateOrganization`, the org-admin variant of `RoleBasedSidebar`, the org-admin option in the "View As" toggle.
- Services: `src/services/orgService.ts` entirely.
- Database tables: `organizations`, `org_members`, `org_subscriptions`, `invitations`, `pending_org_admins`.
- RPC functions: `accept_invitation`, `add_org_admin_by_email`, `add_org_creator_as_admin`, `cancel_invitation`, `check_org_admin`, `create_invitation`, `ensure_user_membership` (will be replaced by a simpler signup hook), `get_invitation`, `get_org_admins`, `get_org_invitations`, `get_org_members`, `get_self_registered_students`, `get_user_email_by_id`, `is_org_admin` (both overloads), `remove_org_member`, `use_invite_link`.
- The temporary `add_org_admin_by_email` RPC introduced earlier today (2026-05-14) — it was a defensive lockdown of an org-admin-add hole, no longer needed once the feature is gone.

**What stays:**
- All lesson content tables: `medical_terms`, `sops`, lessons, quizzes, progress.
- Subscription infrastructure: Stripe integration, `get_user_subscription_status`, `has_active_access`, `process-cancellation` edge function.
- Certificate system: `certificates` table, `get_all_certificates`, `admin_delete_certificate` (admin only).
- Progress RPCs: `save_lesson_complete`, `save_quiz_attempt`, `load_user_progress`, `bulk_sync_progress`.
- Search: `search_terms` and the medical terminology tables.
- The "Security Rules" section of CLAUDE.md (added 2026-05-14) — those rules apply to the simpler codebase too.

**Pricing model:** stays at $327/year individual access. Tiered organization pricing in the README is removed.

**Migration plan:** see [MIGRATION_PLAN.md](./MIGRATION_PLAN.md). Phased: Document → Remove client UI → **Refactor three "or-org-access" functions to drop their org branches** → Drop tables → Final docs pass. The function refactor step (Phase 3a) is critical and easy to miss; `has_active_access`, `get_user_subscription_status`, and `get_students_refund_status` all JOIN org tables today, and dropping the tables without first rewriting those functions would lock every paying user out of every paid route.

**Risk:** any existing invite links in the wild break immediately when Phase 2 lands. Acceptable because there are no real org users to disrupt.

### How to apply this in future sessions

If a future session sees org-related code or references to "org admin", "invitation", or "multi-tenant" features — that code is in the process of being removed. Check the current phase in ARCHITECTURE.md before adding new code that depends on org concepts. Do not extend the org feature.

---

## ADR-002 — Drop the "View As" admin role-preview toggle

- **Status:** Accepted
- **Date:** 2026-05-14
- **Owner:** Marty Koepke

### Context

The legacy admin sidebar had a "View As" segmented control that let a admin switch the rendering between `admin`, `org_admin`, and `student` views without signing out. With ADR-001 removing `org_admin`, only the two-way `admin ↔ student` variant would be meaningful.

A reduced two-way version was considered but rejected for the reasons below.

### Decision

**Remove the "View As" toggle entirely.** To test the student experience, the admin signs in with a real test student account in an Incognito / InPrivate browser window.

### Why not keep a two-way variant

The toggle only re-renders the UI; the real `auth.uid()`, RLS context, and RPC permissions remain `admin`. That hides three categories of bugs that the toggle *looks like* it would catch:

| Bug category | Toggle catches it? |
|---|---|
| Sidebar / page elements visible to the wrong role | Yes |
| RLS policy incorrectly denies student access to data | **No** |
| RPC `permission denied` for student callers | **No** |
| Subscription / paywall gate behavior for students | **No** |
| Fresh-signup onboarding flow | **No** |

Maintenance cost is also non-trivial: the toggle is flipped rarely, so its rendering paths silently drift out of sync with the actual student experience over time.

### Consequences

- `src/contexts/AuthContext.tsx` loses ~40 lines: `viewAs` state, `setViewAs`, `effectiveRoleInfo`, persistence wiring.
- `src/components/layout/RoleBasedSidebar.tsx` loses the segmented-control UI and the role-preview conditional branches.
- Test workflow becomes: Incognito window + test student account. About 10 seconds slower than flipping the toggle, but catches every bug category above.
- If a true UI-only preview is ever genuinely needed later, browser DevTools (element-hide / CSS class injection) is faster than rebuilding a server-side toggle.

---

## ADR-003 — Admin role identification: hardcoded email list now, DB-backed if needed later

- **Status:** Accepted
- **Date:** 2026-05-14
- **Owner:** Marty Koepke

### Context

Per ADR-001, the platform has two roles: `admin` and `student`. The current implementation hardcodes which emails are admins in `AuthContext.tsx`:

```typescript
const ADMIN_EMAILS = ['mkoepkeci@gmail.com'];
```

Marty wants the ability to grow this list — to add another admin in the future as the platform scales. Two reasonable patterns:

1. **Code-based list (status quo, simplified).** Add a new email to `ADMIN_EMAILS` and redeploy.
2. **DB-backed flag.** A column on `user_profiles` (e.g., `is_admin boolean default false`), seeded for Marty, mutable via an admin-only RPC. Adding an admin is a runtime DB operation, no deploy needed.

### Decision

**Use the hardcoded list approach for now.** Migrate to a DB-backed flag when (a) there are three or more admins, OR (b) admin turnover requires a non-deploy mechanism.

Reasoning:
- For 1-2 admins, code-based is the simplest possible implementation. Zero runtime risk, zero new RLS surface, zero new RPC to audit.
- Adding a new admin via a code change + redeploy is a 5-minute operation; it does not require a feature.
- A DB-backed flag introduces: a new schema migration, new RLS policies on the flag, an admin-only RPC to flip it, a UI to invoke that RPC, and a way to seed the initial admin. That cost is justified at scale, not at 1-2 admins.
- We've just spent a session removing exactly this kind of "grow into the feature" complexity (the multi-tenant org system). The lesson: don't build the infrastructure before you have the use case.

### Consequences

**Now:**
- `src/contexts/AuthContext.tsx` exports `const ADMIN_EMAILS = ['mkoepkeci@gmail.com'];`
- Role resolution is `ADMIN_EMAILS.includes(currentUser.email) ? 'admin' : 'student'`.
- Adding another admin: edit the file, commit, push, deploy. Document the new admin in this ADR or a new ADR-NNN.

**When this becomes painful (3+ admins or non-engineer admins):**
- Add a `user_profiles.is_admin boolean not null default false` column via migration.
- Seed `update user_profiles set is_admin = true where user_id = (select id from auth.users where email in ('mkoepkeci@gmail.com', ...))` for current admins.
- Refactor `AuthContext` to fetch `is_admin` from `user_profiles` on session load.
- Add an "Admins" section to the Admin Dashboard with a "Promote to admin" form (admin-only RPC).
- Lock RLS on `user_profiles.is_admin` so only existing admins can flip it.

Document that migration as its own ADR when it happens.

### Initial admin seed

The single hardcoded admin at the time of this ADR is `mkoepkeci@gmail.com`.
