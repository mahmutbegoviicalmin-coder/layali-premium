"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/types";

const STORAGE_KEY = "layali-saved-products";

interface SavedProductsContextValue {
  savedProducts: Product[];
  isSaved: (productId: string) => boolean;
  toggleSave: (product: Product) => void;
  removeSaved: (productId: string) => void;
  clearSaved: () => void;
  isHydrated: boolean;
}

const SavedProductsContext = createContext<SavedProductsContextValue | null>(
  null
);

export function SavedProductsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedProducts(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProducts));
  }, [savedProducts, isHydrated]);

  const isSaved = useCallback(
    (productId: string) => savedProducts.some((p) => p.id === productId),
    [savedProducts]
  );

  const toggleSave = useCallback((product: Product) => {
    setSavedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const removeSaved = useCallback((productId: string) => {
    setSavedProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearSaved = useCallback(() => setSavedProducts([]), []);

  const value = useMemo(
    () => ({
      savedProducts,
      isSaved,
      toggleSave,
      removeSaved,
      clearSaved,
      isHydrated,
    }),
    [savedProducts, isSaved, toggleSave, removeSaved, clearSaved, isHydrated]
  );

  return (
    <SavedProductsContext.Provider value={value}>
      {children}
    </SavedProductsContext.Provider>
  );
}

export function useSavedProducts() {
  const ctx = useContext(SavedProductsContext);
  if (!ctx)
    throw new Error(
      "useSavedProducts must be used within SavedProductsProvider"
    );
  return ctx;
}
