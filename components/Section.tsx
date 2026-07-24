import { PawIcon } from "./Logo";
import BotanicalOrnament from "./BotanicalOrnament";

export default function Section({
  eyebrow, title, intro, children, tint = false, id,
}: {
  eyebrow?: string; title: string; intro?: string; children: React.ReactNode; tint?: boolean; id?: string;
}) {
  return (
    <section id={id} className={`storefront-section ${tint ? "storefront-tint bg-lilac-50 py-20" : "py-20"}`}>
      <BotanicalOrnament className="botanical-ornament botanical-section-art" variant={tint ? "corner" : "branch"} />
      <div className="container-px relative z-10">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="eyebrow flex items-center gap-2">
              <PawIcon className="h-3.5 w-3.5 text-gold" /> {eyebrow}
            </p>
          )}
          <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
          {intro && <p className="mt-4 leading-relaxed">{intro}</p>}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
