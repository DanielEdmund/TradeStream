"use client";

import { useMemo } from "react";
import { Brain, Layers, Scale, Target } from "lucide-react";
import { useHoldings } from "@/components/portfolio/holdings-table";
import { INITIAL_ACCOUNT_VALUE_NGN } from "@/lib/mock/portfolio";
import { useTrading } from "@/lib/store/use-trading";
import { DEMO_FX_USDNGN, toNgn, formatPrice, cn, formatPct } from "@/lib/utils";

const CLASS_TONE: Record<string, string> = {
  stock: "text-bull",
  etf: "text-volt",
  crypto: "text-neon",
  fx: "text-alert",
  commodity: "text-slate-300",
};

/** Risk & analytics panel — concentration, stress test, best/worst (demo metrics). */
export function RiskPanel() {
  const holdings = useHoldings();
  const cash = useTrading((s) => s.cash);

  const stats = useMemo(() => {
    const totalNgn =
      holdings.reduce((s, h) => s + toNgn(h.value, h.currency), 0) +
      // cash counts toward allocation
      0;
    const byClass = new Map<string, number>();
    for (const h of holdings) {
      const v = toNgn(h.value, h.currency);
      byClass.set(h.asset.class, (byClass.get(h.asset.class) ?? 0) + v);
    }

    const sorted = [...holdings].sort((a, b) => b.weight - a.weight);
    const top = sorted[0];
    const best = [...holdings].sort((a, b) => b.totalPnlPct - a.totalPnlPct)[0];
    const worst = [...holdings].sort((a, b) => a.totalPnlPct - b.totalPnlPct)[0];

    const winners = holdings.filter((h) => h.totalPnl > 0).length;
    const totalPnl = holdings.reduce((s, h) => s + toNgn(h.totalPnl, h.currency), 0);

    return {
      totalNgn,
      byClass: [...byClass.entries()].map(([k, v]) => ({ k, v, pct: totalNgn ? (v / totalNgn) * 100 : 0 })),
      top,
      best,
      worst,
      winRate: holdings.length ? (winners / holdings.length) * 100 : 0,
      totalPnl,
      count: holdings.length,
      classCount: byClass.size,
    };
  }, [holdings]);

  const concentrationRisk = stats.top && stats.top.weight > 25;

  return (
    <div className="space-y-3">
      {/* Exposure by class */}
      <div className="panel p-4">
        <div className="flex items-center gap-2">
          <Layers size={13} className="text-volt" />
          <span className="label-caps">Exposure by asset class</span>
        </div>
        <ul className="mt-3 space-y-2">
          {stats.byClass.map((c) => (
            <li key={c.k} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className={cn("font-semibold uppercase tracking-wide", CLASS_TONE[c.k] ?? "text-slate-300")}>
                  {c.k}
                </span>
                <span className="num text-slate-400">
                  {formatPrice(c.v, "NGN")} · {c.pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-950">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-volt/70 to-volt"
                  style={{ width: `${Math.min(100, c.pct)}%` }}
                />
              </div>
            </li>
          ))}
          {stats.byClass.length === 0 && (
            <li className="text-[11px] text-slate-500">No holdings to allocate.</li>
          )}
        </ul>
      </div>

      {/* Stress test */}
      <div className="panel p-4">
        <div className="flex items-center gap-2">
          <Scale size={13} className="text-alert" />
          <span className="label-caps">Simulated stress test</span>
        </div>
        <p className="mt-1 text-[10px] leading-snug text-slate-600">
          Hypothetical shock applied to current holdings only — an illustration, not a forecast.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[-3, -5, -10].map((shock) => {
            const impact = (stats.totalNgn * shock) / 100;
            return (
              <div key={shock} className="rounded-lg border border-white/[0.07] bg-surface-950/60 p-2 text-center">
                <p className="num text-[11px] font-bold text-bear">{shock}%</p>
                <p className="num mt-0.5 text-[11px] text-slate-300">{formatPrice(impact, "NGN")}</p>
                <p className="text-[9px] uppercase tracking-wider text-slate-600">shock</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scorecard */}
      <div className="panel p-4">
        <div className="flex items-center gap-2">
          <Target size={13} className="text-bull" />
          <span className="label-caps">Demo scorecard</span>
        </div>
        <dl className="mt-3 space-y-2 text-[11px]">
          <Line k="Positions" v={`${stats.count} across ${stats.classCount} classes`} />
          <Line
            k="Concentration"
            v={stats.top ? `${stats.top.symbol} · ${stats.top.weight.toFixed(1)}%` : "—"}
            warn={concentrationRisk}
          />
          <Line k="Holding win rate" v={`${stats.winRate.toFixed(0)}% of positions in profit`} />
          <Line
            k="Best performer"
            v={stats.best ? `${stats.best.symbol} ${formatPct(stats.best.totalPnlPct)}` : "—"}
            tone="good"
          />
          <Line
            k="Weakest performer"
            v={stats.worst ? `${stats.worst.symbol} ${formatPct(stats.worst.totalPnlPct)}` : "—"}
            tone="bad"
          />
          <Line
            k="Unrealised P&L"
            v={formatPrice(stats.totalPnl, "NGN")}
            tone={stats.totalPnl >= 0 ? "good" : "bad"}
          />
          <Line
            k="vs starting capital"
            v={formatPct(
              ((stats.totalNgn + cash.NGN + cash.USD * DEMO_FX_USDNGN) /
                INITIAL_ACCOUNT_VALUE_NGN) *
                100 -
                100,
            )}
          />
        </dl>
        <p className="mt-3 flex items-start gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.03] p-2 text-[9.5px] leading-snug text-slate-500">
          <Brain size={12} className="mt-px shrink-0 text-neon" />
          Metrics are computed from mock data for interface demonstration only. This is not
          financial advice or risk analysis.
        </p>
      </div>
    </div>
  );
}

function Line({
  k,
  v,
  tone,
  warn,
}: {
  k: string;
  v: string;
  tone?: "good" | "bad";
  warn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] pb-1.5 last:border-0">
      <dt className="text-slate-500">{k}</dt>
      <dd
        className={cn(
          "num text-right font-semibold",
          warn ? "text-alert" : tone === "good" ? "text-bull" : tone === "bad" ? "text-bear" : "text-slate-200",
        )}
      >
        {v}
      </dd>
    </div>
  );
}
