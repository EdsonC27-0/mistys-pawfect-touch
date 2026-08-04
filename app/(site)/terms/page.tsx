import { PawIcon } from "@/components/Logo";

export const metadata = { title: "Terms of Service — Misty's Pawfect Touch" };

export default function TermsPage() {
  return (
    <div className="container-px py-16 sm:py-20">
      <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Legal</p>
      <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Terms of Service</h1>
      <p className="mt-4 max-w-2xl text-sm text-inkgrey/60">
        Draft — last updated 2026-08-04. This has not yet been reviewed by a lawyer and should be
        checked before this page is linked from the site or relied on as binding terms.
      </p>

      <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-inkgrey/85">
        <section>
          <h2 className="text-xl text-plum">Bookings</h2>
          <p className="mt-2">
            A booking made through this site is a request, not a confirmed appointment, until we
            approve it. Prices shown are estimates based on the information you provide (dog size,
            service selected); your final price may vary depending on coat condition, temperament,
            and time taken, and will be confirmed with you before or at your appointment.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Payment</h2>
          <p className="mt-2">
            Payment can be made via a payment link we send you, manual EFT, or in person at the
            parlour (card or cash), depending on what&rsquo;s available and what you choose at
            booking. Payment links are provided by third-party payment processors; we are not
            responsible for outages or issues on their end, though we&rsquo;ll help resolve any
            payment problem with your booking.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Your dog&rsquo;s wellbeing</h2>
          <p className="mt-2">
            Please tell us honestly about your dog&rsquo;s temperament, medical conditions, and any
            handling sensitivities when booking. We reserve the right to pause, adapt, or decline a
            groom if we believe continuing would cause your dog distress or isn&rsquo;t safe for
            your dog or our staff, and we&rsquo;ll always try to contact you first.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Cancellations</h2>
          <p className="mt-2">
            See our <a className="text-plum-mid hover:underline" href="/cancellation-policy">Cancellation Policy</a> for
            details on rescheduling and cancelling appointments.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Changes to these terms</h2>
          <p className="mt-2">
            We may update these terms from time to time as the business grows; the current version
            will always be available on this page.
          </p>
        </section>
      </div>
    </div>
  );
}
