"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  title?: string;
}

/** Compact segmented control used for timeframes, order types and filters. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  itemClassName,
  size = "md",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  itemClassName?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-white/[0.07] bg-surface-950/70 p-0.5",
        className,
      )}
      role="tablist"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            title={o.title}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "focus-ring rounded-md font-semibold transition-all duration-150",
              size === "sm" ? "h-6 px-2 text-[10px]" : "h-7 px-2.5 text-[11px]",
              active
                ? "bg-volt/15 text-volt shadow-[inset_0_0_0_1px_rgba(6,182,212,0.35)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]",
              itemClassName,
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
