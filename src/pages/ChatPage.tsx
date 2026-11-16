import { Link } from "react-router-dom";
import ModuleBriefing from "../components/ModuleBriefing";
import { IconChat } from "../components/icons";
import Panel from "../components/ui/Panel";

export default function ChatPage() {
  return (
    <ModuleBriefing
      icon={<IconChat size={22} />}
      title="AI Chat"
      tagline="Percakapan teks dengan tiga mode engine dan riwayat yang bertahan di perangkat Anda."
      stage="Tahap 6–8"
      capabilities={[
        { title: "Mode Local LLM", detail: "Model GGUF dijalankan lokal lewat llama.cpp server; tanpa internet, tanpa biaya token." },
        { title: "Mode AI Chat API", detail: "Provider eksternal opsional dengan API key milik pengguna sendiri, disimpan lokal." },
        { title: "Mode Intent Only", detail: "Tanpa LLM: perintah deterministik (buka musik, catatan, pengingat) tetap berjalan cepat." },
        { title: "Riwayat percakapan", detail: "Semua pesan disimpan di SQLite lokal dan tetap ada setelah aplikasi ditutup." },
      ]}
      cta={
        <Panel title="Persiapan" subtitle="Konfigurasi engine dilakukan di Engine Settings">
          <div className="chip-row">
            <Link className="btn btn-secondary" to="/settings">Buka Engine Settings</Link>
            <Link className="btn btn-ghost" to="/dashboard">Kembali ke Dashboard</Link>
          </div>
        </Panel>
      }
    />
  );
}