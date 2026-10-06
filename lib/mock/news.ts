import type { EconomicEvent, NewsItem } from "@/lib/types";

const MIN = 60_000;
const HOUR = 60 * MIN;
const now = Date.now();

/** All headlines below are fictional demo content. */
export const NEWS: NewsItem[] = [
  {
    id: "n1",
    headline: "NGX All Share Index paces higher as banking names lead simulated flows",
    source: "TradeStream Wire (Demo)",
    category: "Markets",
    timestamp: now - 12 * MIN,
    tickers: ["GTCO", "ZENITHBANK", "UBA", "ACCESSCORP"],
    sentiment: "bullish",
    impact: "high",
    summary:
      "Mock reporting shows simulated demand concentrated in tier-1 banks during the afternoon session, with volume running above the fictional 20-day average.",
    featured: true,
  },
  {
    id: "n2",
    headline: "CBN policy pause keeps the naira range-bound in this simulated tape",
    source: "TradeStream Wire (Demo)",
    category: "FX",
    timestamp: now - 44 * MIN,
    tickers: ["USDNGN"],
    sentiment: "neutral",
    impact: "high",
    summary:
      "The fictional USD/NGN pair drifts inside a tight band as demo traders wait on imaginary policy guidance. No real exchange rate is shown anywhere in this prototype.",
  },
  {
    id: "n3",
    headline: "Bitcoin reclaims mocked resistance as crypto tape turns risk-on",
    source: "TradeStream Wire (Demo)",
    category: "Crypto",
    timestamp: now - 1 * HOUR - 8 * MIN,
    tickers: ["BTC", "ETH", "SOL"],
    sentiment: "bullish",
    impact: "medium",
    summary:
      "Generated candles show BTC printing higher lows across the demo session while ETH lags. All prices are locally simulated.",
  },
  {
    id: "n4",
    headline: "Cement makers diverge: DANGCEM slips while BUACEMENT holds gains (demo)",
    source: "TradeStream Wire (Demo)",
    category: "Markets",
    timestamp: now - 2 * HOUR,
    tickers: ["DANGCEM", "BUACEMENT", "LAFARGE"],
    sentiment: "bearish",
    impact: "medium",
    summary:
      "A fictional rotation inside industrial goods leaves the sector flat on the day, according to this prototype's mock breadth numbers.",
  },
  {
    id: "n5",
    headline: "Brent eases in the simulated tape as energy names reprice (demo)",
    source: "TradeStream Wire (Demo)",
    category: "Commodities",
    timestamp: now - 3 * HOUR,
    tickers: ["XBRUSD", "SEPLAT", "OANDO"],
    sentiment: "bearish",
    impact: "medium",
    summary:
      "Mock crude prices drift lower, dragging the fictional oil & gas basket with it. Nothing here reflects real commodity markets.",
  },
  {
    id: "n6",
    headline: "Telecoms outperform on simulated subscriber growth: MTNN, AIRTELAFRI",
    source: "TradeStream Wire (Demo)",
    category: "Earnings",
    timestamp: now - 5 * HOUR,
    tickers: ["MTNN", "AIRTELAFRI"],
    sentiment: "bullish",
    impact: "high",
    summary:
      "Invented results season chatter supports the fictional telecom basket, with MTNN among the top simulated gainers.",
  },
  {
    id: "n7",
    headline: "Gold holds near mocked highs as traders seek a perceived safe haven",
    source: "TradeStream Wire (Demo)",
    category: "Commodities",
    timestamp: now - 7 * HOUR,
    tickers: ["XAUUSD", "GLD"],
    sentiment: "bullish",
    impact: "low",
    summary:
      "Demo metal prices consolidate near the top of their generated range. Displayed values are not real quotes.",
  },
  {
    id: "n8",
    headline: "Earnings season preview: three NGX names to watch in this demo blotter",
    source: "TradeStream Wire (Demo)",
    category: "Earnings",
    timestamp: now - 9 * HOUR,
    tickers: ["MTNN", "NESTLE", "STANBIC"],
    sentiment: "neutral",
    impact: "medium",
    summary:
      "A fictional calendar of results keeps the simulated tape active into the close of this prototype's session.",
  },
  {
    id: "n9",
    headline: "Alt-coins underperform Bitcoin in the generated 24h snapshot (demo)",
    source: "TradeStream Wire (Demo)",
    category: "Crypto",
    timestamp: now - 13 * HOUR,
    tickers: ["ETH", "DOGE", "XRP"],
    sentiment: "bearish",
    impact: "low",
    summary:
      "Simulated breadth in the crypto universe skews negative, with smaller tokens lagging the mock market leader.",
  },
  {
    id: "n10",
    headline: "Rate-cut hopes lift simulated ETF flows into growth proxies",
    source: "TradeStream Wire (Demo)",
    category: "Policy",
    timestamp: now - 20 * HOUR,
    tickers: ["SPY", "QQQ", "EEM"],
    sentiment: "bullish",
    impact: "medium",
    summary:
      "Invented macro optimism supports the demo equity ETF basket. No real fund flows are measured here.",
  },
  {
    id: "n11",
    headline: "Consumer names steady as invented input costs moderate",
    source: "TradeStream Wire (Demo)",
    category: "Markets",
    timestamp: now - 26 * HOUR,
    tickers: ["NESTLE"],
    sentiment: "neutral",
    impact: "low",
    summary: "A calm, fictional session for consumer goods with low generated volatility.",
  },
  {
    id: "n12",
    headline: "Risk checklist: position sizing before your next simulated trade",
    source: "TradeStream Academy (Demo)",
    category: "Policy",
    timestamp: now - 31 * HOUR,
    tickers: [],
    sentiment: "neutral",
    impact: "low",
    summary:
      "Editorial reminder from the demo desk: decide your invalidation level and size before entry — the habit matters more than any single fill.",
  },
];

/** Mock movers computed at render time from the simulated quotes (see components/markets). */
export const ECONOMIC_CALENDAR: EconomicEvent[] = [
  {
    id: "e1",
    time: "10:00 WAT",
    country: "NG",
    title: "CBN Monetary Policy Committee meeting (mock)",
    importance: "high",
    forecast: "27.50%",
    previous: "27.50%",
  },
  {
    id: "e2",
    time: "14:30 WAT",
    country: "US",
    title: "Core CPI, month-on-month (mock)",
    importance: "high",
    forecast: "0.2%",
    previous: "0.3%",
  },
  {
    id: "e3",
    time: "16:00 WAT",
    country: "NG",
    title: "NGX monthly factor report (demo)",
    importance: "medium",
    previous: "98,015",
  },
  {
    id: "e4",
    time: "18:30 WAT",
    country: "US",
    title: "Crude oil inventories (mock)",
    importance: "medium",
    forecast: "-1.4M",
    previous: "+0.9M",
  },
  {
    id: "e5",
    time: "Tomorrow",
    country: "NG",
    title: "Selected banks publish simulated results (demo)",
    importance: "low",
  },
];
