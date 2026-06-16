"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductTab } from "@/lib/types";
import { getProductsByTab } from "@/lib/data/products";
import { ProductCard } from "@/components/products/product-card";
import {
  Section,
  SectionContainer,
  SectionTitle,
  FadeIn,
} from "@/components/ui/section";
import { cn } from "@/lib/utils";

const tabs: { id: ProductTab; label: string }[] = [
  { id: "best-sellers", label: "Best Sellers" },
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "fruit", label: "Fruit Flavors" },
  { id: "ice", label: "Ice Flavors" },
  { id: "exotic", label: "Exotic Mixes" },
  { id: "premium", label: "Premium Series" },
];

export function ProductCollection() {
  const [activeTab, setActiveTab] = useState<ProductTab>("best-sellers");
  const scrollRef = useRef<HTMLDivElement>(null);
  const products = getProductsByTab(activeTab);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <Section id="collection">
      <SectionContainer>
        <div className="rounded-[32px] bg-white p-8 md:p-12 lg:p-16 shadow-soft">
          <FadeIn>
            <SectionTitle
              title="Explore Our Collection"
              subtitle="Discover premium shisha flavors curated for wholesale partners"
            />
          </FadeIn>

          {/* Tabs */}
          <FadeIn delay={0.1}>
            <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "shrink-0 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-soft"
                      : "bg-light-bg text-muted hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Slider */}
          <div className="relative">
            <button
              aria-label="Scroll left"
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-elevated text-primary transition-colors hover:text-accent-gold md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-none snap-x snap-mandatory"
            >
              {products.map((product, i) => (
                <div key={product.id} className="snap-start">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>

            <button
              aria-label="Scroll right"
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-elevated text-primary transition-colors hover:text-accent-gold md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </SectionContainer>
    </Section>
  );
}
