import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import type { CatalogData, Product } from "@/lib/types";
import { filterProductsByTab, filterHomepageProducts, sortProductsByCategory } from "@/lib/catalog/filters";
import { slugify } from "@/lib/utils/slugify";

const CATALOG_PATH = path.join(process.cwd(), "data", "catalog.json");

function ensureCatalogFile(): void {
  const dir = path.dirname(CATALOG_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function readCatalog(): CatalogData {
  ensureCatalogFile();
  if (!existsSync(CATALOG_PATH)) {
    return { categories: [], products: [] };
  }
  const raw = readFileSync(CATALOG_PATH, "utf-8");
  return JSON.parse(raw) as CatalogData;
}

export function writeCatalog(data: CatalogData): void {
  ensureCatalogFile();
  writeFileSync(CATALOG_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function enrichProduct(
  product: Product,
  categories: CatalogData["categories"]
): Product {
  const category = categories.find((c) => c.id === product.category);
  return {
    ...product,
    categoryLabel: category?.label ?? product.categoryLabel,
    isActive: product.isActive !== false,
    showOnHomepage: product.showOnHomepage !== false,
    homepageOrder: product.homepageOrder ?? 999,
  };
}

export function getActiveProducts(): Product[] {
  const catalog = readCatalog();
  const products = catalog.products
    .filter((p) => p.isActive !== false)
    .map((p) => enrichProduct(p, catalog.categories));
  return sortProductsByCategory(products);
}

export function getHomepageProducts(): Product[] {
  const catalog = readCatalog();
  const products = catalog.products
    .filter((p) => p.isActive !== false)
    .map((p) => enrichProduct(p, catalog.categories));
  return filterHomepageProducts(products);
}

export function getProductBySlug(slug: string): Product | undefined {
  const catalog = readCatalog();
  const product = catalog.products.find(
    (p) => p.slug === slug && p.isActive !== false
  );
  if (!product) return undefined;
  return enrichProduct(product, catalog.categories);
}

export function getProductsByTab(tab: string): Product[] {
  return filterProductsByTab(getActiveProducts(), tab);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const products = getActiveProducts();
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}
