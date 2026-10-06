"use client";

import { useEffect } from "react";
import { ASSETS } from "@/lib/mock/assets";
import { useMarket } from "@/lib/store/use-market";
import { cn, formatNumber, formatPct, formatPrice } from "@/lib/utils";

const TAPE_SYMBOLS = [
  "MTNN",
  "DANGCEM",
  "GTCO",
  "AIRTELAFRI",
  "SEPLAT",
  "BUACEMENT",
  "BTC",
  "ETH",
  "SOL",
  "XAUUSD",
  "XBRUSD",
  "USDNGN",
  "SPY",
  "QQQ",
  "EURUSD",
];

/** Scrolling simulated price tape — every number is generated locally. */
export function TickerTape() {
  const quotes = useMarket((s) => s.quotes);
  const feed = useMarket((s) => s.feed);
  const start = useMarket((s) => s.start);

  useEffect(() => {
    start();
  }, [start]);

  const items = TAPE_SYMBOLS.map((sym) => {
    const a = ASSETS.find((x) => x.symbol === sym)!;
    const q = quotes[sym];
    return { asset: a, q };
  });

  const row = (dup: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={dup}>
      {items.map(({ asset, q }) => {
        const up = (q?.changePct ?? 0) >= 0;
        return (
          <div
            key={`${dup ? "d" : "m"}-${asset.symbol}`}
            className="flex items-center gap-2 border-r border-white/[0.05] px-4 py-1.5"
          >
            <span className="num text-[11px] font-bold text-slate-300">{asset.symbol}</span>
            <span className="num text-[11px] text-slate-400">
              {q ? formatPrice(q.price, asset.currency) : "—"}
            </span>
            <span
              className={cn(
                "num text-[11px] font-semibold",
                up ? "text-bull" : "text-bear",
              )}
            >
              {q ? formatPct(q.changePct) : ""}
            </span>
            <span
              className={cn(
                "h-3 w-3",
                up ? "text-bull" : "text-bear",
              )}
              aria-hidden
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3">
                <path
                  d={up ? "M6 2 L10 8 L2 8 Z" : "M6 10 L2 4 L10 4 Z"}
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="ticker-mask relative flex h-8 items-center overflow-hidden border-b border-white/[0.06] bg-surface-950/90">
      <div
        className={cn(
          "flex min-w-max animate-ticker items-center",
          feed === "paused" && "[animation-play-state:paused] opacity-60",
        )}
      >
        {row(false)}
        {row(true)}
      </div>
      <div className="absolute right-0 top-0 flex h-full items-center gap-1.5 border-l border-white/[0.06] bg-surface-950/95 px-3">
        <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse-dot" />
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-volt">
          {feed === "live" ? "Sim feed" : "Paused"}
        </span>
        <span className="num text-[9px] text-slate-600">
          {formatNumber(quotes.MTNN?.price ?? 0, 2)}
        </span>
      </div>
    </div>
  );
}
