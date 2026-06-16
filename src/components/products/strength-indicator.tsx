import { cn } from "@/lib/utils";

interface StrengthIndicatorProps {
  strength: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const labels = ["Blag", "Lagano", "Srednje", "Jako", "Intenzivno"];

export function StrengthIndicator({
  strength,
  className,
}: StrengthIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-1" aria-label={`Strength: ${labels[strength - 1]}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 w-3 rounded-full transition-colors",
              i < strength ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted">{labels[strength - 1]}</span>
    </div>
  );
}
