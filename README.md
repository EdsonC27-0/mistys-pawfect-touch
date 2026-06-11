# Misty's Pawfect Touch 🐾

Premium dog parlour website + booking system + admin dashboard.
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) · Vercel

---

## 1. Deploy to Vercel (≈2 minutes)

```bash
cd mistys
npx vercel          # follow prompts, accept defaults
npx vercel --prod   # promote to production
```

Or push this folder to a GitHub repo and import it at vercel.com/new.

No environment variables are required to get running — the Supabase URL and anon
key have safe fallbacks baked into `lib/supabase/config.ts` (the anon key is
public by design; all access is governed by row-level security). If you prefer
env vars, set these in Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://bbwzzmsektsykzgkxjaf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key, see .env.local>
```

## 2. Create your admin login (one-time)

1. In the Supabase dashboard → project **mistys-pawfect-touch** → SQL Editor, run
   (replacing with the email you'll sign in with):

   ```sql
   update admin_allowlist set email = 'you@example.com';
   ```

2. Dashboard → **Authentication → Users → Add user** → enter that same email +
   a strong password.

3. Visit `https://your-site.vercel.app/admin/login` and sign in.
   The allowlist trigger grants the admin role automatically.

To add more admins later: insert their email into `admin_allowlist` *before*
creating their user.

## 3. Replace placeholders before launch

All in **Admin → Site content → Settings**:

| Setting | Currently | Change to |
|---|---|---|
| `whatsapp_number` | `"27000000000"` | Real number, digits only, e.g. `"27821234567"` |
| `phone_display` | `"+27 00 000 0000"` | Pretty version for display |
| `email_address` | placeholder | Your real email |
| `address` | "Durbanville, Cape Town" | Exact street address |
| `bank_details` | placeholder JSON | Real EFT details (private — never shown publicly) |
| `pensioner_discount_percent` | `10` | Whatever you offer |
| `instagram_username` | `"mistyspawfecttouch"` | Your handle |

Also:
- **Gallery & Instagram tiles** (Admin → Site content): paste real image URLs —
  elegant lavender placeholders display until you do.
- **Owner's note** on `/about`: edit `app/(site)/about/page.tsx` with your name.
- **Map** on `/contact`: swap the embed `src` for your exact address.

## 4. How bookings work

1. Customer picks a service → dog details → a **live time slot** (computed from
   your opening hours minus existing bookings minus blocked times) → submits.
2. Double-booking is impossible — enforced by a database exclusion constraint.
3. The booking lands in **Admin → Bookings** as *pending*. You approve / reject /
   reschedule, set the amount, paste a payment link (PayFast, Yoco, Ozow, Peach,
   or manual EFT), and send the confirmation via WhatsApp or email in one click.
4. Payment statuses: pending → link sent → paid (or failed / refunded / cancelled).
   Every change is logged in the `payments` table.

Opening hours and blocked-out time (holidays, lunch, vet runs) live in
**Admin → Calendar & hours**.

## 5. Local development

```bash
npm install
npm run dev   # http://localhost:3000
```

## Project map

```
app/(site)/        Public pages (home, about, services, pricing, book, gallery, reviews, faq, contact)
app/admin/         Login + admin panel (overview, bookings, calendar, customers, services, content, enquiries)
components/        UI components (BookingWizard is the booking flow)
lib/supabase/      Browser + server Supabase clients
Database           Supabase project `mistys-pawfect-touch` (ref bbwzzmsektsykzgkxjaf)
                   Migrations: core_schema, rls_and_rpcs, seed_data_and_fix_discount, harden_function_grants
```
