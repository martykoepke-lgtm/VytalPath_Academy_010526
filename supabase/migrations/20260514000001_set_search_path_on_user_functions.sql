-- Fixes "Function Search Path Mutable" advisor warnings on user-owned
-- functions in public. Sets a fixed search_path so the function body
-- always resolves identifiers against a known schema list, removing
-- the hijack vector the lint warns about.
--
-- Order is intentional: pg_catalog FIRST so built-in calls like now(),
-- gen_random_uuid(), etc. always resolve to the real catalog functions.

alter function public.bulk_sync_progress(uuid, jsonb, jsonb)
  set search_path = pg_catalog, public;

alter function public.get_org_price_per_seat(integer)
  set search_path = pg_catalog, public;

alter function public.get_org_seat_tier(integer)
  set search_path = pg_catalog, public;

alter function public.get_user_subscription_status(uuid)
  set search_path = pg_catalog, public;

alter function public.has_active_access(uuid)
  set search_path = pg_catalog, public;

alter function public.is_org_admin(uuid, uuid)
  set search_path = pg_catalog, public;

alter function public.load_user_progress(uuid)
  set search_path = pg_catalog, public;

alter function public.save_lesson_complete(uuid, text, timestamptz)
  set search_path = pg_catalog, public;

alter function public.save_quiz_attempt(uuid, text, integer, boolean, integer, jsonb, timestamptz)
  set search_path = pg_catalog, public;

alter function public.update_updated_at_column()
  set search_path = pg_catalog, public;
