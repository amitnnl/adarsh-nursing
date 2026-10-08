import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";
import type { Course } from "@/lib/site";

const accents: Record<Course["accent"], { bg: string; chip: string; ring: string; glow: string }> = {
  rose: {
    bg: "from-brand-50 to-white",
    chip: "bg-brand-700 text-white",
    ring: "group-hover:ring-brand-300",
    glow: "bg-brand-300/40",
  },
  navy: {
    bg: "from-navy-50 to-white",
    chip: "bg-navy-800 text-white",
    ring: "group-hover:ring-navy-300",
    glow: "bg-navy-300/40",
  },
  green: {
    bg: "from-emerald-50 to-white",
    chip: "bg-emerald-700 text-white",
    ring: "group-hover:ring-emerald-300",
    glow: "bg-emerald-300/40",
  },
};

export function CourseCard({ course, index }: { course: Course; index: number }) {
  const a = accents[course.accent];
  return (
    <Link
      href={`/courses#${course.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-b ${a.bg} p-7 ring-1 ring-ink/5 shadow-soft transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-lift ${a.ring}`}
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full ${a.glow} blur-2xl transition-transform duration-700 group-hover:scale-150`}
      />
      <div className="relative flex items-start justify-between">
        <span className="font-display text-[3.25rem] leading-none font-semibold text-ink/10">
          0{index + 1}
        </span>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${a.chip}`}>
          {course.type}
        </span>
      </div>
      <h3 className="relative mt-4 font-display text-[2rem] leading-none font-semibold text-ink">
        {course.name}
      </h3>
      <p className="relative mt-1.5 text-[15px] font-medium text-ink-2">{course.fullName}</p>
      <p className="relative mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <Clock3 className="h-4 w-4 text-brand-700" />
        {course.duration}
      </p>
      <ul className="relative mt-5 space-y-2 text-[14.5px] text-ink-2">
        {course.eligibility.map((e) => (
          <li key={e} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {e}
          </li>
        ))}
      </ul>
      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-semibold text-brand-800">
        Course details
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
