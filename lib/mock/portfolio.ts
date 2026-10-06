import type { CashBalance, Order, Position } from "@/lib/types";
import { DEMO_FX_USDNGN } from "@/lib/utils";

const DAY = 86_400_000;
const now = Date.now();

/** Demo starting capital (fake money only). */
export const STARTING_CASH: CashBalance = {
  NGN: 12_500_000,
  USD: 10_000,
};

/** Pre-seeded simulated holdings so portfolio / blotter screens have content on first load. */
export const SEED_POSITIONS: Position[] = [
  { symbol: "MTNN", qty: 4200, avgPrice: 241.3, currency: "NGN", openedAt: now - 74 * DAY },
  { symbol: "GTCO", qty: 15000, avgPrice: 54.85, currency: "NGN", openedAt: now - 61 * DAY },
  { symbol: "ZENITHBANK", qty: 20000, avgPrice: 52.4, currency: "NGN", openedAt: now - 55 * DAY },
  { symbol: "DANGCEM", qty: 1800, avgPrice: 505.0, currency: "NGN", openedAt: now - 48 * DAY },
  { symbol: "AIRTELAFRI", qty: 300, avgPrice: 1980.0, currency: "NGN", openedAt: now - 40 * DAY },
  { symbol: "SEPLAT", qty: 120, avgPrice: 5120.0, currency: "NGN", openedAt: now - 33 * DAY },
  { symbol: "OANDO", qty: 8000, avgPrice: 64.15, currency: "NGN", openedAt: now - 21 * DAY },
  { symbol: "BTC", qty: 0.284, avgPrice: 58420.0, currency: "USD", openedAt: now - 27 * DAY },
  { symbol: "ETH", qty: 3.4, avgPrice: 2680.0, currency: "USD", openedAt: now - 19 * DAY },
  { symbol: "SOL", qty: 42, avgPrice: 132.4, currency: "USD", openedAt: now - 12 * DAY },
  { symbol: "SPY", qty: 18, avgPrice: 552.1, currency: "USD", openedAt: now - 30 * DAY },
  { symbol: "XAUUSD", qty: 4, avgPrice: 2580.0, currency: "USD", openedAt: now - 16 * DAY },
];

/** Open (working) simulated orders. */
export const SEED_OPEN_ORDERS: Order[] = [
  {
    id: "ORD-10428",
    symbol: "MTNN",
    side: "buy",
    type: "limit",
    qty: 1500,
    price: 255.0,
    status: "open",
    filledQty: 0,
    timeInForce: "gtc",
    createdAt: now - 3 * 3600_000,
    note: "Demo bid under the simulated bid/ask.",
  },
  {
    id: "ORD-10431",
    symbol: "DANGCEM",
    side: "sell",
    type: "limit",
    qty: 700,
    price: 505.5,
    status: "open",
    filledQty: 0,
    timeInForce: "day",
    createdAt: now - 95 * 60_000,
    note: "Simulated take-profit resting above the mark.",
  },
  {
    id: "ORD-10435",
    symbol: "BTC",
    side: "buy",
    type: "stop",
    qty: 0.12,
    price: 64500.0,
    status: "open",
    filledQty: 0,
    timeInForce: "gtc",
    createdAt: now - 41 * 60_000,
    note: "Mock stop-entry trigger above resistance.",
  },
];

/** Fills / history for the blotter. */
export const SEED_FILLED_ORDERS: Order[] = [
  {
    id: "ORD-10377",
    symbol: "SOL",
    side: "buy",
    type: "market",
    qty: 42,
    status: "filled",
    filledQty: 42,
    avgFillPrice: 132.4,
    timeInForce: "ioc",
    createdAt: now - 12 * DAY,
    filledAt: now - 12 * DAY,
  },
  {
    id: "ORD-10391",
    symbol: "GTCO",
    side: "buy",
    type: "limit",
    qty: 5000,
    price: 54.85,
    status: "filled",
    filledQty: 5000,
    avgFillPrice: 54.85,
    timeInForce: "gtc",
    createdAt: now - 61 * DAY,
    filledAt: now - 61 * DAY,
  },
  {
    id: "ORD-10402",
    symbol: "XAUUSD",
    side: "buy",
    type: "limit",
    qty: 4,
    price: 2580.0,
    status: "filled",
    filledQty: 4,
    avgFillPrice: 2580.0,
    timeInForce: "day",
    createdAt: now - 16 * DAY,
    filledAt: now - 16 * DAY,
  },
  {
    id: "ORD-10415",
    symbol: "FBNH",
    side: "buy",
    type: "limit",
    qty: 6000,
    price: 22.4,
    status: "cancelled",
    filledQty: 0,
    timeInForce: "gtc",
    createdAt: now - 6 * DAY,
    note: "Withdrawn from the demo book.",
  },
  {
    id: "ORD-10421",
    symbol: "ETH",
    side: "sell",
    type: "market",
    qty: 1.2,
    status: "filled",
    filledQty: 1.2,
    avgFillPrice: 2714.6,
    timeInForce: "ioc",
    createdAt: now - 4 * DAY,
    filledAt: now - 4 * DAY,
  },
  {
    id: "ORD-10426",
    symbol: "NESTLE",
    side: "buy",
    type: "limit",
    qty: 100,
    price: 1275.0,
    status: "rejected",
    filledQty: 0,
    timeInForce: "day",
    createdAt: now - 2 * DAY,
    note: "Demo risk check: simulated exposure cap reached.",
  },
];

/** Equity curve anchors for the mock portfolio chart (NGN). */
export const EQUITY_CURVE: { range: string; points: number }[] = [];

export const SEED_WATCHLIST: string[] = [
  "MTNN",
  "DANGCEM",
  "GTCO",
  "ZENITHBANK",
  "AIRTELAFRI",
  "SEPLAT",
  "BTC",
  "ETH",
  "XAUUSD",
  "USDNGN",
];

/** Closed round-trips used for journal stats (all invented). */
export const CLOSED_TRADES = [
  { symbol: "TRANSCORP", pnl: 486_200, returnPct: 9.4, days: 14 },
  { symbol: "BUACEMENT", pnl: -212_400, returnPct: -3.1, days: 8 },
  { symbol: "QQQ", pnl: 74_800, returnPct: 4.6, days: 22 },
  { symbol: "DOGE", pnl: -96_500, returnPct: -6.2, days: 3 },
  { symbol: "UBA", pnl: 318_900, returnPct: 7.8, days: 19 },
];

/** Cost basis of the seeded holdings, in NGN (fx-converted for USD instruments). */
export const SEED_HOLDINGS_COST_NGN = SEED_POSITIONS.reduce(
  (s, p) =>
    s + (p.currency === "USD" ? p.avgPrice * p.qty * DEMO_FX_USDNGN : p.avgPrice * p.qty),
  0,
);

/**
 * Account value the demo portfolio "started" from: seeded cash + cost basis of
 * seeded holdings. Used as the return baseline so numbers stay honest.
 */
export const INITIAL_ACCOUNT_VALUE_NGN =
  STARTING_CASH.NGN + STARTING_CASH.USD * DEMO_FX_USDNGN + SEED_HOLDINGS_COST_NGN;
