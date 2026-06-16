"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductShowcaseCardProps {
  product: Product;
  variant?: "spotlight" | "filmstrip";
  isActive?: boolean;
  scale?: number;
}

export function ProductShowcaseCard({
  product,
  variant = "spotlight",
  isActive = false,
  scale = 1,
}: ProductShowcaseCardProps) {
  const secondaryImage =
    product.images.length > 1 ? product.images[1] : null;
  const isSpotlight = variant === "spotlight";

  return (
    <motion.div
      data-product-card
      className={cn(
        "shrink-0 snap-center",
        isSpotlight ? "w-[72vw] max-w-[340px] sm:w-[300px] lg:w-[320px]" : "w-[300px] lg:w-[320px] snap-start"
      )}
      style={{ scale }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "group relative block overflow-hidden rounded-3xl transition-shadow duration-500",
          isSpotlight
            ? cn(
                "bg-white/[0.06] ring-1 ring-white/10",
                isActive
                  ? "shadow-[0_32px_64px_-16px_rgba(0,0,0,0.45)] ring-white/20"
                  : "shadow-none"
              )
            : "bg-white ring-1 ring-black/[0.06] shadow-[0_2px_12px_rgba(242,95,65,0.06)]"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden",
            isSpotlight
              ? "aspect-[4/5] bg-gradient-to-b from-white/[0.12] to-white/[0.04]"
              : "aspect-square bg-[#f3f3f5]"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              isSpotlight ? "p-5 sm:p-6" : "p-8 sm:p-10"
            )}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={520}
              height={520}
              className={cn(
                "relative z-[1] max-h-full w-full object-contain transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isSpotlight ? "p-5 sm:p-6" : "p-8 sm:p-10",
                secondaryImage && isActive
                  ? "scale-[0.94] opacity-0"
                  : "scale-100 opacity-100",
                isSpotlight &&
                  isActive &&
                  "drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
              )}
              sizes="(max-width: 640px) 72vw, 320px"
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.name} pakovanje`}
                width={520}
                height={520}
                className={cn(
                  "absolute inset-0 m-auto max-h-full w-full object-contain transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isSpotlight ? "p-5 sm:p-6" : "p-8 sm:p-10",
                  isActive ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                  isSpotlight &&
                    isActive &&
                    "drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
                )}
                sizes="(max-width: 640px) 72vw, 320px"
              />
            )}
          </div>

          {isSpotlight && (
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_60%)]"
            />
          )}

          {(product.isBestSeller || product.isNew) && isActive && (
            <span
              className={cn(
                "absolute left-4 top-4 z-[2] rounded-full px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em]",
                product.isBestSeller
                  ? "bg-white text-primary"
                  : "bg-white/15 text-white ring-1 ring-white/20"
              )}
            >
              {product.isBestSeller ? "Bestseler" : "Novo"}
            </span>
          )}
        </div>

        {!isSpotlight && (
          <div className="flex items-end justify-between gap-3 border-t border-black/[0.04] px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="min-w-0">
              <p className="text-[0.6875rem] font-medium text-muted">
                {product.categoryLabel}
              </p>
              <h3 className="mt-0.5 truncate font-heading text-[1.0625rem] font-medium tracking-tight text-foreground sm:text-lg">
                {product.name}
              </h3>
            </div>
            <span className="shrink-0 text-[0.6875rem] font-medium tabular-nums text-muted">
              {product.packagingSizes[0]}
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
