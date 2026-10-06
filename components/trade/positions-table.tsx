"use client";

import { getAsset } from "@/lib/mock/assets";
import { useMarket } from "@/lib/store/use-market";
import { useTrading } from "@/lib/store/use-trading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, formatNumber, formatPct, formatPrice, toNgn } from "@/lib/utils";

/** Open simulated positions with mark-to-market P&L. */
export function PositionsTable({ onSelect }: { onSelect: (symbol: string) => void }) {
  const positions = useTrading((s) => s.positions);
  const quotes = useMarket((s) => s.quotes);
  const closePosition = useTrading((s) => s.closePosition);

  if (positions.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-xs text-slate-500">
        No open simulated positions. Place a demo order from the ticket to open one.
      </div>
    );
  }

  const rows = positions.map((p) => {
    const asset = getAsset(p.symbol)!;
    const q = quotes[p.symbol];
    const price = q?.price ?? p.avgPrice;
    const value = price * p.qty;
    const cost = p.avgPrice * p.qty;
    const totalPnl = value - cost;
    const dayPnl = (price - (q?.prevClose ?? price)) * p.qty;
    const pct = (totalPnl / cost) * 100;
    return { p, asset, price, value, totalPnl, dayPnl, pct };
  });

  const totalValue = rows.reduce((s, r) => s + toNgn(r.value, r.asset.currency), 0);
  const totalPnl = rows.reduce((s, r) => s + toNgn(r.totalPnl, r.asset.currency), 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-left text-[11.5px]">
        <thead>
          <tr className="border-b border-white/[0.07] text-[9px] uppercase tracking-[0.14em] text-slate-500">
            <th className="px-4 py-2 font-semibold">Symbol</th>
            <th className="px-3 py-2 text-right font-semibold">Qty</th>
            <th className="px-3 py-2 text-right font-semibold">Avg price</th>
            <th className="px-3 py-2 text-right font-semibold">Mark</th>
            <th className="px-3 py-2 text-right font-semibold">Value</th>
            <th className="px-3 py-2 text-right font-semibold">Day P&amp;L</th>
            <th className="px-3 py-2 text-right font-semibold">Total P&amp;L</th>
            <th className="px-4 py-2 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.p.symbol} className="row-hover border-b border-white/[0.04]">
              <td className="px-4 py-2">
                <button
                  onClick={() => onSelect(r.p.symbol)}
                  className="focus-ring flex flex-col items-start rounded text-left"
                >
                  <span className="num font-bold text-white">{r.p.symbol}</span>
                  <span className="text-[10px] text-slate-500">{r.asset.name}</span>
                </button>
              </td>
              <td className="num px-3 py-2 text-right text-slate-300">
                {formatNumber(r.p.qty, r.p.qty < 10 ? 3 : 0)}
              </td>
              <td className="num px-3 py-2 text-right text-slate-400">
                {formatPrice(r.p.avgPrice, r.asset.currency)}
              </td>
              <td className="num px-3 py-2 text-right text-slate-200">
                {formatPrice(r.price, r.asset.currency)}
              </td>
              <td className="num px-3 py-2 text-right text-slate-200">
                {formatPrice(r.value, r.asset.currency)}
              </td>
              <td
                className={cn(
                  "num px-3 py-2 text-right",
                  r.dayPnl >= 0 ? "text-bull" : "text-bear",
                )}
              >
                {r.dayPnl >= 0 ? "+" : ""}
                {formatPrice(r.dayPnl, r.asset.currency)}
              </td>
              <td className={cn("num px-3 py-2 text-right", r.totalPnl >= 0 ? "text-bull" : "text-bear")}>
                <div className="flex flex-col items-end">
                  <span>
                    {r.totalPnl >= 0 ? "+" : ""}
                    {formatPrice(r.totalPnl, r.asset.currency)}
                  </span>
                  <span className="text-[10px] opacity-80">{formatPct(r.pct)}</span>
                </div>
              </td>
              <td className="px-4 py-2 text-right">
                <Tooltip label="Simulated market close of the entire position" side="left">
                  <Button size="sm" variant="ghost-bear" onClick={() => closePosition(r.p.symbol)}>
                    Close
                  </Button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-[11px]">
            <td className="px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-slate-500" colSpan={4}>
              {rows.length} open positions · total value (₦ equivalent)
            </td>
            <td className="num px-3 py-2.5 text-right font-bold text-white">
              {formatPrice(totalValue, "NGN")}
            </td>
            <td />
            <td
              className={cn(
                "num px-3 py-2.5 text-right font-bold",
                totalPnl >= 0 ? "text-bull" : "text-bear",
              )}
            >
              {totalPnl >= 0 ? "+" : ""}
              {formatPrice(totalPnl, "NGN")}
            </td>
            <td>
              <Badge variant="volt">Demo</Badge>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
