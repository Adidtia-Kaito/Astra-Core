import type { ReactNode } from "react";
import { useToastStore, type ToastKind } from "../../stores/toastStore";
import { IconAlert, IconCheck, IconClose, IconInfo } from "../icons";

const ICONS: Record<ToastKind, ReactNode> = {
  success: <IconCheck size={16} />,
  error: <IconAlert size={16} />,
  warning: <IconAlert size={16} />,
  info: <IconInfo size={16} />,
};

export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          <span className="toast-icon">{ICONS[t.kind]}</span>
          <div className="toast-text">
            <strong>{t.title}</strong>
            {t.message && <span>{t.message}</span>}
          </div>
          <button className="icon-btn" onClick={() => dismiss(t.id)} aria-label="Tutup notifikasi"><IconClose size={13} /></button>
        </div>
      ))}
    </div>
  );
}