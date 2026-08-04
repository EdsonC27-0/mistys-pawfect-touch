import Section from "@/components/Section";
import Placeholder from "@/components/Placeholder";
import { PawIcon } from "@/components/Logo";

export const metadata = { title: "About — Misty's Pawfect Touch" };
export const revalidate = 3600;

export default function AboutPage() {
  return (
    <>
      <section className="container-px py-16 sm:py-20">
        <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> About us</p>
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">A warm, welcoming parlour built on trust</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">
          Misty&rsquo;s Pawfect Touch is a boutique dog parlour in Durbanville, Cape Town, devoted to
          grooming, comfort and canine wellness. We believe a groom should feel like care, not a chore —
          which is why every appointment is built around behaviour-conscious handling, unhurried pacing,
          and genuine affection for the dog on our table.
        </p>
      </section>

      <Section tint eyebrow="How we work" title="Comfort first, always">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { t: "We read the dog, not the clock", d: "Appointments are paced to your dog's comfort. Breaks, slow introductions and quiet reassurance are part of every groom." },
            { t: "Behaviour-conscious handling", d: "Our handling is reward-based and force-free. Anxious or reactive dogs get extra time, softer sounds and a calmer room." },
            { t: "Wellness beyond the groom", d: "Coat, skin, ears, nails — and honest advice on behaviour and nutrition when you want it. We care about the whole dog." },
          ].map((x) => (
            <div key={x.t} className="card p-7">
              <h3 className="text-lg">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Owner's note" title="A note from the owner">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Placeholder label="Owner portrait with Misty" />
          <div className="card relative p-8 sm:p-10">
            <span className="absolute -top-5 left-8 font-display text-7xl text-lavender">&ldquo;</span>
            <p className="leading-relaxed">
              Misty&rsquo;s Pawfect Touch began with a Labrador named Misty — a gentle old soul who hated
              the noise and rush of busy grooming salons. I promised her something better: a quiet room,
              soft hands and all the time she needed. That promise became this parlour.
            </p>
            <p className="mt-4 leading-relaxed">
              Today, every dog who walks through our door gets the Misty treatment. We learn their names,
              their quirks, their favourite scratch spots. We groom them the way we&rsquo;d want our own
              dogs groomed — gently, beautifully, and with a little extra love.
            </p>
            <p className="mt-6 font-display text-lg text-plum">— Thercia</p>
          </div>
        </div>
      </Section>
    </>
  );
}
