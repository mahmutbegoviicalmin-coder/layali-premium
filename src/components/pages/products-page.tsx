"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ProductCategory, ProductTab } from "@/lib/types";
import { filterProductsByTab, groupProductsByCategory } from "@/lib/catalog/filters";
import { useProducts } from "@/context/products-context";
import { ProductCard } from "@/components/products/product-card";
import {
  SectionContainer,
  SectionTitle,
  FadeIn,
} from "@/components/ui/section";
import { cn } from "@/lib/utils";

const tabs: { id: ProductTab | ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "Svi proizvodi" },
  { id: "best-sellers", label: "Bestseleri" },
  { id: "new-arrivals", label: "Novi proizvodi" },
  { id: "ice", label: "Ledeni okusi" },
  { id: "fruit", label: "Voćni okusi" },
  { id: "dessert", label: "Desertni okusi" },
  { id: "mint", label: "Mentol i svježina" },
  { id: "exotic", label: "Egzotične mješavine" },
  { id: "premium", label: "Premium serija" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<ProductTab | ProductCategory | "all">(
    tabParam && tabs.some((t) => t.id === tabParam)
      ? (tabParam as ProductTab | ProductCategory)
      : "all"
  );

  const { products, loading } = useProducts();

  const displayed =
    activeTab === "all" ? products : filterProductsByTab(products, activeTab);

  const grouped =
    activeTab === "all" ? groupProductsByCategory(displayed) : null;

  return (
    <div className="pt-36 pb-16">
      <SectionContainer>
        <FadeIn>
          <SectionTitle
            title="Naši proizvodi"
            subtitle="Pregledajte kompletan Layali premium katalog za veleprodaju"
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-10 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "border border-border bg-white text-muted hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {loading ? (
          <div className="py-16 text-center text-muted">Učitavanje proizvoda...</div>
        ) : displayed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white py-16 text-center">
            <p className="text-muted">Nema proizvoda za odabrani filter.</p>
          </div>
        ) : grouped ? (
          <div className="space-y-12">
            {grouped.map((group) => (
              <FadeIn key={group.category}>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <div>
                    <h2 className="font-heading text-2xl font-medium text-foreground">
                      {group.label}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {group.products.length} okusa u ovoj kategoriji
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.products.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      className="w-full"
                    />
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayed.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              className="w-full"
            />
          ))}
        </div>
        )}
      </SectionContainer>
    </div>
  );
}

export function ProductsPageContent() {
  return (
    <Suspense
      fallback={
        <div className="pt-36 pb-16 text-center text-muted">Učitavanje...</div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
