"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { InquiryItem, Product } from "@/lib/types";
import {
  MIN_ORDER_GRAMS,
  getTotalOrderGrams,
  meetsMinimumOrder,
  getGramsRemaining,
  getOrderProgress,
  normalizeInquiryItem,
  type PackSizeGrams,
} from "@/lib/order-rules";

const STORAGE_KEY = "layali-inquiry-basket";

interface InquiryBasketContextValue {
  items: InquiryItem[];
  addToInquiry: (product: Product) => void;
  removeFromInquiry: (productId: string) => void;
  updatePackSize: (productId: string, packSizeGrams: PackSizeGrams) => void;
  updatePackCount: (productId: string, packCount: number) => void;
  clearInquiry: () => void;
  isInInquiry: (productId: string) => boolean;
  itemCount: number;
  totalOrderGrams: number;
  minimumOrderGrams: number;
  meetsMinimumOrder: boolean;
  gramsRemaining: number;
  orderProgress: number;
  isHydrated: boolean;
}

const InquiryBasketContext = createContext<InquiryBasketContextValue | null>(
  null
);

function normalizeItems(items: InquiryItem[]): InquiryItem[] {
  return items.map(normalizeInquiryItem);
}

export function InquiryBasketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(normalizeItems(JSON.parse(stored)));
    } catch {
      /* ignore */
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addToInquiry = useCallback((product: Product) => {
    setItems((prev) => {
      const normalized = normalizeItems(prev);
      const existing = normalized.find((i) => i.product.id === product.id);
      if (existing) {
        return normalized.map((i) =>
          i.product.id === product.id
            ? { ...i, packCount: (i.packCount ?? 1) + 1 }
            : i
        );
      }
      return [
        ...normalized,
        { product, packSizeGrams: 250, packCount: 1 },
      ];
    });
  }, []);

  const removeFromInquiry = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updatePackSize = useCallback(
    (productId: string, packSizeGrams: PackSizeGrams) => {
      setItems((prev) =>
        normalizeItems(prev).map((i) =>
          i.product.id === productId ? { ...i, packSizeGrams } : i
        )
      );
    },
    []
  );

  const updatePackCount = useCallback((productId: string, packCount: number) => {
    setItems((prev) =>
      normalizeItems(prev).map((i) =>
        i.product.id === productId
          ? { ...i, packCount: packCount > 0 ? packCount : 1 }
          : i
      )
    );
  }, []);

  const clearInquiry = useCallback(() => setItems([]), []);

  const isInInquiry = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items]
  );

  const itemCount = items.length;
  const totalOrderGrams = getTotalOrderGrams(items);
  const orderMeetsMinimum = meetsMinimumOrder(items);
  const gramsRemaining = getGramsRemaining(items);
  const orderProgress = getOrderProgress(items);

  const value = useMemo(
    () => ({
      items,
      addToInquiry,
      removeFromInquiry,
      updatePackSize,
      updatePackCount,
      clearInquiry,
      isInInquiry,
      itemCount,
      totalOrderGrams,
      minimumOrderGrams: MIN_ORDER_GRAMS,
      meetsMinimumOrder: orderMeetsMinimum,
      gramsRemaining,
      orderProgress,
      isHydrated,
    }),
    [
      items,
      addToInquiry,
      removeFromInquiry,
      updatePackSize,
      updatePackCount,
      clearInquiry,
      isInInquiry,
      itemCount,
      totalOrderGrams,
      orderMeetsMinimum,
      gramsRemaining,
      orderProgress,
      isHydrated,
    ]
  );

  return (
    <InquiryBasketContext.Provider value={value}>
      {children}
    </InquiryBasketContext.Provider>
  );
}

export function useInquiryBasket() {
  const ctx = useContext(InquiryBasketContext);
  if (!ctx)
    throw new Error(
      "useInquiryBasket must be used within InquiryBasketProvider"
    );
  return ctx;
}
