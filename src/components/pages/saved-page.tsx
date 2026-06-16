"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useSavedProducts } from "@/context/saved-products-context";
import { useInquiryBasket } from "@/context/inquiry-basket-context";
import { Button } from "@/components/ui/button";
import { FadeIn, SectionContainer, SectionTitle } from "@/components/ui/section";

export function SavedProductsPage() {
  const { savedProducts, toggleSave } = useSavedProducts();
  const { addToInquiry } = useInquiryBasket();

  return (
    <div className="pt-36 pb-16">
      <SectionContainer>
        <FadeIn>
          <SectionTitle
            title="Sačuvani proizvodi"
            subtitle="Vaša odabrana ponuda okusa za veleprodajni upit"
          />
        </FadeIn>

        {savedProducts.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-12 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted/40" />
              <h3 className="mt-4 font-heading text-xl text-primary">
                Još nema sačuvanih proizvoda
              </h3>
              <p className="mt-2 text-sm text-muted">
                Pregledajte katalog i sačuvajte okuse koji vas zanimaju.
              </p>
              <Link href="/products" className="mt-6 inline-block">
                <Button variant="gold">Pregledaj proizvode</Button>
              </Link>
            </div>
          </FadeIn>
        ) : (
          <div className="grid gap-4">
            {savedProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-white p-5 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                      {product.brand}
                    </p>
                    <h3 className="font-heading text-lg font-medium text-primary">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted">{product.categoryLabel}</p>
                  </div>
                  <div className="flex w-full gap-2 sm:w-auto">
                    <Link href={`/products/${product.slug}`}>
                      <Button variant="secondary" size="sm">
                        Pogledaj detalje
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToInquiry(product)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Dodaj u listu
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ukloni iz sačuvanih"
                      onClick={() => toggleSave(product)}
                    >
                      <Trash2 className="h-4 w-4 text-muted" />
                    </Button>
                  </div>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.2}>
              <div className="mt-8 flex justify-center">
                <Link href="/inquiry">
                  <Button variant="gold" size="lg">
                    Idi na listu za upit
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
