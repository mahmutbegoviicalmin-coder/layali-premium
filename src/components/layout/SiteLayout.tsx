"use client";

import { AppProviders } from "@/components/providers/app-providers";
import { LanguageProvider } from "@/context/LanguageContext";
import { AnnouncementBarProvider } from "@/context/announcement-bar-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MinimumOrderBar } from "@/components/layout/minimum-order-bar";
import { SitePreloader } from "@/components/layout/site-preloader";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <LanguageProvider>
        <AnnouncementBarProvider>
          <SitePreloader />
          <Header />
          <MinimumOrderBar />
          <main className="flex-1 overflow-x-hidden bg-background">{children}</main>
          <Footer />
        </AnnouncementBarProvider>
      </LanguageProvider>
    </AppProviders>
  );
}
