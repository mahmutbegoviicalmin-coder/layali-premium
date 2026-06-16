import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AboutPageContent } from "@/components/pages/about-page";

export const metadata: Metadata = {
  title: "O nama",
  description:
    "S&B PREMIUM, ekskluzivni predstavnik brenda Layali. Uvoz, distribucija i razvoj premium okusa za nargilu.",
};

export default function AboutPage() {
  return (
    <SiteLayout>
      <AboutPageContent />
    </SiteLayout>
  );
}
