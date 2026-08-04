# Feature Specification: Production Readiness

**Feature Branch**: `001-production-readiness`

**Created**: 2026-08-04

**Status**: Draft

**Input**: User description: "Assess and close remaining gaps to make Misty's Pawfect Touch production-ready for accepting real bookings and payments."

## Context

This repo is substantially further along than a typical MVP: it already has Supabase Postgres + Auth wired in, RLS-scoped admin roles (via an `admin_allowlist` → `profiles` trigger), a database exclusion constraint that prevents double-booking, and an admin panel covering bookings, calendar, customers, services, and site content. This spec does **not** re-litigate those — it targets what's verified to still be missing or broken.

**Verified during this assessment (2026-08-04)**:

- The project's Supabase database (`mistys-pawfect-touch`, ref `bbwzzmsektsykzgkxjaf`) was found **paused** (a direct connection attempt timed out). A prior commit had added graceful static fallbacks for every public *read* path (services, pricing, reviews, FAQs), which is why the live site still looked fully populated and correct while paused. The booking submission flow (`BookingWizard` → `supabase.rpc("create_booking", ...)`) has no such fallback, so **while paused, the live site could not accept real bookings at all**, despite appearing fully functional. **This has been fixed**: the project was resumed (now `ACTIVE_HEALTHY`) and a real end-to-end test booking was run through the actual `create_booking` RPC, confirmed to write correctly-linked `customers`/`dogs`/`bookings` rows, then cleaned up. FR-001 is resolved.
- The one-time admin setup (allowlist entry + Supabase Auth user) was **already done** prior to this session (`admin_allowlist`: 1 row, `profiles`: 1 row) — FR-004 is resolved, contrary to the original assumption that it was still outstanding.
- The real database content (10 services, 8 settings, 5 reviews, 8 FAQs) is different from — and more complete than — the static fallback constants in `lib/data.ts`, and matches the business owner's original change-request document closely (e.g. a service literally named "Wash & Blow-Dry"). Because the database was paused for the entire earlier part of this engagement, edits made against the fallback/presentation layer did not reach the real data. Two real data bugs were found and fixed directly in this pass:
  - `settings.whatsapp_number` / `phone_display` still held placeholder values (`27000000000` / `+27 00 000 0000`) despite a real number being established elsewhere — customers would have been sent to a fake WhatsApp number. Corrected to `+27 82 531 5141`.
  - The real "Wash & Blow-Dry" service description still said "...premium, coat-friendly products..." — the exact wording flagged in the original document. Corrected to remove "premium".
- `settings.bank_details` still holds placeholder values (`"Your Bank"`, account number `000000000`) — needed for the Manual EFT payment method to be usable. Real banking details were not available during this session.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A customer's booking request actually reaches the business (Priority: P1)

A customer fills out the booking wizard, submits it, and the booking is durably recorded and visible to the business — not silently lost because the underlying database was unreachable.

**Why this priority**: This is verified broken right now. Every other production-readiness concern is moot if the core booking transaction doesn't work.

**Independent Test**: Submit a real booking end-to-end (as a customer would) and confirm it appears in Admin → Bookings within the same session.

**Acceptance Scenarios**:

1. **Given** the database is reachable, **When** a customer submits the booking wizard, **Then** the booking is created and immediately visible in the admin bookings list.
2. **Given** the database is temporarily unreachable at the moment of submission, **When** a customer submits a booking, **Then** they see a clear, honest error telling them to try again or contact the parlour directly — never a silent failure or a false "success" message.
3. **Given** a booking submission fails, **When** the customer retries, **Then** no duplicate or partial booking record is created from the failed attempt.

---

### User Story 2 - The admin account actually works (Priority: P1)

Misty (or whoever runs the parlour) can log into `/admin` with real credentials and see real, current data — not a static demo.

**Why this priority**: Directly blocks operating the business day-to-day. Depends on the same database availability as Story 1, plus the one-time allowlist + Supabase Auth user setup documented in the README.

**Independent Test**: Log into `/admin/login` with the business's real admin email/password and confirm the dashboard loads live counts (not zero/placeholder) and reflects a real booking made in Story 1.

**Acceptance Scenarios**:

1. **Given** the database is reachable and the admin allowlist/user is configured, **When** the business owner logs in, **Then** they reach the dashboard without errors and see real data.
2. **Given** someone who is not on the admin allowlist attempts to log in, **When** they authenticate with a valid Supabase Auth account, **Then** they are still refused admin access (allowlist check, not just "logged in").

---

### User Story 3 - Customers can complete a real online payment (Priority: P2)

A customer who receives a payment link from the admin can actually pay, and the business can see that payment reflected in the booking record.

**Why this priority**: Today this is a fully manual workflow — the admin creates a payment link *outside* the system (in PayFast/Yoco/etc.'s own dashboard) and pastes the resulting URL into the booking record. There is no live payment-provider API integration. This is a real gap, but the business can still operate manually via EFT/cash in the meantime, so it ranks below the booking pipeline itself.

**Independent Test**: As admin, generate a real payment link for a test booking through the actual chosen provider, complete a test payment, and confirm the admin can record the outcome against that booking.

**Acceptance Scenarios**:

1. **Given** the admin pastes a real, provider-issued payment link into a booking, **When** the customer opens it, **Then** they reach a genuine payment checkout page for the correct amount.
2. **Given** a payment succeeds or fails, **When** the admin checks back, **Then** they have a clear, low-friction way to mark the booking's payment status accordingly (manual confirmation is acceptable at launch; automatic webhook confirmation is a future enhancement, not required here).

---

### User Story 4 - The public site shows real, business-accurate information (Priority: P3)

Visitors see the parlour's real contact details, services, pricing, and images — and that content survives the database being temporarily unreachable without silently reverting to placeholder values indefinitely.

**Why this priority**: Important for trust and conversion, and partly already done (phone/WhatsApp number and owner name are confirmed real, per a prior commit). What's unverified is the rest of the README's "replace before launch" checklist, which can't be confirmed while the database is unreachable.

**Independent Test**: Once the database is restored, review the `settings` table and gallery/Instagram content against the README's placeholder checklist and confirm no placeholder values remain.

**Acceptance Scenarios**:

1. **Given** the database is reachable, **When** a visitor loads any public page, **Then** displayed content matches the live `settings`/`services`/`gallery` tables, not the static fallback.
2. **Given** the static fallback is ever served (database briefly unreachable), **When** it renders, **Then** it still reflects real, current business information — not the original placeholder/demo values baked into the fallback constants.
3. **Given** the business updates a price, service, or FAQ in the admin panel, **When** the change is saved, **Then** it appears on the public site within the page's revalidation window (currently 60 seconds for most pages).

---

### Edge Cases

- What happens if the database is unreachable for an extended period (not just a transient blip)? The business needs a way to know this is happening (see FR-005) rather than discovering it only when a customer complains that booking doesn't work.
- What happens if a booking's Supabase RPC call succeeds but the response is lost in transit? The customer should not be told to retry in a way that risks a duplicate booking (see FR-002/FR-003).
- What happens if the static fallback content (services, reviews, FAQs) is ever stale relative to what's actually configured in the database? This should be rare but detectable during content audits.
- What happens if an admin allowlist email is added but the corresponding Supabase Auth user is never created (or vice versa)? Login should fail clearly, not ambiguously.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The production database MUST be reachable from the deployed site at all times during normal operation (not paused/suspended). This is currently failing and must be the first thing fixed.
- **FR-002**: The booking submission flow MUST handle database unavailability with a clear, honest customer-facing error rather than a silent failure or false success.
- **FR-003**: The booking submission flow MUST NOT create duplicate records when a customer retries after a failed or ambiguous submission.
- **FR-004**: System MUST allow the business owner to complete the one-time admin setup (allowlist entry + Supabase Auth user) and successfully log in with real credentials.
- **FR-005**: System MUST give the business (or whoever maintains the site) a way to notice when the database has become unreachable in production, rather than relying on a customer to report a failed booking.
- **FR-006**: System MUST support generating a real, provider-issued payment link for at least one payment provider (PayFast, Yoco, Ozow, or Peach Payments) that the admin pastes into a booking, consistent with the existing manual-link workflow.
- **FR-007**: Admin MUST have a simple way to mark a booking's payment status once a payment is confirmed by the provider (manual confirmation acceptable; no requirement for automatic webhook-based confirmation in this pass).
- **FR-008**: All placeholder business content identified in the README's "Replace placeholders before launch" checklist (WhatsApp/phone, email, address, bank details, pensioner discount, Instagram handle, gallery/Instagram images, owner's note, map embed) MUST be verified against the live `settings`/`gallery`/`instagram_tiles` tables once the database is reachable, and completed where still placeholder.
- **FR-009**: The static fallback content (services, reviews, FAQs) MUST be kept truthful — if it's ever served to a real visitor during a database outage, it should not contradict real business facts (pricing, service names) that have since changed in the live database.
- **FR-010**: System MUST keep all Supabase keys, admin credentials, and any future payment-provider credentials out of source control (existing `.env.local` / Vercel env var pattern already supports this — verify it's actually used for anything beyond the public anon key).

### Key Entities

- **Booking**: Already modeled in the existing schema (`bookings` + related tables) via a database-level exclusion constraint preventing double-booking. This spec doesn't change that model — it ensures the write path to it is reliable.
- **Settings**: Key/value business configuration (`settings` table) — WhatsApp number, address, opening hours, etc. Needs a completeness audit once the database is reachable.
- **Payment record**: Currently a manually-pasted URL + status field on the booking, not a first-class entity synced with a payment provider's API.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A real end-to-end booking (customer submits → appears in admin) succeeds 100% of the time under normal conditions, verified by a live test booking.
- **SC-002**: Zero silent booking failures — every failed submission shows the customer a clear message, verified by deliberately testing against an unreachable/slow database.
- **SC-003**: The business owner can log into `/admin` with real credentials and see real data within 2026-08 (i.e., before this spec is considered complete).
- **SC-004**: A customer can be sent a real, working payment link and the business can confirm payment against the correct booking, verified with one real test transaction.
- **SC-005**: Zero placeholder values remain in the live `settings` table against the README's checklist, confirmed by direct inspection once the database is reachable.
- **SC-006**: The business (or site maintainer) is notified within a reasonable time window if the database becomes unreachable again in the future, rather than finding out from a customer.

## Assumptions

- The immediate blocker — the paused Supabase project — is an infrastructure/billing issue (e.g., free-tier auto-pause from inactivity), not a code defect, and is expected to be resolved by resuming the project before any other work in this spec can be verified end-to-end.
- The existing RLS policies, admin-role model, and double-booking exclusion constraint are sound and out of scope for this pass; this spec only covers what's confirmed missing or broken, not a full re-audit of the schema.
- One payment provider is sufficient for launch (consistent with the earlier decision on the demo scaffold: Yoco, unless the business has since chosen differently) — full multi-provider live integration is not required.
- "Notice when the database is unreachable" (FR-005) can be a lightweight solution (e.g., an uptime check hitting a health endpoint) rather than a full observability stack.
- Static fallback content is an acceptable permanent safety net for brief outages, not something to remove — the requirement is that it stays truthful, not that it goes away.
