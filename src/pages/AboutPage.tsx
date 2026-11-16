import { IconCopy, IconCpu, IconFolder, IconTerminal } from "../components/icons";
import Button from "../components/ui/Button";
import Panel from "../components/ui/Panel";
import StatusBadge from "../components/ui/StatusBadge";
import { useAppStore } from "../stores/appStore";
import { toast } from "../stores/toastStore";

const STACK = ["Tauri 2", "React 19", "TypeScript", "Vite", "Zustand", "FastAPI", "SQLite · Tahap 2", "llama.cpp · Tahap 8"];

export default function AboutPage() {
  const appInfo = useAppStore((s) => s.appInfo);
  const process = useAppStore((s) => s.backendProcess);

  const copy = async (label: string, value?: string | null) => {
    if (!value) {
      toast.warning("Tidak tersedia", `${label} belum diketahui.`);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Disalin", label);
    } catch {
      toast.error("Gagal menyalin", label);
    }
  };

  const rows: Array<{ label: string; value?: string | null; icon?: "folder" | "cpu" | "terminal" }> = [
    { label: "Nama aplikasi", value: appInfo?.name ?? "Astra-Core.sys" },
    { label: "Versi aplikasi", value: appInfo?.version ?? "1.2.0" },
    { label: "Versi Tauri", value: appInfo?.tauri_version },
    { label: "Platform / arsitektur", value: appInfo ? `${appInfo.platform} / ${appInfo.arch}` : undefined, icon: "cpu" },
    { label: "App data directory", value: appInfo?.data_dir, icon: "folder" },
    { label: "Logs directory", value: appInfo?.logs_dir, icon: "folder" },
    { label: "Backend directory", value: appInfo?.backend_dir, icon: "folder" },
    { label: "Python executable", value: appInfo?.python, icon: "terminal" },
    { label: "Backend URL", value: appInfo?.backend_url ?? "http://127.0.0.1:8000" },
    { label: "Backend PID", value: process?.pid ? String(process.pid) : undefined },
  ];

  return (
    <div className="stack">
      <Panel title="Astra-Core.sys" subtitle="Personal AI Waifu & Desktop Companion" actions={<StatusBadge status="neutral" label={`v${appInfo?.version ?? "1.2.0"} · Tahap 1`} />}>
        <p className="muted">
          Astra-Core adalah companion desktop local-first: percakapan, suara, gambar, dan musik berjalan di perangkat
          Anda dengan backend Python lokal dan shell desktop Tauri. Tidak ada akun wajib dan tidak ada cloud paksaan.
        </p>
        <div className="chip-row">
          {STACK.map((s) => <span key={s} className="chip">{s}</span>)}
        </div>
      </Panel>

      <Panel title="Runtime & Penyimpanan" subtitle="Nilai nyata dari aplikasi desktop, bukan data contoh">
        <ul className="spec-list">
          {rows.map((r) => (
            <li key={r.label}>
              <span className="spec-label">
                {r.icon === "folder" && <IconFolder size={14} />}
                {r.icon === "cpu" && <IconCpu size={14} />}
                {r.icon === "terminal" && <IconTerminal size={14} />}
                {r.label}
              </span>
              <span className="spec-value">
                <code title={r.value ?? "—"}>{r.value ?? "—"}</code>
                {r.value && (
                  <Button size="sm" variant="ghost" icon={<IconCopy size={13} />} onClick={() => void copy(r.label, r.value)} aria-label={`Salin ${r.label}`} />
                )}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Privasi sejak desain" subtitle="Komitmen yang sudah berlaku sejak Tahap 0">
        <ul className="spec-list">
          <li><span>Data percakapan & identitas</span><StatusBadge status="online" label="Lokal di perangkat" /></li>
          <li><span>Telemetry / pelacakan</span><StatusBadge status="offline" label="Tidak ada" /></li>
          <li><span>API key provider eksternal</span><StatusBadge status="warning" label="Opsional, milik pengguna" /></li>
          <li><span>Akses jaringan backend</span><StatusBadge status="online" label="127.0.0.1 saja" /></li>
        </ul>
      </Panel>
    </div>
  );
}