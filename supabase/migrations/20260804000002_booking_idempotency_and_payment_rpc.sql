-- Applied directly to the linked project on 2026-08-04 (see supabase/README.md
-- for why this repo didn't have migration files before today) and reproduced
-- here so it's reviewable going forward.
--
-- Two independent fixes:
--
-- 1. Booking idempotency. create_booking had no way to distinguish "the
--    customer is submitting a genuinely new booking" from "the network
--    dropped the response to a booking that actually succeeded, and the
--    customer is retrying." The bookings_no_overlap exclusion constraint only
--    catches the case where the retry targets the *same* slot — if the
--    customer (confused by an error) picks a different slot on retry, they'd
--    end up with two real bookings. A client-generated request ID, enforced
--    unique at the database level, closes that gap: the RPC now returns the
--    original booking's result on a duplicate request ID instead of creating
--    a second one.
--
-- 2. Atomic payment recording. The admin UI previously did two independent
--    client-side writes for "mark paid" (insert into payments, then update
--    bookings.payment_status) with no error handling on the first write and
--    no transactional link between them — either could succeed while the
--    other failed, leaving the payment ledger and booking record
--    contradictory. record_payment() does both in one function invocation
--    (implicitly one transaction), and is now used for *every* payment
--    status change from the admin UI, not just "mark paid" / "mark link
--    sent" — so every payment transition gets an audit trail, not just some.

alter table public.bookings add column client_request_id uuid;
create unique index bookings_client_request_id_key on public.bookings(client_request_id) where client_request_id is not null;

create or replace function public.create_booking(
  p_service_id uuid, p_date date, p_start_time time, p_owner_name text, p_email text,
  p_phone text, p_is_pensioner boolean, p_dog_name text, p_breed text, p_size dog_size,
  p_notes text, p_payment_method text, p_client_request_id uuid default null
)
returns jsonb
language plpgsql security definer set search_path to 'public'
as $function$
declare
  v_dur int; v_end time; v_customer uuid; v_dog uuid; v_booking bookings;
  v_price numeric(10,2); v_discount numeric := 0;
begin
  if p_client_request_id is not null then
    select * into v_booking from bookings where client_request_id = p_client_request_id;
    if found then
      return jsonb_build_object('reference', v_booking.reference, 'id', v_booking.id,
        'date', v_booking.date, 'start_time', v_booking.start_time, 'amount', v_booking.amount);
    end if;
  end if;

  if coalesce(trim(p_owner_name),'') = '' or coalesce(trim(p_dog_name),'') = '' then
    raise exception 'Owner name and dog name are required';
  end if;
  if coalesce(trim(p_email),'') = '' and coalesce(trim(p_phone),'') = '' then
    raise exception 'Provide an email address or phone number';
  end if;
  if length(coalesce(p_notes,'')) > 2000 then
    raise exception 'Notes are too long (max 2000 characters)';
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

  insert into bookings (customer_id, dog_id, service_id, date, start_time, end_time, amount, customer_notes, payment_method, client_request_id)
  values (v_customer, v_dog, p_service_id, p_date, p_start_time, v_end, v_price, coalesce(p_notes,''), coalesce(p_payment_method,''), p_client_request_id)
  returning * into v_booking;

  return jsonb_build_object('reference', v_booking.reference, 'id', v_booking.id,
    'date', v_booking.date, 'start_time', v_booking.start_time, 'amount', v_booking.amount);
exception
  when exclusion_violation then
    raise exception 'That time slot has just been taken. Please choose another slot.';
  when unique_violation then
    select * into v_booking from bookings where client_request_id = p_client_request_id;
    return jsonb_build_object('reference', v_booking.reference, 'id', v_booking.id,
      'date', v_booking.date, 'start_time', v_booking.start_time, 'amount', v_booking.amount);
end;
$function$;

grant execute on function public.create_booking(uuid, date, time, text, text, text, boolean, text, text, dog_size, text, text, uuid) to anon, authenticated, service_role;

create or replace function public.record_payment(
  p_booking_id uuid, p_status pay_status, p_note text default null
)
returns jsonb
language plpgsql
set search_path to 'public'
as $function$
declare
  v_booking bookings;
begin
  if not is_admin() then
    raise exception 'Not authorized';
  end if;

  select * into v_booking from bookings where id = p_booking_id;
  if not found then
    raise exception 'Booking not found';
  end if;

  insert into payments (booking_id, provider, status, amount, link, note)
  values (
    p_booking_id,
    coalesce(nullif(v_booking.payment_provider, ''), 'manual_eft'),
    p_status,
    coalesce(v_booking.amount, 0),
    coalesce(v_booking.payment_link, ''),
    coalesce(p_note, 'Marked ' || p_status::text || ' by admin')
  );

  update bookings set payment_status = p_status, updated_at = now() where id = p_booking_id;

  return jsonb_build_object('booking_id', p_booking_id, 'payment_status', p_status);
end;
$function$;

revoke all on function public.record_payment(uuid, pay_status, text) from public;
grant execute on function public.record_payment(uuid, pay_status, text) to authenticated;
