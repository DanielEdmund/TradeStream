"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Tooltip } from "@/components/ui/tooltip";
import type { Asset, OrderSide, OrderType, TimeInForce } from "@/lib/types";
import { useMarket } from "@/lib/store/use-market";
import { useTrading } from "@/lib/store/use-trading";
import { cn, formatCompact, formatPrice, roundToTick } from "@/lib/utils";

interface Props {
  asset: Asset;
}

type FormValues = {
  qty: string;
  price?: string;
};

const schema = z.object({
  qty: z.coerce
    .number({ invalid_type_error: "Enter a quantity" })
    .positive("Quantity must be greater than zero"),
  price: z.coerce
    .number()
    .optional()
    .refine((v) => v === undefined || v > 0, "Enter a valid price"),
});

const SLIPPAGE_NOTE = 0.0005;

/** Simulated order ticket — React Hook Form + Zod, routed to local React state only. */
export function OrderTicket({ asset }: Props) {
  const quote = useMarket((s) => s.quotes[asset.symbol]);
  const cash = useTrading((s) => s.cash);
  const positions = useTrading((s) => s.positions);
  const submit = useTrading((s) => s.submit);

  const [side, setSide] = useState<OrderSide>("buy");
  const [type, setType] = useState<OrderType>("market");
  const [tif, setTif] = useState<TimeInForce>("day");

  const last = quote?.price ?? asset.basePrice;
  const ticked = roundToTick(last, asset.tickSize);
  const holding = positions.find((p) => p.symbol === asset.symbol);
  const balance = cash[asset.currency];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { qty: "", price: String(ticked) },
    mode: "onBlur",
  });

  // Re-seed the price field whenever the instrument or order type changes.
  useEffect(() => {
    reset({ qty: watch("qty") ?? "", price: String(roundToTick(last, asset.tickSize)) });
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.symbol, type]);

  const qty = Number(watch("qty") ?? 0) || 0;
  const priceField = watch("price");
  const execPrice = type === "market" ? last * (side === "buy" ? 1 + SLIPPAGE_NOTE : 1 - SLIPPAGE_NOTE) : Number(priceField) || last;
  const notional = qty * execPrice;
  const balanceAfter = side === "buy" ? balance - notional : balance + notional;

  const disabledMsg = useMemo(() => {
    if (side === "buy" && notional > balance) return "Exceeds simulated buying power";
    if (side === "sell" && (!holding || qty > holding.qty)) return holding ? "Exceeds simulated holding" : "No simulated holding";
    return null;
  }, [side, notional, balance, holding, qty]);

  const onSubmit = handleSubmit((values) => {
    const priceNum = Number(values.price ?? 0);
    const qtyNum = Number(values.qty);
    if (type !== "market" && (!values.price || priceNum <= 0)) {
      setError("price", { message: "A price is required for limit / stop orders" });
      return;
    }
    const result = submit({
      symbol: asset.symbol,
      side,
      type,
      qty: qtyNum,
      price: type === "market" ? undefined : priceNum,
      timeInForce: tif,
    });
    if (result.ok) reset({ qty: "", price: String(roundToTick(last, asset.tickSize)) });
  });

  return (
    <form onSubmit={onSubmit} className="panel flex flex-col overflow-hidden" noValidate>
      <div className="panel-header">
        <span className="label-caps">Order ticket · simulate</span>
        <Tooltip
          label="Nothing is routed anywhere. Fills are decided by the local demo engine."
          side="left"
        >
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-volt">
            <Zap size={10} /> demo only
          </span>
        </Tooltip>
      </div>

      {/* Buy / sell */}
      <div className="grid grid-cols-2 gap-1.5 p-3 pb-2">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={cn(
            "focus-ring flex h-9 items-center justify-center gap-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all",
            side === "buy"
              ? "bg-bull text-slate-950 shadow-glow-bull"
              : "border border-bull/30 bg-bull/[0.06] text-bull hover:bg-bull/12",
          )}
        >
          <ArrowDownRight size={14} /> Buy
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={cn(
            "focus-ring flex h-9 items-center justify-center gap-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all",
            side === "sell"
              ? "bg-bear text-white shadow-glow-bear"
              : "border border-bear/30 bg-bear/[0.06] text-bear hover:bg-bear/12",
          )}
        >
          <ArrowUpRight size={14} /> Sell
        </button>
      </div>

      <div className="flex flex-col gap-3 px-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <Segmented
            className="flex-1"
            itemClassName="flex-1"
            value={type}
            onChange={setType}
            options={[
              { value: "market", label: "Market", title: "Fill immediately at the simulated offer" },
              { value: "limit", label: "Limit", title: "Only fill at your price or better" },
              { value: "stop", label: "Stop", title: "Trigger once the mock price is crossed" },
            ]}
          />
        </div>

        {/* Quantity */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="qty" className="label-caps">
              Quantity
            </label>
            <span className="text-[10px] text-slate-500">
              held: <span className="num text-slate-300">{holding?.qty ?? 0}</span>
            </span>
          </div>
          <div className="relative">
            <Input
              id="qty"
              type="number"
              step="any"
              min="0"
              placeholder="0"
              invalid={!!errors.qty}
              className="num pr-16"
              {...register("qty")}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {asset.symbol}
            </span>
          </div>
          {errors.qty && (
            <p className="mt-1 flex items-center gap-1 text-[10px] text-bear">
              <AlertTriangle size={10} /> {errors.qty.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="price" className="label-caps">
              {type === "market" ? "Est. fill price" : type === "stop" ? "Stop trigger" : "Limit price"}
            </label>
            <span className="text-[10px] text-slate-500">{asset.currency}</span>
          </div>
          {type === "market" ? (
            <div className="num flex h-9 items-center justify-between rounded-md border border-dashed border-white/12 bg-white/[0.03] px-3 text-sm text-slate-300">
              <span>{formatPrice(execPrice, asset.currency)}</span>
              <span className="text-[10px] uppercase tracking-wider text-alert">±5 bps slip</span>
            </div>
          ) : (
            <>
              <Input
                id="price"
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                invalid={!!errors.price}
                className="num"
                {...register("price")}
              />
              {errors.price && (
                <p className="mt-1 flex items-center gap-1 text-[10px] text-bear">
                  <AlertTriangle size={10} /> {errors.price.message}
                </p>
              )}
            </>
          )}
        </div>

        {/* Time in force */}
        <div className="flex items-center justify-between">
          <span className="label-caps">Time in force</span>
          <Segmented
            size="sm"
            value={tif}
            onChange={setTif}
            options={[
              { value: "day", label: "DAY" },
              { value: "gtc", label: "GTC" },
              { value: "ioc", label: "IOC" },
            ]}
          />
        </div>

        {/* Summary */}
        <div className="space-y-1.5 rounded-lg border border-white/[0.07] bg-surface-950/60 p-2.5 text-[11px]">
          <Row k="Est. notional" v={formatPrice(notional, asset.currency)} />
          <Row
            k={side === "buy" ? "Buying power after" : "Proceeds (sim)"}
            v={formatPrice(balanceAfter, asset.currency)}
            tone={balanceAfter < 0 ? "bad" : undefined}
          />
          <Row k="Fees (demo 0.15%)" v={formatPrice(notional * 0.0015, asset.currency)} muted />
        </div>

        {disabledMsg && (
          <p className="flex items-center gap-1.5 rounded-md border border-alert/30 bg-alert/[0.08] px-2 py-1.5 text-[10px] font-semibold text-alert">
            <AlertTriangle size={11} className="shrink-0" /> {disabledMsg}
          </p>
        )}

        <Button
          type="submit"
          variant={side === "buy" ? "bull" : "bear"}
          className="h-10 w-full text-[13px] uppercase tracking-wide"
          disabled={isSubmitting || qty <= 0}
        >
          <Activity size={14} />
          {side === "buy" ? "Simulate buy" : "Simulate sell"} · {asset.symbol}
        </Button>

        <p className="text-[9.5px] leading-snug text-slate-600">
          Demo / simulated trading: submitting creates a local record only. No brokerage, no real
          order, no real money.
        </p>
      </div>
    </form>
  );
}

function Row({
  k,
  v,
  muted,
  tone,
}: {
  k: string;
  v: string;
  muted?: boolean;
  tone?: "bad";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-slate-500", muted && "text-slate-600")}>{k}</span>
      <span
        className={cn(
          "num font-semibold",
          tone === "bad" ? "text-bear" : muted ? "text-slate-500" : "text-slate-200",
        )}
      >
        {v}
      </span>
    </div>
  );
}
