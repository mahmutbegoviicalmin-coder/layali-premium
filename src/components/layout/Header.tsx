"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSavedProducts } from "@/context/saved-products-context";
import { useInquiryBasket } from "@/context/inquiry-basket-context";

const navLinks = [
  { href: "/", label: "Početna" },
  { href: "/products", label: "Proizvodi" },
  { href: "/about", label: "O nama" },
  { href: "/contact", label: "Kontakt" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState("BS");
  const { savedProducts } = useSavedProducts();
  const { itemCount } = useInquiryBasket();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-[2.5%] pt-4 md:pt-5">
      <div
        className={cn(
          "mx-auto flex h-[64px] w-full max-w-7xl items-center justify-between rounded-[32px] border px-6 bg-white/98 md:h-[68px] md:px-10",
          isHome
            ? "border-border/80 shadow-[var(--shadow-header)]"
            : "border-border shadow-[var(--shadow-header)]"
        )}
      >
        <Link href="/" className="shrink-0">
          <span className="font-heading text-[1.35rem] font-semibold tracking-[0.18em] text-foreground">
            LAYALI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-5 py-2 text-[0.8125rem] font-medium tracking-wide rounded-full transition-colors duration-200",
                pathname === link.href
                  ? "bg-primary text-white"
                  : "text-foreground/75 hover:bg-surface hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-1.5">
          <button
            aria-label="Pretraži"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/65 transition-colors duration-200 hover:bg-surface hover:text-foreground"
          >
            <Search className="h-[1.125rem] w-[1.125rem]" />
          </button>

          <Link
            href="/saved"
            aria-label={`Sačuvani proizvodi (${savedProducts.length})`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground/65 transition-colors duration-200 hover:bg-surface hover:text-foreground"
          >
            <Heart className="h-[1.125rem] w-[1.125rem]" />
            {savedProducts.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                {savedProducts.length}
              </span>
            )}
          </Link>

          <Link
            href="/inquiry"
            aria-label={`Lista za upit (${itemCount})`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground/65 transition-colors duration-200 hover:bg-surface hover:text-foreground"
          >
            <ShoppingBag className="h-[1.125rem] w-[1.125rem]" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            aria-label="Promijeni jezik"
            onClick={() => setLang(lang === "BS" ? "EN" : "BS")}
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-medium text-foreground/65 transition-colors duration-200 hover:bg-surface hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang}
          </button>

          <button
            aria-label="Otvori meni"
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full text-foreground/65 hover:bg-surface"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/25 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      <nav
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col bg-background p-10 shadow-lift transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
        aria-label="Mobile"
        aria-hidden={!mobileOpen}
      >
        <div className="mb-12 flex items-center justify-between">
          <span className="font-heading text-xl font-semibold tracking-[0.15em] text-foreground">
            LAYALI
          </span>
          <button
            aria-label="Zatvori meni"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "border-b border-border py-4 text-lg font-medium transition-colors",
              pathname === link.href
                ? "text-primary"
                : "text-foreground/75"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
