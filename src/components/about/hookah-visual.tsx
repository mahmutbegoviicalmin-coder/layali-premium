"use client";

import { motion } from "framer-motion";

const smokePaths = [
  { delay: 0, x: 0 },
  { delay: 0.7, x: -12 },
  { delay: 1.4, x: 14 },
  { delay: 2.1, x: -6 },
];

export function HookahVisual() {
  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-white to-surface px-6 py-8 md:px-8 md:py-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.05),transparent_62%)]" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-[58%] rounded-full border border-primary/[0.06]"
        animate={{ scale: [1, 1.04, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-[58%] rounded-full border border-primary/[0.04]"
        animate={{ scale: [1, 1.03, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="relative mx-auto flex max-w-[300px] flex-col items-center">
        <div className="relative h-[220px] w-full sm:h-[250px]">
          {smokePaths.map((smoke, i) => (
            <motion.div
              key={i}
              className="absolute bottom-[38%] h-24 w-7 rounded-full bg-gradient-to-t from-primary/12 via-primary/6 to-transparent blur-md"
              style={{ left: `calc(50% + ${smoke.x}px)` }}
              initial={{ opacity: 0, y: 16, scaleX: 0.5 }}
              animate={{
                opacity: [0, 0.5, 0],
                y: [0, -56, -96],
                scaleX: [0.5, 1, 1.15],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: smoke.delay,
                ease: "easeOut",
              }}
            />
          ))}

          <svg
            viewBox="0 0 240 320"
            className="absolute inset-0 h-full w-full text-primary"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.ellipse
              cx="120"
              cy="288"
              rx="72"
              ry="14"
              fill="currentColor"
              opacity="0.08"
              animate={{ rx: [72, 76, 72] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

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
            <rect x="98" y="210" width="44" height="8" rx="4" fill="currentColor" opacity="0.12" />
            <rect x="98" y="226" width="44" height="8" rx="4" fill="currentColor" opacity="0.08" />

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

            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M92 132 C92 108 148 108 148 132 L148 148 C148 162 92 162 92 148 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="white"
              />
              <ellipse cx="120" cy="118" rx="34" ry="10" stroke="currentColor" strokeWidth="2" fill="white" />
              <motion.ellipse
                cx="120"
                cy="112"
                rx="18"
                ry="6"
                fill="currentColor"
                opacity="0.15"
                animate={{ opacity: [0.1, 0.22, 0.1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>

            <path
              d="M148 156 C176 156 188 170 188 196"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="188" cy="196" r="8" stroke="currentColor" strokeWidth="2" fill="white" />

            <motion.circle
              cx="120"
              cy="88"
              r="3"
              fill="currentColor"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="mt-2 flex w-full items-center justify-between rounded-2xl border border-border bg-white/90 px-4 py-3 backdrop-blur-sm">
          <div>
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted">
              Layali premium
            </p>
            <p className="mt-0.5 text-sm font-medium text-primary">
              Ekskluzivni predstavnik
            </p>
          </div>
          <motion.span
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
