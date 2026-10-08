import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { courses, mapsLink, nav, site, telHref } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 bg-navy-950 text-white/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
              <Image
                src="/images/logo-mark.png"
                alt=""
                fill
                sizes="48px"
                className="object-cover scale-[1.35] translate-y-[8%]"
              />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-white">{site.name}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-gold-400">{site.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            Nurturing compassionate healthcare professionals in Mahendergarh, Haryana. A modern
            campus, experienced faculty and real clinical exposure.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {site.values.map((v) => (
              <span
                key={v}
                className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wider text-white/70"
              >
                {v}
              </span>
            ))}
          </div>
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
                {site.address.landmark}, {site.address.line1}, {site.address.line2},{" "}
                {site.address.state} {site.address.pin}
              </a>
            </li>
            {site.phones.map((p) => (
              <li key={p} className="flex gap-3">
                <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-400" />
                <a href={telHref(p)} className="hover:text-gold-300">
                  +91 {p}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-400" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-gold-300">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Niwaz Nagar · Narnaul · Mahendergarh · Haryana</p>
        </div>
      </div>
    </footer>
  );
}
