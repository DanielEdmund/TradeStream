"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  /** Stroke colour override; defaults to bull/bear by net direction. */
  positive?: boolean;
}

/** Dependency-free sparkline (SVG) — crisp at small sizes, no chart-lib overhead per row. */
export function Sparkline({ data, width = 92, height = 28, className, positive }: Props) {
  const { path, area, up } = useMemo(() => {
    if (data.length < 2) return { path: "", area: "", up: true };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const pad = 2.5;
    const stepX = width / (data.length - 1);
    const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);

    const pts = data.map((v, i) => `${(i * stepX).toFixed(2)},${y(v).toFixed(2)}`);
    const up = data[data.length - 1] >= data[0];
    return {
      path: `M ${pts.join(" L ")}`,
      area: `M 0,${height} L ${pts.join(" L ")} L ${width},${height} Z`,
      up,
    };
  }, [data, width, height]);

  const isUp = positive ?? up;
  const stroke = isUp ? "#10B981" : "#EF4444";
  const fill = isUp ? "rgba(16,185,129,0.14)" : "rgba(239,68,68,0.14)";
  const gid = `sg-${isUp ? "u" : "d"}-${data.length}`;

  if (!path) return <div className={cn("opacity-30", className)} />;

  return (
    <svg width={width} height={height} className={cn("overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
