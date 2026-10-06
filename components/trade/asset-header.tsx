"use client";

import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import type { Asset, Quote } from "@/lib/types";
import { cn, formatNumber, formatPct, formatPrice } from "@/lib/utils";

interface Props {
  asset: Asset;
  quote: Quote;
  watched: boolean;
  onToggleWatch: () => void;
}

/** Instrument header: big last price, day change and session statistics. */
export function AssetHeader({ asset, quote, watched, onToggleWatch }: Props) {
  const up = quote.changePct >= 0;
  const spreadTicks = asset.class === "crypto" ? 0.1 : asset.tickSize;

  const stats = [
    { k: "Prev close", v: formatPrice(quote.prevClose, asset.currency) },
    { k: "Day high", v: formatPrice(quote.dayHigh, asset.currency) },
    { k: "Day low", v: formatPrice(quote.dayLow, asset.currency) },
    {
      k: "Spread",
      v: formatPrice(spreadTicks, asset.currency),
      tip: "Simulated bid/ask gap in this demo book.",
    },
    { k: "Mkt cap", v: asset.marketCap ?? "—", hideSm: true },
    { k: "Exchange", v: asset.exchange, hideSm: true },
  ];

  return (
    <div className="panel flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onToggleWatch}
          aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
          className={cn(
            "focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-md border transition-colors",
            watched
              ? "border-alert/40 bg-alert/10 text-alert"
              : "border-white/10 text-slate-500 hover:border-white/25 hover:text-slate-300",
          )}
        >
          <Star size={15} fill={watched ? "currentColor" : "none"} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="num text-lg font-bold leading-none text-white">{asset.symbol}</h1>
            <Badge variant={asset.class === "crypto" ? "neon" : asset.class === "stock" ? "volt" : "default"}>
              {asset.class}
            </Badge>
          </div>
          <p className="mt-1 truncate text-[11px] text-slate-400">
            {asset.name} · {asset.sector}
          </p>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            "num text-[26px] font-bold leading-none tracking-tight",
            up ? "text-bull text-glow-bull" : "text-bear text-glow-bear",
          )}
        >
          {formatPrice(quote.price, asset.currency)}
        </span>
        <span
          className={cn(
            "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[12px] font-bold",
            up ? "bg-bull/12 text-bull" : "bg-bear/12 text-bear",
          )}
        >
          {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {quote.change >= 0 ? "+" : ""}
          {formatNumber(Math.abs(quote.change), Math.abs(quote.change) < 1 ? 4 : 2)}
          <span className="opacity-80">({formatPct(quote.changePct)})</span>
        </span>
        <span className="hidden text-[10px] uppercase tracking-wider text-slate-500 sm:block">
          today · simulated
        </span>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-1">
        {stats.map((s) =>
          s.tip ? (
            <Tooltip key={s.k} label={s.tip} side="bottom">
              <span className={cn("flex flex-col", s.hideSm && "hidden xl:flex")}>
                <span className="label-caps">{s.k}</span>
                <span className="num text-xs font-semibold text-slate-200">{s.v}</span>
              </span>
            </Tooltip>
          ) : (
            <span key={s.k} className={cn("flex flex-col", s.hideSm && "hidden xl:flex")}>
              <span className="label-caps">{s.k}</span>
              <span className="num text-xs font-semibold text-slate-200">{s.v}</span>
            </span>
          ),
        )}
      </div>
    </div>
  );
}
