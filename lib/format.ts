export const zar = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(Number(n));

export const fmtTime = (t: string) => t.slice(0, 5);

export const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export const SIZES = [
  { value: "small", label: "Small", hint: "Under 10 kg" },
  { value: "medium", label: "Medium", hint: "10–25 kg" },
  { value: "large", label: "Large", hint: "25–40 kg" },
  { value: "xlarge", label: "Extra-large", hint: "Over 40 kg" },
  { value: "puppy", label: "Puppy", hint: "Under 6 months" },
] as const;
