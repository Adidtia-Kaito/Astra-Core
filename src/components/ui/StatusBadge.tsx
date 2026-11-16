export type BadgeStatus = "online" | "offline" | "checking" | "error" | "warning" | "neutral";

const DEFAULT_LABEL: Record<BadgeStatus, string> = {
  online: "Online",
  offline: "Offline",
  checking: "Memeriksa",
  error: "Error",
  warning: "Waspada",
  neutral: "Info",
};

export default function StatusBadge({ status, label }: { status: BadgeStatus; label?: string }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {label ?? DEFAULT_LABEL[status]}
    </span>
  );
}