"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/context/products-context";
import { ProductImage } from "@/components/products/product-image";
import { ProductPrice } from "@/components/products/product-price";
import { cn } from "@/lib/utils";

const SLIDE_MS = 380;

function StrengthDots({ strength }: { strength: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Jačina ${strength} od 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 rounded-full",
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
  const [showAltImage, setShowAltImage] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  const [slide, setSlide] = useState<{
    from: number;
    to: number;
    direction: 1 | -1;
    phase: "start" | "end";
  } | null>(null);

  const animatingRef = useRef(false);
  const slideTimerRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);

  const count = homepageProducts.length;

  const clearSlideTimer = () => {
    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  };

  const goTo = useCallback(
    (index: number) => {
      if (count === 0 || animatingRef.current) return;
      const normalized = ((index % count) + count) % count;
      if (normalized === activeIndex) return;

      clearSlideTimer();
      animatingRef.current = true;
      setShowAltImage(false);

      const direction: 1 | -1 =
        normalized === activeIndex
          ? 1
          : normalized > activeIndex
            ? 1
            : normalized < activeIndex
              ? -1
              : 1;

      // Wrap-aware direction (e.g. last → first should feel like "next")
      let dir: 1 | -1 = direction;
      if (activeIndex === count - 1 && normalized === 0) dir = 1;
      if (activeIndex === 0 && normalized === count - 1) dir = -1;

      setSlide({
        from: activeIndex,
        to: normalized,
        direction: dir,
        phase: "start",
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlide((current) =>
            current ? { ...current, phase: "end" } : current
          );
        });
      });

      slideTimerRef.current = window.setTimeout(() => {
        setActiveIndex(normalized);
        setSlide(null);
        animatingRef.current = false;
        slideTimerRef.current = null;
      }, SLIDE_MS);
    },
    [activeIndex, count]
  );

  activeIndexRef.current = activeIndex;

  const activeProduct = homepageProducts[activeIndex];
  const altImage =
    activeProduct && activeProduct.images.length > 1
      ? activeProduct.images[1]
      : null;

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  useEffect(() => {
    return () => clearSlideTimer();
  }, []);

  useEffect(() => {
    if (count === 0) return;

    const indices = new Set<number>([
      activeIndex,
      (activeIndex + 1) % count,
      (activeIndex - 1 + count) % count,
    ]);

    indices.forEach((i) => {
      const product = homepageProducts[i];
      if (!product) return;
      const img = new window.Image();
      img.src = product.image;
    });
  }, [activeIndex, count, homepageProducts]);

  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToRef.current(activeIndexRef.current - 1);
      if (e.key === "ArrowRight") goToRef.current(activeIndexRef.current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;

    const thumb = strip.children[activeIndex] as HTMLElement | undefined;
    if (!thumb) return;

    const target =
      thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2;

    strip.scrollTo({ left: target, behavior: "auto" });
  }, [activeIndex]);

  const renderSlideImage = (
    productIndex: number,
    options?: { allowAlt?: boolean }
  ) => {
    const product = homepageProducts[productIndex];
    if (!product) return null;

    const secondary =
      product.images.length > 1 ? product.images[1] : null;
    const isActive = productIndex === activeIndex;
    const showAlt =
      options?.allowAlt && isActive && showAltImage && secondary;

    return (
      <ProductImage
        src={showAlt ? secondary! : product.image}
        alt={product.name}
        width={560}
        height={560}
        className="max-h-full w-full object-contain"
        sizes="(max-width: 1024px) 90vw, 480px"
        priority={productIndex < 2}
      />
    );
  };

  const slideTransform = slide
    ? slide.direction === 1
      ? slide.phase === "start"
        ? "translate3d(0, 0, 0)"
        : "translate3d(-50%, 0, 0)"
      : slide.phase === "start"
        ? "translate3d(-50%, 0, 0)"
        : "translate3d(0, 0, 0)"
    : "translate3d(0, 0, 0)";

  const slideTransition =
    slide && slide.phase === "end"
      ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : "none";

  const fromIndex = slide?.from ?? activeIndex;
  const toIndex = slide?.to ?? activeIndex;

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
                  <div className="relative h-full w-full">
                    {slide ? (
                      <div
                        className={cn(
                          "product-slider-track flex h-full w-[200%] gpu-layer",
                          slide?.phase === "end" && "is-sliding"
                        )}
                        style={{
                          transform: slideTransform,
                          transition: slideTransition,
                        }}
                      >
                        {slide.direction === 1 ? (
                          <>
                            <div className="flex w-1/2 shrink-0 items-center justify-center p-8 sm:p-12">
                              {renderSlideImage(fromIndex)}
                            </div>
                            <div className="flex w-1/2 shrink-0 items-center justify-center p-8 sm:p-12">
                              {renderSlideImage(toIndex)}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex w-1/2 shrink-0 items-center justify-center p-8 sm:p-12">
                              {renderSlideImage(toIndex)}
                            </div>
                            <div className="flex w-1/2 shrink-0 items-center justify-center p-8 sm:p-12">
                              {renderSlideImage(fromIndex)}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center p-8 sm:p-12 gpu-layer">
                        {renderSlideImage(activeIndex, { allowAlt: true })}
                      </div>
                    )}
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

                  {altImage && !slide && (
                    <p className="absolute bottom-4 left-4 z-10 text-[0.6875rem] text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Drugi prikaz pakovanja
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Prethodni proizvod"
                  onClick={prev}
                  className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-95 lg:left-3 lg:translate-x-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Sljedeći proizvod"
                  onClick={next}
                  className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-95 lg:right-3 lg:translate-x-0"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="relative min-w-0">
                <div key={activeProduct.id} className="product-info-fade">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                    {activeProduct.categoryLabel}
                    <span className="mx-2 text-border">·</span>
                    {activeProduct.origin}
                  </p>
                  <h3 className="mt-2 font-heading text-[2rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem]">
                    {activeProduct.name}
                  </h3>
                  <ProductPrice
                    price={activeProduct.price}
                    salePrice={activeProduct.salePrice}
                    size="lg"
                    className="mt-3"
                  />
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
                      className="h-full origin-left bg-primary transition-transform duration-[380ms] ease-out"
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
              <div
                ref={thumbStripRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
              >
                {homepageProducts.map((product, i) => (
                  <button
                    key={product.id}
                    type="button"
                    aria-label={product.name}
                    aria-current={i === activeIndex ? "true" : undefined}
                    onClick={() => goTo(i)}
                    className={cn(
                      "relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f3f3f6] p-2 transition-[opacity,transform] duration-200 sm:h-20 sm:w-20",
                      i === activeIndex
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                        : "opacity-60 hover:opacity-100 hover:ring-1 hover:ring-black/10"
                    )}
                  >
                    <ProductImage
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
