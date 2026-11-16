import type { ComponentType } from "react";
import { IconChat, IconDashboard, IconImage, IconInfo, IconMusic, IconSettings, type IconProps } from "../icons";

export interface NavItem {
  to: string;
  label: string;
  group: "Utama" | "Sistem";
  icon: ComponentType<IconProps>;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", group: "Utama", icon: IconDashboard, description: "Ringkasan companion & status sistem" },
  { to: "/chat", label: "AI Chat", group: "Utama", icon: IconChat, description: "Percakapan teks multi-mode" },
  { to: "/image-generator", label: "AI Image Generator", group: "Utama", icon: IconImage, description: "Generate & kelola gambar" },
  { to: "/music-room", label: "Music Room", group: "Utama", icon: IconMusic, description: "Musik lokal & Spotify" },
  { to: "/settings", label: "Engine Settings", group: "Sistem", icon: IconSettings, description: "Konfigurasi seluruh engine" },
  { to: "/about", label: "About", group: "Sistem", icon: IconInfo, description: "Versi, stack, dan privasi" },
];

export const PAGE_META: Record<string, { title: string; sub: string }> = {
  "/onboarding": { title: "First-time Setup", sub: "Selamat datang di Astra-Core.sys" },
  ...Object.fromEntries(NAV_ITEMS.map((i) => [i.to, { title: i.label, sub: i.description }])),
};