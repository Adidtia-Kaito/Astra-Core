import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/appStore";
import { toast } from "../../stores/toastStore";
import { IconCheck } from "../icons";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

export default function IdentityModal() {
  const open = useAppStore((s) => s.identityModalOpen);
  const setOpen = useAppStore((s) => s.setIdentityModalOpen);
  const identity = useAppStore((s) => s.identity);
  const setIdentity = useAppStore((s) => s.setIdentity);

  const [userName, setUserName] = useState(identity.userName);
  const [companionName, setCompanionName] = useState(identity.companionName);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setUserName(identity.userName);
      setCompanionName(identity.companionName);
      setError("");
    }
  }, [open, identity]);

  const save = () => {
    const u = userName.trim();
    const c = companionName.trim();
    if (!u || !c) { setError("Kedua nama wajib diisi."); return; }
    if (u.length > 32 || c.length > 32) { setError("Maksimal 32 karakter per nama."); return; }
    setIdentity({ userName: u, companionName: c });
    setOpen(false);
    toast.success("Identitas disimpan", `${c} siap menemani ${u}.`);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Identitas Companion"
      subtitle="Nama ini dipakai di seluruh aplikasi dan disimpan lokal di perangkat."
      footer={
        <>
          <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          <Button variant="primary" type="submit" form="identity-form" icon={<IconCheck size={16} />}>Simpan</Button>
        </>
      }
    >
      <form id="identity-form" className="stack" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <Input label="Nama pengguna" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="mis. Kaito" autoFocus />
        <Input label="Nama AI companion" value={companionName} onChange={(e) => setCompanionName(e.target.value)} placeholder="mis. Astra" hint="Nama panggilan companion Anda." />
        {error && <span className="field-error">{error}</span>}
      </form>
    </Modal>
  );
}