"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { heroSlides } from "@/lib/data/hero";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 6000;
const FADE_MS = 650;

export function HeroSection() {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [progressKey, setProgressKey] = useState(0);
  const displayedRef = useRef(0);
  const transitioningRef = useRef(false);

  const changeSlide = useCallback((nextIndex: number) => {
    if (transitioningRef.current || nextIndex === displayedRef.current) return;

    transitioningRef.current = true;
    setPreviousIndex(displayedRef.current);
    setDisplayedIndex(nextIndex);
    displayedRef.current = nextIndex;
    setProgressKey((k) => k + 1);

    window.setTimeout(() => {
      setPreviousIndex(null);
      transitioningRef.current = false;
    }, FADE_MS);
  }, []);

  const next = useCallback(() => {
    changeSlide((displayedRef.current + 1) % heroSlides.length);
  }, [changeSlide]);

  const prev = useCallback(() => {
    changeSlide(
      (displayedRef.current - 1 + heroSlides.length) % heroSlides.length
    );
  }, [changeSlide]);

  const goTo = useCallback(
    (index: number) => {
      changeSlide(index);
    },
    [changeSlide]
  );

  useEffect(() => {
    const timer = window.setInterval(next, SLIDE_DURATION);
    return () => window.clearInterval(timer);
  }, [next]);

  useEffect(() => {
    const nextIdx = (displayedIndex + 1) % heroSlides.length;
    const img = new window.Image();
    img.src = heroSlides[nextIdx].image;
  }, [displayedIndex]);

  const slide = heroSlides[displayedIndex];

  return (
    <section className="relative w-full bg-background" aria-label="Hero slider">
      <div className="absolute left-0 right-0 top-0 z-40 h-[2px]">
        <div
          key={progressKey}
          className="hero-progress-bar h-full bg-primary"
          style={
            {
              "--hero-progress-duration": `${SLIDE_DURATION}ms`,
              backgroundColor: slide.accentColor,
            } as React.CSSProperties
          }
        />
      </div>

      <div className="px-0 pb-3 pt-36 sm:px-4 sm:pb-4 md:px-8 md:pb-5 lg:px-10">
        <div className="relative mx-auto w-full max-w-[1456px] overflow-hidden rounded-none border-0 bg-card sm:rounded-[24px] sm:border sm:border-border md:rounded-[28px] lg:rounded-[32px]">
          <div className="relative h-[min(74vh,680px)] w-full md:h-auto md:min-h-0 md:aspect-video">
            <div className="pointer-events-none absolute right-4 top-4 z-20 sm:right-5 sm:top-5 md:right-6 md:top-6">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.12em] text-white/85 tabular-nums">
                {String(displayedIndex + 1).padStart(2, "0")}
                <span className="mx-1 text-white/35">/</span>
                {String(heroSlides.length).padStart(2, "0")}
              </span>
            </div>

            {/* Samo 2 sloja slika max — manje memorije i GPU opterećenja */}
            <div className="absolute inset-0">
              {previousIndex !== null && (
                <div className="gpu-layer hero-fade-out pointer-events-none absolute inset-0 z-[1]">
                  <Image
                    src={heroSlides[previousIndex].image}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1536px) 92vw, 1456px"
                    aria-hidden
                  />
                </div>
              )}
              <div className="gpu-layer absolute inset-0 z-[2]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={displayedIndex === 0}
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1536px) 92vw, 1456px"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/95 via-black/55 to-black/15 md:hidden" />
            <div className="pointer-events-none absolute inset-0 z-[3] hidden md:block">
              <div className="absolute inset-y-0 left-0 w-[min(62%,680px)] bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 pb-5 sm:p-6 md:hidden">
              <div
                key={`mobile-${slide.id}`}
                className="content-fade-in rounded-2xl border border-white/10 bg-black/55 p-4"
              >
                <HeroCopy slide={slide} variant="mobile" />
              </div>

              <div className="pointer-events-auto mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Prethodni slajd"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex flex-1 items-center justify-center gap-2">
                  {heroSlides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={s.flavor}
                      aria-current={i === displayedIndex ? "true" : undefined}
                      className={cn(
                        "h-2 rounded-full transition-[width,background-color] duration-300",
                        i === displayedIndex ? "w-7 bg-white" : "w-2 bg-white/35"
                      )}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Sljedeći slajd"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="absolute inset-0 z-10 hidden items-center gap-4 px-5 md:flex lg:gap-6 lg:px-8">
              <button
                type="button"
                onClick={prev}
                aria-label="Prethodni slajd"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition-colors duration-200 hover:bg-black/65"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex min-w-0 flex-1 items-center">
                <div
                  key={`desktop-${slide.id}`}
                  className="content-fade-in pointer-events-auto w-full max-w-[440px]"
                >
                  <div className="rounded-2xl border border-white/12 bg-black/55 p-7 shadow-[0_12px_40px_rgba(0,0,0,0.35)] lg:p-8">
                    <HeroCopy slide={slide} variant="desktop" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Sljedeći slajd"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition-colors duration-200 hover:bg-black/65"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCopy({
  slide,
  variant = "desktop",
}: {
  slide: (typeof heroSlides)[number];
  variant?: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";
  const textShadow = "[text-shadow:0_1px_3px_rgba(0,0,0,0.6)]";

  return (
    <div className={cn(isMobile && "pointer-events-auto")}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em]",
            "border border-white/25 bg-white/15 text-white"
          )}
        >
          {slide.flavor}
        </span>
        {slide.isBestSeller && (
          <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider text-primary">
            Bestseler
          </span>
        )}
      </div>

      {!isMobile && (
        <div className="mt-4 h-[2px] w-10 rounded-full bg-white/80" />
      )}

      <p
        className={cn(
          "font-semibold uppercase tracking-[0.18em] text-white/95",
          textShadow,
          isMobile ? "mt-3 text-[0.75rem]" : "mt-4 text-[0.6875rem] tracking-[0.2em]"
        )}
      >
        {slide.eyebrow}
      </p>

      <h1
        className={cn(
          "font-heading font-medium tracking-tight text-white",
          textShadow,
          isMobile
            ? "mt-2 text-[1.75rem] leading-[1.12] sm:text-[2rem]"
            : "mt-2 text-[1.875rem] leading-[1.12] lg:text-[2.125rem]"
        )}
      >
        {slide.headline}
      </h1>

      <p
        className={cn(
          "leading-relaxed text-white/95",
          textShadow,
          isMobile
            ? "mt-2.5 max-w-[32ch] text-[0.9375rem]"
            : "mt-3 max-w-[34ch] text-[0.9375rem]"
        )}
      >
        {slide.subheadline}
      </p>

      <div
        className={cn(
          "flex gap-2.5",
          isMobile ? "mt-5 flex-col" : "mt-7 flex-wrap items-center"
        )}
      >
        <Link
          href="/products"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200",
            isMobile
              ? "h-[3.25rem] w-full bg-white text-[0.9375rem] text-primary shadow-md hover:bg-white/90"
              : "h-11 bg-white px-6 text-sm text-primary shadow-md hover:bg-white/90"
          )}
        >
          Pregledaj ponudu
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/contact"
          className={cn(
            "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200",
            isMobile
              ? "h-12 w-full border border-white/35 bg-white/15 text-[0.9375rem] text-white hover:bg-white/25"
              : "h-11 border border-white/35 bg-white/15 px-6 text-sm text-white hover:bg-white/25"
          )}
        >
          Postani partner
        </Link>
      </div>
    </div>
  );
}
