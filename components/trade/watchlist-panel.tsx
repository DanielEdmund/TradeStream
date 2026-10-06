"use client";

import { ASSETS, getAsset } from "@/lib/mock/assets";
import { useMarket } from "@/lib/store/use-market";
import { Sparkline } from "@/components/charts/sparkline";
import { cn, formatPct, formatPrice, toneClass } from "@/lib/utils";

/** Left rail: simulated quotes + sparkline for every watched instrument. */
export function WatchlistPanel({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (symbol: string) => void;
}) {
  const watchlist = useMarket((s) => s.watchlist);
  const quotes = useMarket((s) => s.quotes);
  const history = useMarket((s) => s.history);
  const toggleWatch = useMarket((s) => s.toggleWatch);

  const symbols = watchlist.length > 0 ? watchlist : ASSETS.slice(0, 8).map((a) => a.symbol);

  return (
    <div className="panel flex h-full min-h-[420px] flex-col overflow-hidden">
      <div className="panel-header">
        <span className="label-caps">Watchlist</span>
        <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-volt">
          <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse-dot" />
          simulated
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {symbols.map((sym) => {
          const asset = getAsset(sym);
          const q = quotes[sym];
          if (!asset || !q) return null;
          const up = q.changePct >= 0;
          const active = selected === sym;
          return (
            <button
              key={sym}
              onClick={() => onSelect(sym)}
              onDoubleClick={() => toggleWatch(sym)}
              title="Click to open · double-click to remove from watchlist"
              className={cn(
                "row-hover flex w-full items-center gap-2 border-b border-white/[0.04] px-3 py-2 text-left transition-colors",
                active && "bg-volt/[0.07] shadow-[inset_2px_0_0_0_rgba(6,182,212,0.9)]",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "num text-[12px] font-bold",
                      active ? "text-volt" : "text-white",
                    )}
                  >
                    {sym}
                  </span>
                  <span className={cn("num text-[11px]", toneClass(q.changePct))}>
                    {formatPct(q.changePct)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="num text-[11px] text-slate-400">
                    {formatPrice(q.price, asset.currency)}
                  </span>
                  <Sparkline
                    data={history[sym] ?? []}
                    positive={up}
                    width={54}
                    height={16}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-white/[0.06] px-3 py-2 text-[10px] leading-snug text-slate-600">
        Prices random-walk locally every 1.3s. Double-click a row to drop it from the list.
      </div>
    </div>
  );
}
