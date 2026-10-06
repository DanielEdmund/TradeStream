"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  CandlestickChart,
  CheckCircle2,
  FlaskConical,
  Gauge,
  Layers,
  LineChart,
  Newspaper,
  PieChart,
  ReceiptText,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const JOURNEY = [
  { step: "Discover", icon: Layers, href: "/markets", copy: "Screen NGX stocks, ETFs, crypto, FX and commodities in one fast tape." },
  { step: "Analyze", icon: CandlestickChart, href: "/terminal", copy: "Candles, depth ladder and time & sales — the terminal vocabulary, live-simulated." },
  { step: "Simulate", icon: Zap, href: "/terminal", copy: "Market, limit and stop orders routed to local state. Zero risk, full mechanics." },
  { step: "Track", icon: PieChart, href: "/portfolio", copy: "Mark-to-market P&L, weights, allocation and a simulated stress test." },
  { step: "Review", icon: ReceiptText, href: "/orders", copy: "A blotter and journal that turn every fill into feedback." },
  { step: "Learn", icon: BookOpenText, href: "/learn", copy: "Glossary, risk principles and a knowledge check before real capital." },
];

const STATS = [
  { v: "30", l: "mock instruments", s: "NGX · ETF · crypto · FX" },
  { v: "5", l: "chart timeframes", s: "1D → 1Y seeded candles" },
  { v: "1.3s", l: "sim tick interval", s: "local random-walk engine" },
  { v: "₦0", l: "real money involved", s: "no broker, bank or wallet" },
];

const ASSET_CLASSES = [
  { k: "NGX stocks", d: "MTNN · DANGCEM · GTCO · SEPLAT…", tone: "text-bull" },
  { k: "ETFs", d: "SPY · QQQ · GLD · EEM", tone: "text-volt" },
  { k: "Crypto", d: "BTC · ETH · SOL · XRP · BNB", tone: "text-neon" },
  { k: "FX & commodities", d: "USD/NGN · XAU · Brent · EUR/USD", tone: "text-alert" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const HEADLINE_LINES = ["Trade smarter.", "Move faster.", "Stay in control."];

const lineVariants: Variants = {
  hidden: { y: "118%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.8, delay: 0.18 + i * 0.11, ease: EASE },
  }),
};

/** Scroll-triggered fade/rise wrapper used across the lower sections. */
function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Counts a stat string ("30", "1.3s", "₦0") up once it scrolls into view. */
function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  const { prefix, suffix, decimals, target } = useMemo(() => {
    const m = /^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/.exec(value);
    if (!m) return { prefix: "", suffix: value, decimals: 0, target: 0 };
    return {
      prefix: m[1],
      suffix: m[3],
      decimals: (m[2].split(".")[1] ?? "").length,
      target: Number(m[2]),
    };
  }, [value]);

  const final = `${prefix}${target.toFixed(decimals)}${suffix}`;
  const [display, setDisplay] = useState(final);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, target, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-surface-950 text-plat">
        {/* Demo strip */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="flex h-7 items-center justify-center gap-2 border-b border-alert/25 bg-alert/[0.08] px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-alert"
        >
          <FlaskConical size={12} />
          Demo / simulated trading — frontend prototype with mock data only
        </motion.div>

        {/* Nav */}
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-surface-950/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Link href="/" className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-volt/15 text-volt">
                  <ArrowRight size={15} />
                </span>
                <span className="text-[15px] font-bold tracking-tight text-white">
                  Trade<span className="text-volt">Stream</span>
                </span>
                <Badge variant="alert">Demo</Badge>
              </Link>
            </motion.div>

            <nav className="hidden items-center gap-5 text-[13px] font-medium text-slate-400 md:flex">
              {[
                { href: "/markets", l: "Markets" },
                { href: "/terminal", l: "Terminal" },
                { href: "/portfolio", l: "Portfolio" },
                { href: "/orders", l: "Orders" },
                { href: "/news", l: "News" },
                { href: "/learn", l: "Learn" },
              ].map((i, idx) => (
                <motion.span
                  key={i.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + idx * 0.05, ease: EASE }}
                >
                  <Link href={i.href} className="transition-colors hover:text-white">
                    {i.l}
                  </Link>
                </motion.span>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.5, ease: EASE }}
              className="flex items-center gap-2"
            >
              <Link href="/learn">
                <Button variant="outline" size="sm">
                  Why simulate?
                </Button>
              </Link>
              <Link href="/terminal">
                <Button size="sm" className="shine-sweep">
                  Launch terminal <ArrowRight size={13} />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Scroll progress */}
          <motion.div
            style={{ scaleX: progress }}
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-volt via-cyan-300 to-neon"
          />
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="absolute inset-0 bg-grid-faint opacity-[0.55]" />
          <div className="absolute inset-0 grid-surface animate-grid-pan opacity-40" />
          {/* Ambient drifting glows */}
          <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 animate-float-a rounded-full bg-volt/25 blur-[90px]" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 animate-float-b rounded-full bg-neon/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-72 animate-float-b rounded-full bg-bull/10 blur-[90px]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />

          <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-volt/30 bg-volt/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-volt">
                <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse-dot" />
                Professional trading terminal · simulated
              </span>
            </motion.div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
              {HEADLINE_LINES.map((line, i) => (
                <span
                  key={line}
                  className="block overflow-hidden pb-[0.18em] -mb-[0.18em]"
                >
                  <motion.span
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate="show"
                    className={cn("block", i === 2 && "text-gradient-flow")}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-400"
            >
              TradeStream is a high-performance trading terminal concept built for Nigerian retail
              investors — the speed and precision of a pro desk, explained clearly enough for
              everyday investors. Every price, chart, order and fill here is{" "}
              <span className="font-semibold text-alert">simulated locally</span>. Learn the
              mechanics of markets without ever risking a naira.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62, ease: EASE }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link href="/terminal">
                <Button size="lg" className="shine-sweep">
                  <CandlestickChart size={16} /> Open demo terminal
                </Button>
              </Link>
              <Link href="/markets">
                <Button size="lg" variant="outline">
                  Explore markets <ArrowRight size={15} />
                </Button>
              </Link>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.85 }}
                className="flex items-center gap-1.5 text-[11px] text-slate-500"
              >
                <CheckCircle2 size={13} className="text-bull" />
                No sign-up · no wallet · no real orders
              </motion.span>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.72, ease: EASE }}
              className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4"
            >
              {STATS.map((s) => (
                <div
                  key={s.l}
                  className="panel p-4 transition-all duration-200 hover:-translate-y-1 hover:border-volt/35 hover:shadow-glow-volt"
                >
                  <p className="num text-2xl font-black text-white">
                    <CountUp value={s.v} />
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-slate-300">{s.l}</p>
                  <p className="text-[10.5px] text-slate-600">{s.s}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Journey */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <Reveal>
            <p className="label-caps">The loop</p>
            <h2 className="mt-1.5 text-2xl font-bold text-white md:text-3xl">
              Discover → Analyze → Simulate → Track → Review → Learn
            </h2>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-400">
              A complete practice loop for active traders — built to feel fast, technical and precise,
              while staying legible for everyday investors.
            </p>
          </Reveal>

          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {JOURNEY.map((j, i) => {
              const Icon = j.icon;
              return (
                <motion.div
                  key={j.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                  className="h-full"
                >
                  <Link href={j.href} className="group block h-full">
                    <div className="panel h-full p-5 transition-all duration-200 group-hover:border-volt/35 group-hover:shadow-glow-volt">
                      <div className="flex items-center justify-between">
                        <span className="grid h-9 w-9 place-items-center rounded-md border border-volt/30 bg-volt/10 text-volt transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110">
                          <Icon size={17} />
                        </span>
                        <span className="num text-[11px] font-black text-slate-700 transition-colors duration-200 group-hover:text-volt/70">
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[15px] font-bold text-white group-hover:text-volt">
                        {j.step}
                      </h3>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-400">{j.copy}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Terminal preview */}
        <section className="border-y border-white/[0.06] bg-surface-900/40">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <Reveal>
                <p className="label-caps">Terminal feel</p>
                <h2 className="mt-1.5 text-2xl font-bold text-white">
                  Closer to a desk than a banking app
                </h2>
              </Reveal>
              <ul className="mt-5 space-y-3">
                {[
                  { Icon: Gauge, t: "Speed-aware chrome", d: "Ticker tape, live-sim badge and a pausable feed control keep you oriented." },
                  { Icon: BarChart3, t: "Precision data", d: "Monospaced numerics, tabular figures, depth ladder and time & sales." },
                  { Icon: ShieldAlert, t: "Risk, always visible", d: "Spreads, stress shocks and concentration warnings sit next to the numbers." },
                  { Icon: Newspaper, t: "Context in one pane", d: "A simulated wire, movers and calendar feed the same tape you trade on." },
                ].map(({ Icon, t, d }, i) => (
                  <motion.li
                    key={t}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                    className="flex gap-3"
                  >
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-volt transition-colors duration-200 hover:border-volt/40 hover:bg-volt/10">
                      <Icon size={14} />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-bold text-white">{t}</p>
                      <p className="text-[12.5px] leading-relaxed text-slate-400">{d}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE }}
              className="panel overflow-hidden"
            >
              <div className="panel-header">
                <span className="label-caps">Mock watchlist</span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-volt">
                  <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse-dot" /> sim feed
                </span>
              </div>
              <ul className="divide-y divide-white/[0.05]">
                {[
                  { s: "MTNN", p: "₦268.50", c: +2.12 },
                  { s: "GTCO", p: "₦62.35", c: +2.21 },
                  { s: "DANGCEM", p: "₦480.20", c: -1.35 },
                  { s: "SEPLAT", p: "₦5,600.00", c: -1.41 },
                  { s: "BTC", p: "$63,240.00", c: +2.18 },
                  { s: "XAUUSD", p: "$2,645.30", c: +0.46 },
                  { s: "USDNGN", p: "₦1,655.50", c: +0.27 },
                ].map((r) => (
                  <li key={r.s} className="flex items-center justify-between px-4 py-2.5">
                    <span className="num text-[12px] font-bold text-white">{r.s}</span>
                    <span className="flex items-center gap-3">
                      <span className="num text-[11.5px] text-slate-400">{r.p}</span>
                      <span
                        className={cn(
                          "num w-16 text-right text-[11.5px] font-semibold",
                          r.c >= 0 ? "text-bull" : "text-bear",
                        )}
                      >
                        {r.c >= 0 ? "+" : ""}
                        {r.c.toFixed(2)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/[0.06] px-4 py-2.5 text-[10px] leading-snug text-slate-600">
                Static illustration — the live terminal random-walks every 1.3 seconds.
              </div>
            </motion.div>
          </div>
        </section>

        {/* Asset classes */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <Reveal>
            <p className="label-caps">Simulated universe</p>
            <h2 className="mt-1.5 text-2xl font-bold text-white">Four asset classes, one tape</h2>
          </Reveal>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {ASSET_CLASSES.map((c, i) => (
              <motion.div
                key={c.k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                className="panel group h-full p-5"
              >
                <Sparkles
                  size={15}
                  className={cn(c.tone, "transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110")}
                />
                <p className="mt-3 text-[14px] font-bold text-white">{c.k}</p>
                <p className="num mt-1 text-[11.5px] leading-relaxed text-slate-500">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Risk + CTA */}
        <section className="border-t border-white/[0.06] bg-surface-900/40">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: EASE }}
                className="rounded-xl border border-alert/25 bg-alert/[0.06] p-6"
              >
                <div className="flex items-center gap-2 text-alert">
                  <ShieldAlert size={16} />
                  <span className="label-caps !text-alert">Read this first</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-white">
                  A prototype, not a trading service
                </h3>
                <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-slate-400">
                  {[
                    "No real brokerage, market data, WebSocket or order execution",
                    "No deposits, withdrawals, bank links or crypto transactions",
                    "No authentication, KYC, leverage or margin",
                    "No financial advice — all numbers are local mock TypeScript data",
                    "Gains and losses shown are neutral demo values, never predictions",
                  ].map((t, i) => (
                    <motion.li
                      key={t}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease: EASE }}
                      className="flex gap-2"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-alert" />
                      {t}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
                className="panel flex flex-col justify-center p-6"
              >
                <p className="label-caps">Core message</p>
                <p className="mt-2 text-3xl font-black leading-tight text-white">
                  Trade smarter.
                  <br />
                  Move faster.
                  <br />
                  <span className="text-volt">Stay in control.</span>
                </p>
                <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-slate-400">
                  Step into the simulated terminal, size a position, watch the ladder move and review
                  the fill — the whole loop, with zero consequences.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/terminal">
                    <Button size="lg" className="shine-sweep">
                      <Zap size={16} /> Launch demo terminal
                    </Button>
                  </Link>
                  <Link href="/learn">
                    <Button size="lg" variant="ghost">
                      <LineChart size={15} /> Learn the mechanics
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06]">
          <Reveal y={12} delay={0.05}>
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-volt/15 text-volt">
                  <ArrowRight size={14} />
                </span>
                <div className="text-[12px] leading-tight">
                  <p className="font-bold text-white">
                    Trade<span className="text-volt">Stream</span>
                  </p>
                  <p className="text-[10.5px] text-slate-600">Demo / simulated trading prototype</p>
                </div>
              </div>
              <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-slate-500">
                {["Markets", "Terminal", "Portfolio", "Orders", "News", "Learn"].map((l) => (
                  <Link key={l} href={`/${l.toLowerCase()}`} className="transition-colors hover:text-white">
                    {l}
                  </Link>
                ))}
              </nav>
              <p className="max-w-md text-[10.5px] leading-relaxed text-slate-600">
                © 2026 TradeStream concept. Frontend mock only — no real financial services are offered
                or implied. Not investment advice.
              </p>
            </div>
          </Reveal>
        </footer>
      </div>
    </MotionConfig>
  );
}
