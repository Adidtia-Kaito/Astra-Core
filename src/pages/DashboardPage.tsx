import { useState } from "react";
import { Link } from "react-router-dom";
import { IconEdit, IconPlay, IconRefresh, IconStop } from "../components/icons";
import { NAV_ITEMS } from "../components/layout/nav";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import Panel from "../components/ui/Panel";
import StatusBadge from "../components/ui/StatusBadge";
import { checkBackend } from "../services/health";
import { isTauri, restartBackend, startBackend, stopBackend, type BackendInfo } from "../services/tauri";
import { useAppStore } from "../stores/appStore";
import { toast } from "../stores/toastStore";

type LifecycleAction = "start" | "stop" | "restart";

export default function DashboardPage() {
  const identity = useAppStore((s) => s.identity);
  const status = useAppStore((s) => s.backendStatus);
  const process = useAppStore((s) => s.backendProcess);
  const setBackendProcess = useAppStore((s) => s.setBackendProcess);
  const openIdentity = useAppStore((s) => s.setIdentityModalOpen);
  const [busy, setBusy] = useState<LifecycleAction | null>(null);
  const desktop = isTauri();

  const runLifecycle = async (action: LifecycleAction) => {
    if (!desktop) {
      toast.warning("Hanya di desktop", "Jalankan lewat npm run tauri dev untuk mengontrol backend.");
      return;
    }
    setBusy(action);
    try {
      const fn = action === "start" ? startBackend : action === "stop" ? stopBackend : restartBackend;
      const info: BackendInfo = await fn();
      setBackendProcess(info);
      await checkBackend(false);
      const label = action === "start" ? "dijalankan" : action === "stop" ? "dihentikan" : "di-restart";
      toast.success(`Backend ${label}`, info.message);
    } catch (e) {
      toast.error("Lifecycle gagal", e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="stack">
      <div className="grid-2">
        <Panel
          title="Companion"
          subtitle="Identitas aktif di perangkat ini"
          actions={<Button size="sm" icon={<IconEdit size={14} />} onClick={() => openIdentity(true)}>Ubah</Button>}
        >
          <div className="identity-hero">
            <span className="avatar avatar-lg">{identity.companionName.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong className="identity-name">{identity.companionName}</strong>
              <p className="muted">menemani {identity.userName}</p>
            </div>
          </div>
          <p className="muted">Identitas disimpan lokal dan dipakai di sidebar, header, dan percakapan.</p>
        </Panel>

        <Panel
          title="Backend Lokal"
          subtitle={process?.url ?? "FastAPI · 127.0.0.1:8000"}
          actions={<StatusBadge status={status} />}
        >
          {status === "checking" ? (
            <LoadingState label="Menghubungi /health…" />
          ) : status === "offline" ? (
            <ErrorState
              title="Backend tidak merespons"
              message={process?.message ?? "Backend belum berjalan atau gagal start."}
              onRetry={() => void runLifecycle("start")}
              retryLabel="Jalankan backend"
              retrying={busy === "start"}
            />
          ) : (
            <p className="muted">
              Health check merespons <code>ok</code>
              {process?.pid ? ` · pid ${process.pid}` : ""}. Layanan siap menerima request dari shell.
            </p>
          )}

          <div className="chip-row">
            <Button size="sm" variant="primary" icon={<IconPlay size={14} />} loading={busy === "start"}
              disabled={!desktop || (busy !== null && busy !== "start") || process?.running === true}
              onClick={() => void runLifecycle("start")}>Start</Button>
            <Button size="sm" variant="danger" icon={<IconStop size={14} />} loading={busy === "stop"}
              disabled={!desktop || (busy !== null && busy !== "stop") || process?.running !== true}
              onClick={() => void runLifecycle("stop")}>Stop</Button>
            <Button size="sm" icon={<IconRefresh size={14} />} loading={busy === "restart"}
              disabled={!desktop || (busy !== null && busy !== "restart")}
              onClick={() => void runLifecycle("restart")}>Restart</Button>
          </div>

          {process?.log_file && (
            <p className="field-hint" title={process.log_file}>Log: {process.log_file}</p>
          )}
          {!desktop && (
            <p className="field-hint">Kontrol lifecycle aktif saat berjalan sebagai aplikasi desktop (Tauri).</p>
          )}
        </Panel>
      </div>

      <Panel title="Modul" subtitle="Navigasi cepat ke seluruh ruangan aplikasi">
        <div className="grid-4">
          {NAV_ITEMS.filter((i) => i.to !== "/dashboard" && i.to !== "/about").map((item) => (
            <Link key={item.to} to={item.to} className="module-card">
              <item.icon size={20} />
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}