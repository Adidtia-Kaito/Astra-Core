import ModuleBriefing from "../components/ModuleBriefing";
import { IconSpark, IconUser } from "../components/icons";
import Button from "../components/ui/Button";
import Panel from "../components/ui/Panel";
import { useAppStore } from "../stores/appStore";

export default function OnboardingPage() {
  const openIdentity = useAppStore((s) => s.setIdentityModalOpen);
  return (
    <ModuleBriefing
      icon={<IconSpark size={22} />}
      title="Selamat datang di Astra-Core.sys"
      tagline="Setup singkat sebelum companion Anda hidup. Semua pilihan disimpan lokal dan bisa diubah kapan saja di Engine Settings."
      stage="Tahap 3 · Onboarding lengkap"
      capabilities={[
        { title: "Identitas lokal", detail: "Nama pengguna dan nama companion menjadi sapaan personal di seluruh aplikasi — tanpa akun cloud." },
        { title: "Preferensi awal", detail: "Tema, mode suara, dan engine default dipilih saat setup penuh tiba di Tahap 3." },
        { title: "Privasi sejak awal", detail: "Tidak ada telemetry. Backend hanya mendengarkan di 127.0.0.1 dan data tetap di perangkat." },
        { title: "Bertahap & jujur", detail: "Fitur yang belum dibangun ditandai jelas dengan tahap roadmap-nya, bukan tombol mati." },
      ]}
      cta={
        <Panel title="Mulai sekarang" subtitle="Langkah pertama yang sudah bisa dijalankan hari ini">
          <p className="muted">Tetapkan identitas Anda dan companion. Nama ini langsung dipakai di sidebar, dashboard, dan sapaan.</p>
          <div>
            <Button variant="primary" icon={<IconUser size={16} />} onClick={() => openIdentity(true)}>Setup identitas</Button>
          </div>
        </Panel>
      }
    />
  );
}