"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-md gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        type="email"
        placeholder="Email vaše firme"
        className="border-white/10 bg-white/10 text-white placeholder:text-white/40 focus:border-white/30"
        aria-label="Email za newsletter"
      />
      <Button variant="gold" type="submit" className="shrink-0">
        Pretplati se
      </Button>
    </form>
  );
}
