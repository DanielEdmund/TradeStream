/**
 * Shared domain types for the TradeStream prototype.
 * Everything described here is MOCK DATA — there is no real market, broker or wallet behind it.
 */

export type AssetClass = "stock" | "etf" | "crypto" | "fx" | "commodity";
export type Currency = "NGN" | "USD";
export type Exchange = "NGX" | "NASDAQ" | "CRYPTO" | "OTC";

export interface Asset {
  symbol: string;
  name: string;
  class: AssetClass;
  currency: Currency;
  exchange: Exchange;
  sector: string;
  /** Base price the simulated engine starts from (mock). */
  basePrice: number;
  /** Previous close used to compute the day's simulated change. */
  prevClose: number;
  /** Daily volatility used by the random walk (e.g. 0.012 = ~1.2%/day). */
  dailyVol: number;
  /** Minimum price increment for the synthetic order book. */
  tickSize: number;
  marketCap?: string;
  about: string;
}

export interface Candle {
  /** Unix seconds (lightweight-charts compatible). */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Timeframe = "1D" | "5D" | "1M" | "6M" | "1Y";

export interface Quote {
  symbol: string;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  /** Simulated session high / low. */
  dayHigh: number;
  dayLow: number;
  updatedAt: number;
}

export interface IndexQuote {
  id: string;
  name: string;
  value: number;
  prevClose: number;
  changePct: number;
  currency: Currency;
}

export interface BookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: BookLevel[];
  asks: BookLevel[];
  spread: number;
}

export interface TradePrint {
  id: string;
  time: number;
  price: number;
  side: "buy" | "sell";
  size: number;
}

export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit" | "stop";
export type OrderStatus = "open" | "filled" | "cancelled" | "rejected";
export type TimeInForce = "day" | "gtc" | "ioc";

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  qty: number;
  /** Limit / stop price (undefined for market orders). */
  price?: number;
  status: OrderStatus;
  filledQty: number;
  avgFillPrice?: number;
  timeInForce: TimeInForce;
  createdAt: number;
  filledAt?: number;
  note?: string;
}

export interface Position {
  symbol: string;
  qty: number;
  avgPrice: number;
  currency: Currency;
  openedAt: number;
}

export interface HoldingRow extends Position {
  asset: Asset;
  price: number;
  prevClose: number;
  value: number;
  dayPnl: number;
  totalPnl: number;
  totalPnlPct: number;
  weight: number;
}

export interface CashBalance {
  NGN: number;
  USD: number;
}

export type Sentiment = "bullish" | "bearish" | "neutral";

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  category: "Markets" | "FX" | "Earnings" | "Crypto" | "Policy" | "Commodities";
  timestamp: number;
  tickers: string[];
  sentiment: Sentiment;
  impact: "high" | "medium" | "low";
  summary: string;
  featured?: boolean;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  title: string;
  importance: "high" | "medium" | "low";
  forecast?: string;
  previous?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  tag: "Basics" | "Risk" | "Orders" | "Markets" | "Crypto";
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  level: "Beginner" | "Intermediate";
  blurb: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
