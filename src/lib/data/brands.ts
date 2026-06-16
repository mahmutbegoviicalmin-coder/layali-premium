import type { Brand } from "@/lib/types";

export const brands: Brand[] = [
  {
    id: "layali",
    slug: "layali",
    name: "Layali",
    logo: "LA",
    description:
      "Layali premium serija okusa za nargilu. Razvijena za lounge barove, kafiće i veleprodajne partnere koji traže konzistentan kvalitet i prepoznatljiv karakter u ponudi.",
  },
  {
    id: "1",
    slug: "al-fakher",
    name: "Al Fakher",
    logo: "AF",
    description:
      "Jedan od najprepoznatljivijih brendova okusa za nargilu, poznat po konzistentnom kvalitetu.",
  },
  {
    id: "2",
    slug: "starbuzz",
    name: "Starbuzz",
    logo: "SB",
    description:
      "Premium američki brend sa snažnim i modernim profilima okusa.",
  },
  {
    id: "3",
    slug: "fumari",
    name: "Fumari",
    logo: "FM",
    description:
      "Ručno birani okusi sa glatkim dimom i intenzivnim aromama.",
  },
  {
    id: "4",
    slug: "tangiers",
    name: "Tangiers",
    logo: "TG",
    description:
      "Specijalni premium tobacco za zahtjevne lokale i poznavaoce.",
  },
  {
    id: "5",
    slug: "social-smoke",
    name: "Social Smoke",
    logo: "SS",
    description:
      "Nagrađivani okusi sa izuzetnim kvalitetom reza i dugotrajnim sesijama.",
  },
  {
    id: "6",
    slug: "azure",
    name: "Azure",
    logo: "AZ",
    description:
      "Moderna kuća okusa koja spaja tradiciju i savremene trendove.",
  },
  {
    id: "7",
    slug: "adalya",
    name: "Adalya",
    logo: "AD",
    description:
      "Turski premium okusi sa bogatim aromama za veleprodajne partnere.",
  },
  {
    id: "8",
    slug: "darkside",
    name: "Darkside",
    logo: "DS",
    description:
      "Ruski premium brend poznat po intenzivnim okusima i stabilnom performansu.",
  },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export const productTabs = [
  { id: "best-sellers", label: "Bestseleri" },
  { id: "new-arrivals", label: "Novi proizvodi" },
  { id: "fruit", label: "Voćni okusi" },
  { id: "ice", label: "Ledeni okusi" },
  { id: "exotic", label: "Egzotične mješavine" },
  { id: "premium", label: "Premium serija" },
] as const;
