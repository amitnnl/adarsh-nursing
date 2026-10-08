import type { ReactNode } from "react";
import { Reveal } from "@/components/motion";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] ${
        light ? "text-gold-400" : "text-brand-700"
      }`}
    >
      <span className={`h-px w-6 ${light ? "bg-gold-400" : "bg-brand-700"}`} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-3 font-display text-balance text-[2rem] leading-[1.08] font-semibold sm:text-[2.6rem] ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {text && (
        <p className={`mt-4 text-[17px] leading-relaxed ${light ? "text-white/70" : "text-ink-2"}`}>
          {text}
        </p>
      )}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white grain">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[24rem] w-[24rem] rounded-full bg-navy-600/40 blur-3xl" />
      <div className="container-x relative py-20 sm:py-24 lg:py-28">
        <Reveal>
          <Eyebrow light>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-4 max-w-3xl font-display text-balance text-[2.6rem] leading-[1.02] font-semibold sm:text-6xl">
            {title}
          </h1>
        </Reveal>
        {text && (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{text}</p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.24}>
            <div className="mt-8">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
