"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import {
  Section,
  SectionContainer,
  SectionTitle,
  FadeIn,
} from "@/components/ui/section";

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <Section>
      <SectionContainer>
        <FadeIn>
          <SectionTitle
            title="Trusted by Industry Leaders"
            subtitle="What our wholesale partners say about working with Layali"
          />
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative mx-auto max-w-4xl rounded-[32px] bg-white p-10 md:p-16 shadow-soft">
            <Quote className="h-10 w-10 text-accent-gold/40" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                <blockquote className="font-heading text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-primary">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gold/15 text-sm font-bold text-accent-gold">
                    {t.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{t.author}</p>
                    <p className="text-sm text-muted">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-8 bg-accent-gold"
                        : "w-2 bg-primary/10 hover:bg-primary/20"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  aria-label="Previous testimonial"
                  onClick={prev}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 text-primary hover:border-accent-gold hover:text-accent-gold transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next testimonial"
                  onClick={next}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 text-primary hover:border-accent-gold hover:text-accent-gold transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </SectionContainer>
    </Section>
  );
}
