import type { Metadata } from "next";
import { BriefcaseMedical, CheckCircle2, Clock3, GraduationCap, ListChecks } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { CtaBand } from "@/components/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/section";
import { ButtonLink } from "@/components/ui/button";
import { courses } from "@/lib/site";

export const metadata: Metadata = {
  title: "Courses - A.N.M., G.N.M., B.Sc. Nursing",
  description:
    "A.N.M. (2 years), G.N.M. (3 years) and B.Sc. Nursing (4 years) at Adarsh College of Nursing, Narnaul. Eligibility, subjects and career options.",
};

const tone = {
  rose: { bar: "bg-brand-700", soft: "bg-brand-50 text-brand-800", ring: "ring-brand-100" },
  navy: { bar: "bg-navy-800", soft: "bg-navy-50 text-navy-800", ring: "ring-navy-100" },
  green: { bar: "bg-emerald-700", soft: "bg-emerald-50 text-emerald-800", ring: "ring-emerald-100" },
} as const;

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Courses offered"
        title="Diploma and degree programmes in nursing."
        text="Pick the programme that matches your 10+2 stream and how far you want to go. Every course includes practical training and clinical postings."
      >
        <div className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition-all hover:bg-white/20"
            >
              {c.name} · {c.duration}
            </a>
          ))}
        </div>
      </PageHero>

      <section className="container-x -mt-10 relative z-10">
        <Stagger className="grid gap-6 md:grid-cols-3">
          {courses.map((c, i) => (
            <StaggerItem key={c.slug} className="h-full">
              <CourseCard course={c} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x space-y-10 py-24">
        {courses.map((c) => {
          const t = tone[c.accent];
          return (
            <Reveal key={c.slug} className="scroll-mt-28" as="div">
              <article
                id={c.slug}
                className={`grid overflow-hidden rounded-[2rem] bg-white ring-1 ${t.ring} shadow-soft lg:grid-cols-[1fr_1.6fr]`}
              >
                <div className="relative p-8 sm:p-10">
                  <span className={`absolute left-0 top-10 h-16 w-1.5 rounded-r ${t.bar}`} />
                  <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${t.soft}`}>
                    {c.type} · {c.duration}
                  </span>
                  <h2 className="mt-4 font-display text-4xl font-semibold text-ink">{c.name}</h2>
                  <p className="mt-1 text-lg font-medium text-ink-2">{c.fullName}</p>
                  <p className="mt-5 text-[16px] leading-relaxed text-ink-2">{c.summary}</p>
                  <dl className="mt-7 space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock3 className="h-5 w-5 text-brand-700" />
                      <dt className="sr-only">Duration</dt>
                      <dd className="text-[15px] font-semibold text-ink">{c.duration} full-time</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-brand-700" />
                      <dt className="sr-only">Award</dt>
                      <dd className="text-[15px] font-semibold text-ink">{c.type} in {c.fullName}</dd>
                    </div>
                  </dl>
                  <ButtonLink href={`/admissions?course=${c.slug}`} className="mt-8">
                    Apply for {c.name}
                  </ButtonLink>
                </div>

                <div className="grid gap-8 bg-cream p-8 sm:p-10 md:grid-cols-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink">
                      <ListChecks className="h-4 w-4 text-brand-700" />
                      Eligibility
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {c.eligibility.map((e) => (
                        <li key={e} className="flex items-start gap-2 text-[15px] text-ink-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink">
                      <GraduationCap className="h-4 w-4 text-brand-700" />
                      What you learn
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {c.learn.map((e) => (
                        <li key={e} className="flex items-start gap-2 text-[15px] text-ink-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink">
                      <BriefcaseMedical className="h-4 w-4 text-brand-700" />
                      Career paths
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {c.careers.map((e) => (
                        <li key={e} className="flex items-start gap-2 text-[15px] text-ink-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-700" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
        <Reveal>
          <p className="mx-auto max-w-2xl text-center text-sm text-ink-2/80">
            Seat intake, fee structure and recognition details are shared by the admission office.
            Call or WhatsApp us for the current session.
          </p>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
