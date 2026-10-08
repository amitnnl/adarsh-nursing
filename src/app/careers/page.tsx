import type { Metadata } from "next";
import { Briefcase, Mail, Stethoscope, Users } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero, SectionHeading } from "@/components/section";
import { ButtonAnchor } from "@/components/ui/button";
import { openings, site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers - We are hiring",
  description:
    "Teaching and non-teaching openings at Adarsh College of Nursing, Narnaul: Principal, Vice Principal, Nursing Professors, Clinical Instructors, Lab Technician and more.",
};

const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Application - Adarsh College of Nursing")}`;

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="We are hiring"
        title="Teach the nurses Haryana needs."
        text="Adarsh College of Nursing is building its teaching and support team for the 2026-27 session. Interested candidates can send their resume by email."
      >
        <ButtonAnchor href={mailto} variant="gold" size="lg">
          <Mail className="h-5 w-5" />
          Send your resume
        </ButtonAnchor>
      </PageHero>

      <section className="container-x grid gap-8 py-24 lg:grid-cols-2">
        <Reveal className="rounded-[2rem] bg-white p-8 ring-1 ring-ink/5 shadow-soft sm:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white">
            <Stethoscope className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold text-ink">Teaching staff</h2>
          <p className="mt-2 text-[15px] text-ink-2">Nursing faculty with the qualifications and registration required for the post.</p>
          <Stagger as="ul" className="mt-7 space-y-2.5">
            {openings.teaching.map((o) => (
              <StaggerItem
                as="li"
                key={o}
                className="flex items-center justify-between rounded-2xl bg-cream px-5 py-3.5 text-[15px] font-medium text-ink transition-all hover:bg-brand-50"
              >
                {o}
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 ring-1 ring-brand-100">
                  Open
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[2rem] bg-white p-8 ring-1 ring-ink/5 shadow-soft sm:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-white">
            <Users className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold text-ink">Non-teaching staff</h2>
          <p className="mt-2 text-[15px] text-ink-2">Administrative and support roles that keep the campus running.</p>
          <Stagger as="ul" className="mt-7 space-y-2.5">
            {openings.nonTeaching.map((o) => (
              <StaggerItem
                as="li"
                key={o}
                className="flex items-center justify-between rounded-2xl bg-cream px-5 py-3.5 text-[15px] font-medium text-ink transition-all hover:bg-navy-50"
              >
                {o}
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800 ring-1 ring-navy-100">
                  Open
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </section>

      <section className="bg-white py-24">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="How to apply"
            title="Email your resume. We will call you back."
            text="Mention the post you are applying for in the subject line. Shortlisted candidates are invited to the campus for a discussion and demo class where applicable."
          />
          <Reveal className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-4 rounded-[2rem] bg-cream p-8 text-center ring-1 ring-ink/5">
            <Briefcase className="h-8 w-8 text-brand-700" />
            <a href={mailto} className="break-all font-display text-2xl font-semibold text-brand-800 hover:underline">
              {site.email}
            </a>
            <p className="text-sm text-ink-2">
              Questions? Call{" "}
              <a href={telHref(site.phones[0])} className="font-semibold text-ink hover:text-brand-800">
                {site.phones[0]}
              </a>{" "}
              or{" "}
              <a href={telHref(site.phones[1])} className="font-semibold text-ink hover:text-brand-800">
                {site.phones[1]}
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
