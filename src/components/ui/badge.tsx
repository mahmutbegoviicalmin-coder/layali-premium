import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "muted" | "green";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variant === "default" && "bg-surface text-primary",
        variant === "gold" && "bg-primary text-white",
        variant === "muted" && "border border-border bg-background text-muted",
        variant === "green" && "bg-primary text-white",
        className
      )}
    >
      {children}
    </span>
  );
}
