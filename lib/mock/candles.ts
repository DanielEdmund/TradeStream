import type { Asset, Candle, Timeframe } from "@/lib/types";
import { hashString, seededRandom } from "@/lib/utils";

/** Bars and step size (seconds) per timeframe for the mock OHLC generator. */
export const TIMEFRAMES: { id: Timeframe; label: string; bars: number; stepSec: number; intraday: boolean }[] = [
  { id: "1D", label: "1D", bars: 78, stepSec: 300, intraday: true },
  { id: "5D", label: "5D", bars: 80, stepSec: 1800, intraday: true },
  { id: "1M", label: "1M", bars: 180, stepSec: 14400, intraday: true },
  { id: "6M", label: "6M", bars: 126, stepSec: 86400, intraday: false },
  { id: "1Y", label: "1Y", bars: 252, stepSec: 86400, intraday: false },
];

/** Daily volatility of a timeframe ≈ daily vol × √(bars per day × step in days). */
function barsPerDay(stepSec: number): number {
  return 86400 / stepSec;
}

function advanceTime(t: number, stepSec: number, daily: boolean): number {
  let next = t + stepSec;
  if (!daily) return next;
  // Skip weekends so daily candles look like a real session calendar.
  for (let i = 0; i < 4; i++) {
    const day = new Date(next * 1000).getUTCDay();
    if (day === 0 || day === 6) next += 86400;
    else break;
  }
  return next;
}

/**
 * Deterministic seeded OHLC generator.
 * Same (symbol, timeframe, price) always produces the same chart — no randomness between renders.
 */
export function generateCandles(
  asset: Asset,
  timeframe: Timeframe,
  endPrice: number,
): Candle[] {
  const tf = TIMEFRAMES.find((t) => t.id === timeframe)!;
  const rand = seededRandom(hashString(`${asset.symbol}:${timeframe}`));

  const nowSec = Math.floor(Date.now() / 1000);
  const anchor = Math.floor(nowSec / tf.stepSec) * tf.stepSec;
  let time = anchor - tf.stepSec * (tf.bars - 1);

  const sigmaPerBar = asset.dailyVol * Math.sqrt(barsPerDay(tf.stepSec));
  // Mild per-series trend so different assets feel different.
  const trend = (rand() - 0.45) * sigmaPerBar * 0.35;

  const raw: Candle[] = [];
  let price = asset.prevClose;

  for (let i = 0; i < tf.bars; i++) {
    const shock = (rand() + rand() + rand() - 1.5) * 1.4 * sigmaPerBar;
    const open = price;
    const close = Math.max(0.0001, open * (1 + trend + shock));
    const wick = Math.abs(close - open) + open * sigmaPerBar * (0.35 + rand() * 0.9);
    const high = Math.max(open, close) + wick * rand();
    const low = Math.max(0.0001, Math.min(open, close) - wick * rand());
    const volume = Math.round(
      (120_000 + rand() * 900_000) * (1 + Math.abs(shock) / Math.max(sigmaPerBar, 1e-9) * 0.35),
    );
    raw.push({ time, open, high, low, close, volume });
    price = close;
    time = advanceTime(time, tf.stepSec, !tf.intraday || tf.stepSec >= 86400);
  }

  // Rescale so the final close lands exactly on the current simulated price.
  const last = raw[raw.length - 1];
  const factor = last.close === 0 ? 1 : endPrice / last.close;
  return raw.map((c) => ({
    time: c.time,
    open: round(c.open * factor, asset.tickSize),
    high: round(c.high * factor, asset.tickSize),
    low: round(c.low * factor, asset.tickSize),
    close: round(c.close * factor, asset.tickSize),
    volume: c.volume,
  }));
}

function round(v: number, tick: number): number {
  if (tick <= 0) return v;
  return Math.round(v / tick) * tick;
}

/** Simple moving average over closes, aligned to candles (null while warming up). */
export function movingAverage(candles: Candle[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;
    if (i >= period) sum -= candles[i - period].close;
    out.push(i >= period - 1 ? sum / period : null);
  }
  return out;
}
