"use client";

import { Ban } from "lucide-react";
import { getAsset } from "@/lib/mock/assets";
import { useTrading } from "@/lib/store/use-trading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/lib/types";
import { cn, formatDateTime, formatPrice } from "@/lib/utils";

const STATUS_STYLE: Record<OrderStatus, string> = {
  open: "border-alert/35 bg-alert/10 text-alert",
  filled: "border-bull/35 bg-bull/10 text-bull",
  cancelled: "border-white/15 bg-white/5 text-slate-400",
  rejected: "border-bear/35 bg-bear/10 text-bear",
};

interface Props {
  orders: Order[];
  onCancel?: (id: string) => void;
  onSelectSymbol?: (symbol: string) => void;
  empty?: string;
}

/** Blotter table shared by the terminal and the orders screen. */
export function OrdersTable({ orders, onCancel, onSelectSymbol, empty }: Props) {
  if (orders.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-xs text-slate-500">
        {empty ?? "No orders in this view."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-[11.5px]">
        <thead>
          <tr className="border-b border-white/[0.07] text-[9px] uppercase tracking-[0.14em] text-slate-500">
            <th className="px-4 py-2 font-semibold">Order ID</th>
            <th className="px-3 py-2 font-semibold">Symbol</th>
            <th className="px-3 py-2 font-semibold">Side</th>
            <th className="px-3 py-2 font-semibold">Type</th>
            <th className="px-3 py-2 text-right font-semibold">Qty</th>
            <th className="px-3 py-2 text-right font-semibold">Price</th>
            <th className="px-3 py-2 text-right font-semibold">Filled</th>
            <th className="px-3 py-2 font-semibold">Status</th>
            <th className="px-4 py-2 text-right font-semibold">Time</th>
            {onCancel && <th className="px-4 py-2 text-right font-semibold" />}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const asset = getAsset(o.symbol);
            const cur = asset?.currency ?? "NGN";
            return (
              <tr key={o.id} className="row-hover border-b border-white/[0.04]">
                <td className="num px-4 py-2 text-slate-500">{o.id}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => onSelectSymbol?.(o.symbol)}
                    className="focus-ring num rounded font-bold text-white hover:text-volt"
                  >
                    {o.symbol}
                  </button>
                </td>
                <td
                  className={cn(
                    "px-3 py-2 text-[10px] font-black uppercase tracking-wider",
                    o.side === "buy" ? "text-bull" : "text-bear",
                  )}
                >
                  {o.side}
                </td>
                <td className="px-3 py-2 text-slate-400">
                  {o.type}
                  {o.timeInForce !== "day" && (
                    <span className="ml-1 text-[9px] uppercase text-slate-600">{o.timeInForce}</span>
                  )}
                </td>
                <td className="num px-3 py-2 text-right text-slate-300">
                  {o.qty.toLocaleString("en-NG", { maximumFractionDigits: 3 })}
                </td>
                <td className="num px-3 py-2 text-right text-slate-200">
                  {o.type === "market" && !o.avgFillPrice
                    ? "MKT"
                    : formatPrice(o.avgFillPrice ?? o.price ?? 0, cur)}
                </td>
                <td className="num px-3 py-2 text-right text-slate-400">
                  {o.status === "filled" ? "100%" : o.filledQty > 0 ? `${o.filledQty} / ${o.qty}` : "—"}
                </td>
                <td className="px-3 py-2">
                  <span className={cn("inline-flex rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider", STATUS_STYLE[o.status])}>
                    {o.status}
                  </span>
                  {o.note && (
                    <span className="ml-2 hidden text-[10px] text-slate-600 xl:inline">{o.note}</span>
                  )}
                </td>
                <td className="num px-4 py-2 text-right text-[10.5px] text-slate-500">
                  {formatDateTime(o.filledAt ?? o.createdAt)}
                </td>
                {onCancel && (
                  <td className="px-4 py-2 text-right">
                    {o.status === "open" ? (
                      <Button size="sm" variant="ghost" onClick={() => onCancel(o.id)}>
                        <Ban size={11} /> Cancel
                      </Button>
                    ) : (
                      <Badge variant="default">—</Badge>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
