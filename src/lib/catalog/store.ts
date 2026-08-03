import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import type { CatalogData, Product } from "@/lib/types";
import {
  filterProductsByTab,
  filterHomepageProducts,
  sortProductsByCategory,
  sortAromaProducts,
} from "@/lib/catalog/filters";
import { getOrderCollection } from "@/lib/collection";

const CATALOG_PATH = path.join(process.cwd(), "data", "catalog.json");
const AROMA_PATH = path.join(process.cwd(), "data", "aroma-collection.json");
/** Unique pathnames on each write so public Blob CDN never serves a stale catalog. */
const CATALOG_BLOB_PREFIX = "data/catalog/";

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function ensureCatalogDir(): void {
  const dir = path.dirname(CATALOG_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function readLocalCatalog(): CatalogData {
  ensureCatalogDir();
  if (!existsSync(CATALOG_PATH)) {
    return { categories: [], products: [] };
  }
  const raw = readFileSync(CATALOG_PATH, "utf-8");
  return JSON.parse(raw) as CatalogData;
}

function writeLocalCatalog(data: CatalogData): void {
  ensureCatalogDir();
  writeFileSync(CATALOG_PATH, JSON.stringify(data, null, 2), "utf-8");
}

async function readBlobCatalog(): Promise<CatalogData | null> {
  const { blobs } = await list({
    prefix: CATALOG_BLOB_PREFIX,
    limit: 1000,
  });

  if (!blobs.length) return null;

  const latest = [...blobs].sort(
    (a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)
  )[0];

  const res = await fetch(latest.url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Catalog blob fetch failed: ${res.status}`);
  }

  return (await res.json()) as CatalogData;
}

async function writeBlobCatalog(data: CatalogData): Promise<void> {
  const pathname = `${CATALOG_BLOB_PREFIX}${Date.now()}.json`;
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  });

  // Best-effort cleanup of older catalog versions (keep last 5)
  try {
    const { blobs } = await list({
      prefix: CATALOG_BLOB_PREFIX,
      limit: 1000,
    });
    const sorted = [...blobs].sort(
      (a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)
    );
    const stale = sorted.slice(5);
    if (stale.length) {
      const { del } = await import("@vercel/blob");
      await del(stale.map((b) => b.url));
    }
  } catch (error) {
    console.warn("[catalog] Could not prune old catalog blobs:", error);
  }
}

export async function readCatalog(): Promise<CatalogData> {
  if (useBlobStorage()) {
    try {
      const fromBlob = await readBlobCatalog();
      if (fromBlob) return fromBlob;

      // First deploy: seed Blob from the repo's catalog.json
      const seed = readLocalCatalog();
      await writeBlobCatalog(seed);
      return seed;
    } catch (error) {
      console.error(
        "[catalog] Blob read failed, falling back to local file:",
        error
      );
      return readLocalCatalog();
    }
  }

  return readLocalCatalog();
}

export function readAromaProductsRaw(): Product[] {
  if (!existsSync(AROMA_PATH)) {
    return [];
  }
  const raw = readFileSync(AROMA_PATH, "utf-8");
  const data = JSON.parse(raw) as { products: Product[] };
  return data.products ?? [];
}

export async function writeCatalog(data: CatalogData): Promise<void> {
  if (useBlobStorage()) {
    await writeBlobCatalog(data);
    try {
      writeLocalCatalog(data);
    } catch {
      // Vercel filesystem is read-only — ignore
    }
    return;
  }

  writeLocalCatalog(data);
}

export function enrichProduct(
  product: Product,
  categories: CatalogData["categories"]
): Product {
  const category = categories.find((c) => c.id === product.category);
  return {
    ...product,
    orderCollection: product.orderCollection ?? "standard",
    categoryLabel: category?.label ?? product.categoryLabel,
    isActive: product.isActive !== false,
    showOnHomepage: product.showOnHomepage !== false,
    homepageOrder: product.homepageOrder ?? 999,
    collectionOrder: product.collectionOrder ?? 999,
  };
}

async function getStandardProducts(): Promise<Product[]> {
  const catalog = await readCatalog();
  return catalog.products
    .filter((p) => p.isActive !== false)
    .map((p) => enrichProduct(p, catalog.categories));
}

export async function getActiveProducts(): Promise<Product[]> {
  return sortProductsByCategory(await getStandardProducts());
}

export async function getAromaProducts(): Promise<Product[]> {
  const catalog = await readCatalog();
  const products = readAromaProductsRaw()
    .filter((p) => p.isActive !== false)
    .map((p) => enrichProduct(p, catalog.categories));
  return sortAromaProducts(products);
}

export async function getHomepageProducts(): Promise<Product[]> {
  return filterHomepageProducts(await getStandardProducts());
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const catalog = await readCatalog();
  const standard = catalog.products.find(
    (p) => p.slug === slug && p.isActive !== false
  );
  if (standard) {
    return enrichProduct(standard, catalog.categories);
  }

  const aroma = readAromaProductsRaw().find(
    (p) => p.slug === slug && p.isActive !== false
  );
  if (!aroma) return undefined;
  return enrichProduct(aroma, catalog.categories);
}

export async function getProductsByTab(tab: string): Promise<Product[]> {
  return filterProductsByTab(await getActiveProducts(), tab);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const collection = getOrderCollection(product);
  const products =
    collection === "aroma"
      ? await getAromaProducts()
      : await getActiveProducts();

  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const [standard, aroma] = await Promise.all([
    getActiveProducts(),
    getAromaProducts(),
  ]);
  return [...standard.map((p) => p.slug), ...aroma.map((p) => p.slug)];
}
