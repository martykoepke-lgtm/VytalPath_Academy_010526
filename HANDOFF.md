# Session Handoff — 2026-05-14 → next session

A new Claude session should read this first. It's a 5-minute orientation that points at the canonical docs for details. Do not re-plan — pick up where we left off.

---

## TL;DR

VytalPath is mid-pivot from multi-tenant (orgs + individuals) to single-tenant (individuals only). Phase 1 (planning docs) is complete. **Phase 2a — delete `/join/:code` invite flow — is the next concrete step.** Production is live, real subscribers exist (Marty + test users), and the app cannot break.

---

## Read in this order (all in the repo root, ~10 minutes total)

1. **[CLAUDE.md](./CLAUDE.md)** — the banner at the top explains the in-progress pivot and the two-role model. Auto-loaded into every session.
2. **[MIGRATION_PLAN.md](./MIGRATION_PLAN.md)** — the tactical playbook. Scroll to the "Status tracker" at the bottom to see exactly which checkboxes are done.
3. **[DECISIONS.md](./DECISIONS.md)** — three ADRs:
   - ADR-001: single-tenant pivot (the *what* and *why*)
   - ADR-002: drop "View As" toggle (no UI-only role preview)
   - ADR-003: admin role via hardcoded `ADMIN_EMAILS` list (currently `['mkoepkeci@gmail.com']`)
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — target architecture. The "deletion blast radius" map at the bottom is the safety net for future deletes.

---

## What was done in the 2026-05-14 session

### Security fixes shipped to production
- **Closed a real privilege escalation:** `org_members` table had `WITH CHECK (true)` INSERT policy. Any authenticated user could promote themselves to admin of any org. Patched via a `SECURITY DEFINER` RPC `add_org_admin_by_email` with internal `auth.uid()` check + drop of the loose policy.
- **Search-path hardening:** added `SET search_path = pg_catalog, public` to 10 user-owned Postgres functions.
- **SECURITY DEFINER lockdown:** revoked `EXECUTE` on 25 functions from `PUBLIC`/`anon`, granted only to `authenticated`. Advisor warnings dropped 65 → 30. Remaining 30 are intentional (Signed-In Users Can Execute is by design) or false positives (`leads` INSERT pattern, two extensions in public).

### Planning docs created
- CLAUDE.md banner added pointing at the pivot
- DECISIONS.md (three ADRs)
- ARCHITECTURE.md (target shape, page/service/table inventory)
- MIGRATION_PLAN.md (phased playbook)

### Code changes in repo (uncommitted, on branch `claude/nice-tu-593f73`)
- `src/services/orgService.ts` — `addOrgAdmin` rewritten as thin wrapper around the new RPC (becomes moot in Phase 2c when the file is deleted anyway)
- Three migration files in `supabase/migrations/`:
  - `20260514000000_fix_org_members_admin_insert.sql`
  - `20260514000001_set_search_path_on_user_functions.sql`
  - `20260514000002_lock_down_security_definer_functions.sql`
- All three marked applied via `supabase migration repair`

---

## First step tomorrow

**Phase 2a — delete `/join/:code` invite flow.** This is the simplest phase, lowest risk, ~15 minutes. The checklist is in MIGRATION_PLAN.md.

Before starting:
1. Confirm with Marty that we're starting.
2. Read Phase 2a's exact checklist in MIGRATION_PLAN.md (no re-planning).
3. Make the file deletions + router edit.
4. Run `npm run build` to verify it compiles.
5. Show the diff. **Do not commit** until Marty approves.
6. After commit, the verify gate in MIGRATION_PLAN.md must pass before moving to 2b.

---

## How Marty wants to work — important

- **One baby step at a time.** Don't dump multi-step plans. Single diagnostic action, single decision point.
- **Verify-before-commit for every change.** Every commit on this branch must leave the app in a working state.
- **Paranoid about breaking the app.** Real production with real subscribers. Don't experiment, don't shortcut.
- **Plain English.** Marty is non-technical (relatively). No unexplained jargon. When something is genuinely technical, frame it with the consequence ("this means X breaks for users if we get it wrong") not just the mechanism.
- **No sycophancy.** Don't say "great question!" Just answer.
- **Honest assessments.** If a plan has real risk, say so. If a feature is being dropped that might be missed, say so. Marty's intuition saved us from a real production break in this session (caught the `get_students_refund_status` org-join issue) — trust the pushback.

---

## Tooling state

| What | State |
|---|---|
| Supabase CLI | Installed via Scoop at `C:\Users\mkoep\scoop\shims\supabase`. PATH may need `$env:Path += ";C:\Users\mkoep\scoop\shims"` in PowerShell tool calls. |
| Supabase auth | Logged in via PAT. Linked to project `vwieorhlcapeeamvltqa` (Published_VytalPath_Academy). |
| Supabase MCP (`mcp__3b4c68c7-...`) | **Authenticated to the WRONG Supabase account.** Calling `get_advisors` returns "no permission". Do not use the MCP advisor tool. Use the dashboard's Security Advisor UI instead. |
| Chrome (Claude in Chrome) | Has the extension installed. supabase.com permission was granted for the previous session — may need re-approval each session/tab. Useful for driving the Supabase dashboard SQL editor without manual paste. |
| Edge browser | Marty signed into the correct Supabase account here. Where Marty does manual dashboard work. |
| Worktree | `C:\Users\mkoep\VytalPath-Academy-main\.claude\worktrees\nice-tu-593f73\` (branch `claude/nice-tu-593f73`). All session work is here. Main repo at `C:\Users\mkoep\VytalPath-Academy-main\` is on `main`. |

---

## Watch-outs (gotchas discovered in this session)

1. **Historical migration drift.** The repo's `supabase/migrations/` folder has ~23 migrations that were never applied via `supabase db push` (the schema was built directly in the Supabase dashboard or via Bolt). **Do not run `supabase db push`** — it would try to re-apply tables that already exist and fail. Workflow for any new migration: write the SQL file → run it via the dashboard SQL editor → `supabase migration repair --status applied <timestamp>` to track it.

2. **Three functions silently depend on org tables.** `has_active_access`, `get_user_subscription_status`, and `get_students_refund_status` all JOIN against `org_members` / `org_subscriptions` / `organizations`. They don't fail today (org users just return zero rows), but they **will** fail when Phase 3c drops those tables. **Phase 3a refactors these three functions before the table drop** — this is the most critical step in the whole plan. Do not skip it.

3. **MCP integration vs CLI.** When asked to "operate on Supabase," prefer:
   - **Supabase dashboard via Chrome** (driving the SQL editor) for ad-hoc queries and migrations.
   - **PowerShell + Supabase CLI** for `migration repair`, `migration list`, `secrets list`.
   - **MCP tools** — skip them for this project until the MCP integration is re-authenticated.

4. **`.env` contains a classic GitHub PAT** (`ghp_*`). It's gitignored. Marty has been pasting tokens into chat then rotating them — same caution applies.

5. **Pricing model.** Single $327/year individual access. **No org pricing tiers, no seats.** Promo codes via Stripe if discounts are needed. Don't propose tiered pricing.

6. **Two roles only.** `admin` (hardcoded email match) and `student` (everyone else). No `org_admin`, no `super_admin`, no "View As" toggle.

---

## What NOT to do

- Don't run `supabase db push` (see watch-out #1).
- Don't disable RLS to fix a bug (CLAUDE.md Security Rules — there is no exception to this).
- Don't grant `EXECUTE` on a `SECURITY DEFINER` function to `PUBLIC`/`anon` without an ADR-level reason.
- Don't extend the org feature in any way. It is being deleted.
- Don't propose a parallel rebuild (`src-v2/`). Marty considered it; we chose in-place migration. If that decision needs to be revisited, the rebuild path's costs and timeline are documented in this session's chat transcript.
- Don't combine "remove this UI" and "drop this table" in the same commit. The principle is: kill callers, verify, then kill callees.
- Don't claim "the migration is done" until Phase 3d (final docs pass) is checked off in MIGRATION_PLAN.md status tracker.

---

## Quick orientation question to ask Marty at session start

"I see we're at Phase 2a (delete `/join/:code`). Want to start there now, or is there something else you'd like to address first?"

That's it — no re-planning, no "let me catch up on the docs" preamble. Trust the handoff, trust the docs, do the next step.
