import { NavLink } from "react-router-dom";
import { useAppStore } from "../../stores/appStore";
import { IconChevronLeft, IconChevronRight, IconSpark } from "../icons";
import { NAV_ITEMS } from "./nav";

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggle = useAppStore((s) => s.toggleSidebar);
  const identity = useAppStore((s) => s.identity);
  const openIdentity = useAppStore((s) => s.setIdentityModalOpen);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <span className="brand-mark"><IconSpark size={18} /></span>
        {!collapsed && <span className="brand-text">Astra-Core<span>.sys</span></span>}
      </div>

      <nav className="side-nav" aria-label="Navigasi utama">
        {(["Utama", "Sistem"] as const).map((group) => (
          <div className="nav-group" key={group}>
            {!collapsed && <span className="nav-group-title">{group}</span>}
            {NAV_ITEMS.filter((i) => i.group === group).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon size={18} />
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="side-foot">
        <button className="identity-chip" onClick={() => openIdentity(true)} title="Ubah identitas">
          <span className="avatar">{identity.companionName.slice(0, 1).toUpperCase()}</span>
          {!collapsed && (
            <span className="identity-text">
              <strong>{identity.companionName}</strong>
              <span>untuk {identity.userName}</span>
            </span>
          )}
        </button>
        <button className="icon-btn collapse-btn" onClick={toggle} aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}>
          {collapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}