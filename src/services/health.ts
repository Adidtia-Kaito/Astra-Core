import { useAppStore } from "../stores/appStore";
import { getBackendInfo, isTauri } from "./tauri";

const HEALTH_URL = "http://127.0.0.1:8000/health";
let timer: number | undefined;

export async function refreshBackendProcess(): Promise<void> {
  if (!isTauri()) return;
  const info = await getBackendInfo();
  if (info) useAppStore.getState().setBackendProcess(info);
}

export async function checkBackend(showChecking = true): Promise<boolean> {
  const { setBackendStatus } = useAppStore.getState();
  if (showChecking) setBackendStatus("checking", "Menghubungi backend lokal…");
  const ctrl = new AbortController();
  const timeout = window.setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(HEALTH_URL, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { status?: string; service?: string; pid?: number };
    if (data.status !== "ok") throw new Error("Respons tidak sehat");
    setBackendStatus("online", `${data.service ?? "astra-core-backend"} · 127.0.0.1:8000`);
    await refreshBackendProcess();
    return true;
  } catch {
    setBackendStatus("offline", "Backend tidak merespons di 127.0.0.1:8000");
    await refreshBackendProcess();
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function startHealthPoll(intervalMs = 15000): () => void {
  void checkBackend(true);
  timer = window.setInterval(() => void checkBackend(false), intervalMs);
  return () => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
  };
}