-- Create certificates table for storing locked student certificates
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  student_name text not null,
  certificate_number text unique not null,
  issued_at timestamptz default now() not null,
  is_locked boolean default true not null,

  constraint certificates_one_per_user unique (user_id)
);

-- Enable RLS
alter table public.certificates enable row level security;

-- Users can read their own certificate
create policy "Users can read own certificate"
  on public.certificates for select
  using (auth.uid() = user_id);

-- Users can insert their own certificate (unique constraint prevents duplicates)
create policy "Users can create own certificate"
  on public.certificates for insert
  with check (auth.uid() = user_id);

-- ─── RPC: Get all certificates (super admin dashboard) ───

create or replace function public.get_all_certificates()
returns table (
  id uuid,
  user_id uuid,
  student_name text,
  certificate_number text,
  issued_at timestamptz,
  user_email text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_email text;
begin
  select email into caller_email from auth.users where id = auth.uid();

  if caller_email not in ('mkoepkeci@gmail.com', 'marty.koepke@practicalinformatics.org') then
    raise exception 'Unauthorized: Super admin access required';
  end if;

  return query
    select
      c.id,
      c.user_id,
      c.student_name,
      c.certificate_number,
      c.issued_at,
      u.email as user_email
    from public.certificates c
    join auth.users u on u.id = c.user_id
    order by c.issued_at desc;
end;
$$;

-- ─── RPC: Delete a user's certificate (admin testing / reset) ───

create or replace function public.admin_delete_certificate(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_email text;
begin
  select email into caller_email from auth.users where id = auth.uid();

  if caller_email not in ('mkoepkeci@gmail.com', 'marty.koepke@practicalinformatics.org') then
    raise exception 'Unauthorized: Super admin access required';
  end if;

  delete from public.certificates where user_id = p_user_id;
end;
$$;
