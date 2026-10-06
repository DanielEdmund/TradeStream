"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Segmented } from "@/components/ui/segmented";
import { seededRandom, formatCompact, hashString } from "@/lib/utils";

type Range = "1W" | "1M" | "3M" | "1Y";

const POINTS: Record<Range, number> = { "1W": 7, "1M": 30, "3M": 90, "1Y": 252 };
const VOL: Record<Range, number> = { "1W": 0.004, "1M": 0.007, "3M": 0.01, "1Y": 0.013 };

interface Props {
  /** Current simulated portfolio value in NGN. */
  total: number;
  height?: number;
}

/**
 * Deterministic equity curve for the demo portfolio.
 * Series is generated locally from a seeded RNG anchored to the current value.
 */
export function EquityCurve({ total, height = 240 }: Props) {
  const [range, setRange] = useState<Range>("3M");

  const points = useMemo(() => {
    const n = POINTS[range];
    const rand = seededRandom(hashString(`equity:${range}`));
    const vol = VOL[range];
    const raw: number[] = [];
    let v = 1;
    for (let i = 0; i < n; i++) {
      const shock = (rand() + rand() + rand() - 1.5) * vol * 1.6;
      v = v * (1 + shock + 0.0016);
      raw.push(v);
    }
    // Normalise so the final point equals the live total.
    const scale = total / raw[raw.length - 1];
    const now = Date.now();
    const dayMs = range === "1Y" ? (365 * 86400000) / n : 86400000;
    return raw.map((value, i) => {
      const d = new Date(now - (n - 1 - i) * dayMs);
      return {
        label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        value: Math.round(value * scale),
      };
    });
  }, [total, range]);

  const first = points[0]?.value ?? total;
  const changePct = ((total - first) / first) * 100;
  const up = changePct >= 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <p className="label-caps">Simulated equity</p>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className="num text-2xl font-bold text-white">{formatCompact(total, "NGN")}</span>
            <span className={`num text-sm font-semibold ${up ? "text-bull" : "text-bear"}`}>
              {up ? "+" : ""}
              {changePct.toFixed(2)}% <span className="text-slate-500">· {range}</span>
            </span>
          </div>
        </div>
        <Segmented
          size="sm"
          value={range}
          onChange={setRange}
          options={[
            { value: "1W", label: "1W" },
            { value: "1M", label: "1M" },
            { value: "3M", label: "3M" },
            { value: "1Y", label: "1Y" },
          ]}
        />
      </div>

      <div className="mt-2 flex-1 px-2 pb-2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={up ? "#10B981" : "#EF4444"} stopOpacity={0.35} />
                <stop offset="100%" stopColor={up ? "#10B981" : "#EF4444"} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.07)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
              tickLine={false}
              minTickGap={38}
            />
            <YAxis
              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={64}
              orientation="right"
              tickFormatter={(v: number) => formatCompact(v, "NGN")}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-md border border-white/10 bg-surface-950/95 px-2.5 py-1.5 shadow-panel">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                    <p className="num text-xs font-bold text-white">
                      {formatCompact(payload[0].value as number, "NGN")}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={up ? "#10B981" : "#EF4444"}
              strokeWidth={2}
              fill="url(#equityFill)"
              isAnimationActive
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="px-4 pb-3 text-[10px] text-slate-600">
        Curve is generated locally from seeded mock data and anchored to the live simulated equity.
      </p>
    </div>
  );
}
