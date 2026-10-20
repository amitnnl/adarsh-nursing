"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { nav, site, telHref } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import type { SiteData } from "@/lib/data";

export function SiteHeader({
  siteData,
  logo,
  siteName,
  shortName,
}: {
  siteData?: SiteData;
  logo?: string;
  siteName?: string;
  shortName?: string;
} = {}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const effectivePhones = siteData?.phones?.length ? siteData.phones : site.phones;
  const effectiveSession = siteData?.session || site.session;
  const showBanner = siteData?.isBannerActive !== false;
  const bannerText = siteData?.bannerNotice || `Admissions open for session ${effectiveSession} · A.N.M. · G.N.M. · B.Sc. Nursing`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Top strip */}
      {showBanner && (
        <div className="hidden md:block bg-navy-900 text-white/90 text-[13px]">
          <div className="container-x flex h-9 items-center justify-between">
            <p className="tracking-wide">
              <span className="text-gold-400 font-semibold">Admissions open</span> · {bannerText}
            </p>
            <div className="flex items-center gap-5">
              {effectivePhones.map((p) => (
                <a
                  key={p}
                  href={telHref(p)}
                  className="inline-flex items-center gap-1.5 hover:text-gold-300 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {p}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/85 backdrop-blur-xl shadow-[0_1px_0_rgba(26,26,31,0.06),0_10px_30px_-18px_rgba(26,26,31,0.25)]"
            : "bg-cream/0"
        }`}
      >
        <div
          className={`container-x flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <span className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-ink/10 bg-white shadow-soft transition-transform duration-500 group-hover:rotate-[-6deg] flex items-center justify-center">
              <Image
                src={logo || site.logo || "/images/logo-mark.png"}
                alt={siteName || site.name}
                fill
                sizes="44px"
                className="object-contain p-0.5"
                priority
                unoptimized
              />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[17px] font-semibold text-brand-800 tracking-tight">
                {siteName || site.name}
              </span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-navy-800/80">
                {shortName || "Narnaul · Haryana"}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`relative rounded-full px-3.5 py-2 text-[14.5px] font-medium transition-colors ${
                    active ? "text-brand-800" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {n.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white shadow-soft ring-1 ring-ink/5"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <ButtonLink href="/admissions" size="sm">
              Apply now
            </ButtonLink>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-ink/10 shadow-soft"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[70] flex w-[86%] max-w-sm flex-col bg-cream shadow-lift lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex h-20 items-center justify-between px-5">
                <span className="font-display text-lg font-semibold text-brand-800">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-ink/10"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col px-3">
                {nav.map((n, i) => {
                  const active = pathname === n.href;
                  return (
                    <motion.div
                      key={n.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-medium transition-colors ${
                          active ? "bg-white text-brand-800 shadow-soft" : "text-ink hover:bg-white/70"
                        }`}
                      >
                        {n.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <div className="mt-auto space-y-3 p-5">
                <ButtonLink href="/admissions" className="w-full" onClick={() => setOpen(false)}>
                  Apply now
                </ButtonLink>
                <div className="grid grid-cols-2 gap-2">
                  {effectivePhones.map((p) => (
                    <a
                      key={p}
                      href={telHref(p)}
                      className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white text-sm font-semibold ring-1 ring-ink/10"
                    >
                      <Phone className="h-4 w-4 text-brand-700" />
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
