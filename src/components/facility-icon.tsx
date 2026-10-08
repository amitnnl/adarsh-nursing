import { BedDouble, BookOpen, Bus, FlaskConical, Presentation, TreePine } from "lucide-react";

const icons = { BedDouble, BookOpen, Bus, FlaskConical, Presentation, TreePine } as const;

export type FacilityIconName = keyof typeof icons;

export function FacilityIcon({ name, className = "h-6 w-6" }: { name: FacilityIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} strokeWidth={1.8} />;
}
