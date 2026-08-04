-- Baseline schema snapshot for mistys-pawfect-touch (Supabase project bbwzzmsektsykzgkxjaf)
--
-- This file was reconstructed on 2026-08-04 by introspecting the live production
-- database, because the four migrations that actually created this schema
-- (core_schema, rls_and_rpcs, seed_data_and_fix_discount, harden_function_grants —
-- see `supabase migration list` against the linked project) were applied directly
-- against the remote project and never checked into this repository. Their exact
-- original SQL text is not recoverable; this file captures the resulting schema
-- state as a single baseline so the repo has *some* version-controlled source of
-- truth to review and diff future changes against.
--
-- Going forward: make schema changes as new files in this directory (via
-- `supabase migration new <name>` once the CLI is linked with
-- `supabase link --project-ref bbwzzmsektsykzgkxjaf`), not directly against the
-- dashboard/SQL editor, so this history stays accurate.

-- ── Extensions ────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists btree_gist; -- exclusion constraint on bookings

-- ── Enums ─────────────────────────────────────────────────────────────────────

create type booking_status as enum ('pending', 'approved', 'rejected', 'rescheduled', 'completed', 'cancelled');
create type pay_status as enum ('pending', 'link_sent', 'paid', 'failed', 'refunded', 'cancelled');
create type dog_size as enum ('small', 'medium', 'large', 'xlarge', 'puppy');

-- ── Tables ────────────────────────────────────────────────────────────────────

create table public.admin_allowlist (
  email text primary key
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  is_pensioner boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.dogs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  breed text not null default '',
  size dog_size not null default 'medium',
  behaviour_notes text not null default '',
  medical_notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  long_description text not null default '',
  category text not null default 'grooming',
  duration_minutes int not null default 90,
  is_addon boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.service_prices (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  size dog_size,
  label text not null default '',
  price numeric not null,
  note text not null default '',
  sort_order int not null default 0
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default upper(substr(md5(random()::text), 1, 6)),
  customer_id uuid not null references public.customers(id) on delete cascade,
  dog_id uuid not null references public.dogs(id) on delete cascade,
  service_id uuid not null references public.services(id),
  date date not null,
  start_time time not null,
  end_time time not null,
  status booking_status not null default 'pending',
  payment_status pay_status not null default 'pending',
  payment_method text not null default '',
  payment_provider text not null default '',
  payment_link text not null default '',
  amount numeric,
  customer_notes text not null default '',
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_check check (end_time > start_time),
  constraint bookings_no_overlap exclude using gist (
    tsrange(date + start_time, date + end_time) with &&
  ) where (status in ('pending', 'approved', 'rescheduled'))
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  provider text not null default 'manual_eft',
  status pay_status not null default 'pending',
  amount numeric not null default 0,
  reference text not null default '',
  link text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create table public.business_hours (
  day_of_week int primary key check (day_of_week between 0 and 6),
  is_open boolean not null default true,
  open_time time not null default '08:30',
  close_time time not null default '17:00'
);

create table public.blocked_times (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null,
  end_time time not null,
  reason text not null default '',
  constraint blocked_times_check check (end_time > start_time)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  dog_name text not null default '',
  rating int not null default 5 check (rating between 1 and 5),
  content text not null,
  is_approved boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  active boolean not null default true
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default 'groomed',
  image_url text not null default '',
  sort_order int not null default 0,
  active boolean not null default true
);

create table public.instagram_tiles (
  id uuid primary key default gen_random_uuid(),
  image_url text not null default '',
  caption text not null default '',
  link_url text not null default '',
  sort_order int not null default 0,
  active boolean not null default true
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  phone text not null default '',
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table public.settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'none',
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────

alter table public.admin_allowlist enable row level security;
alter table public.blocked_times enable row level security;
alter table public.bookings enable row level security;
alter table public.business_hours enable row level security;
alter table public.customers enable row level security;
alter table public.dogs enable row level security;
alter table public.enquiries enable row level security;
alter table public.faqs enable row level security;
alter table public.gallery_images enable row level security;
alter table public.instagram_tiles enable row level security;
alter table public.payments enable row level security;
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.service_prices enable row level security;
alter table public.services enable row level security;
alter table public.settings enable row level security;

-- Admin (via is_admin()) has full access to everything. Public/anon access is
-- deliberately narrow: read-only on active/public content, INSERT-only (with
-- restrictions) on enquiries and reviews, and NO direct access at all to
-- bookings/customers/dogs/payments — those are only reachable through the
-- SECURITY DEFINER RPCs below, which apply their own validation.

create policy admin_all_allowlist on public.admin_allowlist for all using (is_admin()) with check (is_admin());
create policy admin_all_blocked_times on public.blocked_times for all using (is_admin()) with check (is_admin());
create policy admin_all_bookings on public.bookings for all using (is_admin()) with check (is_admin());
create policy admin_all_business_hours on public.business_hours for all using (is_admin()) with check (is_admin());
create policy public_business_hours on public.business_hours for select using (true);
create policy admin_all_customers on public.customers for all using (is_admin()) with check (is_admin());
create policy admin_all_dogs on public.dogs for all using (is_admin()) with check (is_admin());
create policy admin_all_enquiries on public.enquiries for all using (is_admin()) with check (is_admin());
create policy public_insert_enquiries on public.enquiries for insert with check (true);
create policy admin_all_faqs on public.faqs for all using (is_admin()) with check (is_admin());
create policy public_faqs on public.faqs for select using (active = true);
create policy admin_all_gallery on public.gallery_images for all using (is_admin()) with check (is_admin());
create policy public_gallery on public.gallery_images for select using (active = true);
create policy admin_all_instagram on public.instagram_tiles for all using (is_admin()) with check (is_admin());
create policy public_instagram on public.instagram_tiles for select using (active = true);
create policy admin_all_payments on public.payments for all using (is_admin()) with check (is_admin());
create policy admin_all_profiles on public.profiles for all using (is_admin()) with check (is_admin());
create policy own_profile on public.profiles for select using (id = auth.uid());
create policy admin_all_reviews on public.reviews for all using (is_admin()) with check (is_admin());
create policy public_insert_reviews on public.reviews for insert with check (is_approved = false);
create policy public_reviews on public.reviews for select using (is_approved = true);
create policy admin_all_service_prices on public.service_prices for all using (is_admin()) with check (is_admin());
create policy public_service_prices on public.service_prices for select
  using (exists (select 1 from public.services s where s.id = service_prices.service_id and s.active));
create policy admin_all_services on public.services for all using (is_admin()) with check (is_admin());
create policy public_services on public.services for select using (active = true);
create policy admin_all_settings on public.settings for all using (is_admin()) with check (is_admin());
create policy public_settings on public.settings for select using (is_public = true);

-- ── Functions ─────────────────────────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path to 'public'
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path to 'public'
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    case when exists (select 1 from public.admin_allowlist a where lower(a.email) = lower(new.email))
      then 'admin' else 'none' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.get_available_slots(p_date date, p_service_id uuid)
returns table(slot_start time, slot_end time)
language plpgsql stable security definer set search_path to 'public'
as $$
declare
  v_dur int;
  v_open time;
  v_close time;
  v_is_open boolean;
  v_step interval := interval '30 minutes';
  t time;
begin
  select duration_minutes into v_dur from services where id = p_service_id and active;
  if v_dur is null then return; end if;

  select bh.is_open, bh.open_time, bh.close_time into v_is_open, v_open, v_close
  from business_hours bh where bh.day_of_week = extract(dow from p_date)::int;
  if v_is_open is distinct from true then return; end if;

  t := v_open;
  while (t + (v_dur || ' minutes')::interval) <= v_close loop
    if not exists (
      select 1 from bookings b
      where b.date = p_date
        and b.status in ('pending','approved','rescheduled')
        and tsrange(p_date + t, p_date + t + (v_dur || ' minutes')::interval)
            && tsrange(b.date + b.start_time, b.date + b.end_time)
    ) and not exists (
      select 1 from blocked_times bt
      where bt.date = p_date
        and tsrange(p_date + t, p_date + t + (v_dur || ' minutes')::interval)
            && tsrange(bt.date + bt.start_time, bt.date + bt.end_time)
    ) and (p_date > current_date or (p_date = current_date and t > (now() at time zone 'Africa/Johannesburg')::time))
    then
      slot_start := t;
      slot_end := t + (v_dur || ' minutes')::interval;
      return next;
    end if;
    t := t + v_step;
  end loop;
end;
$$;

create or replace function public.create_booking(
  p_service_id uuid, p_date date, p_start_time time, p_owner_name text, p_email text,
  p_phone text, p_is_pensioner boolean, p_dog_name text, p_breed text, p_size dog_size,
  p_notes text, p_payment_method text
)
returns jsonb
language plpgsql security definer set search_path to 'public'
as $$
declare
  v_dur int; v_end time; v_customer uuid; v_dog uuid; v_booking bookings;
  v_price numeric(10,2); v_discount numeric := 0;
begin
  if coalesce(trim(p_owner_name),'') = '' or coalesce(trim(p_dog_name),'') = '' then
    raise exception 'Owner name and dog name are required';
  end if;
  if coalesce(trim(p_email),'') = '' and coalesce(trim(p_phone),'') = '' then
    raise exception 'Provide an email address or phone number';
  end if;
  select duration_minutes into v_dur from services where id = p_service_id and active;
  if v_dur is null then raise exception 'Service not found'; end if;
  v_end := p_start_time + (v_dur || ' minutes')::interval;

  if coalesce(trim(p_email),'') <> '' then
    select id into v_customer from customers where lower(email) = lower(trim(p_email));
  end if;
  if v_customer is null then
    insert into customers (full_name, email, phone, is_pensioner)
    values (trim(p_owner_name), nullif(trim(p_email),''), nullif(trim(p_phone),''), coalesce(p_is_pensioner,false))
    returning id into v_customer;
  else
    update customers set full_name = trim(p_owner_name),
      phone = coalesce(nullif(trim(p_phone),''), phone),
      is_pensioner = coalesce(p_is_pensioner, is_pensioner)
    where id = v_customer;
  end if;

  select id into v_dog from dogs where customer_id = v_customer and lower(name) = lower(trim(p_dog_name)) limit 1;
  if v_dog is null then
    insert into dogs (customer_id, name, breed, size)
    values (v_customer, trim(p_dog_name), coalesce(trim(p_breed),''), p_size)
    returning id into v_dog;
  else
    update dogs set breed = coalesce(nullif(trim(p_breed),''), breed), size = p_size where id = v_dog;
  end if;

  select price into v_price from service_prices
  where service_id = p_service_id and (size = p_size or size is null)
  order by case when size = p_size then 0 else 1 end limit 1;

  if coalesce(p_is_pensioner,false) then
    select coalesce((value #>> '{}')::numeric, 0) into v_discount
    from settings where key = 'pensioner_discount_percent';
    v_price := round(coalesce(v_price,0) * (1 - coalesce(v_discount,0)/100), 2);
  end if;

  insert into bookings (customer_id, dog_id, service_id, date, start_time, end_time, amount, customer_notes, payment_method)
  values (v_customer, v_dog, p_service_id, p_date, p_start_time, v_end, v_price, coalesce(p_notes,''), coalesce(p_payment_method,''))
  returning * into v_booking;

  return jsonb_build_object('reference', v_booking.reference, 'id', v_booking.id,
    'date', v_booking.date, 'start_time', v_booking.start_time, 'amount', v_booking.amount);
exception
  when exclusion_violation then
    raise exception 'That time slot has just been taken. Please choose another slot.';
end;
$$;

-- Lock down execution: only the RPCs meant to be public-callable are granted
-- to anon/authenticated. Everything else (table DML) stays behind RLS above.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;
revoke all on function public.get_available_slots(date, uuid) from public;
grant execute on function public.get_available_slots(date, uuid) to anon, authenticated, service_role;
revoke all on function public.create_booking(uuid, date, time, text, text, text, boolean, text, text, dog_size, text, text) from public;
grant execute on function public.create_booking(uuid, date, time, text, text, text, boolean, text, text, dog_size, text, text) to anon, authenticated, service_role;
