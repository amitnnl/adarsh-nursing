import {
  BedDouble,
  BookOpen,
  Bus,
  FlaskConical,
  Presentation,
  TreePine,
  Stethoscope,
  Microscope,
  ShieldAlert,
  Apple,
  GraduationCap,
  Building2,
  Sparkles,
  Wifi,
  Shield,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  BedDouble,
  BookOpen,
  Bus,
  FlaskConical,
  Presentation,
  TreePine,
  Stethoscope,
  Microscope,
  ShieldAlert,
  Apple,
  GraduationCap,
  Building2,
  Sparkles,
  Wifi,
  Shield,
};

export type FacilityIconName = keyof typeof icons | string;

export function FacilityIcon({
  name,
  className = "h-6 w-6",
}: {
  name?: string;
  className?: string;
}) {
  const Icon = (name && icons[name]) ? icons[name] : Building2;
  return <Icon className={className} strokeWidth={1.8} />;
}

