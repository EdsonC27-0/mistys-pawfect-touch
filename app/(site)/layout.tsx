import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getPublicSettings } from "@/lib/data";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppFloat number={String(settings.whatsapp_number)} />
    </>
  );
}
