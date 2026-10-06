"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToast, type ToastTone } from "@/lib/store/use-toast";
import { cn } from "@/lib/utils";

const ICON: Record<ToastTone, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TONE: Record<ToastTone, string> = {
  success: "text-bull border-bull/35",
  error: "text-bear border-bear/35",
  warning: "text-alert border-alert/35",
  info: "text-volt border-volt/35",
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[340px] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICON[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex items-start gap-2.5 rounded-lg border border-white/10 bg-surface-900/95 p-3 shadow-panel backdrop-blur"
            >
              <Icon size={15} className={cn("mt-0.5 shrink-0", TONE[t.tone].split(" ")[0])} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-white">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{t.description}</p>
                )}
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  Demo / simulated
                </p>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="focus-ring rounded p-0.5 text-slate-500 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
