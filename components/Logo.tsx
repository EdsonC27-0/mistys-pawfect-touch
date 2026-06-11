export function LabradorMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Labrador head — side profile facing right, matching logo */}
      {/* Main head + muzzle contour */}
      <path
        d="M17 52 C14 46 12 38 13 29 C14 19 19 11 27 9 C33 7 40 9 46 15 C52 20 55 27 53 34 C51 39 46 42 39 43 C33 44 27 46 23 50 C21 53 19 57 17 59"
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Floppy ear */}
      <path
        d="M17 14 C11 16 7 24 9 34 C10 39 14 41 17 40 C20 39 20 32 18 24 C17 19 17 16 17 14Z"
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Eye */}
      <circle cx="38" cy="19" r="2.2" fill="currentColor" />
      {/* Nose */}
      <ellipse cx="53" cy="29" rx="1.8" ry="1.4" fill="currentColor" />
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
