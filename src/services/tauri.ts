import { invoke } from "@tauri-apps/api/core";

export interface AppInfo {
  name: string;
  version: string;
  tauri_version: string;
  platform: string;
  arch: string;
  data_dir: string;
  logs_dir: string;
  backend_dir: string | null;
  python: string | null;
  backend_url: string;
}

export interface BackendInfo {
  running: boolean;
  pid: number | null;
  host: string;
  port: number;
  url: string;
  backend_dir: string | null;
  python: string | null;
  log_file: string | null;
  message: string;
}

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function getAppInfo(): Promise<AppInfo | null> {
  if (!isTauri()) return null;
  try {
    return await invoke<AppInfo>("app_info");
  } catch {
    return null;
  }
}

export async function getBackendInfo(): Promise<BackendInfo | null> {
  if (!isTauri()) return null;
  try {
    return await invoke<BackendInfo>("backend_status");
  } catch {
    return null;
  }
}

function requireTauri(): void {
  if (!isTauri()) {
    throw new Error("Lifecycle backend hanya tersedia di aplikasi desktop (Tauri).");
  }
}

export async function startBackend(): Promise<BackendInfo> {
  requireTauri();
  return invoke<BackendInfo>("backend_start");
}

export async function stopBackend(): Promise<BackendInfo> {
  requireTauri();
  return invoke<BackendInfo>("backend_stop");
}

export async function restartBackend(): Promise<BackendInfo> {
  requireTauri();
  return invoke<BackendInfo>("backend_restart");
}