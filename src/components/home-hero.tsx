"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { WordReveal } from "@/components/motion";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { site, telHref } from "@/lib/site";
import type { HeroData } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export type HeroSlide = {
  src: string;
  alt: string;
  tag: string;
  caption: string;
};

export function HomeHero({
  hero,
  session,
  phone,
  landmark,
  slides,
}: {
  hero?: HeroData;
  session?: string;
  phone?: string;
  landmark?: string;
  slides?: HeroSlide[];
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -25]);
  const tr = (duration: number, delay = 0) => (reduce ? { duration: 0 } : { duration, delay, ease });

  const [liveHero, setLiveHero] = useState<HeroData | undefined>(undefined);
  const [liveSlides, setLiveSlides] = useState<HeroSlide[] | undefined>(undefined);
  const [liveSession, setLiveSession] = useState<string | undefined>(undefined);
  const [livePhone, setLivePhone] = useState<string | undefined>(undefined);
  const [liveLandmark, setLiveLandmark] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleSync = () => {
      fetch("/api/admin/settings")
        .then(async (res) => {
          if (!res.ok) return null;
          const ct = res.headers.get("content-type");
          if (ct && ct.includes("application/json")) {
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (data?.settings) {
            const s = data.settings;
            if (s.hero) {
              setLiveHero(s.hero);
              if (Array.isArray(s.hero.slides) && s.hero.slides.length > 0) {
                setLiveSlides(s.hero.slides);
              }
            }
            if (s.session) setLiveSession(s.session);
            if (s.phones && s.phones[0]) setLivePhone(s.phones[0]);
            if (s.address) {
              setLiveLandmark(s.address.landmark || s.address.line1);
            }
          }
        })
        .catch(() => {});
    };

    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  const currentHero = liveHero || hero;
  const currentSession = liveSession || session || site.session;
  const effectiveBadge = currentHero?.badge || `Admissions open for ${currentSession}`;
  const effectiveTitleLead = currentHero?.titleLead || "Nurturing compassionate";
  const effectiveTitleHighlight = currentHero?.titleHighlight || "healthcare professionals.";
  const effectiveDesc = currentHero?.description || site.description;
  const effectivePhone = livePhone || phone || site.phones[0];
  const effectiveLandmark = liveLandmark || landmark || `${site.address.landmark || site.address.line1}`;
  const effectiveImage = currentHero?.image || "/images/campus.jpg";

  const effectiveSlides: HeroSlide[] =
    liveSlides && liveSlides.length > 0
      ? liveSlides
      : slides && slides.length > 0
      ? slides
      : [
          {
            src: effectiveImage,
            alt: "Adarsh College of Nursing campus building and lawns",
            tag: "Our Campus",
            caption: effectiveLandmark,
          },
          {
            src: "/images/nursing-lab.jpg",
            alt: "Practical nursing simulation and clinical skills lab",
            tag: "Practical Skills Lab",
            caption: "Clinical mannequins & hospital simulation beds",
          },
          {
            src: "/images/nursing-library.jpg",
            alt: "College library and medical learning study hall",
            tag: "College Library",
            caption: "Medical books, journals & quiet study spaces",
          },
          {
            src: "/images/poster.jpg",
            alt: "Admissions open poster for session 2026-27",
            tag: "Admissions Open",
            caption: `A.N.M. · G.N.M. · B.Sc. Nursing (${currentSession})`,
          },
        ];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeCurrent = Math.min(current, Math.max(0, effectiveSlides.length - 1));

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent((prev) => (prev + newDirection + effectiveSlides.length) % effectiveSlides.length);
    },
    [effectiveSlides.length]
  );

  const goToSlide = (idx: number) => {
    if (idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  useEffect(() => {
    if (isPaused || reduce) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, reduce, paginate]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : dir < 0 ? "-100%" : 0,
      opacity: 0,
      scale: 1.04,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 320, damping: 32 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.5, ease },
      },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: "spring" as const, stiffness: 320, damping: 32 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -300) {
      paginate(1);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 300) {
      paginate(-1);
    }
  };

  const stats = [
    [currentHero?.stat1Val || "100%", currentHero?.stat1Label || "Clinical Exposure"],
    [currentHero?.stat2Val || "3+", currentHero?.stat2Label || "Recognized Courses"],
    [currentHero?.stat3Val || "10:1", currentHero?.stat3Label || "Student-Faculty Ratio"],
  ];

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-6 h-[26rem] w-[26rem] rounded-full bg-brand-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-52 top-24 h-[28rem] w-[28rem] rounded-full bg-navy-200/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.8),transparent_60%)]" />

      <div className="container-x relative grid items-center gap-7 pb-7 pt-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-11 lg:pt-7">
        <motion.div style={{ y: copyY }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.6)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-[12.5px] font-semibold text-brand-800 shadow-soft ring-1 ring-brand-100"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            {effectiveBadge}
          </motion.div>

          <h1 className="mt-4 font-display text-balance text-[2.2rem] leading-[1.04] font-semibold text-ink sm:text-[3rem] lg:text-[3.25rem]">
            <WordReveal text={effectiveTitleLead} delay={0.1} />
            <br />
            <span className="underline-swash">
              <WordReveal text={effectiveTitleHighlight} delay={0.35} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.55)}
            className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2 sm:text-[17px]"
          >
            {effectiveDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.7)}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href={currentHero?.ctaPrimaryLink || "/admissions"} size="lg">
              {currentHero?.ctaPrimary || `Apply for ${currentSession}`}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonAnchor href={telHref(effectivePhone)} variant="ghost" size="lg">
              <Phone className="h-5 w-5 text-brand-700" />
              {effectivePhone}
            </ButtonAnchor>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.85)}
            className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-ink/10"
          >
            {stats.map(([v, l]) => (
              <div key={l} className="px-4 first:pl-0">
                <dt className="font-display text-2xl font-semibold text-ink sm:text-3xl">{v}</dt>
                <dd className="text-[12px] uppercase tracking-[0.14em] text-ink-2 sm:text-[13px]">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[28rem] lg:max-w-none">
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={tr(1, 0.2)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="group/slider relative aspect-[8/7] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-ink/10 select-none bg-navy-950"
          >
            {/* Sliding Images */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={safeCurrent}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={effectiveSlides[safeCurrent]?.src || "/images/campus.jpg"}
                  alt={effectiveSlides[safeCurrent]?.alt || "Slide preview"}
                  fill
                  priority={safeCurrent === 0}
                  loading={safeCurrent === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                  draggable={false}
                  unoptimized={
                    typeof effectiveSlides[safeCurrent]?.src === "string" &&
                    (effectiveSlides[safeCurrent].src.startsWith("http://") ||
                      effectiveSlides[safeCurrent].src.startsWith("https://") ||
                      effectiveSlides[safeCurrent].src.startsWith("data:"))
                  }
                />
              </motion.div>
            </AnimatePresence>

            {/* Slide Index Counter Badge (Top Right) */}
            <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-navy-950/60 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md ring-1 ring-white/15">
              <span className="text-gold-400">0{safeCurrent + 1}</span>
              <span className="text-white/40">/</span>
              <span>0{effectiveSlides.length}</span>
            </div>

            {/* Arrow Navigation Controls */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur-md ring-1 ring-white/20 transition-all duration-200 hover:scale-110 hover:bg-navy-900 opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100 focus:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur-md ring-1 ring-white/20 transition-all duration-200 hover:scale-110 hover:bg-navy-900 opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100 focus:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Gradient Overlay for Caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-transparent" />

            {/* Bottom Caption & Pagination Dots */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4 text-white">
              <div className="max-w-[70%]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                      {effectiveSlides[safeCurrent]?.tag || ""}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-white/95 line-clamp-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                      {effectiveSlides[safeCurrent]?.caption || ""}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 pb-1">
                {effectiveSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === current
                        ? "w-5 bg-gold-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={tr(0.8, 0.9)}
            className="absolute -left-4 top-[48%] z-30 hidden rounded-2xl bg-white/95 p-3.5 shadow-lift ring-1 ring-ink/5 backdrop-blur sm:block animate-float"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-white">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-ink-2">Programmes</p>
                <p className="text-[14px] font-semibold text-ink">ANM · GNM · B.Sc.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={tr(0.8, 1.05)}
            className="absolute -right-3 bottom-6 z-30 hidden rounded-2xl bg-white/95 p-3.5 shadow-lift ring-1 ring-ink/5 backdrop-blur sm:block [animation-delay:1.2s] animate-float sm:bottom-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-ink-2">Campus life</p>
                <p className="text-[14px] font-semibold text-ink">Hostel & transport</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

