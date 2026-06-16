import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SavedProductsPage as SavedPageContent } from "@/components/pages/saved-page";

export const metadata: Metadata = {
  title: "Sačuvani proizvodi",
  description: "Vaši sačuvani Layali okusi za veleprodajni upit.",
};

export default function SavedProductsPage() {
  return (
    <SiteLayout>
      <SavedPageContent />
    </SiteLayout>
  );
}
