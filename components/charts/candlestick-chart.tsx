"use client";

import { useEffect, useRef } from "react";
import {
  ColorType,
  CrosshairMode,
  createChart,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { movingAverage } from "@/lib/mock/candles";
import type { Candle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  candles: Candle[];
  currencySymbol: string;
  className?: string;
  /** Hide volume histogram (used in compact contexts). */
  compact?: boolean;
}

/**
 * Terminal candlestick chart (TradingView Lightweight Charts) fed exclusively
 * by locally generated mock candles — no market data is ever requested.
 */
export function CandlestickChart({ candles, currencySymbol, className, compact }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const priceLineRef = useRef<IPriceLine | null>(null);

  // Create chart once.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(148,163,184,0.85)",
        fontSize: 11,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      },
      grid: {
        vertLines: { color: "rgba(148,163,184,0.055)" },
        horzLines: { color: "rgba(148,163,184,0.055)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(6,182,212,0.75)",
          width: 1,
          style: 2,
          labelBackgroundColor: "#06B6D4",
        },
        horzLine: {
          color: "rgba(6,182,212,0.75)",
          width: 1,
          style: 2,
          labelBackgroundColor: "#06B6D4",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(148,163,184,0.16)",
        scaleMargins: compact ? { top: 0.2, bottom: 0.08 } : { top: 0.12, bottom: 0.26 },
      },
      timeScale: {
        borderColor: "rgba(148,163,184,0.16)",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 4,
      },
      handleScroll: true,
      handleScale: true,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#10B981",
      downColor: "#EF4444",
      borderUpColor: "#10B981",
      borderDownColor: "#EF4444",
      wickUpColor: "rgba(16,185,129,0.85)",
      wickDownColor: "rgba(239,68,68,0.85)",
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "vol",
    });
    chart.priceScale("vol").applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
      visible: false,
    });

    const maSeries = chart.addLineSeries({
      color: "#8B5CF6",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    maSeriesRef.current = maSeries;

    const ro = new ResizeObserver(() => {
      if (!wrapRef.current) return;
      chart.applyOptions({
        width: wrapRef.current.clientWidth,
        height: wrapRef.current.clientHeight,
      });
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      maSeriesRef.current = null;
      priceLineRef.current = null;
    };
  }, [compact]);

  // Feed data.
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    const maSeries = maSeriesRef.current;
    const chart = chartRef.current;
    if (!candleSeries || !volumeSeries || !maSeries || !chart || candles.length === 0) return;

    const data = candles.map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candleSeries.setData(data);
    volumeSeries.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color:
          c.close >= c.open ? "rgba(16,185,129,0.28)" : "rgba(239,68,68,0.28)",
      })),
    );

    const ma = movingAverage(candles, 20);
    maSeries.setData(
      ma
        .map((v, i) => ({ time: candles[i].time as UTCTimestamp, value: v }))
        .filter((p): p is { time: UTCTimestamp; value: number } => p.value !== null),
    );

    const last = candles[candles.length - 1];
    if (priceLineRef.current) candleSeries.removePriceLine(priceLineRef.current);
    priceLineRef.current = candleSeries.createPriceLine({
      price: last.close,
      color: "#06B6D4",
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "LAST",
    });

    chart.timeScale().fitContent();
  }, [candles]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div ref={wrapRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute left-3 top-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1 text-neon">
          <span className="h-[2px] w-3 bg-neon" /> MA20
        </span>
        <span className="text-slate-500">Simulated candles · {currencySymbol}</span>
      </div>
    </div>
  );
}
