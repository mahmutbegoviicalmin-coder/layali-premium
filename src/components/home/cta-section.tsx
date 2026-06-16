"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, Section, SectionContainer } from "@/components/ui/section";

export function CTASection() {
  return (
    <Section>
      <SectionContainer>
        <FadeIn>
          <div className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,106,0.15),transparent_60%)]" />
            <div className="relative">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-tight max-w-2xl mx-auto">
                Ready To Expand Your Flavor Selection?
              </h2>
              <p className="mt-4 text-white/60 text-base md:text-lg max-w-xl mx-auto">
                Join hundreds of premium venues and retailers who trust Layali
                for wholesale hookah flavor distribution.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/products">
                  <Button variant="gold" size="lg">
                    Browse Products
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Become Partner
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </SectionContainer>
    </Section>
  );
}
