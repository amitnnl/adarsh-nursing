import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/data";
import { site } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | Narnaul, Mahendergarh`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "nursing college Narnaul",
    "ANM course Mahendergarh",
    "GNM college Haryana",
    "BSc Nursing Narnaul",
    "Adarsh College of Nursing",
    "nursing admission 2026",
  ],
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/images/campus.jpg", width: 768, height: 1024 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#8c1d2f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const siteData = await getSiteSettings();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteShell siteData={siteData}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
