import Link from "next/link";
import Section from "@/components/Section";
import { PawIcon } from "@/components/Logo";
import { getServices } from "@/lib/data";
import { zar } from "@/lib/format";

export const metadata = { title: "Services — Misty's Pawfect Touch" };
export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();
  const groups: [string, string][] = [
    ["grooming", "Grooming"],
    ["care", "Care packages"],
    ["support", "Behaviour & nutrition"],
  ];
  return (
    <>
      <section className="container-px py-16 sm:py-20">
        <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Our services</p>
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Every coat, cared for beautifully</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">
          From a quick wash and blow-dry to breed-standard styling, behaviour support and nutrition
          guidance — choose what your dog needs, and we&rsquo;ll handle the rest with a gentle touch.
        </p>
      </section>
      {groups.map(([key, label], i) => {
        const items = services.filter((s: any) => s.category === key);
        if (!items.length) return null;
        return (
          <Section key={key} tint={i % 2 === 0} title={label} eyebrow={`${items.length} service${items.length > 1 ? "s" : ""}`}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s: any) => {
                const min = (s.service_prices ?? []).reduce(
                  (m: number | null, p: any) => (m === null || Number(p.price) < m ? Number(p.price) : m), null);
                return (
                  <div key={s.id} className="card flex flex-col p-7">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg">{s.name}</h3>
                      {s.is_addon && <span className="rounded-full bg-lilac-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-plum-mid">Add-on</span>}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{s.short_description}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-inkgrey/75">{s.long_description}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-lilac-100 pt-4">
                      <div className="text-sm">
                        <span className="font-semibold text-plum-mid">{min !== null ? `from ${zar(min)}` : "On request"}</span>
                        <span className="text-inkgrey/60"> · ±{s.duration_minutes} min</span>
                      </div>
                      <Link href={`/book?service=${s.slug}`} className="btn-primary !px-4 !py-2 text-xs">Book this service</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        );
      })}
    </>
  );
}
