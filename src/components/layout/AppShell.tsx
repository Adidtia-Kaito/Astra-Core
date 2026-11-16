import { useEffect, type ReactNode } from "react";
import { startHealthPoll } from "../../services/health";
import { getAppInfo } from "../../services/tauri";
import { useAppStore } from "../../stores/appStore";
import ToastHost from "../ui/ToastHost";
import Header from "./Header";
import IdentityModal from "./IdentityModal";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";

export default function AppShell({ children }: { children: ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  const setAppInfo = useAppStore((s) => s.setAppInfo);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    let alive = true;
    void getAppInfo().then((info) => {
      if (alive && info) setAppInfo(info);
    });
    return () => { alive = false; };
  }, [setAppInfo]);

  useEffect(() => startHealthPoll(), []);

  return (
    <div className="shell">
      <div className="shell-body">
        <Sidebar />
        <div className="shell-main">
          <Header />
          <main className="content">{children}</main>
        </div>
      </div>
      <StatusBar />
      <IdentityModal />
      <ToastHost />
    </div>
  );
}