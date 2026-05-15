# Migration Plan — Multi-Tenant → Single-Tenant

The working playbook for executing ADR-001 (see [DECISIONS.md](./DECISIONS.md)).

**Operating principle:** the app cannot break. Every commit on this branch must leave the application in a working state. We never combine "remove this UI" with "drop this table" in the same commit — we always remove the *callers* first, verify nothing's broken, then remove the *callees*.

Each phase below ends with a **green-light checklist** that must be ticked before moving to the next phase.

---

## Pre-flight (one-time, before Phase 2)

- [ ] Active production user count confirmed: Marty + test accounts only. No org subscriptions.
- [ ] Current branch (`claude/nice-tu-593f73`) has the three security commits from 2026-05-14 staged or merged. **The TypeScript change to `addOrgAdmin` is moot once the function is deleted in Phase 2c, so we can skip deploying that one specifically — but the org_members migration and search_path migration are still real fixes that should ship.**
- [ ] You have a fresh Supabase DB snapshot (Supabase auto-backups daily; confirm you can roll back).
- [ ] Local dev environment runs: `npm run dev` → app loads → you can sign in.

---

## Phase 2 — Remove client-side org infrastructure

**Goal:** delete every reference to organizations from the React app. The DB still has the org tables at the end of this phase — they just have no callers.

**Order matters:** delete leaves before branches. Sub-phases are designed so each one is independently buildable.

### Phase 2a — Delete the `/join/:code` invite flow

- [ ] Delete file: `src/components/join/JoinOrganization.tsx`
- [ ] Delete file: `src/components/join/` directory if empty
- [ ] Remove import of `JoinOrganization` in `src/router.tsx`
- [ ] Remove the `{ path: 'join/:code', element: <JoinOrganization /> }` route from `src/router.tsx`

**Verify (before commit):**
- [ ] `npm run build` succeeds (no missing import errors)
- [ ] `npm run dev` → app loads → sign in works → navigate to a lesson → lesson renders
- [ ] Search the codebase for `JoinOrganization` and `/join/` — zero results

**Commit:** `Remove /join/:code invite flow (Phase 2a of single-tenant pivot)`

---

### Phase 2b — Delete `/admin/orgs/*` and `/admin/create-organization`

- [ ] Delete file: `src/components/admin/OrgAdminDashboard.tsx`
- [ ] Delete file: `src/components/admin/OrgAdminRoute.tsx`
- [ ] Delete file: `src/components/admin/CreateOrganization.tsx`
- [ ] Remove imports + routes for the above from `src/router.tsx`
- [ ] In `src/components/admin/SuperAdminDashboard.tsx`, remove **only** the org-related sections (preserve everything else):

  **Remove:**
  - The "Organizations" tab / list
  - "Create Organization" button
  - Org-scoped invitations management
  - Any `rpc('get_all_organizations', …)` calls
  - Any `rpc('create_invitation', …)`, `rpc('cancel_invitation', …)`, `rpc('get_org_admins', …)`, `rpc('get_org_invitations', …)` calls
  - Org-level metrics: `avg_progress` aggregation across an org, `active_invite_links` counts, `self_registered_count`

  **Preserve (these are the reason admin still exists):**
  - "Student Subscriptions & Refund Status" section — per-student `completion_percentage`, `last_progress_sync`, `days_enrolled`, plan info, refund eligibility (line ~707 today)
  - Certificate management — view all, generate on the fly, delete
  - Authenticated user list with subscription status

- [ ] In `src/components/admin/AdminRedirect.tsx`, remove the branch that redirects org admins to `/admin/orgs/:slug`. AdminRedirect now sends admins to `/admin` and everyone else to `/welcome`.

**Verify:**
- [ ] `npm run build` succeeds
- [ ] `npm run dev` → sign in as admin → `/admin` loads → user list and certificate list still render
- [ ] Sign in as a non-admin test account → `/admin` redirects to `/welcome` (or returns 404, depending on your route guard pattern — either is fine)
- [ ] Grep for `OrgAdminDashboard`, `OrgAdminRoute`, `CreateOrganization`, `get_all_organizations`, `create_invitation` — zero results

**Commit:** `Remove org admin dashboard and create-organization (Phase 2b)`

---

### Phase 2c — Delete `src/services/orgService.ts` and remaining org RPC calls

- [ ] Audit: grep for `from '../services/orgService'` and `from '@/services/orgService'`. List every importer.
- [ ] For each importer, delete or rewrite the call:
  - Most should be in components we already deleted in 2a/2b.
  - Any survivor needs a case-by-case decision — log it here as you find it.
- [ ] Delete file: `src/services/orgService.ts`
- [ ] Search for stray `rpc('accept_invitation', …)`, `rpc('check_org_admin', …)`, `rpc('ensure_user_membership', …)`, `rpc('is_org_admin', …)`, `rpc('use_invite_link', …)`, `rpc('get_invitation', …)`, `rpc('get_org_members', …)`, `rpc('remove_org_member', …)`, `rpc('add_org_admin_by_email', …)`, `rpc('add_org_creator_as_admin', …)`, `rpc('get_self_registered_students', …)`, `rpc('get_user_email_by_id', …)` — remove each call site.

**Special case: `ensure_user_membership`** is called in `AuthContext.tsx:106`. After this pivot, the entire role-resolution path simplifies to:

```
if (currentUser.email is in ADMIN_EMAILS) → role = 'admin'
else → role = 'user'
```

There is no need to call an RPC at all. Inline this logic and remove the import.

**Verify:**
- [ ] `npm run build` succeeds
- [ ] `npm run dev` → sign in → role resolves correctly (admin if your email is in the list, user otherwise)
- [ ] `/welcome`, `/foundations`, `/ehr-lab`, `/practice`, `/progress`, `/certificate`, `/search`, `/account`, `/admin` (if admin) all load
- [ ] Sign out, sign back in — works
- [ ] Grep for `orgService`, `org_members`, `org_admin`, `org_id` in `src/` — only references in `types/`, comments, and `cmaaCompetencyMap.ts` if any remain
- [ ] **Manual smoke test:** complete one lesson + take one quiz + check `/progress` updated

**Commit:** `Remove orgService and org RPC calls (Phase 2c)`

---

### Phase 2d — Simplify `AuthContext` and sidebar

Per **ADR-002**, the "View As" toggle is removed entirely. The two roles are `admin` and `student`.

- [ ] `src/contexts/AuthContext.tsx`:
  - Remove the `org_admin` value from the role union.
  - Rename the regular user role from `student | user` (whatever variant is in use) to just `student`.
  - **Remove `viewAs` state, `setViewAs`, and `effectiveRoleInfo` entirely** (ADR-002).
  - `roleInfo` is now the single source of truth.
  - Simplify role resolution to:
    ```typescript
    const role = ADMIN_EMAILS.includes(currentUser.email)
      ? 'admin'
      : 'student';
    ```
  - Remove the `ensure_user_membership` RPC call — no longer needed.
- [ ] `src/components/layout/RoleBasedSidebar.tsx`:
  - Remove the "View As" segmented control UI.
  - Remove the org_admin sidebar variant.
  - Two sidebar variants now: admin (everything + "Admin Dashboard" link) and student (everything except the Admin link).
- [ ] `src/components/layout/AppLayout.tsx`:
  - Remove any conditional rendering that references `org_admin` or `viewAs`.
- [ ] If `MobileBottomNav` exists and references `effectiveRoleInfo` or `viewAs`, simplify the same way.
- [ ] **Rename the dashboard file to match the new role name:**
  - `git mv src/components/admin/SuperAdminDashboard.tsx src/components/admin/AdminDashboard.tsx`
  - Update the import in `src/router.tsx`: `SuperAdminDashboard` → `AdminDashboard`
  - Update the component name inside the file: `function SuperAdminDashboard()` → `function AdminDashboard()` and the `export` declaration accordingly
  - After this rename, docs that reference `SuperAdminDashboard` should be updated to `AdminDashboard` (DECISIONS.md, ARCHITECTURE.md, CLAUDE.md, this file).

**Verify:**
- [ ] `npm run build` succeeds
- [ ] `npm run dev` → sign in as admin → sidebar shows correct nav + Admin Dashboard link
- [ ] Sign in as test user → sidebar shows correct nav, no Admin link, no View As toggle
- [ ] All routes still accessible per role
- [ ] No TypeScript errors

**Commit:** `Simplify AuthContext and sidebar to two-role model (Phase 2d)`

---

### Phase 2 — Green-light checklist (must pass before Phase 3)

- [ ] Production deploy completed (push branch → merge to main → Vercel auto-deploy)
- [ ] Production smoke test as admin: sign in → admin dashboard → users + certificates load → sign out
- [ ] Production smoke test as test user: sign in → welcome → start a lesson → quiz → progress updates → sign out
- [ ] No console errors in browser DevTools
- [ ] No 404s in Network tab for any RPC call
- [ ] [ARCHITECTURE.md](./ARCHITECTURE.md) updated: remove "Removed in this pivot" notes that are now actually removed; move them to the appropriate "Removed" history section
- [ ] Open a follow-up issue or note for Phase 3: "Drop org tables and unused RPCs"

---

## Phase 3 — Database cleanup

**Goal:** remove the now-unused org tables and RPCs from Postgres.

**⚠️ Critical ordering:** three of the surviving RPCs (`has_active_access`, `get_user_subscription_status`, `get_students_refund_status`) still contain `UNION` / `JOIN` against the org tables for the "or org-based access" branches. They don't fail today — those branches just return zero rows for individual users — but they **will fail** the moment we drop the tables. So we refactor the functions first (Phase 3a), then sanity check (3b), then drop tables (3c).

### Phase 3a — Refactor surviving functions to drop org branches

These three functions all have an "individual OR org access" pattern. We rewrite each to only return the individual branch.

**1. `has_active_access(uuid)`** — currently checks `subscriptions` first, falls through to a `JOIN org_members + org_subscriptions` check. Rewrite to only check `subscriptions`:

```sql
create or replace function public.has_active_access(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  return exists (
    select 1 from public.subscriptions
    where user_id = p_user_id
      and status = 'active'
      and current_period_end > now()
  );
end;
$$;
```

**2. `get_user_subscription_status(uuid)`** — drop the "if not found, return org subscription" fallback. Drop `org_name` from the return type since there's no org. Update `access_type` to be `individual` or `none` only.

**3. `get_students_refund_status()`** — drop the `UNION ALL` and the org_members branch entirely. Drop the `org_name` column from the return type.

**Apply via Supabase dashboard SQL editor**, then `supabase migration repair --status applied <timestamp>`.

**Verify before moving to 3b:**
- [ ] `select has_active_access(<your-user-uuid>);` returns `true` (you have a sub)
- [ ] `select * from get_user_subscription_status(<your-user-uuid>);` returns one row, `access_type = 'individual'`
- [ ] `select count(*) from get_students_refund_status();` returns the same count as `select count(*) from subscriptions where status in ('active', 'past_due');`
- [ ] App still works: sign in, load a lesson, view `/account`, view `/admin` student list.

**Update client code** — the `SubscriptionContext` type for `access_type` should change from `'individual' | 'organization' | 'none'` to `'individual' | 'none'`. If `org_name` is rendered anywhere, remove that usage.

### Phase 3b — Sanity check no callers remain

- [ ] Run in SQL editor:
  ```sql
  -- Confirm no production code path calls the org RPCs.
  -- (This query just lists them; we use it as a checklist for the next migration.)
  select p.proname
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in (
      'accept_invitation', 'add_org_admin_by_email', 'add_org_creator_as_admin',
      'cancel_invitation', 'check_org_admin', 'create_invitation',
      'ensure_user_membership', 'get_invitation', 'get_org_admins',
      'get_org_invitations', 'get_org_members', 'get_self_registered_students',
      'get_user_email_by_id', 'is_org_admin', 'remove_org_member', 'use_invite_link'
    )
  order by p.proname;
  ```
- [ ] In the codebase (`src/`), grep one more time for the function names above. Zero results expected.

### Phase 3c — Single drop migration

Only run after Phase 3a has been verified and `has_active_access` / `get_user_subscription_status` / `get_students_refund_status` no longer reference org tables.

Create `supabase/migrations/<timestamp>_drop_org_infrastructure.sql`:

```sql
-- Drops the multi-tenant organization infrastructure. See ADR-001.
-- All client callers were removed in Phase 2.
-- The three "or-org-access" functions were refactored in Phase 3a.

-- Drop RPCs (functions cascade if any view depends on them; check first)
drop function if exists public.accept_invitation(text);
drop function if exists public.add_org_admin_by_email(uuid, text);
drop function if exists public.add_org_creator_as_admin();
drop function if exists public.cancel_invitation(uuid);
drop function if exists public.check_org_admin(text);
drop function if exists public.create_invitation(uuid, text, text, integer);
drop function if exists public.ensure_user_membership(uuid, text);
drop function if exists public.get_invitation(text);
drop function if exists public.get_org_admins(uuid);
drop function if exists public.get_org_invitations(uuid);
drop function if exists public.get_org_members(uuid);
drop function if exists public.get_self_registered_students();
drop function if exists public.get_user_email_by_id(uuid);
drop function if exists public.is_org_admin(uuid);
drop function if exists public.is_org_admin(uuid, uuid);
drop function if exists public.remove_org_member(uuid);
drop function if exists public.use_invite_link(text, uuid);

-- Drop tables in dependency order
-- (org_subscriptions before organizations because of FK to org_id)
drop table if exists public.pending_org_admins cascade;
drop table if exists public.invitations cascade;
drop table if exists public.org_members cascade;
drop table if exists public.org_subscriptions cascade;
drop table if exists public.organizations cascade;
```

**Apply via Supabase dashboard SQL editor (NOT via `supabase db push`)** — same workflow we used today. Then `supabase migration repair --status applied <timestamp>` to track it.

**Verify:**
- [ ] Supabase Security Advisor: drop from ~30 warnings to <10 (everything org-related is gone)
- [ ] App still loads, sign in works, lessons work
- [ ] Run the Phase 3a query again — all functions return zero rows (they're gone)
- [ ] `supabase migration list` shows the drop migration as `applied`

### Phase 3d — Final pass on docs

- [ ] [ARCHITECTURE.md](./ARCHITECTURE.md): move the "Removed in this pivot" sections into a "Historical" section at the bottom, or delete them outright.
- [ ] [CLAUDE.md](./CLAUDE.md): remove the "Architectural pivot in progress" banner — pivot is done.
- [ ] [CLAUDE.md](./CLAUDE.md): update the "Organization & Role System" section to "Roles" with just admin + user.
- [ ] [CLAUDE.md](./CLAUDE.md): update the "Database Schema" section — remove org tables, mark `ensure_user_membership` and others as deprecated/removed.
- [ ] [CLAUDE.md](./CLAUDE.md): update the project structure tree — remove `admin/OrgAdminDashboard.tsx`, `admin/OrgAdminRoute.tsx`, `admin/CreateOrganization.tsx`, `join/JoinOrganization.tsx`.
- [ ] [DECISIONS.md](./DECISIONS.md): add a closing line to ADR-001: "Implemented YYYY-MM-DD. Validated in production via smoke test."

---

## Phase 4 — Optional follow-ups (NOT in this migration)

These are nice-to-haves that became possible *because* of the simplification. None is required for ADR-001 to be considered complete.

- [ ] Extract a `services/progressService.ts` from `ProgressContext.tsx` for testability.
- [ ] Extract a `services/certificateService.ts`.
- [ ] Add unit tests for the simplified `AuthContext` role resolution.
- [ ] Address the remaining 2 "Extension in Public" advisor warnings (`pg_trgm`, `unaccent`) by moving extensions to an `extensions` schema. Invasive — only if you want to.
- [ ] Decide whether `storage.videos` bucket should still allow listing (currently does).

---

## Rollback plan

At any phase, if something breaks:

| Phase broke at | Rollback action |
|---|---|
| Phase 2a/2b/2c/2d | `git revert <commit>` — the deleted files come back. Push, redeploy. |
| Phase 3 migration | Restore the dropped tables and functions from a Supabase backup (Settings → Database → Backups). Then `supabase migration repair --status reverted <timestamp>` to clear the tracking. |

The single biggest safety net is your Supabase daily backup. Make sure you know how to access it before Phase 3.

---

## Status tracker

Update this as each phase completes.

- [x] **Phase 1 — Document the pivot.** Completed 2026-05-14. Output: this file, [DECISIONS.md](./DECISIONS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [CLAUDE.md](./CLAUDE.md) banner.
- [ ] **Phase 2a — Delete `/join/:code` invite flow.**
- [ ] **Phase 2b — Delete `/admin/orgs/*` and CreateOrganization.**
- [ ] **Phase 2c — Delete `orgService.ts` and remaining org RPC calls.**
- [ ] **Phase 2d — Simplify `AuthContext` and sidebar.**
- [ ] **Phase 3a — Refactor `has_active_access`, `get_user_subscription_status`, `get_students_refund_status` to drop org branches.** ⚠️ Must complete before Phase 3c.
- [ ] **Phase 3b — Pre-drop sanity check.**
- [ ] **Phase 3c — Drop org tables and RPCs migration.**
- [ ] **Phase 3d — Final docs pass.**
