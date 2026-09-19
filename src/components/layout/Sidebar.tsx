import type { User } from "../../types";
import { Avatar } from "../ui/Avatar";

export type NavView = "dashboard" | "my-leaves" | "apply" | "team" | "calendar";

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ReactNode;
  managerOnly?: boolean;
}

const NAV: NavItem[] = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    id: "my-leaves", label: "My Leaves",
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  },
  {
    id: "apply", label: "Apply for Leave",
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/><path d="M12 7v1"/></svg>,
  },
  {
    id: "team", label: "Team Requests",
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg>,
    managerOnly: true,
  },
  {
    id: "calendar", label: "Leave Calendar",
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
  },
];

interface SidebarProps {
  view: NavView;
  setView: (v: NavView) => void;
  user: User;
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ view, setView, user, mobileOpen, onClose }: SidebarProps) {
  const items = NAV.filter(n => !n.managerOnly || user.role === "Manager");

  const content = (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">LeavePro</p>
            <p className="text-slate-500 text-xs mt-0.5">HR Management</p>
          </div>
        </div>
      </div>

      {/* Role pill */}
      <div className="px-4 pt-4 pb-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
          ${user.role === "Manager" ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50" : "bg-slate-800 text-slate-400 border border-slate-700/50"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.role === "Manager" ? "bg-indigo-400" : "bg-slate-500"}`} />
          {user.role} · {user.department}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => { setView(item.id); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left
              ${view === item.id
                ? "bg-indigo-600 text-white font-medium shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <Avatar initials={user.avatar} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-slate-200 text-xs font-medium truncate">{user.name}</p>
            <p className="text-slate-500 text-xs truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block w-56 flex-shrink-0 h-full">{content}</aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-64 h-full">{content}</aside>
        </div>
      )}
    </>
  );
}
