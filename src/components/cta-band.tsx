import { MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/motion";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { site, telHref, whatsappHref } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="container-x">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-800 px-6 py-14 text-white grain sm:px-12 lg:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-navy-700/40 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                Admissions open · {site.session}
              </p>
              <h2 className="mt-3 font-display text-balance text-4xl leading-[1.05] font-semibold sm:text-5xl">
                Start your nursing career close to home.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-white/75">
                Seats for A.N.M., G.N.M. and B.Sc. Nursing are limited. Talk to our admission team
                today or visit the campus near Narnaul Bypass.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonAnchor href={telHref(site.phones[0])} variant="gold" size="lg">
                <Phone className="h-5 w-5" />
                Call {site.phones[0]}
              </ButtonAnchor>
              <ButtonAnchor
                href={whatsappHref("Hello, I want to know about admission at Adarsh College of Nursing.")}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline-light"
                size="lg"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp us
              </ButtonAnchor>
              <ButtonLink href="/admissions" variant="outline-light" size="lg">
                Enquiry form
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
