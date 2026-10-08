"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, GraduationCap, MapPin, Phone, ShieldCheck } from "lucide-react";
import { WordReveal } from "@/components/motion";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { site, telHref } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const tr = (duration: number, delay = 0) => (reduce ? { duration: 0 } : { duration, delay, ease });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-brand-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-52 top-40 h-[36rem] w-[36rem] rounded-full bg-navy-200/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.8),transparent_60%)]" />

      <div className="container-x relative grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-16">
        <motion.div style={{ y: copyY }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.6)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-brand-800 shadow-soft ring-1 ring-brand-100"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            Admissions open for {site.session}
          </motion.div>

          <h1 className="mt-6 font-display text-balance text-[2.75rem] leading-[1.02] font-semibold text-ink sm:text-6xl lg:text-[4.4rem]">
            <WordReveal text="Nurturing compassionate" delay={0.1} />
            <br />
            <WordReveal text="healthcare" delay={0.3} />{" "}
            <span className="underline-swash">
              <WordReveal text="professionals." delay={0.4} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.55)}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2"
          >
            A.N.M., G.N.M. and B.Sc. Nursing at a modern campus near Narnaul Bypass, Mahendergarh.
            Experienced faculty, well-equipped labs, hostel and transport — everything a nursing
            student needs, close to home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.7)}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href="/admissions" size="lg">
              Apply for {site.session}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonAnchor href={telHref(site.phones[0])} variant="ghost" size="lg">
              <Phone className="h-5 w-5 text-brand-700" />
              {site.phones[0]}
            </ButtonAnchor>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.85)}
            className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-ink/10"
          >
            {[
              ["3", "Courses"],
              ["2–4", "Years"],
              ["45%", "Min. marks"],
            ].map(([v, l]) => (
              <div key={l} className="px-4 first:pl-0">
                <dt className="font-display text-3xl font-semibold text-ink">{v}</dt>
                <dd className="text-[13px] uppercase tracking-[0.14em] text-ink-2">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={tr(1, 0.2)}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-ink/10"
          >
            <Image
              src="/images/campus.jpg"
              alt="Adarsh College of Nursing campus at dusk"
              fill
              priority
              loading="eager"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Our campus</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-gold-400" />
                  Niwaz Nagar, near Narnaul Bypass
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={tr(0.8, 0.9)}
            className="absolute -left-4 top-[52%] hidden rounded-2xl bg-white/90 p-4 shadow-lift ring-1 ring-ink/5 backdrop-blur sm:block animate-float"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-800 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-ink-2">Programmes</p>
                <p className="text-[15px] font-semibold text-ink">ANM · GNM · B.Sc.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={tr(0.8, 1.05)}
            className="absolute -right-3 bottom-24 hidden rounded-2xl bg-white/90 p-4 shadow-lift ring-1 ring-ink/5 backdrop-blur sm:block [animation-delay:1.2s] animate-float"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-ink-2">Campus life</p>
                <p className="text-[15px] font-semibold text-ink">Hostel & transport</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
