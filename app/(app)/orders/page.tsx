"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { OrdersTable } from "@/components/trade/orders-table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLOSED_TRADES } from "@/lib/mock/portfolio";
import { useTrading } from "@/lib/store/use-trading";
import { cn, formatPct, formatPrice, toneBgClass } from "@/lib/utils";

export default function OrdersPage() {
  const orders = useTrading((s) => s.orders);
  const cancel = useTrading((s) => s.cancel);
  const fillCount = useTrading((s) => s.fillCount);
  const submittedNotional = useTrading((s) => s.submittedNotional);
  const [tab, setTab] = useState("open");

  const open = useMemo(() => orders.filter((o) => o.status === "open"), [orders]);
  const closed = useMemo(() => orders.filter((o) => o.status !== "open"), [orders]);

  const wins = CLOSED_TRADES.filter((t) => t.pnl > 0);
  const losses = CLOSED_TRADES.filter((t) => t.pnl <= 0);
  const netSim = CLOSED_TRADES.reduce((s, t) => s + t.pnl, 0);
  const winRate = (wins.length / CLOSED_TRADES.length) * 100;
  const avgWin = wins.reduce((s, t) => s + t.pnl, 0) / Math.max(1, wins.length);
  const avgLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / Math.max(1, losses.length));

  const stats = [
    { k: "Working orders", v: String(open.length), sub: "resting in the simulated book", tone: undefined },
    { k: "Fills (session)", v: String(fillCount), sub: "local engine executions", tone: 1 },
    { k: "Simulated volume", v: formatPrice(submittedNotional, "USD"), sub: "notional submitted", tone: undefined },
    { k: "Journal win rate", v: `${winRate.toFixed(0)}%`, sub: `${wins.length}W · ${losses.length}L closed`, tone: 1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-white">
            Orders <span className="text-volt">/ review</span>
          </h1>
          <p className="text-[11px] text-slate-500">
            Every order below lives in local React state — cancel, filter and re-run freely.
          </p>
        </div>
        <Badge variant="alert">Demo blotter · no real executions</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="panel p-4">
            <p className="label-caps">{s.k}</p>
            <p className={cn("num mt-1.5 text-xl font-bold text-white")}>{s.v}</p>
            <p className="mt-0.5 text-[10.5px] text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Blotter */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="open">Open ({open.length})</TabsTrigger>
              <TabsTrigger value="closed">Completed ({closed.length})</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
            simulated blotter
          </span>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="py-1">
          <TabsContent value="open">
            <OrdersTable
              orders={open}
              onCancel={cancel}
              empty="No working orders. Submit a limit or stop from the terminal ticket."
            />
          </TabsContent>
          <TabsContent value="closed">
            <OrdersTable orders={closed} empty="No completed orders yet." />
          </TabsContent>
        </Tabs>
      </div>

      {/* Trade journal */}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="panel overflow-hidden">
          <div className="panel-header">
            <span className="label-caps">Trade journal · closed demo rounds</span>
            <Badge variant="neon">Review</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[11.5px]">
              <thead>
                <tr className="border-b border-white/[0.07] text-[9px] uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-2 font-semibold">Symbol</th>
                  <th className="px-3 py-2 text-right font-semibold">P&amp;L</th>
                  <th className="px-3 py-2 text-right font-semibold">Return</th>
                  <th className="px-3 py-2 text-right font-semibold">Held</th>
                  <th className="px-4 py-2 text-right font-semibold">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {CLOSED_TRADES.map((t) => (
                  <tr key={t.symbol} className="row-hover border-b border-white/[0.04]">
                    <td className="num px-4 py-2 font-bold text-white">{t.symbol}</td>
                    <td
                      className={cn(
                        "num px-3 py-2 text-right",
                        t.pnl >= 0 ? "text-bull" : "text-bear",
                      )}
                    >
                      {t.pnl >= 0 ? "+" : ""}
                      {formatPrice(t.pnl, "NGN")}
                    </td>
                    <td className={cn("num px-3 py-2 text-right", t.pnl >= 0 ? "text-bull" : "text-bear")}>
                      {formatPct(t.returnPct)}
                    </td>
                    <td className="num px-3 py-2 text-right text-slate-400">{t.days}d</td>
                    <td className="px-4 py-2 text-right">
                      <Badge variant={t.pnl >= 0 ? "bull" : "bear"}>
                        {t.pnl >= 0 ? "Win" : "Loss"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel p-4">
          <span className="label-caps">Journal stats</span>
          <dl className="mt-3 space-y-2.5 text-[11.5px]">
            <Row k="Net (simulated)" v={formatPrice(netSim, "NGN")} tone={netSim} />
            <Row k="Average win" v={formatPrice(avgWin, "NGN")} tone={1} />
            <Row k="Average loss" v={`-${formatPrice(avgLoss, "NGN")}`} tone={-1} />
            <Row k="Payoff ratio" v={`${(avgWin / Math.max(avgLoss, 1)).toFixed(2)}R`} />
            <Row k="Win rate" v={`${winRate.toFixed(0)}%`} tone={1} />
          </dl>
          <div className={cn("mt-3 rounded-md border border-white/[0.07] p-2.5 text-[10px] leading-snug text-slate-500")}>
            Journal results are invented demo data used to exercise the UI. Past-looking numbers say
            nothing about future outcomes — and none of this is real.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: number }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] pb-1.5 last:border-0">
      <dt className="text-slate-500">{k}</dt>
      <dd
        className={cn(
          "num font-semibold",
          tone === undefined ? "text-slate-200" : toneBgClass(tone).split(" ")[1],
        )}
      >
        {v}
      </dd>
    </div>
  );
}
