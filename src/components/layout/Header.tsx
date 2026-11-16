import { useLocation } from "react-router-dom";
import { useAppStore } from "../../stores/appStore";
import { IconMoon, IconSun } from "../icons";
import StatusBadge from "../ui/StatusBadge";
import { PAGE_META } from "./nav";

export default function Header() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? { title: "Astra-Core.sys", sub: "Personal AI Companion" };
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const status = useAppStore((s) => s.backendStatus);

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{meta.title}</h1>
        <p>{meta.sub}</p>
      </div>
      <div className="topbar-actions">
        <StatusBadge
          status={status}
          label={status === "online" ? "Backend online" : status === "checking" ? "Menghubungkan…" : "Backend offline"}
        />
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
          title={theme === "dark" ? "Tema terang" : "Tema gelap"}
        >
          {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
        </button>
      </div>
    </header>
  );
}