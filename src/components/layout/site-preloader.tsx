"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "layali-preloader-seen";
const MIN_VISIBLE_MS = 900;
const FADE_MS = 500;

function PreloaderHookah() {
  return (
    <div className="preloader-scene relative mx-auto h-[200px] w-[168px] sm:h-[220px] sm:w-[184px]">
      <div
        className="preloader-ambient pointer-events-none absolute left-1/2 top-[58%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-36 sm:w-36"
        aria-hidden
      />

      <div className="preloader-smoke-wrap pointer-events-none absolute inset-0" aria-hidden>
        <span className="preloader-smoke preloader-smoke-1" />
        <span className="preloader-smoke preloader-smoke-2" />
        <span className="preloader-smoke preloader-smoke-3" />
        <span className="preloader-smoke preloader-smoke-4" />
        <span className="preloader-smoke preloader-smoke-5" />
      </div>

      <svg
        viewBox="0 0 240 320"
        className="preloader-hookah relative z-[1] h-full w-full text-foreground"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <ellipse cx="120" cy="288" rx="72" ry="14" fill="currentColor" opacity="0.06" />

        <rect
          x="88"
          y="198"
          width="64"
          height="82"
          rx="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="white"
        />
        <rect x="98" y="210" width="44" height="8" rx="4" fill="currentColor" opacity="0.1" />
        <rect x="98" y="226" width="44" height="8" rx="4" fill="currentColor" opacity="0.07" />

        <rect
          x="112"
          y="132"
          width="16"
          height="68"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
          fill="white"
        />

        <g className="preloader-bowl-float">
          <path
            d="M92 132 C92 108 148 108 148 132 L148 148 C148 162 92 162 92 148 Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="white"
          />
          <ellipse
            cx="120"
            cy="118"
            rx="34"
            ry="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="white"
          />
          <ellipse
            cx="120"
            cy="112"
            rx="18"
            ry="6"
            className="preloader-bowl-glow fill-primary"
          />
        </g>

        <path
          d="M148 156 C176 156 188 170 188 196"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="188" cy="196" r="8" stroke="currentColor" strokeWidth="2" fill="white" />

        <circle cx="120" cy="88" r="3" className="preloader-tip-glow fill-primary" />
      </svg>
    </div>
  );
}

export function SitePreloader() {
  const [phase, setPhase] = useState<"visible" | "hiding" | "hidden">("visible");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setPhase("hidden");
      return;
    }

    let done = false;
    const start = performance.now();

    const finish = () => {
      if (done) return;
      done = true;
      sessionStorage.setItem(SESSION_KEY, "1");

      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

      window.setTimeout(() => {
        setPhase("hiding");
        window.setTimeout(() => setPhase("hidden"), FADE_MS);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    const fallback = window.setTimeout(finish, 2400);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(fallback);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={cn(
        "site-preloader fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-500 ease-out",
        "bg-gradient-to-b from-[#fff9f7] via-background to-background",
        phase === "hiding" ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      aria-hidden={phase === "hiding"}
      aria-busy={phase === "visible"}
      role="status"
      aria-label="Učitavanje"
    >
      <div className="preloader-enter flex flex-col items-center px-6">
        <PreloaderHookah />

        <div className="mt-2 text-center">
          <span className="font-heading text-[1.35rem] font-semibold tracking-[0.24em] text-foreground sm:text-[1.5rem]">
            LAYALI
          </span>
          <p className="mt-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted">
            Premium okusi za nargilu
          </p>
        </div>

        <div className="mt-6 h-[2px] w-28 overflow-hidden rounded-full bg-border sm:w-32">
          <div className="site-preloader-bar h-full w-full origin-left bg-primary" />
        </div>
      </div>
    </div>
  );
}
