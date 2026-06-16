import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { InquiryPage as InquiryPageContent } from "@/components/pages/inquiry-page";

export const metadata: Metadata = {
  title: "Lista za upit",
  description:
    "Pregledajte odabrane proizvode i pošaljite veleprodajni upit Layaliju.",
};

export default function InquiryPage() {
  return (
    <SiteLayout>
      <InquiryPageContent />
    </SiteLayout>
  );
}
