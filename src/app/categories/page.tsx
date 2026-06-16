import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryCards } from "@/lib/data/categories";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { FadeIn } from "@/components/ui/section";

export default function CategoriesPage() {
  return (
    <SiteLayout>
      <div className="px-[2.5%] pb-24 pt-36">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
                Product Categories
              </span>
              <h1 className="mt-3 font-serif text-4xl font-medium text-foreground md:text-5xl">
                Browse Categories
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
                Explore our flavor categories to find the perfect products for
                your business.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {categoryCards.map((cat, i) => (
              <FadeIn key={cat.id} delay={i * 0.08}>
                <Link href={`/products?tab=${cat.slug}`}>
                  <div className="group relative min-h-[280px] overflow-hidden rounded-3xl shadow-soft md:min-h-[320px]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h2 className="font-serif text-3xl font-medium text-white">
                        {cat.name}
                      </h2>
                      <p className="mt-2 text-sm text-white/70">
                        {cat.productCount} products available
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent-gold">
                        Explore Collection
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
