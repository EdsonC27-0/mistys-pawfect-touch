import { supabaseServer } from "./supabase/server";

// ── Static fallback content ──────────────────────────────────────────────────
// Rendered when Supabase is paused / has no data yet.

export const STATIC_SERVICES: any[] = [
  {
    id: "static-bath-brush",
    slug: "bath-brush",
    name: "Bath & Brush",
    category: "grooming",
    short_description: "A thorough shampoo, blow-dry and brush-out — perfect for keeping your dog fresh between full grooms.",
    long_description: "Includes ear wipe, nail filing and a spritz of dog-safe perfume. Great for dogs who just need a freshen up.",
    duration_minutes: 60,
    is_addon: false,
    active: true,
    sort_order: 1,
    service_prices: [
      { id: "p1", size: "small",  price: 350, label: "Small" },
      { id: "p2", size: "medium", price: 450, label: "Medium" },
      { id: "p3", size: "large",  price: 550, label: "Large" },
      { id: "p4", size: "xlarge", price: 650, label: "Extra-large" },
    ],
  },
  {
    id: "static-full-groom",
    slug: "full-groom",
    name: "Full Groom",
    category: "grooming",
    short_description: "The complete package — wash, dry, breed-specific cut, nail trim, ear clean and professional finishing.",
    long_description: "Our signature service. We take as long as your dog needs. Includes blow-dry, scissor finish and a deodorant spritz.",
    duration_minutes: 120,
    is_addon: false,
    active: true,
    sort_order: 2,
    service_prices: [
      { id: "p5", size: "small",  price: 500,  label: "Small" },
      { id: "p6", size: "medium", price: 650,  label: "Medium" },
      { id: "p7", size: "large",  price: 800,  label: "Large" },
      { id: "p8", size: "xlarge", price: 1000, label: "Extra-large" },
    ],
  },
  {
    id: "static-puppy-grooming",
    slug: "puppy-grooming",
    name: "Puppy Introduction",
    category: "grooming",
    short_description: "A calm, gentle first groom designed to make puppies feel positive about the whole experience.",
    long_description: "Short sessions, slow handling and lots of reassurance. The focus is confidence-building, not a perfect cut. Puppies under 6 months.",
    duration_minutes: 45,
    is_addon: false,
    active: true,
    sort_order: 3,
    service_prices: [
      { id: "p9", size: "small", price: 350, label: "All puppies" },
    ],
  },
  {
    id: "static-nail-clip",
    slug: "nail-clip",
    name: "Nail Clip",
    category: "care",
    short_description: "Quick, stress-free nail trimming — standalone or added to any groom.",
    long_description: "We use professional-grade tools and take care around the quick. Great for dogs who need regular maintenance between grooms.",
    duration_minutes: 15,
    is_addon: true,
    active: true,
    sort_order: 4,
    service_prices: [
      { id: "p10", size: null, price: 120, label: "Per session" },
    ],
  },
  {
    id: "static-ear-clean",
    slug: "ear-clean",
    name: "Ear Clean",
    category: "care",
    short_description: "Gentle ear cleaning with veterinary-approved solution to prevent build-up and infection.",
    long_description: "Especially important for floppy-eared breeds. Can be done as a standalone visit or added to any appointment.",
    duration_minutes: 10,
    is_addon: true,
    active: true,
    sort_order: 5,
    service_prices: [
      { id: "p11", size: null, price: 80, label: "Per session" },
    ],
  },
  {
    id: "static-behaviour",
    slug: "behaviour-consult",
    name: "Behaviour Guidance",
    category: "support",
    short_description: "Practical, reward-based guidance for everyday behaviour challenges — anxiety, reactivity, recall and more.",
    long_description: "One-on-one sessions with our behaviour-aware groomer. We focus on practical, kind strategies you can use at home every day.",
    duration_minutes: 45,
    is_addon: false,
    active: true,
    sort_order: 6,
    service_prices: [
      { id: "p12", size: null, price: 350, label: "Per session" },
    ],
  },
  {
    id: "static-nutrition",
    slug: "nutrition-consult",
    name: "Nutrition Guidance",
    category: "support",
    short_description: "Honest, breed-specific advice on feeding, coat health and supplements — based on real experience.",
    long_description: "Not a vet consultation, but practical guidance from groomers who've seen the difference good nutrition makes to coat and skin health.",
    duration_minutes: 30,
    is_addon: false,
    active: true,
    sort_order: 7,
    service_prices: [
      { id: "p13", size: null, price: 250, label: "Per session" },
    ],
  },
];

export const STATIC_REVIEWS: any[] = [
  { id: "sr1", author_name: "Sarah M.", dog_name: "Biscuit", rating: 5, content: "Biscuit came home absolutely beautiful — and, for the first time ever, actually seemed happy after his groom. The team took their time and made him feel completely safe.", sort_order: 1, is_approved: true },
  { id: "sr2", author_name: "Johan van der Berg", dog_name: "Luna", rating: 5, content: "Luna is a nervous girl and every other parlour has stressed her out. At Misty's she was calm, smelled amazing and practically skipped to the car. We've found our permanent groomer.", sort_order: 2, is_approved: true },
  { id: "sr3", author_name: "Thandi K.", dog_name: "Max", rating: 5, content: "Professional, warm and genuinely passionate about dogs. The pensioner discount is such a lovely touch. Max always comes back looking like he's stepped off a photoshoot.", sort_order: 3, is_approved: true },
  { id: "sr4", author_name: "Liezel H.", dog_name: "Mochi", rating: 5, content: "I was worried about leaving my anxious Bichon but they were so patient and reassuring. She came home happy and her coat was absolutely perfect. Can't recommend highly enough!", sort_order: 4, is_approved: true },
  { id: "sr5", author_name: "Pieter S.", dog_name: "Bruno", rating: 5, content: "Great communication, a calm environment and an excellent result. Bruno is a big boy and not always easy to handle — they managed him brilliantly and he loved every minute.", sort_order: 5, is_approved: true },
];

export const STATIC_FAQS: any[] = [
  { id: "f1", question: "Do I need to make an appointment?", answer: "Yes — all grooming is by appointment only so we can give your dog our full attention. You can book online anytime or WhatsApp us during business hours.", sort_order: 1, active: true },
  { id: "f2", question: "How long does a groom take?", answer: "A bath & brush takes approximately 60 minutes; a full groom 90–120 minutes. Larger dogs or heavy coats may take a little longer. We'll always give you an estimated pick-up time at drop-off.", sort_order: 2, active: true },
  { id: "f3", question: "My dog is anxious — can you still help?", answer: "Absolutely — anxious and reactive dogs are our speciality. We use calm, reward-based handling, break sessions into smaller steps where needed, and will never rush or force your dog. Their comfort always comes first.", sort_order: 3, active: true },
  { id: "f4", question: "What breeds do you groom?", answer: "All breeds and mixes are welcome — from Chihuahuas to Boerboels. We're experienced with curly, double, wire and drop coats and happy to discuss your dog's specific needs.", sort_order: 4, active: true },
  { id: "f5", question: "Do you offer a pensioner discount?", answer: "Yes — pensioners receive 10% off all grooming services, plus extra assistance at drop-off and collection. Simply tick the pensioner option when booking.", sort_order: 5, active: true },
  { id: "f6", question: "How do I pay?", answer: "We offer a secure payment link (PayFast / Yoco), manual EFT, or card and cash at the parlour on the day. You choose your preferred method when you book.", sort_order: 6, active: true },
  { id: "f7", question: "What should I bring?", answer: "Just your dog! If they're on medication or have specific dietary needs, mention it in the booking notes. We have everything else covered.", sort_order: 7, active: true },
  { id: "f8", question: "Do you board dogs overnight?", answer: "Not at this stage — we focus entirely on day grooming so every dog gets our full, undivided attention during their visit.", sort_order: 8, active: true },
];

// ── Data fetchers ────────────────────────────────────────────────────────────

export async function getPublicSettings(): Promise<Record<string, any>> {
  const defaults: Record<string, any> = {
    whatsapp_number: "27000000000",
    phone_display: "+27 00 000 0000",
    email_address: "hello@mistyspawfecttouch.co.za",
    address: "Durbanville, Cape Town, Western Cape",
    opening_hours_text: "Mon–Fri 08:30–17:00 · Sat 08:30–13:00",
    instagram_username: "mistyspawfecttouch",
    pensioner_discount_percent: 10,
  };
  try {
    const sb = supabaseServer();
    const { data } = await sb.from("settings").select("key,value").eq("is_public", true);
    (data ?? []).forEach((r) => (defaults[r.key] = r.value));
  } catch {}
  return defaults;
}

export async function getServices() {
  try {
    const sb = supabaseServer();
    const { data } = await sb
      .from("services")
      .select("*, service_prices(*)")
      .eq("active", true)
      .order("sort_order");
    if (data && data.length > 0) return data;
  } catch {}
  return STATIC_SERVICES;
}

export async function getReviews(limit?: number) {
  try {
    const sb = supabaseServer();
    let q = sb.from("reviews").select("*").eq("is_approved", true).order("sort_order");
    if (limit) q = q.limit(limit);
    const { data } = await q;
    if (data && data.length > 0) return data;
  } catch {}
  return limit ? STATIC_REVIEWS.slice(0, limit) : STATIC_REVIEWS;
}

export async function getFaqs() {
  try {
    const sb = supabaseServer();
    const { data } = await sb.from("faqs").select("*").eq("active", true).order("sort_order");
    if (data && data.length > 0) return data;
  } catch {}
  return STATIC_FAQS;
}
