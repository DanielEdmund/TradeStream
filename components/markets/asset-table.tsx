"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownUp, Search, Star } from "lucide-react";
import { Sparkline } from "@/components/charts/sparkline";
import { Badge } from "@/components/ui/badge";
import { CLASS_LABEL, CLASS_ORDER, ASSETS } from "@/lib/mock/assets";
import { useMarket } from "@/lib/store/use-market";
import type { AssetClass } from "@/lib/types";
import { cn, formatPct, formatPrice, toneClass } from "@/lib/utils";

type SortKey = "symbol" | "price" | "change" | "class";

/** Discover & screen the mock asset universe. */
export function AssetTable() {
  const router = useRouter();
  const quotes = useMarket((s) => s.quotes);
  const history = useMarket((s) => s.history);
  const watchlist = useMarket((s) => s.watchlist);
  const toggleWatch = useMarket((s) => s.toggleWatch);

  const [query, setQuery] = useState("");
  const [cls, setCls] = useState<AssetClass | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "change", dir: -1 });

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = ASSETS.filter((a) => {
      const okCls = cls === "all" || a.class === cls;
      const okTerm =
        !term ||
        a.symbol.toLowerCase().includes(term) ||
        a.name.toLowerCase().includes(term) ||
        a.sector.toLowerCase().includes(term);
      return okCls && okTerm;
    });

    const sorted = [...filtered].sort((a, b) => {
      const qa = quotes[a.symbol];
      const qb = quotes[b.symbol];
      switch (sort.key) {
        case "symbol":
          return a.symbol.localeCompare(b.symbol) * sort.dir;
        case "class":
          return a.class.localeCompare(b.class) * sort.dir;
        case "price":
          return ((qa?.price ?? 0) - (qb?.price ?? 0)) * sort.dir;
        default:
          return ((qa?.changePct ?? 0) - (qb?.changePct ?? 0)) * sort.dir;
      }
    });
    return sorted;
  }, [query, cls, sort, quotes]);

  const th = (key: SortKey, label: string, right = false) => (
    <th className={cn("px-3 py-2 font-semibold", right && "text-right")}>
      <button
        onClick={() =>
          setSort((s) => ({ key, dir: s.key === key && s.dir === -1 ? 1 : -1 }))
        }
        className={cn(
          "focus-ring inline-flex items-center gap-1 rounded transition-colors hover:text-volt",
          sort.key === key && "text-volt",
        )}
      >
        {label}
        <ArrowDownUp size={9} className={sort.key === key ? "opacity-100" : "opacity-30"} />
      </button>
    </th>
  );

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header h-auto flex-wrap gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="label-caps">Asset explorer</span>
          <Badge variant="volt">{rows.length} instruments</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class filter */}
          <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.07] bg-surface-950/70 p-0.5">
            {(["all", ...CLASS_ORDER] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCls(c)}
                className={cn(
                  "focus-ring h-6 rounded-md px-2 text-[10px] font-semibold transition-colors",
                  cls === c
                    ? "bg-volt/15 text-volt shadow-[inset_0_0_0_1px_rgba(6,182,212,0.35)]"
                    : "text-slate-400 hover:text-slate-200",
                )}
              >
                {c === "all" ? "All" : CLASS_LABEL[c]}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter symbols…"
              aria-label="Filter mock assets"
              className="focus-ring h-7 w-40 rounded-md border border-white/10 bg-surface-950/80 pl-7 pr-2 text-[11px] text-plat placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-white/[0.07] text-[9px] uppercase tracking-[0.14em] text-slate-500">
              <th className="w-9 px-3 py-2" />
              {th("symbol", "Symbol")}
              <th className="px-3 py-2 font-semibold">Name / sector</th>
              {th("class", "Class")}
              <th className="px-3 py-2 text-right font-semibold">Last</th>
              {th("change", "Day %", true)}
              <th className="px-3 py-2 text-right font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const q = quotes[a.symbol];
              const pct = q?.changePct ?? 0;
              const watched = watchlist.includes(a.symbol);
              return (
                <tr
                  key={a.symbol}
                  onClick={() => router.push(`/terminal?symbol=${a.symbol}`)}
                  className="row-hover cursor-pointer border-b border-white/[0.04]"
                >
                  <td className="px-3 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatch(a.symbol);
                      }}
                      aria-label="Toggle watchlist"
                      className={cn(
                        "focus-ring rounded p-0.5 transition-colors",
                        watched ? "text-alert" : "text-slate-600 hover:text-slate-300",
                      )}
                    >
                      <Star size={13} fill={watched ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="num px-3 py-2 font-bold text-white">{a.symbol}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-slate-300">{a.name}</span>
                      <span className="text-[10px] text-slate-600">
                        {a.sector} · {a.exchange}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      variant={
                        a.class === "crypto"
                          ? "neon"
                          : a.class === "stock"
                            ? "volt"
                            : a.class === "etf"
                              ? "bull"
                              : "default"
                      }
                    >
                      {CLASS_LABEL[a.class]}
                    </Badge>
                  </td>
                  <td className="num px-3 py-2 text-right text-slate-200">
                    {q ? formatPrice(q.price, a.currency) : "—"}
                  </td>
                  <td className={cn("num px-3 py-2 text-right font-semibold", toneClass(pct))}>
                    {formatPct(pct)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end">
                      <Sparkline data={history[a.symbol] ?? []} positive={pct >= 0} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-500">
                  No demo instrument matches that filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-2 text-[10px] text-slate-600">
        Click a row to open it in the simulated terminal. Prices update from the local random-walk
        engine every 1.3s — no market data is fetched anywhere.
      </div>
    </div>
  );
}
