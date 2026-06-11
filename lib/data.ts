import { supabaseServer } from "./supabase/server";

export async function getPublicSettings(): Promise<Record<string, any>> {
  const sb = supabaseServer();
  const { data } = await sb.from("settings").select("key,value").eq("is_public", true);
  const out: Record<string, any> = {
    whatsapp_number: "27000000000",
    phone_display: "+27 00 000 0000",
    email_address: "hello@mistyspawfecttouch.co.za",
    address: "Durbanville, Cape Town, Western Cape",
    opening_hours_text: "Mon–Fri 08:30–17:00 · Sat 08:30–13:00",
    instagram_username: "mistyspawfecttouch",
    pensioner_discount_percent: 10,
  };
  (data ?? []).forEach((r) => (out[r.key] = r.value));
  return out;
}

export async function getServices() {
  const sb = supabaseServer();
  const { data } = await sb
    .from("services")
    .select("*, service_prices(*)")
    .eq("active", true)
    .order("sort_order");
  return data ?? [];
}
