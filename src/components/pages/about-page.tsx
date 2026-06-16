"use client";

import Link from "next/link";
import { ArrowRight, Target, Shield, Handshake } from "lucide-react";
import { HookahVisual } from "@/components/about/hookah-visual";
import { FadeIn } from "@/components/ui/section";

const pillars = [
  {
    icon: Target,
    title: "Jedan fokus",
    text: "Nargila i duhan za nargilu. Bez rasipanja pažnje, bez kompromisa po stručnosti.",
  },
  {
    icon: Shield,
    title: "Stroga selekcija",
    text: "Svaki proizvod prolazi testiranje prije nego stigne do vašeg lokala.",
  },
  {
    icon: Handshake,
    title: "Dugoročni odnosi",
    text: "Transparentnost, pouzdanost i partnerstvo koje gradi ponudu, ne samo narudžbu.",
  },
];

export function AboutPageContent() {
  return (
    <div className="px-[2.5%] pb-20 pt-36 md:pb-24">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-label">O nama</span>
            <h1 className="mt-4 font-heading text-[2rem] font-medium tracking-tight text-foreground md:text-[2.75rem] lg:text-5xl">
              Stručnost posvećena nargili
            </h1>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted md:text-base">
              Bavimo se uvozom, distribucijom i razvojem brendova koji donose
              vrhunsku vrijednost na tržište.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid items-start gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-12">
          <FadeIn direction="none" className="order-2 lg:order-1 lg:sticky lg:top-32">
            <HookahVisual />
          </FadeIn>

          <FadeIn delay={0.1} className="order-1 lg:order-2">
            <div className="flex flex-col justify-center lg:py-2">
              <h2 className="font-heading text-[1.375rem] font-medium leading-snug text-foreground md:text-[1.75rem]">
                Ekskluzivni predstavnik brenda Layali
              </h2>

              <div className="mt-5 space-y-4 text-[0.9375rem] leading-[1.7] text-muted md:text-base">
                <p>
                  Fokusirani smo isključivo na segment nargile i duhana za
                  nargilu, jer vjerujemo da su stručnost i posvećenost jedini
                  pravi put ka savršenstvu.
                </p>
                <p>
                  Kao ekskluzivni predstavnik brenda Layali, donijeli smo na
                  tržište novu dimenziju pušenja nargile. Svaki proizvod koji
                  nosi naše ime prolazi strogu selekciju i testiranje, jer ništa
                  manje od izvrsnosti ne prihvatamo, ni za sebe ni za svoje
                  klijente.
                </p>
                <p>
                  Naša vizija je postati lider u distribuciji vrhunskih aroma
                  za nargilu u regiji i šire. Pristup temeljimo na dugoročnim
                  odnosima, transparentnosti i apsolutnoj posvećenosti
                  kvaliteti.
                </p>
              </div>

              <Link
                href="/contact"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-hover-gold sm:w-fit"
              >
                Postani partner
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3 md:mt-16 md:gap-5">
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={0.08 + i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-white p-6 md:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
                  <pillar.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 font-heading text-lg font-medium text-primary">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {pillar.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.15}>
          <div
            id="wholesale"
            className="mt-12 scroll-mt-32 rounded-3xl border border-border bg-surface px-6 py-10 text-center md:mt-16 md:px-12 md:py-14"
          >
            <h2 className="font-heading text-xl font-medium text-foreground md:text-2xl">
              Veleprodajni program
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-[0.9375rem]">
              Saradjujemo s lounge barovima, kafićima i trgovinama koje traže
              premium okuse i pouzdanog distributera. Pošaljite upit i saznajte
              kako Layali može unaprijediti vašu ponudu.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/inquiry"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-white transition-colors hover:bg-hover-gold"
              >
                Pošalji upit
              </Link>
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-7 text-sm font-medium text-primary transition-colors hover:border-primary"
              >
                Pogledaj okuse
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
