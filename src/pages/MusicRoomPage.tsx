import { Link } from "react-router-dom";
import ModuleBriefing from "../components/ModuleBriefing";
import { IconMusic } from "../components/icons";
import Panel from "../components/ui/Panel";

export default function MusicRoomPage() {
  return (
    <ModuleBriefing
      icon={<IconMusic size={22} />}
      title="Music Room"
      tagline="Satu ruangan untuk musik lokal dan Spotify, dengan kendali playback sepenuhnya manual."
      stage="Tahap 11–12"
      capabilities={[
        { title: "Library lokal", detail: "Scan folder musik, baca metadata (judul, artis, album, cover), dan putar tanpa internet." },
        { title: "Spotify", detail: "Login OAuth PKCE dan playback via Web API untuk akun Premium, tanpa menyimpan password." },
        { title: "Playlist & queue", detail: "Playlist lokal, antrian putar, shuffle, dan repeat yang tersimpan antar sesi." },
        { title: "Kendali manual", detail: "Play, pause, seek, volume, next, previous — tidak ada autoplay tanpa izin pengguna." },
      ]}
      cta={
        <Panel title="Persiapan" subtitle="Folder musik dan akun Spotify diatur di Engine Settings">
          <div className="chip-row">
            <Link className="btn btn-secondary" to="/settings">Buka Engine Settings</Link>
            <Link className="btn btn-ghost" to="/dashboard">Kembali ke Dashboard</Link>
          </div>
        </Panel>
      }
    />
  );
}