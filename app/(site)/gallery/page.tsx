import Section from "@/components/Section";
import Placeholder from "@/components/Placeholder";
import { PawIcon } from "@/components/Logo";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = { title: "Gallery — Misty's Pawfect Touch" };
export const revalidate = 60;

const CATEGORIES: Record<string, string> = {
  groomed: "Freshly groomed",
  "before-after": "Before & after",
  parlour: "Our parlour",
  happy: "Happy dogs",
  branding: "Misty moments",
};

export default async function GalleryPage() {
  const sb = supabaseServer();
  const { data } = await sb.from("gallery_images").select("*").eq("active", true).order("sort_order");
  return (
    <>
      <section className="container-px py-16 sm:py-20">
        <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Gallery</p>
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Proof, in wagging tails</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">
          Transformations, happy faces and quiet moments from the parlour. Real photographs coming soon —
          these elegant placeholders show where they&rsquo;ll live.
        </p>
      </section>
      <div className="container-px grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((g, i) => (
          <figure key={g.id} className={i % 5 === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
            {g.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g.image_url} alt={g.title} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-soft" />
            ) : (
              <Placeholder label={g.title} />
            )}
            <figcaption className="mt-3 flex items-center justify-between px-1 text-sm">
              <span className="font-semibold text-plum">{g.title}</span>
              <span className="rounded-full bg-lilac-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-plum-mid">
                {CATEGORIES[g.category] ?? g.category}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
