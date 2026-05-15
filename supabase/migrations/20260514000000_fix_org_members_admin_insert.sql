-- Closes privilege escalation: any authenticated user could insert
-- themselves as admin of any org via direct insert into org_members,
-- because the "Allow member inserts" policy used WITH CHECK (true).
-- This migration drops the loose policy and routes legitimate admin-add
-- through a SECURITY DEFINER RPC that verifies caller is an admin of the
-- target org.

-- 1. Create the locked-down RPC. SECURITY DEFINER bypasses RLS but
--    we check internally that the caller is an admin of the target org.
create or replace function public.add_org_admin_by_email(
  p_org_id uuid,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_caller_id uuid := auth.uid();
  v_target_user_id uuid;
  v_existing_id uuid;
  v_existing_role text;
begin
  -- Caller must be signed in
  if v_caller_id is null then
    return jsonb_build_object('success', false, 'error', 'Not authenticated');
  end if;

  -- Caller must be an admin of the target org
  if not exists (
    select 1
    from public.org_members
    where org_id = p_org_id
      and user_id = v_caller_id
      and role = 'admin'
      and status = 'active'
  ) then
    return jsonb_build_object('success', false, 'error', 'Not authorized for this organization');
  end if;

  -- Look up the user by email
  select id into v_target_user_id
  from auth.users
  where email = p_email
  limit 1;

  if v_target_user_id is null then
    return jsonb_build_object('success', false, 'error', 'User not found. They must create an account first.');
  end if;

  -- Already a member?
  select id, role into v_existing_id, v_existing_role
  from public.org_members
  where org_id = p_org_id and user_id = v_target_user_id
  limit 1;

  if v_existing_id is not null then
    if v_existing_role = 'admin' then
      return jsonb_build_object('success', false, 'error', 'User is already an admin of this organization.');
    end if;
    -- Upgrade student -> admin
    update public.org_members
      set role = 'admin'
      where id = v_existing_id;
    return jsonb_build_object('success', true);
  end if;

  -- Insert as new admin
  insert into public.org_members (org_id, user_id, role, status)
  values (p_org_id, v_target_user_id, 'admin', 'active');

  return jsonb_build_object('success', true);
end;
$$;

-- 2. Lock down execute. Authenticated only -- anon never needs this.
revoke all on function public.add_org_admin_by_email(uuid, text) from public;
revoke all on function public.add_org_admin_by_email(uuid, text) from anon;
grant execute on function public.add_org_admin_by_email(uuid, text) to authenticated;

-- 3. Drop the loose policy. Legitimate flows are SECURITY DEFINER (bypass RLS):
--    - accept_invitation, ensure_user_membership, signup trigger, new RPC above
--    - "Users can join via invite" (WITH CHECK user_id = auth.uid()) stays
drop policy if exists "Allow member inserts" on public.org_members;
