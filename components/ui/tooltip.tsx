"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Lightweight CSS tooltip — no external dependency. */
export function Tooltip({
  label,
  children,
  side = "top",
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  const pos =
    side === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 mb-1.5"
      : side === "bottom"
        ? "top-full left-1/2 -translate-x-1/2 mt-1.5"
        : side === "left"
          ? "right-full top-1/2 -translate-y-1/2 mr-1.5"
          : "left-full top-1/2 -translate-y-1/2 ml-1.5";

  return (
    <span className={cn("group/tip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-[220px] whitespace-normal rounded-md border border-white/10 bg-surface-950 px-2 py-1 text-[11px] leading-snug text-slate-300 shadow-lg",
          "opacity-0 translate-y-0.5 transition-all duration-150 group-hover/tip:opacity-100 group-hover/tip:translate-y-0",
          pos,
        )}
      >
        {label}
      </span>
    </span>
  );
}
