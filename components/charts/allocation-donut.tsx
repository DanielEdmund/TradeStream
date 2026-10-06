"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCompact } from "@/lib/utils";

export interface Slice {
  name: string;
  value: number;
  color: string;
}

const PALETTE = ["#10B981", "#06B6D4", "#8B5CF6", "#F59E0B", "#EF4444", "#38BDF8", "#A3E635"];

export function colorFor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

/** Portfolio allocation donut (simulated holdings only). */
export function AllocationDonut({ slices, centerLabel }: { slices: Slice[]; centerLabel: string }) {
  const total = slices.reduce((s, x) => s + x.value, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 min-h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="rgba(2,6,23,0.85)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={650}
            >
              {slices.map((s, i) => (
                <Cell key={s.name} fill={colorFor(i)} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0];
                const val = Number(p.value);
                  return (
                  <div className="rounded-md border border-white/10 bg-surface-950/95 px-2.5 py-1.5 shadow-panel">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {String(p.name)}
                    </p>
                    <p className="num text-xs font-bold text-white">
                      {formatCompact(val, "NGN")} · {total ? ((val / total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Total
          </span>
          <span className="num text-lg font-bold text-white">{formatCompact(total, "NGN")}</span>
          <span className="text-[9px] uppercase tracking-wider text-volt">{centerLabel}</span>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-4 pb-4 pt-1">
        {slices.map((s, i) => (
          <li key={s.name} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: colorFor(i) }}
              />
              <span className="truncate text-slate-400">{s.name}</span>
            </span>
            <span className="num shrink-0 font-semibold text-slate-200">
              {total ? ((s.value / total) * 100).toFixed(1) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
