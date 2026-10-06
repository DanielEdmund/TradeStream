import { create } from "zustand";
import { ASSET_MAP } from "@/lib/mock/assets";
import {
  SEED_FILLED_ORDERS,
  SEED_OPEN_ORDERS,
  SEED_POSITIONS,
  STARTING_CASH,
} from "@/lib/mock/portfolio";
import type { CashBalance, Order, OrderSide, OrderType, Position, TimeInForce } from "@/lib/types";
import { uid } from "@/lib/utils";
import { useMarket } from "@/lib/store/use-market";
import { useToast } from "@/lib/store/use-toast";

/**
 * SIMULATED ORDER ROUTER — local React state only.
 * Market orders fill instantly (mock), limit/stop orders are worked by the same local engine.
 * No broker, no exchange, no wallet, no real money.
 */

export interface SubmitInput {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  qty: number;
  price?: number;
  timeInForce: TimeInForce;
}

export interface SubmitResult {
  ok: boolean;
  order?: Order;
  error?: string;
}

interface TradingState {
  cash: CashBalance;
  startingCash: CashBalance;
  positions: Position[];
  orders: Order[];
  realizedPnl: number;
  fillCount: number;
  submittedNotional: number;
  engineStarted: boolean;
  startEngine: () => void;
  submit: (input: SubmitInput) => SubmitResult;
  cancel: (id: string) => void;
  closePosition: (symbol: string) => SubmitResult;
  resetDemo: () => void;
}

const SLIPPAGE = 0.0005; // 5 bps simulated slippage on marketable fills

function seedPositions(): Position[] {
  return SEED_POSITIONS.map((p) => ({ ...p }));
}

function seedOrders(): Order[] {
  return [...SEED_OPEN_ORDERS, ...SEED_FILLED_ORDERS].map((o) => ({ ...o }));
}

function hasPosition(positions: Position[], symbol: string, qty: number): boolean {
  const p = positions.find((x) => x.symbol === symbol);
  return !!p && p.qty + 1e-9 >= qty;
}

/** Average-price accounting for one simulated fill. */
function applyFill(
  positions: Position[],
  order: Order,
  fillQty: number,
  fillPrice: number,
  currency: "NGN" | "USD",
): Position[] {
  const next = positions.map((p) => ({ ...p }));
  const idx = next.findIndex((p) => p.symbol === order.symbol);
  if (order.side === "buy") {
    if (idx === -1) {
      next.push({
        symbol: order.symbol,
        qty: fillQty,
        avgPrice: fillPrice,
        currency,
        openedAt: Date.now(),
      });
    } else {
      const p = next[idx];
      const totalQty = p.qty + fillQty;
      p.avgPrice = (p.qty * p.avgPrice + fillQty * fillPrice) / totalQty;
      p.qty = totalQty;
    }
    return next;
  }
  if (idx === -1) return next;
  const p = next[idx];
  p.qty = Math.max(0, p.qty - fillQty);
  if (p.qty <= 1e-9) next.splice(idx, 1);
  return next;
}

let engine: ReturnType<typeof setInterval> | null = null;

export const useTrading = create<TradingState>((set, get) => ({
  cash: { ...STARTING_CASH },
  startingCash: { ...STARTING_CASH },
  positions: seedPositions(),
  orders: seedOrders(),
  realizedPnl: 1_284_600,
  fillCount: 5,
  submittedNotional: 42_180,
  engineStarted: false,

  startEngine: () => {
    if (engine) return;
    engine = setInterval(() => {
      const { orders, positions, cash } = get();
      const open = orders.filter((o) => o.status === "open");
      if (open.length === 0) return;

      const quotes = useMarket.getState().quotes;
      let changed = false;
      let nextOrders = orders.map((o) => ({ ...o }));
      let nextPositions = positions.map((p) => ({ ...p }));
      let nextCash = { ...cash };

      for (const o of nextOrders) {
        if (o.status !== "open") continue;
        const q = quotes[o.symbol];
        const asset = ASSET_MAP[o.symbol];
        if (!q || !asset || !o.price) continue;

        const triggered =
          o.type === "limit"
            ? o.side === "buy"
              ? q.price <= o.price
              : q.price >= o.price
            : o.side === "buy"
              ? q.price >= o.price
              : q.price <= o.price;

        if (!triggered) continue;

        const fillPrice = o.type === "limit" ? o.price : q.price;
        const notional = fillPrice * o.qty;

        if (o.side === "buy") {
          const bucket = asset.currency === "NGN" ? "NGN" : "USD";
          if (nextCash[bucket] < notional) {
            o.status = "rejected";
            o.note = "Simulated buying power exceeded.";
            changed = true;
            continue;
          }
          nextCash[bucket] -= notional;
        } else {
          if (!nextPositions.some((p) => p.symbol === o.symbol && p.qty + 1e-9 >= o.qty)) {
            o.status = "rejected";
            o.note = "Demo supports long-only: insufficient simulated holding.";
            changed = true;
            continue;
          }
          nextCash[asset.currency === "NGN" ? "NGN" : "USD"] += notional;
        }

        nextPositions = applyFill(nextPositions, o, o.qty, fillPrice, asset.currency);
        o.status = "filled";
        o.filledQty = o.qty;
        o.avgFillPrice = fillPrice;
        o.filledAt = Date.now();
        o.note = "Filled by the local demo engine.";
        changed = true;
      }

      if (changed) {
        set({
          orders: nextOrders,
          positions: nextPositions.filter((p) => p.qty > 1e-9),
          cash: nextCash,
          fillCount: get().fillCount + 1,
        });
      }
    }, 1400);
    set({ engineStarted: true });
  },

  submit: (input) => {
    const asset = ASSET_MAP[input.symbol];
    if (!asset) return { ok: false, error: "Unknown symbol in demo universe." };
    const quote = useMarket.getState().quotes[input.symbol];
    if (!quote) return { ok: false, error: "Simulated quote not ready." };

    const toast = useToast.getState().push;
    const id = `ORD-${Math.floor(10440 + Math.random() * 900)}`;
    const now = Date.now();

    if (input.type !== "market" && (!input.price || input.price <= 0)) {
      return { ok: false, error: "A price is required for limit / stop orders." };
    }

    if (input.type === "market") {
      const dir = input.side === "buy" ? 1 + SLIPPAGE : 1 - SLIPPAGE;
      const fillPrice = quote.price * dir;
      const notional = fillPrice * input.qty;
      const { cash, positions } = get();
      const bucket = asset.currency === "NGN" ? "NGN" : "USD";

      if (input.side === "buy" && cash[bucket] < notional) {
        const order: Order = {
          id,
          symbol: input.symbol,
          side: input.side,
          type: input.type,
          qty: input.qty,
          status: "rejected",
          filledQty: 0,
          timeInForce: input.timeInForce,
          createdAt: now,
          note: "Rejected: insufficient simulated buying power.",
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        toast({
          tone: "error",
          title: "Order rejected (demo)",
          description: `Not enough ${bucket} demo balance for this simulated notional.`,
        });
        return { ok: false, order, error: "Insufficient simulated buying power." };
      }

      if (input.side === "sell" && !hasPosition(positions, input.symbol, input.qty)) {
        const order: Order = {
          id,
          symbol: input.symbol,
          side: input.side,
          type: input.type,
          qty: input.qty,
          status: "rejected",
          filledQty: 0,
          timeInForce: input.timeInForce,
          createdAt: now,
          note: "Rejected: long-only demo, no matching holding.",
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        toast({
          tone: "error",
          title: "Order rejected (demo)",
          description: "Long-only simulation — you cannot sell what you do not hold.",
        });
        return { ok: false, order, error: "No simulated holding to sell." };
      }

      const order: Order = {
        id,
        symbol: input.symbol,
        side: input.side,
        type: "market",
        qty: input.qty,
        status: "filled",
        filledQty: input.qty,
        avgFillPrice: fillPrice,
        timeInForce: input.timeInForce,
        createdAt: now,
        filledAt: now,
        note: "Instant simulated fill (mock slippage applied).",
      };

      const nextCash = { ...cash };
      nextCash[bucket] += input.side === "buy" ? -notional : notional;
      const nextPositions = applyFill(positions, order, input.qty, fillPrice, asset.currency);

      set((s) => ({
        orders: [order, ...s.orders],
        cash: nextCash,
        positions: nextPositions.filter((p) => p.qty > 1e-9),
        fillCount: s.fillCount + 1,
        submittedNotional: s.submittedNotional + notional,
        realizedPnl: s.realizedPnl + (input.side === "sell" ? 0 : 0),
      }));

      toast({
        tone: "success",
        title: `Simulated ${input.side === "buy" ? "BUY" : "SELL"} filled — demo only`,
        description: `${input.qty} ${input.symbol} @ ${fillPrice.toFixed(2)} · ${asset.currency} · no real order was routed.`,
      });
      return { ok: true, order };
    }

    // Limit / stop → rests in the local book until the demo engine works it.
    const order: Order = {
      id,
      symbol: input.symbol,
      side: input.side,
      type: input.type,
      qty: input.qty,
      price: input.price,
      status: "open",
      filledQty: 0,
      timeInForce: input.timeInForce,
      createdAt: now,
      note:
        input.type === "limit"
          ? "Resting in the simulated book."
          : "Mock stop waiting for its trigger.",
    };
    set((s) => ({ orders: [order, ...s.orders], submittedNotional: s.submittedNotional + 0 }));
    toast({
      tone: "info",
      title: `${input.type === "limit" ? "Limit" : "Stop"} order accepted (demo)`,
      description: `${input.side.toUpperCase()} ${input.qty} ${input.symbol} ${input.type === "limit" ? "@" : "trigger"} ${input.price} — resting locally.`,
    });
    return { ok: true, order };
  },

  cancel: (id) => {
    const o = get().orders.find((x) => x.id === id);
    if (!o || o.status !== "open") return;
    set((s) => ({
      orders: s.orders.map((x) =>
        x.id === id ? { ...x, status: "cancelled", note: "Cancelled in demo blotter." } : x,
      ),
    }));
    useToast.getState().push({
      tone: "warning",
      title: "Order cancelled (demo)",
      description: `${o.side.toUpperCase()} ${o.qty} ${o.symbol} removed from the simulated book.`,
    });
  },

  closePosition: (symbol) => {
    const { positions, cash } = get();
    const pos = positions.find((p) => p.symbol === symbol);
    const asset = ASSET_MAP[symbol];
    const quote = useMarket.getState().quotes[symbol];
    if (!pos || !asset || !quote) return { ok: false, error: "No simulated position." };

    const fillPrice = quote.price * (1 - SLIPPAGE);
    const notional = fillPrice * pos.qty;
    const now = Date.now();
    const order: Order = {
      id: `ORD-${Math.floor(10440 + Math.random() * 900)}`,
      symbol,
      side: "sell",
      type: "market",
      qty: pos.qty,
      status: "filled",
      filledQty: pos.qty,
      avgFillPrice: fillPrice,
      timeInForce: "ioc",
      createdAt: now,
      filledAt: now,
      note: "Position closed in the demo (market).",
    };

    const bucket = asset.currency === "NGN" ? "NGN" : "USD";
    const nextCash = { ...cash };
    nextCash[bucket] += notional;

    set((s) => ({
      orders: [order, ...s.orders],
      cash: nextCash,
      positions: s.positions.filter((p) => p.symbol !== symbol),
      fillCount: s.fillCount + 1,
    }));

    useToast.getState().push({
      tone: "success",
      title: "Position closed (demo)",
      description: `Sold ${pos.qty} ${symbol} @ ${fillPrice.toFixed(2)} ${asset.currency} — simulated only.`,
    });
    return { ok: true, order };
  },

  resetDemo: () => {
    set({
      cash: { ...STARTING_CASH },
      positions: seedPositions(),
      orders: seedOrders(),
      realizedPnl: 1_284_600,
      fillCount: 5,
      submittedNotional: 42_180,
    });
    useToast.getState().push({
      tone: "info",
      title: "Demo reset",
      description: "Balances, positions and the blotter were restored to their seed state.",
    });
  },
}));
