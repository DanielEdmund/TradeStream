"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowDownRight, ArrowUpRight, Gauge } from "lucide-react";
import { ASSETS } from "@/lib/mock/assets";
import { ECONOMIC_CALENDAR } from "@/lib/mock/news";
import { useMarket } from "@/lib/store/use-market";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber, formatPct, formatPrice, timeAgo, toneClass } from "@/lib/utils";

/** Indices, breadth, movers and the mock economic calendar. */
export function MarketStats() {
  const router = useRouter();
  const indices = useMarket((s) => s.indices);
  const quotes = useMarket((s) => s.quotes);

  const breadth = useMemo(() => {
    let adv = 0;
    let dec = 0;
    let unch = 0;
    for (const a of ASSETS) {
      const pct = quotes[a.symbol]?.changePct ?? 0;
      if (pct > 0.05) adv++;
      else if (pct < -0.05) dec++;
      else unch++;
    }
    return { adv, dec, unch, total: ASSETS.length };
  }, [quotes]);

  const movers = useMemo(() => {
    const list = ASSETS.map((a) => ({ a, q: quotes[a.symbol] })).filter((x) => x.q);
    const byPct = [...list].sort((x, y) => (y.q!.changePct) - (x.q!.changePct));
    return { gainers: byPct.slice(0, 4), losers: byPct.slice(-4).reverse() };
  }, [quotes]);

  const total = breadth.total || 1;

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-3">
        {/* Indices */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {indices.map((ix) => (
            <div key={ix.id} className="panel p-3">
              <div className="flex items-center justify-between">
                <span className="label-caps truncate">{ix.name}</span>
                <Gauge size={11} className="shrink-0 text-volt" />
              </div>
              <p className="num mt-1.5 text-lg font-bold text-white">
                {formatNumber(ix.value, ix.value > 1000 ? 0 : 2)}
              </p>
              <p className={cn("num text-[11px] font-semibold", toneClass(ix.changePct))}>
                {formatPct(ix.changePct)} <span className="text-slate-600">today</span>
              </p>
            </div>
          ))}
        </div>

        {/* Breadth */}
        <div className="panel p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity size={13} className="text-volt" />
              <span className="label-caps">Simulated breadth · {total} instruments</span>
            </div>
            <span className="text-[10px] text-slate-600">updated every tick</span>
          </div>

          <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-surface-950">
            <div
              className="bg-bull transition-all duration-500"
              style={{ width: `${(breadth.adv / total) * 100}%` }}
            />
            <div
              className="bg-slate-600 transition-all duration-500"
              style={{ width: `${(breadth.unch / total) * 100}%` }}
            />
            <div
              className="bg-bear transition-all duration-500"
              style={{ width: `${(breadth.dec / total) * 100}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-bull">
              <ArrowUpRight size={12} /> {breadth.adv} advancing
            </span>
            <span className="text-slate-500">{breadth.unch} unchanged</span>
            <span className="flex items-center gap-1.5 text-bear">
              {breadth.dec} declining <ArrowDownRight size={12} />
            </span>
          </div>
        </div>

        {/* Movers */}
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { title: "Top gainers (sim)", rows: movers.gainers, tone: "bull" as const },
            { title: "Top decliners (sim)", rows: movers.losers, tone: "bear" as const },
          ].map((block) => (
            <div key={block.title} className="panel overflow-hidden">
              <div className="panel-header">
                <span className="label-caps">{block.title}</span>
                <Badge variant={block.tone}>{block.tone === "bull" ? "▲" : "▼"}</Badge>
              </div>
              <ul>
                {block.rows.map(({ a, q }) => (
                  <li key={a.symbol}>
                    <button
                      onClick={() => router.push(`/terminal?symbol=${a.symbol}`)}
                      className="row-hover flex w-full items-center justify-between px-4 py-2 text-left"
                    >
                      <span className="flex flex-col">
                        <span className="num text-[12px] font-bold text-white">{a.symbol}</span>
                        <span className="text-[10px] text-slate-600">{a.name}</span>
                      </span>
                      <span className="flex flex-col items-end">
                        <span className="num text-[11px] text-slate-300">
                          {q ? formatPrice(q.price, a.currency) : ""}
                        </span>
                        <span className={cn("num text-[11px] font-semibold", toneClass(q?.changePct ?? 0))}>
                          {q ? formatPct(q.changePct) : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="panel h-fit overflow-hidden">
        <div className="panel-header">
          <span className="label-caps">Economic calendar</span>
          <Badge variant="alert">Mock</Badge>
        </div>
        <ul>
          {ECONOMIC_CALENDAR.map((e) => (
            <li key={e.id} className="border-b border-white/[0.04] px-4 py-2.5 last:border-0">
              <div className="flex items-center justify-between gap-2">
                <span className="num text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {e.time}
                </span>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    e.importance === "high"
                      ? "bg-bear"
                      : e.importance === "medium"
                        ? "bg-alert"
                        : "bg-slate-600",
                  )}
                />
              </div>
              <p className="mt-1 text-[11.5px] leading-snug text-slate-300">
                <span className="mr-1.5 rounded bg-white/[0.07] px-1 py-0.5 text-[9px] font-bold text-slate-400">
                  {e.country}
                </span>
                {e.title}
              </p>
              {(e.forecast || e.previous) && (
                <p className="num mt-0.5 text-[10px] text-slate-600">
                  {e.forecast && <span>fc {e.forecast} </span>}
                  {e.previous && <span>· prev {e.previous}</span>}
                </p>
              )}
            </li>
          ))}
        </ul>
        <div className="border-t border-white/[0.06] px-4 py-2 text-[10px] leading-snug text-slate-600">
          Events are fictional demo entries {timeAgo(Date.now() - 1000)} — nothing here reflects real
          releases.
        </div>
      </div>
    </div>
  );
}
