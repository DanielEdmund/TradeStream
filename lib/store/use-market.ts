import { create } from "zustand";
import { ASSETS, ASSET_MAP, INDEX_SEED } from "@/lib/mock/assets";
import { generateCandles, TIMEFRAMES } from "@/lib/mock/candles";
import type { BookLevel, Candle, IndexQuote, OrderBook, Quote, Timeframe, TradePrint } from "@/lib/types";
import { clamp, hashString, roundToTick, seededRandom, uid } from "@/lib/utils";

/**
 * SIMULATED MARKET ENGINE — 100% local.
 * A setInterval random-walks every mock asset; there is no API, feed or WebSocket anywhere.
 */

export type FeedStatus = "live" | "paused";

interface CandleCacheEntry {
  data: Candle[];
  assetKey: string;
}

interface MarketState {
  quotes: Record<string, Quote>;
  /** Rolling price tape used by sparklines. */
  history: Record<string, number[]>;
  /** Candles cached per `symbol|tf`, mutated in place by the engine. */
  candles: Record<string, CandleCacheEntry>;
  books: Record<string, OrderBook>;
  trades: Record<string, TradePrint[]>;
  watchlist: string[];
  indices: IndexQuote[];
  feed: FeedStatus;
  booted: boolean;
  start: () => void;
  toggleFeed: () => void;
  tick: () => void;
  getCandles: (symbol: string, tf: Timeframe) => Candle[];
  toggleWatch: (symbol: string) => void;
}

function seedQuotes(): Record<string, Quote> {
  const out: Record<string, Quote> = {};
  for (const a of ASSETS) {
    out[a.symbol] = {
      symbol: a.symbol,
      price: a.basePrice,
      prevClose: a.prevClose,
      change: a.basePrice - a.prevClose,
      changePct: ((a.basePrice - a.prevClose) / a.prevClose) * 100,
      dayHigh: Math.max(a.basePrice, a.prevClose) * 1.004,
      dayLow: Math.min(a.basePrice, a.prevClose) * 0.996,
      updatedAt: Date.now(),
    };
  }
  return out;
}

/** Liquidity-aware fake order book sizes so ladders look plausible across price scales. */
function sizeFor(price: number, rand: () => number): number {
  if (price > 2000) return Math.round((0.4 + rand() * 9) * 100) / 100;
  if (price > 50) return Math.round(4 + rand() * 160);
  if (price > 1) return Math.round(40 + rand() * 900);
  return Math.round(4000 + rand() * 80000);
}

function buildBook(price: number, tick: number, rand: () => number): OrderBook {
  const mid = roundToTick(price, tick);
  const spreadTicks = rand() > 0.78 ? 2 : 1;
  const bids: BookLevel[] = [];
  const asks: BookLevel[] = [];
  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < 11; i++) {
    const bidPrice = roundToTick(mid - tick * (i + 1), tick);
    const askPrice = roundToTick(mid + tick * (i + 1) + tick * (spreadTicks - 1), tick);
    const bs = sizeFor(mid, rand);
    const as = sizeFor(mid, rand);
    bidTotal += bs;
    askTotal += as;
    bids.push({ price: bidPrice, size: bs, total: bidTotal });
    asks.push({ price: askPrice, size: as, total: askTotal });
  }
  return { bids, asks, spread: roundToTick(tick * spreadTicks, tick) };
}

let timer: ReturnType<typeof setInterval> | null = null;
let seededHistory = false;

function seedHistories(get: () => MarketState): void {
  if (seededHistory) return;
  seededHistory = true;
  const history: Record<string, number[]> = {};
  for (const a of ASSETS) {
    const bars = generateCandles(a, "1D", a.basePrice);
    history[a.symbol] = bars.slice(-46).map((c) => c.close);
    history[a.symbol].push(a.basePrice);
  }
  get();
  useMarket.setState((s) => ({ history: { ...s.history, ...history } }));
}

export const useMarket = create<MarketState>((set, get) => ({
  quotes: seedQuotes(),
  history: {},
  candles: {},
  books: {},
  trades: {},
  watchlist: [
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
  ],
  indices: INDEX_SEED.map((i) => ({ ...i })),
  feed: "live",
  booted: false,

  start: () => {
    seedHistories(get);
    if (timer) return;
    set({ booted: true });
    // Initial book / tape so the UI renders a full ladder on first paint.
    get().tick();
    timer = setInterval(() => get().tick(), 1300);
  },

  toggleFeed: () => {
    const next: FeedStatus = get().feed === "live" ? "paused" : "live";
    set({ feed: next });
  },

  tick: () => {
    const { feed, quotes, history, trades, books, indices, candles } = get();
    if (feed === "paused") return;

    const now = Date.now();
    const nextQuotes: Record<string, Quote> = { ...quotes };
    const nextHistory: Record<string, number[]> = { ...history };
    const nextTrades: Record<string, TradePrint[]> = { ...trades };
    const nextBooks: Record<string, OrderBook> = { ...books };
    const nextCandles: Record<string, CandleCacheEntry> = { ...candles };
    const changedKeys = new Set<string>();

    for (const a of ASSETS) {
      const q = nextQuotes[a.symbol];
      if (!q) continue;
      const rand = seededRandom((hashString(a.symbol) ^ now) >>> 0);

      const stepVol = a.dailyVol * 0.045;
      const shock = (rand() - 0.5) * 2 * stepVol;
      const pull = (a.basePrice - q.price) / a.basePrice * 0.004;
      let price = q.price * (1 + shock + pull);
      const cap = a.class === "crypto" ? 0.16 : 0.09;
      price = clamp(price, a.prevClose * (1 - cap), a.prevClose * (1 + cap));
      price = roundToTick(Math.max(price, a.tickSize), a.tickSize);

      nextQuotes[a.symbol] = {
        ...q,
        price,
        change: price - q.prevClose,
        changePct: ((price - q.prevClose) / q.prevClose) * 100,
        dayHigh: Math.max(q.dayHigh, price),
        dayLow: Math.min(q.dayLow, price),
        updatedAt: now,
      };

      const hist = nextHistory[a.symbol] ? [...nextHistory[a.symbol]] : [];
      hist.push(price);
      if (hist.length > 60) hist.splice(0, hist.length - 60);
      nextHistory[a.symbol] = hist;

      // Print 1–3 simulated trades.
      const prints: TradePrint[] = nextTrades[a.symbol] ? [...nextTrades[a.symbol]] : [];
      const n = 1 + Math.floor(rand() * 3);
      for (let i = 0; i < n; i++) {
        prints.unshift({
          id: uid("print"),
          time: now - i * 400,
          price: roundToTick(price + (rand() - 0.5) * a.tickSize * 3, a.tickSize),
          side: rand() > 0.5 ? "buy" : "sell",
          size: sizeFor(price, rand),
        });
      }
      nextTrades[a.symbol] = prints.slice(0, 28);

      if (!nextBooks[a.symbol] || rand() > 0.35) {
        nextBooks[a.symbol] = buildBook(price, a.tickSize, rand);
      }

      // Update the live bar of every cached timeframe for this symbol (new refs so charts re-render).
      for (let i = 0; i < TIMEFRAMES.length; i++) {
        const key = `${a.symbol}|${TIMEFRAMES[i].id}`;
        const entry = nextCandles[key];
        if (!entry) continue;
        const arr = entry.data;
        const last = arr[arr.length - 1];
        const updatedLast = {
          ...last,
          close: price,
          high: Math.max(last.high, price),
          low: Math.min(last.low, price),
          volume: Math.min(6_000_000, last.volume + Math.round(150 + rand() * 2200)),
        };
        nextCandles[key] = { ...entry, data: [...arr.slice(0, -1), updatedLast] };
        changedKeys.add(key);
      }
    }

    const nextIndices = indices.map((ix) => {
      const r = seededRandom((hashString(ix.id) ^ now) >>> 0);
      const drift = (r() - 0.5) * 0.0016;
      const value = ix.value * (1 + drift);
      return { ...ix, value, changePct: ((value - ix.prevClose) / ix.prevClose) * 100 };
    });

    set({
      quotes: nextQuotes,
      history: nextHistory,
      trades: nextTrades,
      books: nextBooks,
      indices: nextIndices,
      candles: nextCandles,
    });
  },

  getCandles: (symbol, tf) => {
    const key = `${symbol}|${tf}`;
    const cache = get().candles[key];
    if (cache) return cache.data;
    const asset = ASSET_MAP[symbol];
    const q = get().quotes[symbol];
    const data = generateCandles(asset, tf, q ? q.price : asset.basePrice);
    set((s) => ({ candles: { ...s.candles, [key]: { data, assetKey: asset.symbol } } }));
    return data;
  },

  toggleWatch: (symbol) => {
    set((s) => ({
      watchlist: s.watchlist.includes(symbol)
        ? s.watchlist.filter((x) => x !== symbol)
        : [...s.watchlist, symbol],
    }));
  },
}));

/** Reactive single-symbol quote (simulated). */
export function useQuote(symbol: string): Quote | undefined {
  return useMarket((s) => s.quotes[symbol]);
}
