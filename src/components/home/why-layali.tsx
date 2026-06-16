"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import {
  Section,
  SectionContainer,
  FadeIn,
} from "@/components/ui/section";

const benefits = [
  "Large product portfolio",
  "Reliable supply chain",
  "Competitive wholesale pricing",
  "Fast regional delivery",
  "Dedicated account managers",
];

export function WhyLayali() {
  return (
    <Section>
      <SectionContainer>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn direction="left">
            <div className="relative overflow-hidden rounded-[24px] shadow-elevated aspect-[4/5] max-h-[600px]">
              <Image
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d66?w=800&q=80&auto=format&fit=crop"
                alt="Premium hookah lounge atmosphere"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent-gold">
              Why Layali
            </p>
            <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-primary leading-tight">
              Your Trusted Wholesale Partner
            </h2>
            <p className="mt-6 text-muted text-base md:text-lg leading-relaxed">
              We combine deep industry expertise with a premium product
              portfolio to help cafes, lounges, and retailers thrive in a
              competitive market.
            </p>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-primary font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </SectionContainer>
    </Section>
  );
}
