import type { Metadata } from "next";
import Image from "next/image";
import { Award, HeartHandshake, Sparkles, Target } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero, SectionHeading } from "@/components/section";
import { site as defaultSite } from "@/lib/site";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: `About ${defaultSite.name}: our mission, values and campus facilities.`,
};

const valueIcons = [Target, HeartHandshake, Sparkles, Award];
const valueText: Record<string, string> = {
  Discipline: "Punctuality, professional conduct and respect for patients form the base of nursing training here.",
  Dedication: "Faculty and students commit fully to learning, practice and the patients they will serve.",
  Compassion: "Nursing is care first. Empathy is taught, modelled and expected on every ward.",
  Excellence: "High standards in theory, skills and ethics, so every graduate is job-ready.",
};

export default async function AboutPage() {
  const site = await getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="About the college"
        title={`A nursing college built for excellence.`}
        text={`${site.name} at ${site.address.line1}, ${site.address.line2}, gives students a modern, disciplined place to train as nurses without leaving home.`}
      />

      <section className="container-x grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-ink/10">
            <Image
              src="/images/campus.jpg"
              alt="Adarsh College of Nursing building"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-gold-500 px-6 py-5 text-ink shadow-lift sm:block">
            <p className="font-display text-3xl font-semibold leading-none">{site.session}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em]">Admissions open</p>
          </div>
        </Reveal>
        <div>
          <SectionHeading
            eyebrow="Who we are"
            title="Nurturing compassionate healthcare professionals"
            text={
              <>
                {site.name} offers A.N.M., G.N.M. and B.Sc. Nursing programmes from a purpose-built
                campus in Niwaz Nagar. Our promise is simple: <em>{site.tagline}</em>.
              </>
            }
          />
          <Reveal delay={0.1} className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink-2">
            <p>
              Healthcare in Haryana needs trained nurses, and students from Narnaul and the villages
              around it deserve a college they can reach every day. The college was set up to fill
              that gap with qualified faculty, well-equipped nursing labs, a library and hostel and
              transport facilities.
            </p>
            <p>
              Teaching combines classroom lectures, skills labs and supervised clinical postings,
              so students learn to care for real patients with confidence. Personality development,
              communication and professional ethics are part of every year of study.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Our values"
            title="Four words on every classroom wall"
          />
          <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <StaggerItem
                  key={v}
                  className="group rounded-3xl bg-cream p-7 ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1 hover:bg-brand-700 hover:text-white"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft transition-colors group-hover:text-brand-800">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">{v}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2 transition-colors group-hover:text-white/80">
                    {valueText[v]}
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal className="rounded-[2rem] bg-navy-950 p-10 text-white grain relative overflow-hidden">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-700/40 blur-3xl" />
            <p className="relative text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-400">Our mission</p>
            <p className="relative mt-4 font-display text-2xl leading-snug sm:text-3xl">
              To train skilled, ethical and compassionate nurses who serve their communities with
              confidence and care.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[2rem] bg-brand-50 p-10 ring-1 ring-brand-100">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-700">Our vision</p>
            <p className="mt-4 font-display text-2xl leading-snug text-ink sm:text-3xl">
              To be the most trusted nursing institution in southern Haryana, known for the quality
              of its graduates.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand siteData={site} />
    </>
  );
}
