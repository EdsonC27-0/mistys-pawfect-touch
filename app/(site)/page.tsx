import Link from "next/link";
import Image from "next/image";
import Section from "@/components/Section";
import Placeholder from "@/components/Placeholder";
import { PawIcon } from "@/components/Logo";
import { getPublicSettings, getServices } from "@/lib/data";
import { supabaseServer } from "@/lib/supabase/server";
import { zar } from "@/lib/format";

export const revalidate = 60;

const benefits = [
  { title: "Gentle handling", text: "Calm, reward-based handling that puts your dog's comfort before the clock — nervous dogs are our speciality." },
  { title: "Premium grooming", text: "Boutique products, breed-aware styling and a finish you'll want to photograph." },
  { title: "All breeds welcome", text: "From teacup to Boerboel — every coat, every temperament, every glorious mix." },
  { title: "Pensioner discounts", text: "A standing discount and extra help at drop-off, because care should be within reach." },
  { title: "Behaviour & nutrition support", text: "Practical, kind guidance that goes beyond the grooming table." },
];

export default async function HomePage() {
  const [settings, services] = await Promise.all([getPublicSettings(), getServices()]);
  const sb = supabaseServer();
  const { data: reviews } = await sb.from("reviews").select("*").eq("is_approved", true).order("sort_order").limit(3);
  const { data: tiles } = await sb.from("instagram_tiles").select("*").eq("active", true).order("sort_order").limit(6);
  const featured = services.filter((s: any) => !s.is_addon).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-plum/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-lavender/25 blur-3xl" />
        <div className="container-px grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <PawIcon className="h-3.5 w-3.5 text-gold" /> Boutique dog parlour · Durbanville
            </p>
            <h1 className="mt-4 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              Premium grooming, gentle care, and a <em className="not-italic text-plum-mid">pawfect touch</em> for every dog.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed">
              At Misty&rsquo;s Pawfect Touch, every dog is groomed at their own pace, in a calm space,
              by people who genuinely adore them. Premium care — never rushed, always kind.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn-primary">Book an appointment</Link>
              <a
                href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent("Hi! I'd like to book a groom for my dog.")}`}
                target="_blank" rel="noopener noreferrer" className="btn-whatsapp"
              >
                WhatsApp us
              </a>
            </div>
            <p className="mt-6 text-sm text-inkgrey/80">{settings.opening_hours_text}</p>
          </div>
          <div className="relative">
            <div className="card relative aspect-square overflow-hidden p-0 bg-plum">
              <Image
                src="/logo-hero.jpeg"
                alt="Misty's Pawfect Touch — Inspired by love. Delivered with care."
                fill
                className="object-cover mix-blend-multiply"
                style={{ filter: "grayscale(1) brightness(1.8) contrast(15)" }}
                priority
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-3xl bg-white px-5 py-4 shadow-lift sm:block">
              <p className="font-display text-2xl text-plum">5.0 ★</p>
              <p className="text-xs text-inkgrey/80">Loved by Durbanville dogs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + benefits */}
      <Section
        tint
        eyebrow="Why dogs love it here"
        title="A parlour that feels like a second home"
        intro="We're a small, warm team with a simple promise: your dog will be handled gently, groomed beautifully, and returned to you happier than they arrived."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="card p-7">
              <PawIcon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 text-lg">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{b.text}</p>
            </div>
          ))}
          <div className="card flex flex-col justify-between bg-gradient-to-br from-plum to-plum-mid p-7 text-white">
            <h3 className="text-lg text-white">Ready for a pamper?</h3>
            <p className="mt-2 text-sm text-white/85">Pick a service and a live time slot — it takes under two minutes.</p>
            <Link href="/book" className="btn mt-6 bg-white text-plum hover:bg-lilac-50">Book now</Link>
          </div>
        </div>
      </Section>

      {/* Services preview */}
      <Section
        eyebrow="Our services"
        title="From a quick wash to the full works"
        intro="Every service is delivered with the same patience and polish. Prices shown from the smallest size."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s: any) => {
            const min = (s.service_prices ?? []).reduce(
              (m: number | null, p: any) => (m === null || Number(p.price) < m ? Number(p.price) : m), null);
            return (
              <div key={s.id} className="card flex flex-col p-7">
                <h3 className="text-lg">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed">{s.short_description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-plum-mid">{min !== null ? `from ${zar(min)}` : "On request"}</span>
                  <Link href={`/book?service=${s.slug}`} className="btn-ghost !px-4 !py-2 text-xs">Book this service</Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="btn-ghost">See all services</Link>
        </div>
      </Section>

      {/* Reviews */}
      <Section tint eyebrow="Wagging endorsements" title="What our humans say">
        <div className="grid gap-6 lg:grid-cols-3">
          {(reviews ?? []).map((r) => (
            <figure key={r.id} className="card p-7">
              <div className="text-gold" aria-label={`${r.rating} out of 5 stars`}>{"★".repeat(r.rating)}</div>
              <blockquote className="mt-3 text-sm leading-relaxed">&ldquo;{r.content}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-plum">
                {r.author_name}{r.dog_name && <span className="font-normal text-inkgrey/70"> · {r.dog_name}&rsquo;s human</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/reviews" className="btn-ghost">Read more reviews</Link>
        </div>
      </Section>

      {/* Instagram strip */}
      <Section
        eyebrow={`@${settings.instagram_username}`}
        title="Fresh from the parlour"
        intro="Follow along for transformations, happy faces and the occasional zoomie."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(tiles ?? []).map((t) => (
            <a key={t.id} href={t.link_url || `https://instagram.com/${settings.instagram_username}`} target="_blank" rel="noopener noreferrer" className="group">
              {t.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.image_url} alt={t.caption} className="aspect-square w-full rounded-2xl object-cover transition-transform group-hover:scale-[1.02]" />
              ) : (
                <Placeholder label={t.caption} ratio="aspect-square" className="!rounded-2xl" />
              )}
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
