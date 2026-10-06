"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CircleDot,
  LayoutGrid,
  Pause,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";
import { ASSETS } from "@/lib/mock/assets";
import { Button } from "@/components/ui/button";
import { useMarket } from "@/lib/store/use-market";
import { useTrading } from "@/lib/store/use-trading";
import { cn, DEMO_FX_USDNGN, formatClock, formatCompact, formatPct, formatPrice, toneClass } from "@/lib/utils";

export function Topbar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState(() => Date.now());
  const boxRef = useRef<HTMLDivElement>(null);

  const feed = useMarket((s) => s.feed);
  const toggleFeed = useMarket((s) => s.toggleFeed);
  const quotes = useMarket((s) => s.quotes);
  const indices = useMarket((s) => s.indices);
  const cash = useTrading((s) => s.cash);
  const resetDemo = useTrading((s) => s.resetDemo);

  useEffect(() => {
    const t = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return ASSETS.filter(
      (a) =>
        a.symbol.toLowerCase().includes(term) ||
        a.name.toLowerCase().includes(term) ||
        a.sector.toLowerCase().includes(term),
    ).slice(0, 7);
  }, [q]);

  const totalEquity = useMemo(() => {
    let ngn = cash.NGN + cash.USD * DEMO_FX_USDNGN;
    for (const p of useTrading.getState().positions) {
      const quote = quotes[p.symbol];
      const value = (quote?.price ?? p.avgPrice) * p.qty;
      ngn += p.currency === "USD" ? value * DEMO_FX_USDNGN : value;
    }
    return ngn;
  }, [cash, quotes]);

  const ngx = indices.find((i) => i.id === "NGXASI");

  return (
    <header className="relative z-40 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-surface-900/75 px-3 backdrop-blur md:px-4">
      {/* Mobile nav entry (mark) */}
      <div className="flex items-center gap-2 lg:hidden">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-volt/15 text-volt">
          <LayoutGrid size={14} />
        </span>
        <span className="text-sm font-bold text-white">
          Trade<span className="text-volt">Stream</span>
        </span>
      </div>

      {/* Search */}
      <div ref={boxRef} className="relative w-full max-w-[300px]">
        <Search
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search symbol, name, sector…"
          aria-label="Search mock assets"
          className="focus-ring h-8 w-full rounded-md border border-white/10 bg-surface-950/80 pl-8 pr-3 text-xs text-plat placeholder:text-slate-500 hover:border-white/20"
        />
        {open && results.length > 0 && (
          <div className="absolute left-0 top-9 z-50 w-full overflow-hidden rounded-lg border border-white/10 bg-surface-900 shadow-panel">
            {results.map((a) => {
              const quote = quotes[a.symbol];
              return (
                <button
                  key={a.symbol}
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                    router.push(`/terminal?symbol=${a.symbol}`);
                  }}
                  className="row-hover flex w-full items-center justify-between px-3 py-2 text-left"
                >
                  <span className="flex flex-col">
                    <span className="num text-xs font-bold text-white">{a.symbol}</span>
                    <span className="text-[10px] text-slate-500">{a.name}</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="num text-[11px] text-slate-300">
                      {quote ? formatPrice(quote.price, a.currency) : ""}
                    </span>
                    <span className={cn("num text-[10px]", toneClass(quote?.changePct ?? 0))}>
                      {quote ? formatPct(quote.changePct) : ""}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {open && q.trim() && results.length === 0 && (
          <div className="absolute left-0 top-9 z-50 w-full rounded-lg border border-white/10 bg-surface-900 px-3 py-2 text-xs text-slate-500">
            No demo asset matches “{q}”.
          </div>
        )}
      </div>

      {/* NGX mini quote */}
      {ngx && (
        <div className="hidden items-baseline gap-2 border-l border-white/[0.07] pl-3 xl:flex">
          <span className="label-caps">NGX ASI</span>
          <span className="num text-xs font-semibold text-slate-200">
            {formatCompact(ngx.value, "NGN").replace("₦", "")}
          </span>
          <span className={cn("num text-[11px]", toneClass(ngx.changePct))}>
            {formatPct(ngx.changePct)}
          </span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Simulated clock */}
        <div className="hidden items-center gap-1.5 rounded-md border border-white/[0.07] bg-surface-950/70 px-2 py-1 sm:flex">
          <CircleDot size={11} className="text-volt" />
          <span className="num text-[11px] font-semibold text-slate-300">{formatClock(clock)}</span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
            WAT
          </span>
        </div>

        {/* Feed control */}
        <button
          onClick={toggleFeed}
          title="Pause / resume the simulated price engine"
          className={cn(
            "focus-ring flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors",
            feed === "live"
              ? "border-volt/35 bg-volt/10 text-volt hover:bg-volt/15"
              : "border-alert/35 bg-alert/10 text-alert hover:bg-alert/15",
          )}
        >
          {feed === "live" ? <Pause size={12} /> : <Play size={12} />}
          {feed === "live" ? "Live sim" : "Paused"}
        </button>

        {/* Demo equity */}
        <div className="hidden flex-col items-end leading-none md:flex">
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Demo equity
          </span>
          <span className="num text-[13px] font-bold text-white">
            {formatCompact(totalEquity, "NGN")}
          </span>
        </div>

        <Button variant="ghost" size="icon-sm" title="Reset demo data" onClick={resetDemo}>
          <RotateCcw size={14} />
        </Button>

        <div className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.03] py-1 pl-1 pr-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-gradient-to-br from-volt to-neon text-[10px] font-black text-slate-950">
            DT
          </span>
          <span className="hidden text-[11px] font-semibold text-slate-300 sm:block">
            Demo Trader
          </span>
          <ChevronDown size={12} className="text-slate-500" />
        </div>
      </div>
    </header>
  );
}
