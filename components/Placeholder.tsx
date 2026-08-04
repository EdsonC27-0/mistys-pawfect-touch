import { LabradorMark } from "./Logo";

/** Elegant image placeholder used until real photography is added. */
export default function Placeholder({ label, ratio = "aspect-[4/3]", className = "" }: { label?: string; ratio?: string; className?: string }) {
  return (
    <div className={`relative ${ratio} w-full overflow-hidden rounded-3xl placeholder-gradient ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-plum/50">
        <LabradorMark className="h-12 w-12" />
        {label && <span className="px-4 text-center text-xs font-medium uppercase tracking-widest">{label}</span>}
      </div>
    </div>
  );
}
