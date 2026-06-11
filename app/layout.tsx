import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Misty's Pawfect Touch — Premium Dog Parlour in Durbanville, Cape Town",
  description:
    "Premium grooming, gentle care, and a pawfect touch for every dog. Boutique dog parlour in Durbanville offering grooming, behaviour and nutrition support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
