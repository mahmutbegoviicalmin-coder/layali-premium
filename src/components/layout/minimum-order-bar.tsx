"use client";

import Link from "next/link";
import { Package, ArrowRight, X } from "lucide-react";
import { MIN_ORDER_GRAMS, formatGrams } from "@/lib/order-rules";
import { useAnnouncementBar } from "@/context/announcement-bar-context";

export function MinimumOrderBar() {
  const { isVisible, dismiss } = useAnnouncementBar();

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 right-0 top-20 z-40 px-3 md:top-[88px] md:px-[2.5%]">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-b-2xl border border-white/15 shadow-[0_8px_24px_rgba(242,95,65,0.22)]">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#c94a32] via-[#f25f41] to-[#e85a40]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_50%,rgba(255,180,140,0.25),transparent_55%)]"
        />

        <div className="relative flex items-center gap-2.5 px-3.5 py-3 sm:gap-3 sm:px-5 md:px-6">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-8 sm:w-8">
            <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
          </span>

          <p className="min-w-0 flex-1 text-[0.6875rem] leading-snug text-white/75 sm:text-xs md:text-[0.8125rem]">
            <span className="font-semibold text-white">
              Minimalna narudžba: {formatGrams(MIN_ORDER_GRAMS)}
            </span>
            <span className="mx-1.5 text-white/40">·</span>
            <span>Mix okusa dozvoljen</span>
            <span className="mx-1.5 text-white/40">·</span>
            <span>pakovanja 200 g i 250 g</span>
          </p>

          <Link
            href="/inquiry"
            className="inline-flex shrink-0 items-center gap-1 text-[0.6875rem] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-80 sm:text-xs"
          >
            Lista za upit
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Zatvori obavijest"
            className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
