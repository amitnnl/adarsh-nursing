import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/cta-band";
import { FacilityIcon } from "@/components/facility-icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero, SectionHeading } from "@/components/section";
import { getFacilities, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Hostel, transport, spacious classrooms, nursing labs, library and a green campus at Adarsh College of Nursing.",
};

export default async function FacilitiesPage() {
  const [facilities, site] = await Promise.all([
    getFacilities(),
    getSiteSettings(),
  ]);
  return (
    <>
      <PageHero
        eyebrow="Our facilities"
        title="Everything a nursing student needs, on one campus."
        text="From the hostel room to the skills lab, the campus is planned so students can live, study and practise without distraction."
      />

      <section className="container-x py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="relative min-h-[26rem] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-ink/10 lg:row-span-2">
            <Image
              src="/images/campus.jpg"
              alt="College building and front lawn"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-7 text-white">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-400">The campus</p>
              <p className="mt-1 font-display text-2xl font-semibold">Purpose-built for nursing education</p>
            </div>
          </Reveal>
          {facilities.map((f, i) => (
              <Reveal
                key={f.title}
                delay={0.05 * i}
                className={`group relative overflow-hidden rounded-[2rem] p-8 ring-1 ring-ink/5 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${
                  i % 3 === 1 ? "bg-navy-950 text-white" : "bg-white"
                }`}
              >
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full transition-transform duration-700 group-hover:scale-[2.4] ${
                    i % 3 === 1 ? "bg-brand-700/40" : "bg-brand-100"
                  }`}
                />
                <span
                  className={`relative inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-[-8deg] ${
                    i % 3 === 1 ? "bg-gold-500 text-ink" : "bg-brand-700 text-white"
                  }`}
                >
                  <FacilityIcon name={f.icon} />
                </span>
                <h3 className="relative mt-5 font-display text-2xl font-semibold">{f.title}</h3>
                <p className={`relative mt-2 text-[15px] leading-relaxed ${i % 3 === 1 ? "text-white/70" : "text-ink-2"}`}>
                  {f.text}
                </p>
              </Reveal>
            ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Beyond the building"
            title="Support that follows students all the way to their first job"
          />
          <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["Clinical postings", "Supervised hospital postings so students practise on real wards, not only in the lab."],
              ["Placement assistance", "Guidance with applications and interviews for hospital and healthcare roles after graduation."],
              ["Affordable fee structure", "Fees planned for families in the region, with the schedule explained clearly at admission."],
            ].map(([t, d]) => (
              <StaggerItem key={t} className="rounded-3xl bg-cream p-7 ring-1 ring-ink/5">
                <h3 className="text-lg font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand siteData={site} />
    </>
  );
}
