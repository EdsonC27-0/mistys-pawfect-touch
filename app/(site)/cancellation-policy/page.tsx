import { PawIcon } from "@/components/Logo";

export const metadata = { title: "Cancellation Policy — Misty's Pawfect Touch" };

export default function CancellationPolicyPage() {
  return (
    <div className="container-px py-16 sm:py-20">
      <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Legal</p>
      <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Cancellation Policy</h1>
      <p className="mt-4 max-w-2xl text-sm text-inkgrey/60">
        Draft — last updated 2026-08-04. The specific notice period and any cancellation/no-show
        fee below are placeholders; the business owner should confirm real numbers before this page
        is linked from the site.
      </p>

      <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-inkgrey/85">
        <section>
          <h2 className="text-xl text-plum">Rescheduling</h2>
          <p className="mt-2">
            Need to change your appointment time? WhatsApp or email us as early as you can — see{" "}
            <a className="text-plum-mid hover:underline" href="/contact">Contact</a>. We&rsquo;ll do our best to
            find a new slot that works.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Cancelling</h2>
          <p className="mt-2">
            [Draft — to confirm] We ask for at least <strong>24 hours&rsquo; notice</strong> to cancel
            an appointment without charge. Cancellations with less notice, or missed appointments
            without notice, may be subject to a cancellation fee of [amount to be confirmed] to
            cover the reserved appointment slot.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">If we need to cancel</h2>
          <p className="mt-2">
            On the rare occasion we need to cancel or reschedule an appointment (illness, emergency,
            etc.), we&rsquo;ll contact you as soon as possible to find a new time, with no charge to
            you.
          </p>
        </section>
      </div>
    </div>
  );
}
