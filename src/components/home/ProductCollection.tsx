"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/context/products-context";
import { cn } from "@/lib/utils";

const SLIDE_MS = 520;

type SlideDirection = "next" | "prev";

function StrengthDots({ strength }: { strength: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Jačina ${strength} od 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 rounded-full transition-[width,background-color] duration-300",
            i < strength ? "w-5 bg-primary" : "w-1 bg-border"
          )}
        />
      ))}
    </div>
  );
}

export function ProductCollection() {
  const { homepageProducts, loading } = useProducts();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<SlideDirection>("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAltImage, setShowAltImage] = useState(false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = homepageProducts.length;
  const activeProduct = homepageProducts[activeIndex];
  const previousProduct =
    previousIndex !== null ? homepageProducts[previousIndex] : null;
  const altImage =
    activeProduct && activeProduct.images.length > 1
      ? activeProduct.images[1]
      : null;

  const goTo = useCallback(
    (index: number, dir: SlideDirection) => {
      if (count === 0 || isAnimating) return;
      const normalized = ((index % count) + count) % count;
      if (normalized === activeIndex) return;

      setDirection(dir);
      setPreviousIndex(activeIndex);
      setActiveIndex(normalized);
      setShowAltImage(false);
      setIsAnimating(true);

      window.setTimeout(() => {
        setPreviousIndex(null);
        setIsAnimating(false);
      }, SLIDE_MS);
    },
    [activeIndex, count, isAnimating]
  );

  const prev = () => goTo(activeIndex - 1, "prev");
  const next = () => goTo(activeIndex + 1, "next");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(activeIndex - 1, "prev");
      if (e.key === "ArrowRight") goTo(activeIndex + 1, "next");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  useEffect(() => {
    const el = thumbRefs.current[activeIndex];
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  const slideInClass =
    direction === "next" ? "product-slide-in-next" : "product-slide-in-prev";
  const slideOutClass =
    direction === "next" ? "product-slide-out-next" : "product-slide-out-prev";

  return (
    <section className="border-t border-border/70 bg-background">
      <div className="mx-auto max-w-[1200px] px-[5%] py-14 md:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Katalog
            </p>
            <h2 className="mt-2 font-heading text-[2rem] font-medium leading-tight tracking-tight text-foreground md:text-[2.5rem]">
              Premium okusi za nargilu
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            Cijela ponuda
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="aspect-[4/5] max-h-[520px] rounded-3xl bg-surface" />
            <div className="space-y-4">
              <div className="h-4 w-32 rounded bg-surface" />
              <div className="h-10 w-64 rounded bg-surface" />
              <div className="h-24 w-full rounded bg-surface" />
            </div>
          </div>
        ) : activeProduct ? (
          <>
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div
                  className="group relative aspect-[4/5] max-h-[min(72vh,560px)] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#f3f3f6] to-[#e9e9ee] ring-1 ring-black/[0.04]"
                  onMouseEnter={() => altImage && setShowAltImage(true)}
                  onMouseLeave={() => setShowAltImage(false)}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    {previousProduct && (
                      <div
                        className={cn(
                          "gpu-layer absolute inset-0 flex items-center justify-center p-8 sm:p-12",
                          slideOutClass
                        )}
                      >
                        <Image
                          src={previousProduct.image}
                          alt=""
                          width={560}
                          height={560}
                          className="max-h-full w-full object-contain drop-shadow-[0_24px_48px_rgba(242,95,65,0.15)]"
                          sizes="(max-width: 1024px) 90vw, 480px"
                          aria-hidden
                        />
                      </div>
                    )}

                    <div
                      className={cn(
                        "gpu-layer absolute inset-0 flex items-center justify-center p-8 sm:p-12",
                        previousProduct && slideInClass
                      )}
                    >
                      <Image
                        src={
                          showAltImage && altImage
                            ? altImage
                            : activeProduct.image
                        }
                        alt={activeProduct.name}
                        width={560}
                        height={560}
                        className="max-h-full w-full object-contain drop-shadow-[0_24px_48px_rgba(242,95,65,0.15)] transition-opacity duration-300 ease-out"
                        sizes="(max-width: 1024px) 90vw, 480px"
                        priority={activeIndex < 2}
                      />
                    </div>
                  </div>

                  {(activeProduct.isBestSeller || activeProduct.isNew) && (
                    <span
                      className={cn(
                        "absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em]",
                        activeProduct.isBestSeller
                          ? "bg-primary text-white"
                          : "bg-white text-primary ring-1 ring-black/5"
                      )}
                    >
                      {activeProduct.isBestSeller ? "Bestseler" : "Novo"}
                    </span>
                  )}

                  {altImage && (
                    <p className="absolute bottom-4 left-4 z-10 text-[0.6875rem] text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Drugi prikaz pakovanja
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Prethodni proizvod"
                  onClick={prev}
                  disabled={isAnimating}
                  className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 lg:left-3 lg:translate-x-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Sljedeći proizvod"
                  onClick={next}
                  disabled={isAnimating}
                  className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 lg:right-3 lg:translate-x-0"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="relative min-w-0 overflow-hidden">
                {previousProduct && (
                  <div
                    className={cn(
                      "absolute inset-0",
                      direction === "next"
                        ? "product-text-slide-out-next"
                        : "product-text-slide-out-prev"
                    )}
                    aria-hidden
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {previousProduct.categoryLabel}
                    </p>
                    <h3 className="mt-2 font-heading text-[2rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem]">
                      {previousProduct.name}
                    </h3>
                  </div>
                )}

                <div
                  className={cn(
                    previousProduct &&
                      (direction === "next"
                        ? "product-text-slide-in-next"
                        : "product-text-slide-in-prev")
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                    {activeProduct.categoryLabel}
                    <span className="mx-2 text-border">·</span>
                    {activeProduct.origin}
                  </p>
                  <h3 className="mt-2 font-heading text-[2rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem]">
                    {activeProduct.name}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-foreground/75">
                    {activeProduct.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-5">
                    <StrengthDots strength={activeProduct.strength} />
                    <span className="text-sm text-muted">
                      {activeProduct.packagingSizes.join(" · ")}
                    </span>
                  </div>
                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-[background-color,box-shadow] duration-200 hover:bg-hover-gold hover:shadow-lg"
                  >
                    Pogledaj detalje
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="mt-8 flex items-center gap-3 text-sm tabular-nums text-muted">
                  <span>
                    {String(activeIndex + 1).padStart(2, "0")}
                    <span className="mx-1 text-border">/</span>
                    {String(count).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 max-w-[120px] bg-border">
                    <div
                      className="h-full origin-left bg-primary transition-transform duration-500 ease-out"
                      style={{
                        transform: `scaleX(${
                          count > 1 ? activeIndex / (count - 1) : 1
                        })`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-border/60 pt-8">
              <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">
                Svi okusi u ponudi
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {homepageProducts.map((product, i) => (
                  <button
                    key={product.id}
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    type="button"
                    aria-label={product.name}
                    aria-current={i === activeIndex ? "true" : undefined}
                    onClick={() => {
                      if (i === activeIndex) return;
                      const forward = (i - activeIndex + count) % count;
                      const backward = (activeIndex - i + count) % count;
                      goTo(i, forward <= backward ? "next" : "prev");
                    }}
                    disabled={isAnimating}
                    className={cn(
                      "relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f3f3f6] p-2 transition-[opacity,transform,box-shadow] duration-300 sm:h-20 sm:w-20",
                      i === activeIndex
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                        : "opacity-60 hover:opacity-100 hover:ring-1 hover:ring-black/10"
                    )}
                  >
                    <Image
                      src={product.image}
                      alt=""
                      width={80}
                      height={80}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
