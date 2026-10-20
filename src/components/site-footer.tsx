import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { courses, nav, site, telHref } from "@/lib/site";
import type { SiteData } from "@/lib/data";

export function SiteFooter({
  siteData,
  logo,
  siteName,
  tagline,
}: {
  siteData?: SiteData;
  logo?: string;
  siteName?: string;
  tagline?: string;
} = {}) {
  const name = siteData?.name || siteName || site.name;
  const tag = siteData?.tagline || tagline || site.tagline;
  const address = siteData?.address || site.address;
  const phones = siteData?.phones?.length ? siteData.phones : site.phones;
  const email = siteData?.email || site.email;
  const coords = siteData?.coords || site.coords;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;

  return (
    <footer className="relative mt-16 bg-navy-950 text-white/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-full bg-white flex items-center justify-center">
              <Image
                src={logo || siteData?.logo || site.logo || "/images/logo-mark.png"}
                alt={name}
                fill
                sizes="48px"
                className="object-contain p-1"
                unoptimized
              />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-white">{name}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-gold-400">{tag}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            {siteData?.description || site.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(siteData?.values || site.values).map((v) => (
              <span
                key={v}
                className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wider text-white/70"
              >
                {v}
              </span>
            ))}
          </div>

          {/* Social Links if present */}
          {siteData?.social && (siteData.social.facebook || siteData.social.instagram || siteData.social.youtube) && (
            <div className="mt-6 flex items-center gap-4 text-sm">
              {siteData.social.facebook && (
                <a
                  href={siteData.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  Facebook
                </a>
              )}
              {siteData.social.instagram && (
                <a
                  href={siteData.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  Instagram
                </a>
              )}
              {siteData.social.youtube && (
                <a
                  href={siteData.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  YouTube
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Explore</h3>
          <ul className="mt-5 space-y-2.5 text-[15px]">
            {nav.slice(1).map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-gold-300">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Courses</h3>
          <ul className="mt-5 space-y-2.5 text-[15px]">
            {courses.map((c) => (
              <li key={c.slug}>
                <Link href={`/courses#${c.slug}`} className="transition-colors hover:text-gold-300">
                  {c.name} · {c.duration}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Contact</h3>
          <ul className="mt-5 space-y-3.5 text-[15px]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-400" />
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">
                {address.landmark ? `${address.landmark}, ` : ""}{address.line1}, {address.line2},{" "}
                {address.state} {address.pin}
              </a>
            </li>
            {phones.map((p) => (
              <li key={p} className="flex gap-3">
                <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-400" />
                <a href={telHref(p)} className="hover:text-gold-300">
                  +91 {p}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-400" />
              <a href={`mailto:${email}`} className="break-all hover:text-gold-300">
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p>{address.line1} · {address.state}</p>
        </div>
      </div>
    </footer>
  );
}
