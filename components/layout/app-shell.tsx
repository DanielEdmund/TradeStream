"use client";

import { useEffect } from "react";
import { DemoBanner } from "@/components/layout/demo-banner";
import { Sidebar } from "@/components/layout/sidebar";
import { TickerTape } from "@/components/layout/ticker-tape";
import { Topbar } from "@/components/layout/topbar";
import { Toaster } from "@/components/ui/toast";
import { useMarket } from "@/lib/store/use-market";
import { useTrading } from "@/lib/store/use-trading";

/** Terminal chrome: demo banner → tape → sidebar + topbar → page content. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const startMarket = useMarket((s) => s.start);
  const startTrading = useTrading((s) => s.startEngine);

  useEffect(() => {
    startMarket();
    startTrading();
  }, [startMarket, startTrading]);

  return (
    <div className="flex min-h-screen flex-col bg-surface-950">
      <DemoBanner />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <TickerTape />
          <main className="min-w-0 flex-1 overflow-x-hidden p-3 md:p-4">{children}</main>
          <footer className="border-t border-white/[0.06] px-4 py-2.5 text-center text-[10px] leading-relaxed text-slate-600">
            TradeStream prototype — every price, order, balance, position and news item on this
            screen is local mock data. Demo / simulated trading only; not investment advice.
          </footer>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
