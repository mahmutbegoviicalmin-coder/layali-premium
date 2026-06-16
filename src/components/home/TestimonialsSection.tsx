"use client";

import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import { FadeIn } from "@/components/ui/section";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsSection() {
  return (
    <section className="px-[2.5%] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-label">Iskustva partnera</span>
            <h2 className="mt-4 font-heading text-[1.75rem] font-medium tracking-tight text-foreground md:text-[2.5rem]">
              Šta kažu lokali
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/75">
              Prave recenzije iz lounge barova i kafića koji već rade sa
              Layalijem.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {testimonials.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.05}>
              <article
                className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(242,95,65,0.08)] md:p-7"
              >
                <Quote
                  className="h-5 w-5 text-primary/20"
                  strokeWidth={1.5}
                  aria-hidden
                />

                <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-[1.7] text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold tracking-wide text-white"
                  >
                    {getInitials(t.author)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {t.author}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
