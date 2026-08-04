import Link from "next/link";
import Section from "@/components/Section";
import { PawIcon } from "@/components/Logo";
import { getServices, getPublicSettings } from "@/lib/data";
import { zar, SIZES } from "@/lib/format";

export const metadata = { title: "Packages & Pricing — Misty's Pawfect Touch" };
export const revalidate = 60;

export default async function PricingPage() {
  const [services, settings] = await Promise.all([getServices(), getPublicSettings()]);
  const sized = services.filter((s: any) => (s.service_prices ?? []).some((p: any) => p.size));
  const addons = services.filter((s: any) => (s.service_prices ?? []).every((p: any) => !p.size) && (s.service_prices ?? []).length);
  const sizeCols = SIZES.filter((s) => s.value !== "puppy");

  return (
    <>
      <section className="container-px py-16 sm:py-20">
        <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Packages &amp; pricing</p>
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Honest pricing, sized to your dog</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">
          Pricing is based on your dog&rsquo;s size. Pensioners receive a {String(settings.pensioner_discount_percent)}% discount
          on grooming services — just tick the pensioner option when booking.
        </p>
      </section>

      <Section tint title="Grooming by size" eyebrow="Per appointment">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-lilac-100 text-left">
                <th className="px-6 py-4 font-display text-base text-plum">Service</th>
                {sizeCols.map((s) => (
                  <th key={s.value} className="px-4 py-4 text-plum">
                    {s.label}<span className="block text-[10px] font-normal text-inkgrey/60">{s.hint}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sized.map((svc: any) => (
                <tr key={svc.id} className="border-b border-lilac-100 last:border-0 hover:bg-lilac-50/60">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-plum">{svc.name}</span>
                    {svc.slug === "puppy-grooming" && <span className="block text-xs text-inkgrey/60">Puppies under 6 months</span>}
                  </td>
                  {svc.slug === "puppy-grooming" ? (
                    <td colSpan={4} className="px-4 py-4 font-semibold text-plum-mid">
                      {zar(Number(svc.service_prices?.[0]?.price))} <span className="font-normal text-inkgrey/60">— one gentle price, all sizes of small</span>
                    </td>
                  ) : (
                    sizeCols.map((s) => {
                      const p = (svc.service_prices ?? []).find((x: any) => x.size === s.value);
                      return <td key={s.value} className="px-4 py-4 font-semibold text-plum-mid">{p ? zar(Number(p.price)) : "—"}</td>;
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 max-w-2xl text-sm italic text-inkgrey/75">
          Final pricing may vary depending on coat condition, temperament, size and service requirements.
          We&rsquo;ll always confirm with you before we begin.
        </p>
      </Section>

      <Section title="Add-ons & consultations" eyebrow="A la carte">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {addons.map((svc: any) => (
            <div key={svc.id} className="card p-6">
              <h3 className="text-base">{svc.name}</h3>
              <p className="mt-2 font-display text-2xl text-plum-mid">{zar(Number(svc.service_prices?.[0]?.price))}</p>
              <p className="mt-1 text-xs text-inkgrey/60">{svc.service_prices?.[0]?.label}</p>
            </div>
          ))}
          <div className="card panel-gradient p-6 text-white sm:col-span-2 lg:col-span-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg text-white">Pensioner discount — {String(settings.pensioner_discount_percent)}% off grooming</h3>
                <p className="mt-1 text-sm text-white/85">Plus extra help at drop-off and collection. Because every companion deserves the best.</p>
              </div>
              <Link href="/book" className="btn bg-white text-plum hover:bg-lilac-50">Book with discount</Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
