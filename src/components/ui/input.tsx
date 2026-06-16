import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const field = (
      <input
        id={inputId}
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-primary/10 bg-white px-4 text-sm text-primary shadow-sm transition-all placeholder:text-muted focus:border-accent-gold/50 focus:outline-none focus:ring-2 focus:ring-accent-gold/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
          className
        )}
        {...props}
      />
    );

    if (!label && !error) return field;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-primary"
          >
            {label}
          </label>
        )}
        {field}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
