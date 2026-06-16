import { Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "new" | "bestseller";

const statusConfig: Record<
  StatusType,
  {
    label: string;
    icon: typeof Sparkles;
    overlay: string;
    inline: string;
    iconClass: string;
  }
> = {
  new: {
    label: "Novo",
    icon: Sparkles,
    overlay:
      "border-white/25 bg-[#f25f41]/90 text-white shadow-[0_4px_20px_rgba(242,95,65,0.35)]",
    inline: "border-primary/20 bg-surface text-primary",
    iconClass: "text-white",
  },
  bestseller: {
    label: "Bestseler",
    icon: Flame,
    overlay:
      "border-amber-200/40 bg-[#e04e32]/90 text-white shadow-[0_4px_20px_rgba(224,78,50,0.35)]",
    inline: "border-primary/10 bg-primary text-white",
    iconClass: "text-amber-300",
  },
};

interface ProductStatusBadgeProps {
  type: StatusType;
  variant?: "overlay" | "inline";
  size?: "sm" | "md";
  className?: string;
}

export function ProductStatusBadge({
  type,
  variant = "overlay",
  size = "md",
  className,
}: ProductStatusBadgeProps) {
  const { label, icon: Icon, overlay, inline, iconClass } = statusConfig[type];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold uppercase tracking-[0.1em]",
        size === "sm" ? "gap-1 px-2 py-0.5 text-[0.5625rem]" : "gap-1.5 px-3 py-1.5 text-[0.625rem]",
        variant === "overlay" ? overlay : inline,
        variant === "inline" && "border",
        className
      )}
    >
      <Icon
        className={cn(
          size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3",
          variant === "overlay" ? iconClass : type === "bestseller" ? "text-amber-200" : "text-white"
        )}
        strokeWidth={2.25}
      />
      {label}
    </span>
  );
}

interface ProductImageBadgesProps {
  isNew?: boolean;
  isBestSeller?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ProductImageBadges({
  isNew,
  isBestSeller,
  size = "md",
  className,
}: ProductImageBadgesProps) {
  if (isNew) {
    return (
      <ProductStatusBadge
        type="new"
        variant="overlay"
        size={size}
        className={className}
      />
    );
  }

  if (isBestSeller) {
    return (
      <ProductStatusBadge
        type="bestseller"
        variant="overlay"
        size={size}
        className={className}
      />
    );
  }

  return null;
}
