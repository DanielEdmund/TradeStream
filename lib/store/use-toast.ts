import { create } from "zustand";
import { uid } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = uid("toast");
    set((s) => ({ toasts: [...s.toasts, { ...t, id }].slice(-4) }));
    setTimeout(() => get().dismiss(id), 5000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));
