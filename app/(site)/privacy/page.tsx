import { PawIcon } from "@/components/Logo";

export const metadata = { title: "Privacy Policy — Misty's Pawfect Touch" };

export default function PrivacyPage() {
  return (
    <div className="container-px py-16 sm:py-20">
      <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Legal</p>
      <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 max-w-2xl text-sm text-inkgrey/60">
        Draft — last updated 2026-08-04. This has not yet been reviewed by a lawyer and should be
        checked for accuracy and POPIA (Protection of Personal Information Act) compliance before
        this page is linked from the site or relied on as the business&rsquo;s actual policy.
      </p>

      <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-inkgrey/85">
        <section>
          <h2 className="text-xl text-plum">What we collect</h2>
          <p className="mt-2">
            When you book an appointment, contact us, or leave a review, we collect: your name,
            email address and/or phone number, your dog&rsquo;s name, breed and size, and any notes
            you choose to share — including behaviour or medical notes about your dog where you
            provide them. We do not collect or store payment card details ourselves; online
            payments are handled by the payment provider you choose (e.g. PayFast, Yoco), not by us.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Why we collect it</h2>
          <p className="mt-2">
            To create and manage your booking, contact you about your appointment, apply the
            pensioner discount where requested, and provide safe, informed care for your dog
            (behaviour and medical notes help our groomers handle your dog appropriately). Review
            submissions are used, with your name, to display genuine customer feedback on the site
            once approved.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Who can see it</h2>
          <p className="mt-2">
            Your booking and contact details are visible only to Misty&rsquo;s Pawfect Touch admin
            staff. They are not sold or shared with third parties, other than the payment provider
            you choose to complete a transaction, and our hosting/database provider (Vercel,
            Supabase) who process it on our behalf under their own security and data-protection
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">How long we keep it</h2>
          <p className="mt-2">
            [Draft — retention period to be confirmed by the business owner.] We intend to retain
            booking and customer records for as long as needed to run the business and meet any
            legal/tax obligations, and to delete or anonymise data on request where we&rsquo;re not
            required to keep it.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Your rights</h2>
          <p className="mt-2">
            Under POPIA, you can ask us what personal information we hold about you, ask us to
            correct it, or ask us to delete it (subject to legal retention requirements). To make
            a request, contact us using the details on our{" "}
            <a className="text-plum-mid hover:underline" href="/contact">Contact page</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-plum">Reviews</h2>
          <p className="mt-2">
            If you submit a review, your name and (if provided) your dog&rsquo;s name are displayed
            publicly once approved by our team. Reviews are moderated before appearing on the site.
          </p>
        </section>
      </div>
    </div>
  );
}
