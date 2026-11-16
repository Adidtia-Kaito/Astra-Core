import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/appStore";

export default function StatusBar() {
  const status = useAppStore((s) => s.backendStatus);
  const detail = useAppStore((s) => s.backendDetail);
  const theme = useAppStore((s) => s.theme);
  const appInfo = useAppStore((s) => s.appInfo);
  const process = useAppStore((s) => s.backendProcess);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <footer className="statusbar">
      <span className="status-left" title={detail}>
        <span className={`dot dot-${status}`} />
        {detail || "—"}
        {process?.running && process.pid ? ` · pid ${process.pid}` : ""}
      </span>
      <span className="status-mid" title={appInfo?.data_dir ?? "App data directory"}>
        Data lokal · tanpa telemetry
      </span>
      <span className="status-right">
        <span>{theme === "dark" ? "Dark" : "Light"}</span>
        <span className="status-sep" />
        <span>v{appInfo?.version ?? "1.2.0"}</span>
        <span className="status-sep" />
        <time>{now.toLocaleTimeString("id-ID", { hour12: false })}</time>
      </span>
    </footer>
  );
}