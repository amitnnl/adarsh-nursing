import { site } from "@/lib/site";

export function ValuesMarquee() {
  const items = [...site.values, site.tagline, ...site.values, site.tagline];
  return (
    <div className="relative overflow-hidden border-y border-ink/5 bg-white/60 py-4 backdrop-blur">
      <div className="flex w-max animate-marquee gap-10 pr-10 will-change-transform">
        {[...items, ...items].map((v, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-lg font-medium uppercase tracking-[0.22em] text-ink-2/70"
          >
            {v}
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
