"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check, AlertCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { isAromaProduct } from "@/lib/collection";
import { getBrandBySlug } from "@/lib/data/brands";
import { ProductGallery } from "@/components/products/product-gallery";
import { RelatedProductsSlider } from "@/components/products/related-products";
import { StrengthIndicator } from "@/components/products/strength-indicator";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { ProductPrice } from "@/components/products/product-price";
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
  const [addError, setAddError] = useState("");
  const brand = getBrandBySlug(product.brandSlug);
  const saved = isSaved(product.id);
  const inBasket = isInInquiry(product.id);
  const isAroma = isAromaProduct(product);

  const handleAddToInquiry = () => {
    const result = addToInquiry(product);
    if (!result.ok) {
      setAddError(
        "Nova kolekcija aroma i klasična kolekcija se ne mogu kombinovati. Ispraznite listu za upit pa pokušajte ponovo."
      );
      return;
    }
    setAddError("");
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
            {isAroma ? (
              <Link
                href="/nova-kolekcija"
                className="transition-colors hover:text-primary"
              >
                Nova kolekcija
              </Link>
            ) : (
              <Link href="/products" className="transition-colors hover:text-primary">
                Proizvodi
              </Link>
            )}
            <span className="mx-2">/</span>
            <span className="text-primary">{product.name}</span>
          </nav>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn direction="left">
            <ProductGallery
              images={product.images}
              name={product.name}
              imageFit={isAroma ? "contain" : "cover"}
              imageClassName={isAroma ? "p-6 bg-gradient-to-b from-[#f3f3f6] to-[#e9e9ee]" : undefined}
            />
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="gold">{product.brand}</Badge>
                {isAroma ? (
                  <Badge variant="muted">Nova kolekcija aroma</Badge>
                ) : null}
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

              <ProductPrice
                price={product.price}
                salePrice={product.salePrice}
                size="lg"
                className="mt-5"
              />

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

              {brand && !isAroma && (
                <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                    O brendu {brand.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {brand.description}
                  </p>
                </div>
              )}

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium text-primary">
                  {isAroma
                    ? "Dostupno za veleprodaju. Minimalna narudžba 1 kg — mix okusa samo unutar Nova kolekcije aroma (250 g pakovanje). Ne miješa se sa klasičnom kolekcijom."
                    : "Dostupno za veleprodaju. Minimalna narudžba 1 kg (mix okusa). Pakovanja 200 g i 250 g."}
                </p>
              </div>

              {addError ? (
                <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {addError}
                </p>
              ) : null}

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
          title={isAroma ? "Još iz Nova kolekcije" : "Slični proizvodi"}
        />
      </SectionContainer>
    </div>
  );
}
