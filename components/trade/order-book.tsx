"use client";

import { useMemo } from "react";
import type { Asset, OrderBook, Quote } from "@/lib/types";
import { cn, formatNumber, formatPrice, roundToTick } from "@/lib/utils";

interface Props {
  asset: Asset;
  book?: OrderBook;
  quote?: Quote;
}

/** Synthetic depth ladder with cumulative size bars. */
export function OrderBook({ asset, book, quote }: Props) {
  const maxTotal = useMemo(() => {
    if (!book) return 1;
    return Math.max(
      book.bids[book.bids.length - 1]?.total ?? 1,
      book.asks[book.asks.length - 1]?.total ?? 1,
    );
  }, [book]);

  const mid = quote?.price ?? asset.basePrice;
  const spread = book?.spread ?? asset.tickSize;

  const rows = 9;
  const bids = book?.bids.slice(0, rows) ?? [];
  const asks = book?.asks.slice(0, rows) ?? [];

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="panel-header">
        <span className="label-caps">Order book · depth</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
          mock ladder
        </span>
      </div>

      <div className="grid grid-cols-3 border-b border-white/[0.06] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
        <span>Price ({asset.currency})</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col-reverse">
          {bids.map((l) => (
            <div
              key={`b-${l.price}`}
              className="relative grid grid-cols-3 px-3 py-[3px] text-[11px] odd:bg-white/[0.015]"
            >
              <span
                className="absolute inset-y-0 right-0 bg-bull/10"
                style={{ width: `${(l.total / maxTotal) * 100}%` }}
                aria-hidden
              />
              <span className="num relative z-10 text-bull">{formatNumber(l.price, l.price < 10 ? 4 : 2)}</span>
              <span className="num relative z-10 text-right text-slate-300">{formatNumber(l.size, 0)}</span>
              <span className="num relative z-10 text-right text-slate-500">{formatNumber(l.total, 0)}</span>
            </div>
          ))}
        </div>

        <div className="my-1 flex items-center justify-between border-y border-white/[0.07] bg-surface-950/60 px-3 py-1.5">
          <span className="num text-[13px] font-bold text-white">{formatNumber(mid, mid < 10 ? 4 : 2)}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500">
            spread{" "}
            <span className="num text-alert">
              {formatPrice(spread, asset.currency)}
            </span>
          </span>
        </div>

        <div className="flex flex-col">
          {asks.map((l) => (
            <div
              key={`a-${l.price}`}
              className="relative grid grid-cols-3 px-3 py-[3px] text-[11px] odd:bg-white/[0.015]"
            >
              <span
                className="absolute inset-y-0 right-0 bg-bear/10"
                style={{ width: `${(l.total / maxTotal) * 100}%` }}
                aria-hidden
              />
              <span className="num relative z-10 text-bear">{formatNumber(l.price, l.price < 10 ? 4 : 2)}</span>
              <span className="num relative z-10 text-right text-slate-300">{formatNumber(l.size, 0)}</span>
              <span className="num relative z-10 text-right text-slate-500">{formatNumber(l.total, 0)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-3 py-2 text-[10px] text-slate-600">
        Depth is synthesized each tick — it reflects no real resting orders.
      </div>
    </div>
  );
}
