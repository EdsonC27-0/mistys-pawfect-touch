# Database

This project's Postgres schema, RLS policies, and RPC functions live in
Supabase project **mistys-pawfect-touch** (ref `bbwzzmsektsykzgkxjaf`).

Until 2026-08-04, schema changes were made directly against the remote
project (via the dashboard/SQL editor) and never checked into this repo —
meaning there was no way to review, diff, or reproduce the schema from
source. `migrations/20260804000001_baseline_schema.sql` fixes that going
forward: it's a reconstructed snapshot of the schema as it existed on that
date (introspected directly from the live database), not a literal replay
of the original migration history.

**This baseline file should not be run against the current production
project** — it already matches; running it will just error on "already
exists". It exists so:

- Future changes can be reviewed as normal PRs/diffs against known-good SQL.
- A staging project can be created from scratch by applying this file, then
  any migrations added after it, in order.
- Disaster recovery doesn't depend entirely on the current remote project
  still being intact.

## Making a schema change from now on

1. Install the Supabase CLI, then `supabase link --project-ref bbwzzmsektsykzgkxjaf`.
2. `supabase migration new <short_description>` to create a new timestamped
   file in `migrations/`.
3. Write the change as SQL, test it against a local/staging Supabase instance
   (`supabase start` + `supabase db reset`) before applying to production.
4. `supabase db push` to apply to the linked (production) project, or apply
   via the dashboard SQL editor and then add the matching file here so the
   repo stays the source of truth.

## Key design notes for reviewers

- `bookings`, `customers`, `dogs`, `payments` have **no direct public RLS
  access at all** — anon/authenticated users can only reach them through the
  `create_booking` RPC (`SECURITY DEFINER`, does its own validation) or as an
  admin (`is_admin()` checks `profiles.role = 'admin'`, itself gated by the
  `admin_allowlist` table + the `handle_new_user` trigger on signup).
- Double-booking is prevented at the database level by the
  `bookings_no_overlap` exclusion constraint (`EXCLUDE USING gist`), not just
  application logic — this holds even under concurrent requests.
- `settings.value` rows are only readable publicly where `is_public = true`;
  sensitive rows (e.g. `bank_details`) stay admin-only even via direct REST
  calls with the anon key.
