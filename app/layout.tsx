import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Njoms Landscaping Services | Professional Garden & Lawn Care",
  description:
    "Garden design, lawn installation and care, tree pruning, hedge trimming, paving and seasonal cleanups. Get an instant estimate and book your quote on WhatsApp with Njoms Landscaping Services.",
  keywords: [
    "landscaping",
    "garden services",
    "lawn care",
    "hedge trimming",
    "paving",
    "South Africa",
    "Njoms Landscaping",
  ],
  openGraph: {
    title: "Njoms Landscaping Services | Professional Garden & Lawn Care",
    description:
      "Neat lawns, sharp hedges and gardens that grow on you. Instant WhatsApp quotes.",
    type: "website",
    locale: "en_ZA",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#16331F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
