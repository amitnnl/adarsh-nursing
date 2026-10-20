import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarCheck, FileText, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero, SectionHeading } from "@/components/section";
import { ButtonAnchor } from "@/components/ui/button";
import { telHref, whatsappHref } from "@/lib/site";
import { getSiteSettings, getAdmissionSteps, getAdmissionDocuments, getCourses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admissions open for A.N.M., G.N.M. and B.Sc. Nursing at Adarsh College of Nursing. Eligibility, process, documents and enquiry form.",
};

export default async function AdmissionsPage() {
  const [site, admissionSteps, documents, courses] = await Promise.all([
    getSiteSettings(),
    getAdmissionSteps(),
    getAdmissionDocuments(),
    getCourses(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={`Admissions open · ${site.session}`}
        title="Your seat in nursing starts with one message."
        text="Fill the short form, or call and WhatsApp the admission team directly. We reply on working days and can arrange a campus visit."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonAnchor href={telHref(site.phones[0])} variant="gold" size="lg">
            <Phone className="h-5 w-5" />
            {site.phones[0]}
          </ButtonAnchor>
          <ButtonAnchor
            href={whatsappHref("Hello, I want to know about admission at Adarsh College of Nursing.", site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-light"
            size="lg"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </ButtonAnchor>
          {site.brochurePdf && (
            <ButtonAnchor
              href={site.brochurePdf}
              target="_blank"
              download
              variant="outline-light"
              size="lg"
            >
              <FileText className="h-5 w-5" />
              Download Prospectus
            </ButtonAnchor>
          )}
        </div>
      </PageHero>

      <section className="container-x grid gap-8 py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div>
          <SectionHeading
            eyebrow="How it works"
            title="Four simple steps"
            text="No entrance stress at the enquiry stage. Tell us your marks and stream and we will guide you to the right course."
          />
          <Stagger as="ol" className="mt-7 space-y-3.5">
            {admissionSteps.map((s, i) => (
              <StaggerItem
                as="li"
                key={s.title}
                className="group flex gap-5 rounded-3xl bg-white p-6 ring-1 ring-ink/5 shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-700 font-display text-xl font-semibold text-white transition-transform duration-500 group-hover:rotate-[-6deg]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-7 rounded-3xl bg-navy-950 p-7 text-white grain relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-700/40 blur-3xl" />
            <h3 className="relative flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold-400">
              <FileText className="h-4 w-4" />
              Documents to bring
            </h3>
            <ul className="relative mt-4 grid gap-2.5 sm:grid-cols-2">
              {documents.map((d) => (
                <li key={d} className="flex items-start gap-2 text-[15px] text-white/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] bg-white p-6 shadow-lift ring-1 ring-ink/5 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">Admission enquiry</h2>
                <p className="text-sm text-ink-2">Takes under a minute.</p>
              </div>
            </div>
            <div className="mt-6">
              <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-cream" />}>
                <EnquiryForm />
              </Suspense>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Eligibility at a glance"
            title="Which course can you apply for?"
          />
          <div className="mt-8 overflow-hidden rounded-3xl ring-1 ring-ink/10">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-cream text-xs uppercase tracking-[0.16em] text-ink-2">
                <tr>
                  <th className="px-5 py-4 font-semibold">Course</th>
                  <th className="px-5 py-4 font-semibold">Duration</th>
                  <th className="px-5 py-4 font-semibold">Qualification</th>
                  <th className="px-5 py-4 font-semibold">Minimum marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {courses.map((c) => (
                  <tr key={c.slug} className="transition-colors hover:bg-cream/60">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-ink">{c.name}</span>
                      <span className="block text-xs text-ink-2">{c.fullName}</span>
                    </td>
                    <td className="px-5 py-4 text-ink">{c.duration}</td>
                    <td className="px-5 py-4 text-ink">{c.eligibility[0]}</td>
                    <td className="px-5 py-4 text-ink">{c.eligibility[1].replace("Minimum ", "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
