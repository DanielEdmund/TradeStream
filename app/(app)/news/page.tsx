"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Radio, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ECONOMIC_CALENDAR, NEWS } from "@/lib/mock/news";
import { ASSETS } from "@/lib/mock/assets";
import { useMarket } from "@/lib/store/use-market";
import type { NewsItem } from "@/lib/types";
import { cn, formatPct, formatPrice, timeAgo, toneClass } from "@/lib/utils";

const CATEGORIES = ["All", "Markets", "FX", "Earnings", "Crypto", "Commodities", "Policy"] as const;

const SENTIMENT_STYLE = {
  bullish: "border-bull/35 bg-bull/10 text-bull",
  bearish: "border-bear/35 bg-bear/10 text-bear",
  neutral: "border-white/15 bg-white/5 text-slate-400",
} as const;

export default function NewsPage() {
  const router = useRouter();
  const quotes = useMarket((s) => s.quotes);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");

  const featured = NEWS.find((n) => n.featured) ?? NEWS[0];
  const feed = useMemo(
    () =>
      NEWS.filter((n) => !n.featured)
        .filter((n) => cat === "All" || n.category === cat)
        .sort((a, b) => b.timestamp - a.timestamp),
    [cat],
  );

  const movers = useMemo(() => {
    const list = ASSETS.map((a) => ({ a, q: quotes[a.symbol] })).filter((x) => x.q);
    const sorted = [...list].sort((x, y) => (y.q!.changePct) - (x.q!.changePct));
    return { up: sorted.slice(0, 5), down: sorted.slice(-5).reverse() };
  }, [quotes]);

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
            News <span className="text-volt">/ wire</span>
          </h1>
          <p className="text-[11px] text-slate-500">
            A simulated headlines feed written for this prototype — nothing here is real reporting.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-md border border-volt/30 bg-volt/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-volt">
          <Radio size={11} className="animate-pulse-dot" /> Demo wire · live sim
        </span>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-3">
          {/* Featured */}
          <article className="panel relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="volt">{featured.category}</Badge>
                <Badge variant="alert" className={cn(SENTIMENT_STYLE[featured.sentiment])}>
                  {featured.sentiment}
                </Badge>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  {featured.source} · {timeAgo(featured.timestamp)}
                </span>
              </div>
              <h2 className="mt-2.5 max-w-3xl text-xl font-bold leading-snug text-white">
                {featured.headline}
              </h2>
              <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-slate-400">
                {featured.summary}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {featured.tickers.map((t) => {
                  const asset = ASSETS.find((a) => a.symbol === t);
                  const q = quotes[t];
                  return (
                    <button
                      key={t}
                      onClick={() => router.push(`/terminal?symbol=${t}`)}
                      className="focus-ring flex items-center gap-2 rounded-md border border-white/10 bg-surface-950/70 px-2 py-1 transition-colors hover:border-volt/40"
                    >
                      <span className="num text-[11px] font-bold text-white">{t}</span>
                      {q && asset && (
                        <>
                          <span className="num text-[10.5px] text-slate-400">
                            {formatPrice(q.price, asset.currency)}
                          </span>
                          <span className={cn("num text-[10.5px]", toneClass(q.changePct))}>
                            {formatPct(q.changePct)}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "focus-ring h-7 rounded-md border px-2.5 text-[11px] font-semibold transition-colors",
                  cat === c
                    ? "border-volt/40 bg-volt/12 text-volt"
                    : "border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-slate-200",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="panel divide-y divide-white/[0.04] overflow-hidden">
            {feed.map((n: NewsItem) => (
              <article key={n.id} className="row-hover p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {n.category}
                  </span>
                  <span
                    className={cn(
                      "rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                      SENTIMENT_STYLE[n.sentiment],
                    )}
                  >
                    {n.sentiment}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-wider",
                      n.impact === "high" ? "text-alert" : "text-slate-600",
                    )}
                  >
                    {n.impact} impact
                  </span>
                  <span className="ml-auto text-[10px] text-slate-600">
                    {n.source} · {timeAgo(n.timestamp)}
                  </span>
                </div>
                <h3 className="mt-1.5 text-[14px] font-semibold leading-snug text-white">
                  {n.headline}
                </h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{n.summary}</p>
                {n.tickers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {n.tickers.map((t) => (
                      <button
                        key={t}
                        onClick={() => router.push(`/terminal?symbol=${t}`)}
                        className="focus-ring num rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-slate-400 hover:border-volt/40 hover:text-volt"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {feed.length === 0 && (
              <p className="px-4 py-8 text-center text-xs text-slate-500">
                No demo headlines in this category.
              </p>
            )}
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-3">
          <div className="panel overflow-hidden">
            <div className="panel-header">
              <span className="label-caps">Market movers</span>
              <Badge variant="volt">sim</Badge>
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/[0.05]">
              {[
                { title: "Gaining", rows: movers.up, Icon: TrendingUp, cls: "text-bull" },
                { title: "Falling", rows: movers.down, Icon: TrendingDown, cls: "text-bear" },
              ].map(({ title, rows, Icon, cls }) => (
                <div key={title} className="p-3">
                  <p className={cn("label-caps flex items-center gap-1", cls)}>
                    <Icon size={11} /> {title}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {rows.map(({ a, q }) => (
                      <li key={a.symbol} className="flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => router.push(`/terminal?symbol=${a.symbol}`)}
                          className="focus-ring num rounded font-bold text-slate-300 hover:text-volt"
                        >
                          {a.symbol}
                        </button>
                        <span className={cn("num", toneClass(q!.changePct))}>
                          {formatPct(q!.changePct)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="panel-header">
              <span className="label-caps">Calendar</span>
              <Badge variant="alert">mock</Badge>
            </div>
            <ul className="p-2">
              {ECONOMIC_CALENDAR.map((e) => (
                <li key={e.id} className="rounded-md px-2 py-1.5">
                  <div className="flex items-center justify-between">
                    <span className="num text-[10px] uppercase tracking-wider text-slate-500">
                      {e.time}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-slate-600">
                      {e.country}
                    </span>
                  </div>
                  <p className="text-[11px] leading-snug text-slate-300">{e.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
