import { Scale, Landmark, ArrowLeftRight, Building2, Home, BookOpen } from "lucide-react";

export const MAGAZINE_CATEGORIES = {
  editorial: {
    label: "Editor's Note",
    color: "bg-gray-100 text-gray-800",
    accent: "border-gray-400",
    icon: BookOpen,
  },
  legal: {
    label: "Legal Corner",
    color: "bg-blue-100 text-blue-800",
    accent: "border-blue-500",
    icon: Scale,
  },
  mortgage: {
    label: "Mortgage Insights",
    color: "bg-green-100 text-green-800",
    accent: "border-green-500",
    icon: Landmark,
  },
  money_transfer: {
    label: "Money Transfers",
    color: "bg-amber-100 text-amber-800",
    accent: "border-amber-500",
    icon: ArrowLeftRight,
  },
  developer: {
    label: "Developer Spotlight",
    color: "bg-purple-100 text-purple-800",
    accent: "border-purple-500",
    icon: Building2,
  },
  realtor: {
    label: "Realtor's Corner",
    color: "bg-red-100 text-red-800",
    accent: "border-red-500",
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
