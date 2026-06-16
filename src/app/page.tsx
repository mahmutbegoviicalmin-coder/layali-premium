import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCollection } from "@/components/home/ProductCollection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <SiteLayout>
      <HeroSection />
      <ProductCollection />
      <CtaSection />
      <FeatureSection />
    </SiteLayout>
  );
}
