"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/ui/section";

const benefits = [
  "Širok portfolio proizvoda",
  "Pouzdan lanac snabdijevanja",
  "Konkurentne veleprodajne cijene",
  "Brza regionalna isporuka",
  "Posvećeni account manageri",
];

export function WhyLayaliSection() {
  return (
    <section className="px-[2.5%] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-0 overflow-hidden rounded-3xl border border-border bg-white lg:grid-cols-2">
        <FadeIn direction="none" className="relative min-h-[420px] lg:min-h-[580px]">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85&auto=format&fit=crop"
            alt="Premium okusi za nargilu"
            fill
            className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
        </FadeIn>

        <div className="flex flex-col justify-center p-10 md:p-14 lg:p-16">
          <FadeIn>
            <span className="section-label">O Layaliju</span>
            <h2 className="mt-4 font-heading text-[2rem] font-medium tracking-tight text-foreground md:text-[2.35rem]">
              Vaš pouzdani veleprodajni partner
            </h2>
            <p className="mt-5 text-[0.9375rem] leading-[1.75] text-muted md:text-base">
              Layali povezuje premium brendove nargile s lokalsima koji traže
              izvrsnost. Razumijemo ritam veleprodaje, od planiranja zaliha do
              sezonske potražnje, kako biste se vi fokusirali na goste.
            </p>
          </FadeIn>

          <ul className="mt-10 space-y-5">
            {benefits.map((benefit, i) => (
              <FadeIn key={benefit} delay={0.08 + i * 0.05}>
                <li className="flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                    <Check className="h-4 w-4 text-primary" strokeWidth={2} />
                  </div>
                  <span className="text-[0.9375rem] font-medium text-primary md:text-base">
                    {benefit}
                  </span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
