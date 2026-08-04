import { PawIcon } from "@/components/Logo";
import EnquiryForm from "@/components/EnquiryForm";
import { getPublicSettings } from "@/lib/data";

export const metadata = { title: "Contact — Misty's Pawfect Touch" };
export const revalidate = 60;

export default async function ContactPage() {
  const s = await getPublicSettings();
  return (
    <div className="container-px py-16 sm:py-20">
      <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Contact us</p>
      <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">We&rsquo;d love to hear from you</h1>
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card space-y-4 p-7 text-sm">
            <p><span className="label !mb-0.5">WhatsApp / phone</span><a className="text-plum-mid hover:underline" href={`tel:${s.whatsapp_number}`}>{s.phone_display}</a></p>
            <p><span className="label !mb-0.5">Email</span><a className="text-plum-mid hover:underline" href={`mailto:${s.email_address}`}>{s.email_address}</a></p>
            <p><span className="label !mb-0.5">Where to find us</span>{s.address}</p>
            <p><span className="label !mb-0.5">Opening hours</span>{s.opening_hours_text}</p>
            <a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">Chat on WhatsApp</a>
          </div>
          <div className="card overflow-hidden">
            {/* TODO: swap for the exact street address embed once confirmed by the business owner. */}
            <iframe
              title="Map — Durbanville, Cape Town"
              src="https://www.google.com/maps?q=Durbanville,+Cape+Town,+Western+Cape&output=embed"
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-2xl">Send us an enquiry</h2>
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}
