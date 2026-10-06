"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AllocationDonut, type Slice } from "@/components/charts/allocation-donut";
import { EquityCurve } from "@/components/charts/equity-curve";
import { HoldingsTable, useHoldings } from "@/components/portfolio/holdings-table";
import { RiskPanel } from "@/components/portfolio/risk-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INITIAL_ACCOUNT_VALUE_NGN } from "@/lib/mock/portfolio";
import { useTrading } from "@/lib/store/use-trading";
import { cn, formatCompact, formatPrice, toNgn, toneBgClass } from "@/lib/utils";

export default function PortfolioPage() {
  const holdings = useHoldings();
  const cash = useTrading((s) => s.cash);
  const realizedPnl = useTrading((s) => s.realizedPnl);
  const [selected, setSelected] = useState("");

  const metrics = useMemo(() => {
    const holdingsNgn = holdings.reduce((s, h) => s + toNgn(h.value, h.currency), 0);
    const cashNgn = cash.NGN + cash.USD * 1655.5;
    const total = holdingsNgn + cashNgn;
    const dayPnl = holdings.reduce((s, h) => s + toNgn(h.dayPnl, h.currency), 0);
    const unrealised = holdings.reduce((s, h) => s + toNgn(h.totalPnl, h.currency), 0);
    const startingTotal = INITIAL_ACCOUNT_VALUE_NGN;

    const slices: Slice[] = [];
    const byClass = new Map<string, number>();
    for (const h of holdings) {
      const v = toNgn(h.value, h.currency);
      byClass.set(h.asset.class, (byClass.get(h.asset.class) ?? 0) + v);
    }
    const label: Record<string, string> = {
      stock: "NGX stocks",
      etf: "ETFs",
      crypto: "Crypto",
      fx: "FX",
      commodity: "Commodities",
    };
    byClass.forEach((v, k) => slices.push({ name: label[k] ?? k, value: v, color: "" }));
    if (cashNgn > 0) slices.push({ name: "Cash (demo)", value: cashNgn, color: "" });

    return {
      total,
      cashNgn,
      holdingsNgn,
      dayPnl,
      dayPct: total ? (dayPnl / (total - dayPnl)) * 100 : 0,
      unrealised,
      totalReturnPct: ((total - startingTotal) / startingTotal) * 100,
      slices,
    };
  }, [holdings, cash]);

  const cards = [
    {
      k: "Portfolio value",
      v: formatCompact(metrics.total, "NGN"),
      sub: `₦${formatPrice(metrics.cashNgn, "NGN").slice(1)} cash`,
      tone: undefined,
    },
    {
      k: "Day P&L",
      v: `${metrics.dayPnl >= 0 ? "+" : ""}${formatPrice(metrics.dayPnl, "NGN")}`,
      sub: `${metrics.dayPct >= 0 ? "+" : ""}${metrics.dayPct.toFixed(2)}% today`,
      tone: metrics.dayPnl,
    },
    {
      k: "Unrealised P&L",
      v: `${metrics.unrealised >= 0 ? "+" : ""}${formatPrice(metrics.unrealised, "NGN")}`,
      sub: "open positions, marked to sim",
      tone: metrics.unrealised,
    },
    {
      k: "Realised P&L",
      v: formatPrice(realizedPnl, "NGN"),
      sub: "closed demo trades",
      tone: realizedPnl,
    },
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
            Portfolio <span className="text-volt">/ track</span>
          </h1>
          <p className="text-[11px] text-slate-500">
            Simulated holdings, allocation and P&amp;L — play money only, nothing is invested.
          </p>
        </div>
        <Badge variant="alert">Demo / simulated portfolio</Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.k} className="panel p-4">
            <p className="label-caps">{c.k}</p>
            <p
              className={cn(
                "num mt-1.5 text-xl font-bold tracking-tight",
                c.tone === undefined ? "text-white" : toneBgClass(c.tone).split(" ")[1],
              )}
            >
              {c.v}
            </p>
            <p className="mt-0.5 text-[10.5px] text-slate-500">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card>
          <CardContent className="p-0">
            <EquityCurve total={metrics.total} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
              Allocation
            </CardTitle>
          </CardHeader>
          <AllocationDonut slices={metrics.slices} centerLabel="simulated" />
        </Card>
      </div>

      {/* Holdings + risk */}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="panel overflow-hidden">
          <div className="panel-header">
            <span className="label-caps">Holdings</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              click symbol to open terminal
            </span>
          </div>
          <HoldingsTable onSelect={setSelected} />
        </div>
        <RiskPanel />
      </div>
    </motion.div>
  );
}
