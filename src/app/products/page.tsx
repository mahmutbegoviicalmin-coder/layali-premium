import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductsPageContent } from "@/components/pages/products-page";

export const metadata: Metadata = {
  title: "Proizvodi",
  description:
    "Pregledajte Layali premium katalog okusa za nargilu. Veleprodajna ponuda za partnere.",
};

export default function ProductsPage() {
  return (
    <SiteLayout>
      <ProductsPageContent />
    </SiteLayout>
  );
}
