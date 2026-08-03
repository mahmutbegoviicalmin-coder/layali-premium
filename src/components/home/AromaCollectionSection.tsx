"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { groupAromaProductsByCategory } from "@/lib/catalog/filters";
import { useProducts } from "@/context/products-context";
import { useInquiryBasket } from "@/context/inquiry-basket-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/products/product-image";
import { FadeIn, SectionContainer } from "@/components/ui/section";

const AromaProductCard = memo(function AromaProductCard({
  product,
  priority = false,
  onAdd,
  inBasket,
}: {
  product: Product;
  priority?: boolean;
  onAdd: () => void;
  inBasket: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/20">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-b from-[#f3f3f6] to-[#e9e9ee]"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        />
        {product.isNew ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wide text-white">
            Novo
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted">
          {product.categoryLabel}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 font-heading text-lg font-medium leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-xs text-muted">Pakovanje 250 g</p>

        <div className="mt-auto flex gap-2 pt-4">
          <Button
            type="button"
            variant="gold"
            size="sm"
            className="flex-1"
            onClick={onAdd}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {inBasket ? "Dodano" : "Dodaj u upit"}
          </Button>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-9 items-center justify-center rounded-full border border-border px-3 text-xs font-medium text-foreground/75 transition-colors hover:border-primary/30 hover:text-primary"
          >
            Detalji
          </Link>
        </div>
      </div>
    </article>
  );
});

export function AromaCollectionSection() {
  const { aromaProducts, aromaLoading } = useProducts();
  const { addToInquiry, isInInquiry } = useInquiryBasket();
  const [conflict, setConflict] = useState("");

  const grouped = groupAromaProductsByCategory(aromaProducts);

  const handleAdd = (product: Product) => {
    const result = addToInquiry(product);
    if (!result.ok) {
      setConflict(
        "Nova kolekcija aroma i klasična kolekcija se ne mogu kombinovati. Ispraznite listu za upit pa pokušajte ponovo."
      );
      return;
    }
    setConflict("");
  };

  if (!aromaLoading && aromaProducts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/70 bg-surface/40">
      <SectionContainer className="py-14 md:py-20">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Badge variant="gold" className="mb-3">
                Nova linija
              </Badge>
              <h2 className="font-heading text-[2rem] font-medium leading-tight tracking-tight text-foreground md:text-[2.5rem]">
                Nova kolekcija aroma
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                Premium okusi u pakovanju od 250 g. Mix okusa unutar ove kolekcije
                do minimuma od 1 kg — odvojeno od klasične Layali ponude.
              </p>
            </div>
            <Link
              href="/nova-kolekcija"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Cijela kolekcija
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeIn>

        {conflict ? (
          <p className="mt-6 rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {conflict}
          </p>
        ) : null}

        {aromaLoading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-white/80" />
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {grouped.slice(0, 2).map((group, groupIndex) => (
              <FadeIn key={group.category} delay={groupIndex * 0.05}>
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/70 pb-3">
                  <h3 className="font-heading text-xl font-medium text-foreground">
                    {group.label}
                  </h3>
                  <span className="text-sm text-muted">
                    {group.products.length} okusa
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {group.products.slice(0, 4).map((product, index) => (
                    <AromaProductCard
                      key={product.id}
                      product={product}
                      priority={groupIndex === 0 && index < 2}
                      inBasket={isInInquiry(product.id)}
                      onAdd={() => handleAdd(product)}
                    />
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}
