import type { Product, ProductCategory } from "@/lib/types";

export const CATEGORY_DISPLAY_ORDER: ProductCategory[] = [
  "ice",
  "fruit",
  "dessert",
  "mint",
  "exotic",
  "premium",
];

export function sortProductsByCategory(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const ai = CATEGORY_DISPLAY_ORDER.indexOf(a.category);
    const bi = CATEGORY_DISPLAY_ORDER.indexOf(b.category);
    const aRank = ai === -1 ? 99 : ai;
    const bRank = bi === -1 ? 99 : bi;
    if (aRank !== bRank) return aRank - bRank;
    return (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999);
  });
}

export function groupProductsByCategory(products: Product[]): Array<{
  category: ProductCategory;
  label: string;
  products: Product[];
}> {
  const sorted = sortProductsByCategory(products);
  const groups = new Map<ProductCategory, Product[]>();

  for (const product of sorted) {
    const list = groups.get(product.category) ?? [];
    list.push(product);
    groups.set(product.category, list);
  }

  return CATEGORY_DISPLAY_ORDER
    .filter((id) => groups.has(id))
    .map((id) => ({
      category: id,
      label: groups.get(id)?.[0]?.categoryLabel ?? id,
      products: groups.get(id) ?? [],
    }));
}

export function filterProductsByTab(products: Product[], tab: string): Product[] {
  if (tab === "best-sellers") return products.filter((p) => p.isBestSeller);
  if (tab === "new-arrivals") return products.filter((p) => p.isNew);
  if (tab === "premium") return products.filter((p) => p.tags.includes("premium"));
  if (CATEGORY_DISPLAY_ORDER.includes(tab as ProductCategory)) {
    return products.filter((p) => p.category === tab);
  }
  return products.filter((p) => p.tags.includes(tab as Product["tags"][number]));
}

export function filterHomepageProducts(products: Product[]): Product[] {
  return sortProductsByCategory(
    products.filter(
      (p) => p.showOnHomepage !== false && p.isActive !== false
    )
  );
}
