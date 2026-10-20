import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero, SectionHeading } from "@/components/section";
import { ButtonAnchor } from "@/components/ui/button";
import { telHref, whatsappHref } from "@/lib/site";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Adarsh College of Nursing for admissions, counseling, and campus visits.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${site.coords.lat},${site.coords.lng}`;
  const mapsEmbed = `https://www.google.com/maps?q=${site.coords.lat},${site.coords.lng}&z=15&output=embed`;

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Call, message or visit the campus."
        text="The admission office is happy to answer questions from students and parents. Directions to the campus are below."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonAnchor href={telHref(site.phones[0])} variant="gold" size="lg">
            <Phone className="h-5 w-5" />
            {site.phones[0]}
          </ButtonAnchor>
          <ButtonAnchor
            href={whatsappHref("Hello, I have an admission enquiry.", site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-light"
            size="lg"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </ButtonAnchor>
        </div>
      </PageHero>

      <section className="container-x -mt-10 relative z-10">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Phone,
              title: "Call us",
              lines: site.phones.map((p) => ({ label: `+91 ${p}`, href: telHref(p) })),
            },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              lines: [{ label: `+91 ${site.whatsapp}`, href: whatsappHref("Hello, I want to inquire about admissions.", site.whatsapp), external: true }],
            },
            {
              icon: Mail,
              title: "Email",
              lines: [{ label: site.email, href: `mailto:${site.email}` }],
            },
          ].map((c) => (
            <StaggerItem
              key={c.title}
              className="group rounded-3xl bg-white p-7 ring-1 ring-ink/5 shadow-lift transition-all duration-500 hover:-translate-y-1"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white transition-transform duration-500 group-hover:rotate-[-8deg]">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink-2">{c.title}</h3>
              <ul className="mt-2 space-y-1">
                {c.lines.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...("external" in l && l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="break-all text-[17px] font-semibold text-ink hover:text-brand-800"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x grid gap-8 py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div>
          <SectionHeading
            eyebrow="Visit the campus"
            title="Near Narnaul Bypass, Niwaz Nagar"
            text="Walk-ins are welcome on working days. Use the map for turn-by-turn directions."
          />
          <Reveal className="mt-8 space-y-4">
            <div className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink/5 shadow-soft">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <div>
                <p className="font-semibold text-ink">{site.name}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-2">
                  {site.address.landmark}, {site.address.line1},
                  <br />
                  {site.address.line2}, {site.address.state} {site.address.pin}
                </p>
                <p className="mt-2 text-xs text-ink-2/70">
                  {site.coords.lat.toFixed(6)}° N, {site.coords.lng.toFixed(6)}° E
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink/5 shadow-soft">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <div>
                <p className="font-semibold text-ink">Office hours</p>
                <p className="mt-1 text-[15px] text-ink-2">Monday to Saturday, 9:00 am – 5:00 pm</p>
              </div>
            </div>
            <ButtonAnchor href={mapsLink} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              <Navigation className="h-5 w-5" />
              Open in Google Maps
            </ButtonAnchor>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-ink/10">
            <iframe
              title="Map to Adarsh College of Nursing"
              src={mapsEmbed}
              className="h-[26rem] w-full border-0 lg:h-[32rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Send a message"
            title="Have a question? Ask here."
            text="Your message opens in WhatsApp or your email app, ready to send."
          />
          <Reveal delay={0.1} className="rounded-[2rem] bg-cream p-6 ring-1 ring-ink/5 sm:p-8">
            <EnquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
