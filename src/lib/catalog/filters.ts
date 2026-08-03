import type { Product, ProductCategory } from "@/lib/types";

export const MAX_HOMEPAGE_PRODUCTS = 6;

export const CATEGORY_DISPLAY_ORDER: ProductCategory[] = [
  "ice",
  "fruit",
  "dessert",
  "mint",
  "exotic",
  "premium",
];

function categoryRank(category: ProductCategory): number {
  const i = CATEGORY_DISPLAY_ORDER.indexOf(category);
  return i === -1 ? 99 : i;
}

/** Featured (homepage) products first, then by homepageOrder / category. */
export function sortProductsForListing(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const aFeatured = a.showOnHomepage === true ? 0 : 1;
    const bFeatured = b.showOnHomepage === true ? 0 : 1;
    if (aFeatured !== bFeatured) return aFeatured - bFeatured;

    if (aFeatured === 0) {
      const order =
        (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999);
      if (order !== 0) return order;
    }

    const cat = categoryRank(a.category) - categoryRank(b.category);
    if (cat !== 0) return cat;
    return (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999);
  });
}

export function sortProductsByCategory(products: Product[]): Product[] {
  return sortProductsForListing(products);
}

export function groupProductsByCategory(products: Product[]): Array<{
  category: ProductCategory;
  label: string;
  products: Product[];
}> {
  const sorted = sortProductsForListing(products);
  const groups = new Map<ProductCategory, Product[]>();

  for (const product of sorted) {
    const list = groups.get(product.category) ?? [];
    list.push(product);
    groups.set(product.category, list);
  }

  // Keep category section order, but within each group featured stay first
  // because sorted already put featured first overall — rebuild groups in
  // category display order with featured-first within each category.
  return CATEGORY_DISPLAY_ORDER.filter((id) => groups.has(id)).map((id) => {
    const list = groups.get(id) ?? [];
    const featured = list
      .filter((p) => p.showOnHomepage === true)
      .sort((a, b) => (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999));
    const rest = list
      .filter((p) => p.showOnHomepage !== true)
      .sort((a, b) => (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999));
    return {
      category: id,
      label: list[0]?.categoryLabel ?? id,
      products: [...featured, ...rest],
    };
  });
}

export function filterProductsByTab(products: Product[], tab: string): Product[] {
  if (tab === "best-sellers") return products.filter((p) => p.isBestSeller);
  if (tab === "new-arrivals") return products.filter((p) => p.isNew);
  if (CATEGORY_DISPLAY_ORDER.includes(tab as ProductCategory)) {
    return products.filter((p) => p.category === tab);
  }
  return products.filter((p) => p.tags.includes(tab as Product["tags"][number]));
}

/** Only explicitly featured products, ordered, max 6. */
export function filterHomepageProducts(products: Product[]): Product[] {
  return products
    .filter(
      (p) =>
        p.showOnHomepage === true &&
        p.isActive !== false &&
        (p.orderCollection ?? "standard") === "standard"
    )
    .sort((a, b) => (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999))
    .slice(0, MAX_HOMEPAGE_PRODUCTS);
}

export function countHomepageProducts(
  products: Product[],
  excludeId?: string
): number {
  return products.filter(
    (p) =>
      p.showOnHomepage === true &&
      p.isActive !== false &&
      (!excludeId || p.id !== excludeId)
  ).length;
}

/** Put a newly featured product at position 1; shift others down. */
export function promoteToHomepageFront(
  products: Product[],
  productId: string
): Product[] {
  return products.map((p) => {
    if (p.id === productId) {
      return { ...p, showOnHomepage: true, homepageOrder: 1 };
    }
    if (p.showOnHomepage === true) {
      return {
        ...p,
        homepageOrder: Math.min(99, (p.homepageOrder ?? 1) + 1),
      };
    }
    return p;
  });
}

export function sortAromaProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const cat = categoryRank(a.category) - categoryRank(b.category);
    if (cat !== 0) return cat;
    return (a.collectionOrder ?? 999) - (b.collectionOrder ?? 999);
  });
}

export function groupAromaProductsByCategory(products: Product[]) {
  return groupProductsByCategory(sortAromaProducts(products));
}
