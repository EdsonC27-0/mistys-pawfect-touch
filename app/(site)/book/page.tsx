import BookingWizard from "@/components/BookingWizard";
import { PawIcon } from "@/components/Logo";
import { getServices, getPublicSettings } from "@/lib/data";

export const metadata = { title: "Book an Appointment — Misty's Pawfect Touch" };
export const dynamic = "force-dynamic";

export default async function BookPage({ searchParams }: { searchParams: { service?: string } }) {
  const [services, settings] = await Promise.all([getServices(), getPublicSettings()]);
  return (
    <div className="container-px py-16 sm:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="eyebrow flex items-center justify-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Book an appointment</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">Let&rsquo;s find the pawfect time</h1>
        <p className="mt-4 leading-relaxed">Choose a service, pick a live time slot, and tell us about your dog. We confirm every booking personally.</p>
      </div>
      <BookingWizard
        services={services as any}
        initialService={searchParams.service}
        whatsapp={String(settings.whatsapp_number)}
      />
    </div>
  );
}
