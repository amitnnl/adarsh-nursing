import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "outline-light";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 ease-out select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-[0_8px_20px_-8px_rgba(140,29,47,0.6)] hover:bg-brand-800 hover:shadow-[0_14px_28px_-10px_rgba(140,29,47,0.7)] hover:-translate-y-0.5",
  secondary:
    "bg-navy-800 text-white shadow-[0_8px_20px_-8px_rgba(29,58,122,0.6)] hover:bg-navy-900 hover:-translate-y-0.5",
  gold: "bg-gold-500 text-ink shadow-[0_8px_20px_-8px_rgba(242,181,58,0.7)] hover:bg-gold-400 hover:-translate-y-0.5",
  ghost:
    "bg-white/70 text-ink ring-1 ring-ink/10 backdrop-blur hover:bg-white hover:ring-ink/20 hover:-translate-y-0.5",
  "outline-light":
    "bg-white/10 text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/20 hover:ring-white/70 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonLinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

type AnchorProps = CommonProps & Omit<ComponentProps<"a">, "className" | "children">;

export function ButtonAnchor({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: AnchorProps) {
  return (
    <a className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </a>
  );
}

type NativeButtonProps = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: NativeButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
