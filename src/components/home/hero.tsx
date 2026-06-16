"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/section";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
    headline: "Premium Hookah Flavors For Modern Businesses",
    subheadline:
      "Wholesale distribution of the world's most demanded shisha flavors for cafes, lounges, bars and tobacco stores.",
  },
  {
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d66?w=1200&q=80&auto=format&fit=crop",
    headline: "Curated Brands. Unmatched Quality.",
    subheadline:
      "Partner with Layali for verified premium brands, reliable supply chains, and dedicated wholesale support.",
  },
  {
    image: "https://images.unsplash.com/photo-1608275664059-6a352b3f6f6?w=1200&q=80&auto=format&fit=crop",
    headline: "Elevate Your Flavor Portfolio",
    subheadline:
      "From exotic blends to ice sensations — discover flavors that keep your customers coming back.",
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="pt-28 pb-8 md:pt-32">
      <div className="mx-auto w-[95%] max-w-7xl">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[24px] bg-white shadow-elevated min-h-[500px] md:min-h-[700px]">
            <div className="grid md:grid-cols-2 h-full min-h-[500px] md:min-h-[700px]">
              {/* Image Side */}
              <div className="relative h-[280px] md:h-auto overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      className="object-cover"
                      priority={current === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:bg-gradient-to-r md:from-transparent md:to-white" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content Side */}
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent-gold">
                      Wholesale Distribution
                    </p>
                    <h1 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-primary">
                      {slide.headline}
                    </h1>
                    <p className="mt-6 text-base md:text-lg leading-relaxed text-muted max-w-lg">
                      {slide.subheadline}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link href="/products">
                        <Button variant="primary" size="lg">
                          View Collection
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="secondary" size="lg">
                          Become Partner
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="mt-10 flex items-center gap-6">
                  <div className="flex gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => {
                          setDirection(i > current ? 1 : -1);
                          setCurrent(i);
                        }}
                        className="group relative h-1 w-8 overflow-hidden rounded-full bg-primary/10"
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full bg-accent-gold"
                          initial={false}
                          animate={{
                            scaleX: i === current ? 1 : 0,
                            originX: 0,
                          }}
                          transition={{ duration: i === current ? 6 : 0.3 }}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      aria-label="Previous slide"
                      onClick={prev}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 text-primary transition-colors hover:border-accent-gold hover:text-accent-gold"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      aria-label="Next slide"
                      onClick={next}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 text-primary transition-colors hover:border-accent-gold hover:text-accent-gold"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
