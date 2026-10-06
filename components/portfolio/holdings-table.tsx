"use client";

import { useRouter } from "next/navigation";
import { useTrading } from "@/lib/store/use-trading";
import { getAsset } from "@/lib/mock/assets";
import { useMarket } from "@/lib/store/use-market";
import { Badge } from "@/components/ui/badge";
import type { HoldingRow } from "@/lib/types";
import { cn, formatNumber, formatPct, formatPrice, toNgn } from "@/lib/utils";

/** Builds holding rows from simulated positions + live mock quotes. */
export function useHoldings(): HoldingRow[] {
  const positions = useTrading((s) => s.positions);
  const quotes = useMarket((s) => s.quotes);

  const rows = positions.map((p) => {
    const asset = getAsset(p.symbol)!;
    const q = quotes[p.symbol];
    const price = q?.price ?? p.avgPrice;
    const value = price * p.qty;
    const cost = p.avgPrice * p.qty;
    return {
      ...p,
      asset,
      price,
      prevClose: q?.prevClose ?? price,
      value,
      dayPnl: (price - (q?.prevClose ?? price)) * p.qty,
      totalPnl: value - cost,
      totalPnlPct: cost > 0 ? ((value - cost) / cost) * 100 : 0,
      weight: 0,
    } satisfies HoldingRow;
  });

  const total = rows.reduce((s, r) => s + toNgn(r.value, r.asset.currency), 0) || 1;
  return rows.map((r) => ({ ...r, weight: (toNgn(r.value, r.asset.currency) / total) * 100 }));
}

/** Holdings table with weights and P&L. */
export function HoldingsTable({ onSelect }: { onSelect: (s: string) => void }) {
  const holdings = useHoldings();
  const router = useRouter();

  if (holdings.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-xs text-slate-500">
        No simulated holdings. Reset the demo to restore the seeded portfolio.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-[11.5px]">
        <thead>
          <tr className="border-b border-white/[0.07] text-[9px] uppercase tracking-[0.14em] text-slate-500">
            <th className="px-4 py-2 font-semibold">Instrument</th>
            <th className="px-3 py-2 text-right font-semibold">Qty</th>
            <th className="px-3 py-2 text-right font-semibold">Avg cost</th>
            <th className="px-3 py-2 text-right font-semibold">Last</th>
            <th className="px-3 py-2 text-right font-semibold">Value</th>
            <th className="px-3 py-2 text-right font-semibold">Day P&amp;L</th>
            <th className="px-3 py-2 text-right font-semibold">Total P&amp;L</th>
            <th className="px-4 py-2 font-semibold">Weight</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.symbol} className="row-hover border-b border-white/[0.04]">
              <td className="px-4 py-2">
                <button
                  onClick={() => {
                    onSelect(h.symbol);
                    router.push(`/terminal?symbol=${h.symbol}`);
                  }}
                  className="focus-ring flex flex-col items-start rounded text-left"
                >
                  <span className="num font-bold text-white hover:text-volt">{h.symbol}</span>
                  <span className="text-[10px] text-slate-500">
                    {h.asset.name} · {h.asset.class}
                  </span>
                </button>
              </td>
              <td className="num px-3 py-2 text-right text-slate-300">
                {formatNumber(h.qty, h.qty < 10 ? 3 : 0)}
              </td>
              <td className="num px-3 py-2 text-right text-slate-400">
                {formatPrice(h.avgPrice, h.currency)}
              </td>
              <td className="num px-3 py-2 text-right text-slate-200">
                {formatPrice(h.price, h.currency)}
              </td>
              <td className="num px-3 py-2 text-right text-slate-200">
                {formatPrice(h.value, h.currency)}
              </td>
              <td className={cn("num px-3 py-2 text-right", h.dayPnl >= 0 ? "text-bull" : "text-bear")}>
                {h.dayPnl >= 0 ? "+" : ""}
                {formatPrice(h.dayPnl, h.currency)}
              </td>
              <td className={cn("num px-3 py-2 text-right", h.totalPnl >= 0 ? "text-bull" : "text-bear")}>
                <div className="flex flex-col items-end">
                  <span>
                    {h.totalPnl >= 0 ? "+" : ""}
                    {formatPrice(h.totalPnl, h.currency)}
                  </span>
                  <span className="text-[10px] opacity-80">{formatPct(h.totalPnlPct)}</span>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-950">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        h.weight > 25 ? "bg-alert" : "bg-volt",
                      )}
                      style={{ width: `${Math.min(100, h.weight * 2.6)}%` }}
                    />
                  </div>
                  <span className="num text-[10.5px] text-slate-400">{h.weight.toFixed(1)}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Compact P&L summary strip used above the holdings table. */
export function PortfolioBadge() {
  return <Badge variant="volt">Simulated holdings</Badge>;
}
