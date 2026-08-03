"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/products/product-image";

interface ProductGalleryProps {
  images: string[];
  name: string;
  imageFit?: "cover" | "contain";
  imageClassName?: string;
}

export function ProductGallery({
  images,
  name,
  imageFit = "cover",
  imageClassName,
}: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-[24px] bg-white shadow-soft",
          imageClassName
        )}
      >
        <ProductImage
          src={images[selected]}
          alt={name}
          fill
          className={cn(imageFit === "contain" ? "object-contain" : "object-cover")}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              aria-label={`View image ${i + 1}`}
              onClick={() => setSelected(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all",
                selected === i
                  ? "border-accent-gold shadow-soft"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <ProductImage
                src={img}
                alt=""
                fill
                className={imageFit === "contain" ? "object-contain p-1" : "object-cover"}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
