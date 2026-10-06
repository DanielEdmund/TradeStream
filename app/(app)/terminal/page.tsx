"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { AssetHeader } from "@/components/trade/asset-header";
import { OrderBook } from "@/components/trade/order-book";
import { OrderTicket } from "@/components/trade/order-ticket";
import { OrdersTable } from "@/components/trade/orders-table";
import { PositionsTable } from "@/components/trade/positions-table";
import { RecentTrades } from "@/components/trade/recent-trades";
import { WatchlistPanel } from "@/components/trade/watchlist-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAsset, ASSETS } from "@/lib/mock/assets";
import { TIMEFRAMES } from "@/lib/mock/candles";
import { useMarket } from "@/lib/store/use-market";
import { useTrading } from "@/lib/store/use-trading";
import type { Timeframe } from "@/lib/types";
import { formatCompact, formatPrice } from "@/lib/utils";

function TerminalInner() {
  const params = useSearchParams();
  const paramSymbol = params.get("symbol");

  const [symbol, setSymbol] = useState<string>(() => {
    const s = paramSymbol && getAsset(paramSymbol) ? paramSymbol : "MTNN";
    return s;
  });
  const [tf, setTf] = useState<Timeframe>("1D");
  const [tab, setTab] = useState("positions");

  const getCandles = useMarket((s) => s.getCandles);
  const quote = useMarket((s) => s.quotes[symbol]);
  const book = useMarket((s) => s.books[symbol]);
  const trades = useMarket((s) => s.trades[symbol]);
  const history = useMarket((s) => s.history);
  const watchlist = useMarket((s) => s.watchlist);
  const toggleWatch = useMarket((s) => s.toggleWatch);
  const orders = useTrading((s) => s.orders);
  const cash = useTrading((s) => s.cash);

  useEffect(() => {
    if (paramSymbol && getAsset(paramSymbol)) setSymbol(paramSymbol);
  }, [paramSymbol]);

  const asset = getAsset(symbol) ?? ASSETS[0];
  const candles = useMemo(() => getCandles(symbol, tf), [symbol, tf, getCandles, quote?.price]);

  const openOrders = orders.filter((o) => o.status === "open");
  const recent = orders.filter((o) => o.status !== "open").slice(0, 12);

  if (!quote) return null;

  return (
    <div className="space-y-3">
      <AssetHeader
        asset={asset}
        quote={quote}
        watched={watchlist.includes(symbol)}
        onToggleWatch={() => toggleWatch(symbol)}
      />

      <div className="grid gap-3 xl:grid-cols-[236px_minmax(0,1fr)_318px]">
        {/* Left — watchlist */}
        <div className="hidden xl:block">
          <WatchlistPanel selected={symbol} onSelect={setSymbol} />
        </div>

        {/* Center — chart + microstructure */}
        <div className="min-w-0 space-y-3">
          <div className="panel flex flex-col overflow-hidden">
            <div className="panel-header">
              <div className="flex items-center gap-3">
                <span className="num text-sm font-bold text-white">{asset.symbol}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  {tf} · simulated OHLC
                </span>
                <Badge variant="volt">Live sim</Badge>
              </div>
              <Segmented value={tf} onChange={setTf} options={TIMEFRAMES.map((t) => ({ value: t.id, label: t.label }))} />
            </div>
            <div className="h-[360px] md:h-[430px]">
              <CandlestickChart candles={candles} currencySymbol={asset.currency} />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-white/[0.06] px-4 py-2 text-[10px] text-slate-500">
              <span>
                Open <span className="num text-slate-300">{formatPrice(candles[candles.length - 1]?.open ?? 0, asset.currency)}</span>
              </span>
              <span>
                High <span className="num text-bull">{formatPrice(candles[candles.length - 1]?.high ?? 0, asset.currency)}</span>
              </span>
              <span>
                Low <span className="num text-bear">{formatPrice(candles[candles.length - 1]?.low ?? 0, asset.currency)}</span>
              </span>
              <span>
                Vol <span className="num text-slate-300">{formatCompact(candles[candles.length - 1]?.volume ?? 0, "USD").replace("$", "")}</span>
              </span>
              <span className="ml-auto text-slate-600">
                Mock candles · drag to pan, scroll to zoom
              </span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-[330px]">
              <OrderBook asset={asset} book={book} quote={quote} />
            </div>
            <div className="h-[330px]">
              <RecentTrades asset={asset} trades={trades ?? []} />
            </div>
          </div>
        </div>

        {/* Right — ticket + account */}
        <div className="space-y-3">
          <OrderTicket asset={asset} />

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                Sim account
              </CardTitle>
              <Badge variant="neon">Play money</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">NGN cash</span>
                <span className="num font-semibold text-slate-200">{formatPrice(cash.NGN, "NGN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">USD cash</span>
                <span className="num font-semibold text-slate-200">{formatPrice(cash.USD, "USD")}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-2">
                <span className="text-slate-500">Open orders</span>
                <span className="num font-semibold text-alert">{openOrders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Watched</span>
                <span className="num font-semibold text-volt">{watchlist.length}</span>
              </div>
              <p className="pt-1 text-[9.5px] leading-snug text-slate-600">
                No bank, broker or wallet is connected. Balances reset from the top bar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Positions / orders */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="open">
                Open orders ({openOrders.length})
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
            simulated book
          </span>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="py-1">
          <TabsContent value="positions">
            <PositionsTable onSelect={setSymbol} />
          </TabsContent>
          <TabsContent value="open">
            <OrdersTable
              orders={openOrders}
              onCancel={useTrading.getState().cancel}
              onSelectSymbol={setSymbol}
              empty="No working orders. Place a limit or stop from the ticket."
            />
          </TabsContent>
          <TabsContent value="history">
            <OrdersTable
              orders={recent}
              onSelectSymbol={setSymbol}
              empty="No fills yet — your simulated executions will appear here."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function TerminalPage() {
  return (
    <Suspense
      fallback={
        <div className="grid h-64 place-items-center text-xs uppercase tracking-widest text-slate-600">
          Loading simulated terminal…
        </div>
      }
    >
      <TerminalInner />
    </Suspense>
  );
}
