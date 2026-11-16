import { create } from "zustand";

export type ToastKind = "success" | "error" | "warning" | "info";
export interface ToastItem { id: number; kind: ToastKind; title: string; message?: string; }

interface ToastState {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    window.setTimeout(() => get().dismiss(id), 4200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (title: string, message?: string) => useToastStore.getState().push({ kind: "success", title, message }),
  error: (title: string, message?: string) => useToastStore.getState().push({ kind: "error", title, message }),
  warning: (title: string, message?: string) => useToastStore.getState().push({ kind: "warning", title, message }),
  info: (title: string, message?: string) => useToastStore.getState().push({ kind: "info", title, message }),
};