"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Photo = { src: string; alt: string; caption: string; span?: string; position?: string };

const photos: Photo[] = [
  {
    src: "/images/campus.jpg",
    alt: "College building at dusk",
    caption: "Main building at dusk",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/campus.jpg",
    alt: "Front entrance",
    caption: "Main entrance",
    position: "object-[50%_58%]",
  },
  {
    src: "/images/campus.jpg",
    alt: "Front lawn and garden",
    caption: "Lawns and seating",
    position: "object-[20%_75%]",
  },
  {
    src: "/images/campus.jpg",
    alt: "College signage",
    caption: "Adarsh College of Nursing",
    position: "object-[50%_12%]",
  },
  {
    src: "/images/poster.jpg",
    alt: "Admission poster",
    caption: "Admissions 2026-27",
    position: "object-top",
  },
];

export function Gallery() {
  const [i, setI] = useState<number | null>(null);

  const close = useCallback(() => setI(null), []);
  const step = useCallback(
    (d: number) => setI((n) => (n === null ? n : (n + d + photos.length) % photos.length)),
    [],
  );

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [i, close, step]);

  return (
    <>
      <div className="grid auto-rows-[14rem] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[16rem]">
        {photos.map((p, idx) => (
          <motion.button
            key={idx}
            onClick={() => setI(idx)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative overflow-hidden rounded-3xl ring-1 ring-ink/10 shadow-soft ${p.span ?? ""}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${p.position ?? ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
            <p className="absolute bottom-4 left-4 right-4 text-left text-sm font-semibold text-white">{p.caption}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {i !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 sm:left-6"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 sm:right-6"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.figure
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[75vh] w-full overflow-hidden rounded-2xl">
                <Image src={photos[i].src} alt={photos[i].alt} fill sizes="100vw" className="object-contain" />
              </div>
              <figcaption className="mt-3 text-center text-sm text-white/80">{photos[i].caption}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
