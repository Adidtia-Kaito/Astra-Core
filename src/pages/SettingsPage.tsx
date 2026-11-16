import { IconEdit } from "../components/icons";
import Button from "../components/ui/Button";
import Panel from "../components/ui/Panel";
import Select from "../components/ui/Select";
import StatusBadge from "../components/ui/StatusBadge";
import Switch from "../components/ui/Switch";
import { useAppStore, type Theme } from "../stores/appStore";
import { toast } from "../stores/toastStore";

const ENGINE_SECTIONS: ReadonlyArray<readonly [string, string]> = [
  ["Voice Mode", "Tahap 4–5"],
  ["Local LLM", "Tahap 6–8"],
  ["Intent Engine", "Tahap 5"],
  ["Audio STT / TTS", "Tahap 4–5"],
  ["Avatar VRM", "Tahap 13"],
  ["Hardware Monitor", "Tahap 14"],
  ["Privacy & Permissions", "Tahap 15"],
  ["Shortcuts", "Tahap 15"],
  ["Reset & Recovery", "Tahap 16"],
];

export default function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const identity = useAppStore((s) => s.identity);
  const openIdentity = useAppStore((s) => s.setIdentityModalOpen);

  return (
    <div className="stack">
      <div className="grid-2">
        <Panel title="Tampilan & Tema" subtitle="Berlaku langsung dan disimpan lokal">
          <Select
            label="Tema aplikasi"
            value={theme}
            onChange={(e) => {
              const next = e.target.value as Theme;
              setTheme(next);
              toast.info(next === "dark" ? "Tema gelap aktif" : "Tema terang aktif", "Preferensi tema disimpan di perangkat.");
            }}
          >
            <option value="dark">Dark — default companion</option>
            <option value="light">Light — ruang terang</option>
          </Select>
          <Switch
            checked={collapsed}
            onChange={() => toggleSidebar()}
            label="Sidebar ciut"
            description="Tampilkan hanya ikon untuk ruang konten lebih luas."
          />
        </Panel>

        <Panel
          title="Identitas"
          subtitle="Nama pengguna & companion"
          actions={<Button size="sm" icon={<IconEdit size={14} />} onClick={() => openIdentity(true)}>Ubah</Button>}
        >
          <ul className="spec-list">
            <li><span>Nama pengguna</span><strong>{identity.userName}</strong></li>
            <li><span>Nama companion</span><strong>{identity.companionName}</strong></li>
            <li><span>Penyimpanan</span><StatusBadge status="online" label="Lokal di perangkat" /></li>
          </ul>
        </Panel>
      </div>

      <Panel title="Konfigurasi Engine" subtitle="Panel berikut aktif pada tahap implementasinya masing-masing">
        <ul className="spec-list">
          {ENGINE_SECTIONS.map(([name, stage]) => (
            <li key={name}>
              <span>{name}</span>
              <StatusBadge status="neutral" label={stage} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}