"use client";

import { BadgeCheck, PackageCheck, Handshake } from "lucide-react";
import { FadeIn } from "@/components/ui/section";

const features = [
  {
    icon: BadgeCheck,
    title: "Provjereni okusi",
    description:
      "Svaki proizvod dolazi iz sigurnog lanca snabdijevanja. Kvalitet koji možete odmah staviti u ponudu, bez rizika i kompromisa.",
  },
  {
    icon: PackageCheck,
    title: "Brza i sigurna isporuka",
    description:
      "Regionalna skladišta i optimizirana logistika znače da narudžbe stižu na vrijeme, spremne za vašu policu ili meni.",
  },
  {
    icon: Handshake,
    title: "Podrška za vaš lokal",
    description:
      "Pomažemo vam birati okuse, planirati zalihe i graditi ponudu koju gosti primijete i pamte.",
  },
];

export function FeatureSection() {
  return (
    <section className="px-[2.5%] pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="mx-auto max-w-[1400px] rounded-3xl border border-border bg-surface p-8 md:p-14 lg:p-16">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-label">Zašto Layali</span>
            <h2 className="mt-4 font-heading text-[1.75rem] font-medium tracking-tight text-foreground md:text-[2.5rem]">
              Veleprodaja na koju možete računati
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/75">
              Saradjujemo s lounge barovima, kafićima i trgovinama koji traže
              premium okuse za nargilu i pouzdanog partnera iza ponude.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-7">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <div
                className="h-full rounded-2xl border border-border bg-white p-7 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/20 md:p-9"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-[0_4px_20px_rgba(242,95,65,0.35)]">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="mt-6 font-heading text-xl font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-foreground/75">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
