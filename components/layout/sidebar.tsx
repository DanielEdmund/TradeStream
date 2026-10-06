"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BookOpenText,
  CandlestickChart,
  LayoutGrid,
  Newspaper,
  PieChart,
  ReceiptText,
  Settings2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/markets", label: "Markets", icon: LayoutGrid, hint: "Discover & screen assets" },
  { href: "/terminal", label: "Terminal", icon: CandlestickChart, hint: "Chart, book & order ticket" },
  { href: "/portfolio", label: "Portfolio", icon: PieChart, hint: "Holdings, P&L, allocation" },
  { href: "/orders", label: "Orders", icon: ReceiptText, hint: "Blotter & trade journal" },
  { href: "/news", label: "News", icon: Newspaper, hint: "Simulated wire & calendar" },
  { href: "/learn", label: "Learn", icon: BookOpenText, hint: "Risk, glossary & quiz" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[212px] shrink-0 flex-col border-r border-white/[0.06] bg-surface-900/70 lg:flex">
      <Link
        href="/"
        className="focus-ring flex h-14 items-center gap-2.5 border-b border-white/[0.06] px-4"
      >
        <span className="grid h-7 w-7 place-items-center rounded-md bg-volt/15 text-volt shadow-[inset_0_0_0_1px_rgba(6,182,212,0.4)]">
          <ArrowLeftRight size={15} />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-bold tracking-tight text-white">
            Trade<span className="text-volt">Stream</span>
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Sim Terminal
          </span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 p-2.5">
        <p className="label-caps px-2 pb-1 pt-2">Workspace</p>
        {NAV.map(({ href, label, icon: Icon, hint }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={hint}
              className={cn(
                "focus-ring group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-volt/10 text-white shadow-[inset_0_0_0_1px_rgba(6,182,212,0.25)]"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200",
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-volt transition-all",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon
                size={15}
                className={active ? "text-volt" : "text-slate-500 group-hover:text-slate-300"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2.5 border-t border-white/[0.06] p-3">
        <div className="rounded-lg border border-neon/25 bg-neon/[0.07] p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neon">
              Sim account
            </span>
            <Badge variant="neon">Demo</Badge>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-slate-400">
            Play money balances. Reset any time from the top bar.
          </p>
        </div>
        <div className="flex items-center gap-2 px-1 text-[10px] text-slate-600">
          <Settings2 size={12} />
          <span>Prototype build · v0.1</span>
        </div>
      </div>
    </aside>
  );
}
