"use client";

import { motion } from "framer-motion";
import { AssetTable } from "@/components/markets/asset-table";
import { MarketStats } from "@/components/markets/market-stats";
import { Badge } from "@/components/ui/badge";

export default function MarketsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-white">
            Markets <span className="text-volt">/ discover</span>
          </h1>
          <p className="text-[11px] text-slate-500">
            Screen the mock universe across NGX stocks, ETFs, crypto, FX and commodities.
          </p>
        </div>
        <Badge variant="alert">Demo / simulated prices</Badge>
      </div>

      <MarketStats />
      <AssetTable />
    </motion.div>
  );
}
