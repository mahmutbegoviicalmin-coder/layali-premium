import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/section";

export function CtaSection() {
  return (
    <section className="px-[2.5%] py-6 md:py-8">
      <FadeIn>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl border border-white/10 px-8 py-12 text-center shadow-[0_20px_60px_rgba(242,95,65,0.25)] md:px-14 md:py-16">
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-[#1a1614] via-[#2a1814] to-[#3d2218]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_-10%,rgba(242,95,65,0.42),transparent_52%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_110%,rgba(201,74,50,0.35),transparent_48%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.07)_0%,transparent_38%,rgba(0,0,0,0.18)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />

          <div className="relative z-10">
            <span className="section-label text-white/55">Partnerstvo</span>
            <h2 className="mt-4 font-heading text-[2rem] font-medium tracking-tight text-white md:text-[2.75rem] lg:text-[3rem] lg:leading-tight">
              Spremni proširiti ponudu okusa?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-white/70 md:text-base">
              Pridružite se lounge barovima, kafićima i trgovinama koji
              Layaliju biraju za premium veleprodaju okusa nargile.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-white px-9 text-[0.9375rem] font-medium text-primary shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all hover:bg-white/95 hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
              >
                Pregledaj proizvode
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-[52px] items-center rounded-full border border-white/30 bg-white/10 px-9 text-[0.9375rem] font-medium text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/15"
              >
                Postani partner
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
