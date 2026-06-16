"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";
import { SectionTitle, FadeIn } from "@/components/ui/section";

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export function RelatedProductsSlider({
  products,
  title = "Related Products",
}: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="mt-16 md:mt-24">
      <FadeIn>
        <SectionTitle title={title} className="text-left mb-8" />
      </FadeIn>
      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-elevated md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-none"
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        <button
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-elevated md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
