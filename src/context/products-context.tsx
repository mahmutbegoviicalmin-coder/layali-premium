"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { filterHomepageProducts } from "@/lib/catalog/filters";
import type { Product } from "@/lib/types";

interface ProductsContextValue {
  products: Product[];
  homepageProducts: Product[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = (await res.json()) as { products: Product[] };
      setProducts(data.products ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const homepageProducts = useMemo(
    () => filterHomepageProducts(products),
    [products]
  );

  const value = useMemo(
    () => ({ products, homepageProducts, loading, refresh }),
    [products, homepageProducts, loading, refresh]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts mora biti unutar ProductsProvider.");
  }
  return ctx;
}
