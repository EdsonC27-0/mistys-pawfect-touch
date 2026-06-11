export function LabradorMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Minimal Labrador head outline */}
      <path
        d="M14 38c-2-7 0-15 5-20 3-3 6-4 9-4h8c3 0 6 1 9 4 5 5 7 13 5 20l-2 8c-1 4-4 7-8 8l-4 1h-8l-4-1c-4-1-7-4-8-8l-2-8Z"
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M19 16c-4 1-7 5-7 10 0 3 1 5 2 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M45 16c4 1 7 5 7 10 0 3-1 5-2 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="25" cy="33" r="1.8" fill="currentColor" />
      <circle cx="39" cy="33" r="1.8" fill="currentColor" />
      <path d="M32 40v3m0 0c-2 3-5 3-6 1m6-1c2 3 5 3 6 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 40h6c1 0 1.5-1 1-2l-2.4-2.6a2 2 0 0 0-3.2 0L28 38c-.5 1 0 2 1 2Z" fill="currentColor" />
    </svg>
  );
}

export function PawIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <ellipse cx="7" cy="8.5" rx="2" ry="2.6" />
      <ellipse cx="12" cy="6.5" rx="2" ry="2.6" />
      <ellipse cx="17" cy="8.5" rx="2" ry="2.6" />
      <path d="M12 11c-3.2 0-6 2.6-6 5.3 0 1.8 1.4 2.7 3 2.7 1.1 0 2-.4 3-.4s1.9.4 3 .4c1.6 0 3-.9 3-2.7 0-2.7-2.8-5.3-6-5.3Z" />
    </svg>
  );
}

export default function Logo({ stacked = false }: { stacked?: boolean }) {
  return (
    <span className={`flex items-center gap-3 text-plum ${stacked ? "flex-col text-center" : ""}`}>
      <LabradorMark className={stacked ? "h-16 w-16" : "h-10 w-10"} />
      <span className="leading-tight">
        <span className={`block font-display font-semibold ${stacked ? "text-2xl" : "text-lg"}`}>
          Misty&rsquo;s Pawfect Touch
        </span>
        <span className="block text-[10px] font-body uppercase tracking-[0.28em] text-gold">
          Dog Parlour · Durbanville
        </span>
      </span>
    </span>
  );
}
