"use client";

import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImageBadges } from "@/components/products/product-status-badge";
import { StrengthIndicator } from "@/components/products/strength-indicator";
import { ProductImage } from "@/components/products/product-image";
import { ProductPrice } from "@/components/products/product-price";
import { useSavedProducts } from "@/context/saved-products-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
  compact?: boolean;
  elevated?: boolean;
}

export function ProductCard({
  product,
  className,
  compact = false,
  elevated = false,
}: ProductCardProps) {
  const { isSaved, toggleSave } = useSavedProducts();
  const saved = isSaved(product.id);

  if (compact) {
    return (
      <article className={cn("group w-full", className)}>
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            "flex flex-col overflow-hidden rounded-2xl border bg-card transition-[border-color,transform] duration-200 active:border-primary/30",
            product.isHighlighted && "ring-2 ring-primary/25",
            elevated
              ? "border-border hover:-translate-y-0.5 hover:border-primary/15"
              : "border-border"
          )}
        >
          <div className="relative aspect-square overflow-hidden bg-surface">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 45vw, 300px"
            />
            {product.isNew || product.isBestSeller ? (
              <div className="absolute left-2.5 top-2.5 z-10">
                <ProductImageBadges
                  isNew={product.isNew}
                  isBestSeller={product.isBestSeller}
                  size="sm"
                />
              </div>
            ) : null}
          </div>
          <div className="p-3">
            <h3 className="font-heading text-[0.9375rem] font-medium leading-snug text-foreground line-clamp-2">
              {product.name}
            </h3>
            <p className="mt-1 text-[0.6875rem] text-muted">{product.categoryLabel}</p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border bg-card transition-[border-color,transform] duration-200 md:w-[300px] hover:-translate-y-1",
        elevated
          ? "border-border hover:border-primary/15"
          : "border-border hover:border-primary/20",
        product.isHighlighted && "ring-2 ring-primary/20",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          sizes="300px"
        />
        {product.isNew || product.isBestSeller ? (
          <div className="absolute left-4 top-4 z-10">
            <ProductImageBadges
              isNew={product.isNew}
              isBestSeller={product.isBestSeller}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted">
          {product.brand}
        </p>
        <h3 className="mt-2 font-heading text-xl font-medium leading-snug text-foreground line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="muted">{product.categoryLabel}</Badge>
          <span className="text-xs text-muted">{product.origin}</span>
        </div>
        <div className="mt-4">
          <StrengthIndicator strength={product.strength} />
        </div>
        <ProductPrice
          price={product.price}
          salePrice={product.salePrice}
          className="mt-3"
        />

        <div className="mt-auto flex gap-2.5 pt-6">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-hover-gold"
          >
            <Eye className="h-3.5 w-3.5" />
            Pogledaj detalje
          </Link>
          <Button
            variant="secondary"
            size="icon"
            aria-label={saved ? "Ukloni sa liste" : "Sačuvaj proizvod"}
            onClick={() => toggleSave(product)}
            className={cn(
              "rounded-full border-border",
              saved && "border-primary bg-surface text-primary"
            )}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-primary")} />
          </Button>
        </div>
      </div>
    </article>
  );
}
