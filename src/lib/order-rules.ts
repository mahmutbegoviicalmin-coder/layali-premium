import type { InquiryItem } from "@/lib/types";

export const MIN_ORDER_GRAMS = 1000;
export const PACK_SIZE_OPTIONS = [200, 250] as const;
export type PackSizeGrams = (typeof PACK_SIZE_OPTIONS)[number];

export function normalizeInquiryItem(item: InquiryItem): InquiryItem {
  const legacyQuantity = (item as InquiryItem & { quantity?: number }).quantity;

  return {
    product: item.product,
    packSizeGrams: item.packSizeGrams ?? 250,
    packCount:
      item.packCount ??
      (legacyQuantity && legacyQuantity > 0 ? legacyQuantity : 1),
  };
}

export function getItemGrams(item: InquiryItem): number {
  const normalized = normalizeInquiryItem(item);
  return (normalized.packSizeGrams ?? 250) * (normalized.packCount ?? 0);
}

export function getTotalOrderGrams(items: InquiryItem[]): number {
  return items.reduce((sum, item) => sum + getItemGrams(item), 0);
}

export function meetsMinimumOrder(items: InquiryItem[]): boolean {
  if (items.length === 0) return true;
  return getTotalOrderGrams(items) >= MIN_ORDER_GRAMS;
}

export function getGramsRemaining(items: InquiryItem[]): number {
  return Math.max(0, MIN_ORDER_GRAMS - getTotalOrderGrams(items));
}

export function formatGrams(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return Number.isInteger(kg) ? `${kg} kg` : `${kg.toFixed(1).replace(".", ",")} kg`;
  }
  return `${grams} g`;
}

export function getOrderProgress(items: InquiryItem[]): number {
  if (items.length === 0) return 0;
  return Math.min(100, (getTotalOrderGrams(items) / MIN_ORDER_GRAMS) * 100);
}
