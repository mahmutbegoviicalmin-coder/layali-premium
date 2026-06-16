import type { CategoryCard } from "@/lib/types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

export const categoryCards: CategoryCard[] = [
  {
    id: "ice",
    name: "Ledeni okusi",
    slug: "ice",
    image: img("1513558161293-cdaf765ed2fd"),
    productCount: 6,
  },
  {
    id: "fruit",
    name: "Voćni okusi",
    slug: "fruit",
    image: img("1563565375-f71ddfdb5758"),
    productCount: 4,
  },
  {
    id: "dessert",
    name: "Desertni okusi",
    slug: "dessert",
    image: img("1558961363-fa8fcd82a09f"),
    productCount: 2,
  },
  {
    id: "exotic",
    name: "Egzotične mješavine",
    slug: "exotic",
    image: img("1615485925617-9f4d0604a0a0"),
    productCount: 2,
  },
  {
    id: "best-sellers",
    name: "Bestseleri",
    slug: "best-sellers",
    image: img("1546173159-315724a31605"),
    productCount: 3,
  },
];
