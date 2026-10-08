"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";
import { courses, site, whatsappHref } from "@/lib/site";
import { Button } from "@/components/ui/button";

type Form = {
  name: string;
  phone: string;
  course: string;
  qualification: string;
  city: string;
  message: string;
};

const initial: Form = {
  name: "",
  phone: "",
  course: courses[1].name,
  qualification: "",
  city: "",
  message: "",
};

const field =
  "peer w-full rounded-2xl border border-ink/10 bg-white px-4 pt-6 pb-2.5 text-[15px] text-ink outline-none transition-all duration-300 placeholder-transparent focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";
const label =
  "pointer-events-none absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2/80 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-brand-700";

function EnquiryFormInner({ initialCourse }: { initialCourse?: string }) {
  const searchParams = useSearchParams();
  const paramCourse = searchParams ? searchParams.get("course") ?? undefined : undefined;
  const activeCourse = initialCourse ?? paramCourse;
  const preset = courses.find((c) => c.slug === activeCourse)?.name;
  const [f, setF] = useState<Form>({ ...initial, course: preset ?? initial.course });
  const [touched, setTouched] = useState(false);

  const phoneOk = /^[6-9]\d{9}$/.test(f.phone.trim());
  const nameOk = f.name.trim().length >= 2;
  const valid = phoneOk && nameOk;

  const message = useMemo(() => {
    const lines: string[] = [
      `Hello Adarsh College of Nursing, I would like admission information.`,
      ``,
      `Name: ${f.name.trim() || "-"}`,
      `Phone: ${f.phone.trim() || "-"}`,
      `Course: ${f.course}`,
    ];
    if (f.qualification.trim()) lines.push(`Qualification: ${f.qualification.trim()}`);
    if (f.city.trim()) lines.push(`City / Village: ${f.city.trim()}`);
    if (f.message.trim()) lines.push(``, f.message.trim());
    return lines.join("\n");
  }, [f]);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Admission enquiry - ${f.course}`,
  )}&body=${encodeURIComponent(message)}`;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input
            id="name"
            className={field}
            placeholder="Full name"
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
          />
          <label htmlFor="name" className={label}>
            Full name
          </label>
          {touched && !nameOk && <p className="mt-1.5 pl-1 text-xs text-brand-700">Please enter your name.</p>}
        </div>
        <div className="relative">
          <input
            id="phone"
            className={field}
            placeholder="Mobile number"
            inputMode="numeric"
            value={f.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            autoComplete="tel-national"
          />
          <label htmlFor="phone" className={label}>
            Mobile number
          </label>
          {touched && !phoneOk && (
            <p className="mt-1.5 pl-1 text-xs text-brand-700">Enter a valid 10-digit mobile number.</p>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 pl-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2/80">
          Interested course
        </p>
        <div className="grid grid-cols-3 gap-2">
          {courses.map((c) => {
            const on = f.course === c.name;
            return (
              <button
                type="button"
                key={c.slug}
                onClick={() => set("course", c.name)}
                className={`rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${
                  on
                    ? "border-brand-700 bg-brand-700 text-white shadow-[0_10px_24px_-10px_rgba(140,29,47,0.7)]"
                    : "border-ink/10 bg-white text-ink hover:border-brand-300"
                }`}
              >
                <span className="block text-[15px] font-semibold">{c.name}</span>
                <span className={`block text-xs ${on ? "text-white/80" : "text-ink-2"}`}>{c.duration}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input
            id="qualification"
            className={field}
            placeholder="Qualification"
            value={f.qualification}
            onChange={(e) => set("qualification", e.target.value)}
          />
          <label htmlFor="qualification" className={label}>
            Qualification (e.g. 12th PCB, 62%)
          </label>
        </div>
        <div className="relative">
          <input
            id="city"
            className={field}
            placeholder="City"
            value={f.city}
            onChange={(e) => set("city", e.target.value)}
            autoComplete="address-level2"
          />
          <label htmlFor="city" className={label}>
            City / Village
          </label>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="message"
          rows={3}
          className={`${field} resize-none`}
          placeholder="Message"
          value={f.message}
          onChange={(e) => set("message", e.target.value)}
        />
        <label htmlFor="message" className={label}>
          Any question? (optional)
        </label>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" className="sm:flex-1">
          <MessageCircle className="h-5 w-5" />
          Send on WhatsApp
        </Button>
        <a
          href={mailto}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-navy-800 ring-1 ring-navy-800/20 transition-all hover:bg-navy-50 sm:flex-1"
        >
          <Send className="h-4.5 w-4.5" />
          Send by email
        </a>
      </div>
      <p className="pt-1 text-center text-xs text-ink-2/80">
        Your details open in WhatsApp or your email app. Nothing is stored on this website.
      </p>
    </form>
  );
}

export function EnquiryForm({ initialCourse }: { initialCourse?: string }) {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-cream" />}>
      <EnquiryFormInner initialCourse={initialCourse} />
    </Suspense>
  );
}

