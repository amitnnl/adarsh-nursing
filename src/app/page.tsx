import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Navigation, Phone, Quote } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { ValuesMarquee } from "@/components/marquee";
import { CourseCard } from "@/components/course-card";
import { CtaBand } from "@/components/cta-band";
import { FacilityIcon } from "@/components/facility-icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { courses, facilities, mapsLink, site, telHref, whyUs } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ValuesMarquee />

      {/* Courses */}
      <section id="courses" className="container-x py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Courses offered"
            title="Three pathways into nursing"
            text="Choose the programme that fits your qualification and career goal. Every course combines classroom teaching with practical training and clinical exposure."
          />
          <Reveal delay={0.1}>
            <ButtonLink href="/courses" variant="ghost">
              All course details
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
        </div>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {courses.map((c, i) => (
            <StaggerItem key={c.slug} className="h-full">
              <CourseCard course={c} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Why us */}
      <section className="relative overflow-hidden bg-navy-950 py-24 text-white grain">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-navy-600/40 blur-3xl" />
        <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              light
              eyebrow="Why choose us"
              title="Small classes. Real hospitals. Faculty who know your name."
              text="Adarsh College of Nursing is built around one idea: a student who is well taught, well supervised and well supported becomes a nurse patients can trust."
            />
            <Reveal delay={0.15} className="mt-8">
              <ButtonLink href="/about" variant="gold">
                About the college
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </Reveal>
          </div>
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
            {whyUs.map((w, i) => (
              <StaggerItem
                as="li"
                key={w.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:bg-white/[0.07]"
              >
                <span className="font-display text-3xl font-semibold text-gold-400/80">0{i + 1}</span>
                <h3 className="mt-3 text-[17px] font-semibold text-white">{w.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{w.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Facilities */}
      <section className="container-x py-24">
        <SectionHeading
          align="center"
          eyebrow="Our facilities"
          title="A campus built for learning and living"
          text="Purpose-built classrooms, nursing labs, library, hostel and transport in a green campus near Narnaul Bypass."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <StaggerItem
              key={f.title}
              className="group relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-ink/5 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-100 transition-transform duration-700 group-hover:scale-[2.2]" />
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
                <FacilityIcon name={f.icon} />
              </span>
              <h3 className="relative mt-5 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="relative mt-2 text-[15px] leading-relaxed text-ink-2">{f.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center">
          <Link
            href="/facilities"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-800 hover:text-brand-900"
          >
            See all facilities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* Campus visit */}
      <section className="container-x pb-24">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink/5 shadow-soft lg:grid-cols-2">
            <div className="relative min-h-[22rem]">
              <Image
                src="/images/campus.jpg"
                alt="Front lawn and entrance of Adarsh College of Nursing"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/0 lg:to-white/10" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <Quote className="h-8 w-8 text-gold-500" />
              <p className="mt-4 font-display text-2xl leading-snug text-ink sm:text-[1.75rem]">
                “Come and see the classrooms, the labs and the hostel for yourself. Walk-ins are
                welcome on all working days.”
              </p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink-2">
                Admission team · {site.name}
              </p>
              <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                  <p className="text-[15px] leading-snug text-ink">
                    {site.address.landmark}, {site.address.line1},
                    <br />
                    {site.address.line2}, {site.address.state} {site.address.pin}
                  </p>
                </div>
                <ButtonAnchor href={mapsLink} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">
                  <Navigation className="h-4 w-4" />
                  Directions
                </ButtonAnchor>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {site.phones.map((p) => (
                  <a
                    key={p}
                    href={telHref(p)}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:ring-brand-300"
                  >
                    <Phone className="h-4 w-4 text-brand-700" />
                    {p}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
