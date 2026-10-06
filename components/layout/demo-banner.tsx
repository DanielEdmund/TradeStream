"use client";

import { FlaskConical, ShieldAlert } from "lucide-react";

/** Persistent, unmistakable labelling that this prototype simulates everything. */
export function DemoBanner() {
  return (
    <div className="relative z-50 flex h-7 items-center justify-center gap-2 border-b border-alert/25 bg-gradient-to-r from-alert/12 via-amber-50/[0.06] to-alert/12 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-alert">
      <ShieldAlert size={12} className="shrink-0" />
      <span className="truncate">
        Demo / Simulated Trading — mock data only. No real money, orders, or market feeds.
      </span>
      <FlaskConical size={12} className="hidden shrink-0 sm:block" />
    </div>
  );
}
