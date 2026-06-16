import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brands } from "@/lib/data/brands";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { FadeIn } from "@/components/ui/section";

export default function BrandsPage() {
  return (
    <SiteLayout>
      <div className="px-[2.5%] pb-24 pt-36">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
                Authorized Distributor
              </span>
              <h1 className="mt-3 font-serif text-4xl font-medium text-foreground md:text-5xl">
                Our Brands
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
                We partner with the world&apos;s leading hookah flavor
                manufacturers to bring you authentic, high-demand products.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand, i) => (
              <FadeIn key={brand.id} delay={i * 0.05}>
                <div className="group rounded-3xl bg-white p-8 shadow-soft transition-all hover:shadow-lift">
                  <div className="relative mx-auto h-16 w-40">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
                      sizes="160px"
                    />
                  </div>
                  <h3 className="mt-6 text-center font-serif text-xl font-medium text-foreground">
                    {brand.name}
                  </h3>
                  <p className="mt-2 text-center text-sm text-muted">
                    Premium wholesale flavors available
                  </p>
                  <Link
                    href="/products"
                    className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-accent-gold opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    View Products
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
