import { Link } from "react-router-dom";
import ModuleBriefing from "../components/ModuleBriefing";
import { IconImage } from "../components/icons";
import Panel from "../components/ui/Panel";

export default function ImageGeneratorPage() {
  return (
    <ModuleBriefing
      icon={<IconImage size={22} />}
      title="AI Image Generator"
      tagline="Generate gambar dari prompt dengan provider lokal atau API, lengkap dengan library hasil."
      stage="Tahap 9–10"
      capabilities={[
        { title: "Prompt composer", detail: "Prompt, negative prompt, ukuran, seed, dan steps dengan preset yang bisa disimpan." },
        { title: "Provider fleksibel", detail: "Stable Diffusion / ComfyUI lokal atau API eksternal; pilihan provider per generasi." },
        { title: "Progress & queue", detail: "Status generasi real-time, antrian jelas, dan pembatalan yang benar-benar menghentikan job." },
        { title: "Library & history", detail: "Hasil tersimpan lokal dengan metadata prompt sehingga bisa diregenerasi kapan saja." },
      ]}
      cta={
        <Panel title="Persiapan" subtitle="Model dan provider gambar dikonfigurasi di Engine Settings">
          <div className="chip-row">
            <Link className="btn btn-secondary" to="/settings">Buka Engine Settings</Link>
            <Link className="btn btn-ghost" to="/dashboard">Kembali ke Dashboard</Link>
          </div>
        </Panel>
      }
    />
  );
}