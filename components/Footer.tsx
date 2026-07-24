import Link from "next/link";
import Logo, { PawIcon } from "./Logo";
import BotanicalOrnament from "./BotanicalOrnament";

export default function Footer({ settings }: { settings: Record<string, any> }) {
  return (
    <footer className="storefront-footer mt-24 border-t border-lilac-100 bg-lilac-50">
      <BotanicalOrnament className="botanical-ornament botanical-footer-art" variant="corner" />
      <div className="container-px relative z-10 grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Premium grooming, gentle care, and a pawfect touch for every dog in Durbanville, Cape Town.
          </p>
        </div>
        <div>
          <h3 className="text-base">Visit us</h3>
          <p className="mt-3 text-sm leading-relaxed">
            {settings.address}<br />
            {settings.opening_hours_text}<br />
            <a className="text-plum-mid hover:underline" href={`tel:${settings.whatsapp_number}`}>{settings.phone_display}</a><br />
            <a className="text-plum-mid hover:underline" href={`mailto:${settings.email_address}`}>{settings.email_address}</a>
          </p>
        </div>
        <div>
          <h3 className="text-base">Quick links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-plum" href="/book">Book an appointment</Link></li>
            <li><Link className="hover:text-plum" href="/pricing">Packages &amp; pricing</Link></li>
            <li><Link className="hover:text-plum" href="/faq">FAQ</Link></li>
            <li><Link className="hover:text-plum" href="/admin">Parlour admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 border-t border-lilac-100 py-5 text-center text-xs text-inkgrey/70">
        <span className="inline-flex items-center gap-1.5">
          © {new Date().getFullYear()} Misty&rsquo;s Pawfect Touch <PawIcon className="h-3 w-3 text-gold" /> Durbanville, Western Cape
        </span>
      </div>
    </footer>
  );
}
