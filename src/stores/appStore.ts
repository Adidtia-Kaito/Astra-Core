import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppInfo, BackendInfo } from "../services/tauri";

export type Theme = "dark" | "light";
export type BackendStatus = "checking" | "online" | "offline";
export interface Identity { userName: string; companionName: string; }

interface AppState {
  identity: Identity;
  theme: Theme;
  sidebarCollapsed: boolean;
  identityModalOpen: boolean;
  backendStatus: BackendStatus;
  backendDetail: string;
  appInfo: AppInfo | null;
  backendProcess: BackendInfo | null;
  setIdentity: (identity: Identity) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setIdentityModalOpen: (open: boolean) => void;
  setBackendStatus: (status: BackendStatus, detail?: string) => void;
  setAppInfo: (info: AppInfo | null) => void;
  setBackendProcess: (info: BackendInfo | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      identity: { userName: "Kaito", companionName: "Astra" },
      theme: "dark",
      sidebarCollapsed: false,
      identityModalOpen: false,
      backendStatus: "checking",
      backendDetail: "Menghubungi backend lokal…",
      appInfo: null,
      backendProcess: null,
      setIdentity: (identity) => set({ identity }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setIdentityModalOpen: (identityModalOpen) => set({ identityModalOpen }),
      setBackendStatus: (backendStatus, backendDetail = "") => set({ backendStatus, backendDetail }),
      setAppInfo: (appInfo) => set({ appInfo }),
      setBackendProcess: (backendProcess) => set({ backendProcess }),
    }),
    {
      name: "astra-core-app",
      partialize: (s) => ({ identity: s.identity, theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
);