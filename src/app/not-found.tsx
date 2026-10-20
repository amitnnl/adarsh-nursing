import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-700">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">This page does not exist.</h1>
      <p className="mt-4 max-w-md text-ink-2">The link may be old. Head back home or go straight to admissions.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/admissions" variant="ghost">
          Admissions
        </ButtonLink>
      </div>
    </section>
  );
}
