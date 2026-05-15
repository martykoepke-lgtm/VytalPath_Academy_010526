-- Revokes EXECUTE on every SECURITY DEFINER function in public from
-- PUBLIC and anon, then grants to authenticated only. Closes the
-- "Public Can Execute SECURITY DEFINER Function" advisor warnings
-- and ensures sensitive RPCs require a signed-in caller.
--
-- Policy decision: all VytalPath features are for paid (authenticated)
-- accounts. No legitimate flow calls these RPCs as an anonymous user.

do $$
declare
  fn record;
begin
  for fn in
    select p.proname,
           pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef = true
      and p.proname <> 'add_org_admin_by_email'
  loop
    execute format('revoke execute on function public.%I(%s) from public', fn.proname, fn.args);
    execute format('revoke execute on function public.%I(%s) from anon', fn.proname, fn.args);
    execute format('grant  execute on function public.%I(%s) to authenticated', fn.proname, fn.args);
  end loop;
end $$;
