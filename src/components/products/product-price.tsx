"use client";

import { getDisplayPrice, formatPrice } from "@/lib/utils/price";

interface ProductPriceProps {
  price?: number | null;
  salePrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ProductPrice({
  price,
  salePrice,
  className = "",
  size = "md",
}: ProductPriceProps) {
  const display = getDisplayPrice({ price, salePrice });
  if (!display) return null;

  const currentClass =
    size === "lg"
      ? "text-2xl font-semibold"
      : size === "sm"
        ? "text-sm font-semibold"
        : "text-base font-semibold";
  const originalClass =
    size === "lg" ? "text-base" : size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className={`${currentClass} text-foreground`}>
        {formatPrice(display.current)}
      </span>
      {display.original != null && (
        <span className={`${originalClass} text-muted line-through`}>
          {formatPrice(display.original)}
        </span>
      )}
    </div>
  );
}
