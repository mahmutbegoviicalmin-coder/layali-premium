"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { getBrandBySlug } from "@/lib/data/brands";
import { ProductGallery } from "@/components/products/product-gallery";
import { RelatedProductsSlider } from "@/components/products/related-products";
import { StrengthIndicator } from "@/components/products/strength-indicator";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn, SectionContainer } from "@/components/ui/section";
import { useSavedProducts } from "@/context/saved-products-context";
import { useInquiryBasket } from "@/context/inquiry-basket-context";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { isSaved, toggleSave } = useSavedProducts();
  const { addToInquiry, isInInquiry } = useInquiryBasket();
  const [added, setAdded] = useState(false);
  const brand = getBrandBySlug(product.brandSlug);
  const saved = isSaved(product.id);
  const inBasket = isInInquiry(product.id);

  const handleAddToInquiry = () => {
    addToInquiry(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-36 pb-16">
      <SectionContainer>
        <FadeIn>
          <nav className="mb-8 text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-primary">
              Početna
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="transition-colors hover:text-primary">
              Proizvodi
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{product.name}</span>
          </nav>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn direction="left">
            <ProductGallery images={product.images} name={product.name} />
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="gold">{product.brand}</Badge>
                {product.isNew && (
                  <ProductStatusBadge type="new" variant="inline" />
                )}
                {product.isBestSeller && (
                  <ProductStatusBadge type="bestseller" variant="inline" />
                )}
              </div>

              <h1 className="mt-4 font-heading text-3xl font-medium text-foreground md:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Badge variant="muted">{product.categoryLabel}</Badge>
                <span className="text-sm text-muted">
                  Serija: {product.origin}
                </span>
              </div>

              <div className="mt-4">
                <StrengthIndicator strength={product.strength} />
              </div>

              <p className="mt-6 leading-relaxed text-muted">
                {product.description}
              </p>

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Dostupno pakovanje
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.packagingSizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-primary"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {product.availableQuantity != null && (
                <div className="mt-6 rounded-2xl border border-border bg-surface px-5 py-4">
                  <p className="text-sm font-medium text-primary">
                    Dostupna količina: {product.availableQuantity.toLocaleString("bs-BA")} g
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Stanje zaliha za veleprodajne upite. Za tačan termin isporuke kontaktirajte nas.
                  </p>
                </div>
              )}

              <div className="mt-8 rounded-2xl border border-border bg-white p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Specifikacije
                </h3>
                <dl className="mt-4 space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-sm text-muted">{key}</dt>
                      <dd className="text-sm font-medium text-primary">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {brand && (
                <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                    O brendu {brand.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {brand.description}
                  </p>
                </div>
              )}

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium text-primary">
                  Dostupno za veleprodaju. Minimalna narudžba 1 kg (mix okusa).
                  Pakovanja 200 g i 250 g.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleAddToInquiry}
                  className="min-w-[220px]"
                >
                  {added || inBasket ? (
                    <>
                      <Check className="h-5 w-5" />
                      Dodano u listu
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      Dodaj u listu za upit
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => toggleSave(product)}
                  className={cn(saved && "border-primary text-primary")}
                >
                  <Heart className={cn("h-5 w-5", saved && "fill-primary")} />
                  {saved ? "Sačuvano" : "Sačuvaj proizvod"}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>

        <RelatedProductsSlider
          products={relatedProducts}
          title="Slični proizvodi"
        />
      </SectionContainer>
    </div>
  );
}
