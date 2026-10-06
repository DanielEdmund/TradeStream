import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Asset, Currency, Quote } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ------------------------------------------------------------------ */
/* Formatting (demo numbers only)                                      */
/* ------------------------------------------------------------------ */

export function decimalsFor(value: number): number {
  const abs = Math.abs(value);
  if (abs === 0) return 2;
  if (abs < 10) return 4;
  return 2;
}

export function formatPrice(value: number, currency: Currency = "NGN"): string {
  const d = decimalsFor(value);
  const n = value.toLocaleString("en-NG", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
  return currency === "NGN" ? `₦${n}` : `$${n}`;
}

export function formatNumber(value: number, d = 2): string {
  return value.toLocaleString("en-NG", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function formatCurrency(value: number, currency: Currency = "NGN"): string {
  return formatPrice(value, currency);
}

export function formatCompact(value: number, currency: Currency = "NGN"): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const sym = currency === "NGN" ? "₦" : "$";
  if (abs >= 1e12) return `${sign}${sym}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${sym}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${sym}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${sym}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${sym}${abs.toFixed(2)}`;
}

export function formatPct(value: number, { sign = true, d = 2 } = {}): string {
  const s = sign && value > 0 ? "+" : "";
  return `${s}${value.toFixed(d)}%`;
}

export function formatQty(value: number): string {
  return value.toLocaleString("en-NG", { maximumFractionDigits: 4 });
}

export function toneClass(value: number): string {
  if (value > 0) return "text-bull";
  if (value < 0) return "text-bear";
  return "text-plat/70";
}

export function toneBgClass(value: number): string {
  if (value > 0) return "bg-bull/10 text-bull";
  if (value < 0) return "bg-bear/10 text-bear";
  return "bg-white/5 text-plat/70";
}

export function sideTone(side: "buy" | "sell", on = false): string {
  if (side === "buy") return on ? "bg-bull text-slate-950" : "text-bull";
  return on ? "bg-bear text-white" : "text-bear";
}

/* ------------------------------------------------------------------ */
/* Time helpers                                                        */
/* ------------------------------------------------------------------ */

export function timeAgo(ts: number, now = Date.now()): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/* Math / rng                                                          */
/* ------------------------------------------------------------------ */

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic PRNG (mulberry32) so mock charts never change between renders. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function roundToTick(price: number, tick: number): number {
  if (tick <= 0) return price;
  return Math.round(price / tick) * tick;
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Simulated NGN/USD conversion used purely for demo display. */
export const DEMO_FX_USDNGN = 1655.5;

export function toNgn(value: number, currency: Currency): number {
  return currency === "USD" ? value * DEMO_FX_USDNGN : value;
}

export function changeOf(q: Quote | undefined, asset: Asset | undefined) {
  if (!q || !asset) return { change: 0, changePct: 0 };
  return { change: q.change, changePct: q.changePct };
}
