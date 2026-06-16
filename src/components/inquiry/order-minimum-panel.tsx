"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGrams } from "@/lib/order-rules";

interface OrderMinimumPanelProps {
  totalGrams: number;
  minimumGrams: number;
  progress: number;
  meetsMinimum: boolean;
  gramsRemaining: number;
  itemCount: number;
}

export function OrderMinimumPanel({
  totalGrams,
  minimumGrams,
  progress,
  meetsMinimum,
  gramsRemaining,
  itemCount,
}: OrderMinimumPanelProps) {
  if (itemCount === 0) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 md:p-5",
        meetsMinimum
          ? "border-primary/15 bg-surface"
          : "border-amber-300/40 bg-amber-50/80"
      )}
    >
      <div className="flex items-start gap-3">
        {meetsMinimum ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        ) : (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-primary">
            {meetsMinimum
              ? "Minimalna narudžba ispunjena"
              : "Minimalna narudžba nije ispunjena"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {meetsMinimum
              ? "Možete poslati upit. Mix različitih okusa u pakovanjima od 200 g i 250 g je dozvoljen."
              : `Još vam treba ${formatGrams(gramsRemaining)} do minimuma od ${formatGrams(minimumGrams)}. Možete kombinovati više okusa.`}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted">Ukupno u korpi</span>
          <span className="font-semibold text-primary">
            {formatGrams(totalGrams)} / {formatGrams(minimumGrams)}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              meetsMinimum ? "bg-primary" : "bg-amber-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
