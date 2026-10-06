# TradeStream — Demo / Simulated Trading Terminal

> **FRONTEND MOCK ONLY.** This is a visual and interactive prototype, not a real trading or
> financial application. No brokerage integrations, market APIs, WebSocket connections, order
> execution, deposits/withdrawals, bank connections, crypto transactions, authentication/KYC,
> leverage/margin, or financial advice exist here. **Every price, chart, order, balance,
> position, news item, market move and transaction is local mock TypeScript data simulated with
> React state.**

Core message: **Trade smarter. Move faster. Stay in control.**

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui-style** hand-built primitives (Button, Card, Tabs, Badge, Input…)
- **Framer Motion** for motion, **Lucide React** for icons
- **TradingView Lightweight Charts** (candlestick terminal chart) + **Recharts** (equity curve, allocation donut)
- **Zustand** for simulated state (price engine, order book, orders, positions)
- **React Hook Form + Zod** for the simulated order ticket

## Project structure

```
app/
  layout.tsx                 Root layout, metadata, fonts
  globals.css                Design tokens, terminal surfaces, utilities
  page.tsx                   Landing / product story
  (app)/
    layout.tsx               Terminal chrome (sidebar, topbar, ticker tape, demo banner)
    markets/page.tsx         Asset discovery & screening
    terminal/page.tsx        Main trading terminal (chart, book, ticket, positions)
    portfolio/page.tsx       Simulated portfolio, equity curve, allocation, risk
    orders/page.tsx          Order blotter (open / history) + trade journal stats
    news/page.tsx            Simulated news feed, movers, economic calendar
    learn/page.tsx           Education, glossary, risk awareness, quiz
components/
  ui/                        shadcn-style primitives (button, card, tabs, badge, input, tooltip, segmented, toast)
  layout/                    AppShell, Sidebar, Topbar, TickerTape, DemoBanner
  charts/                    CandlestickChart (lightweight-charts), Sparkline, EquityCurve, AllocationDonut
  markets/                   AssetTable, MarketStats, ClassFilter
  trade/                     AssetHeader, WatchlistPanel, OrderTicket (RHF+Zod), OrderBook,
                             RecentTrades, PositionsTable, MarketMovers
  portfolio/                 StatCard, HoldingsTable, RiskPanel
  news/                      NewsCard, NewsRow, CalendarPanel
  learn/                     QuizCard, GlossaryList
lib/
  types.ts                   Shared mock domain types
  utils.ts                   cn(), formatters (₦ / $), seeded RNG, helpers
  mock/assets.ts             ~30 mock assets (NGX stocks, ETFs, crypto, FX/commodities)
  mock/candles.ts            Deterministic seeded OHLC generator per timeframe
  mock/news.ts               Mock headlines, movers, economic calendar
  mock/portfolio.ts          Demo holdings, balances, order & fill history, watchlist
  mock/learn.ts              Glossary, lessons, quiz questions
  store/use-market.ts        Simulated live engine: quotes, candles, book, trades, indices
  store/use-trading.ts       Simulated balances, positions, orders, fills, cancellation
  store/use-toast.ts         Lightweight toast notifications
```

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build check
```

## Simulation model (all local, all fake)

- A `setInterval` "price engine" random-walks every mock asset inside Zustand; there is no network.
- Candles are generated from a **seeded PRNG** so charts are deterministic and reproducible.
- The order book, recent trades, indices and ticker tape are synthesized each tick.
- Orders submit into local React state: market orders fill instantly (simulated), limit/stop
  orders are "worked" by the same local engine when price crosses.
- Balances are demo capital (₦ / $) with a **Reset demo** control.

## Design language

| Token | Hex | Meaning |
| --- | --- | --- |
| Bull Green | `#10B981` | gains, buy, positive P&L |
| Bear Red | `#EF4444` | losses, sell, risk |
| Deep Space | `#0F172A` | terminal surfaces, focus |
| Electric Cyan | `#06B6D4` | simulated live state, crosshair, selection |
| Platinum | `#E5E7EB` | primary data & text |
| Amber Alert | `#F59E0B` | pending orders, warnings |
| Neon Purple | `#8B5CF6` | advanced tools, analytics, pro features |
