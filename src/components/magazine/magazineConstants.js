import { Scale, Landmark, ArrowLeftRight, Building2, Home, BookOpen } from "lucide-react";

export const MAGAZINE_CATEGORIES = {
  editorial: {
    label: "Editor's Note",
    color: "bg-stone-100 text-stone-700",
    accent: "border-stone-400",
    gradientFrom: "from-stone-500",
    gradientTo: "to-stone-700",
    icon: BookOpen,
  },
  legal: {
    label: "Legal Corner",
    color: "bg-sky-50 text-sky-800",
    accent: "border-sky-500",
    gradientFrom: "from-sky-600",
    gradientTo: "to-blue-800",
    icon: Scale,
  },
  mortgage: {
    label: "Mortgage Insights",
    color: "bg-emerald-50 text-emerald-800",
    accent: "border-emerald-500",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-800",
    icon: Landmark,
  },
  money_transfer: {
    label: "Money Transfers",
    color: "bg-amber-50 text-amber-800",
    accent: "border-amber-500",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-700",
    icon: ArrowLeftRight,
  },
  developer: {
    label: "Developer Spotlight",
    color: "bg-violet-50 text-violet-800",
    accent: "border-violet-500",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-800",
    icon: Building2,
  },
  realtor: {
    label: "Realtor's Corner",
    color: "bg-rose-50 text-rose-800",
    accent: "border-rose-500",
    gradientFrom: "from-rose-500",
    gradientTo: "to-red-800",
    icon: Home,
  },
};

export const CATEGORY_ORDER = [
  "editorial",
  "legal",
  "mortgage",
  "money_transfer",
  "developer",
  "realtor",
];

export const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function getIssueLabel(month, year) {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
