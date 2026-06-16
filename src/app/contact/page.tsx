import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContactPageContent } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Stupite u kontakt sa Layali veleprodajnim timom.",
};

export default function ContactPage() {
  return (
    <SiteLayout>
      <ContactPageContent />
    </SiteLayout>
  );
}
