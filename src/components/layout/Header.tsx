import type { User, Role } from "../../types";
import { Avatar } from "../ui/Avatar";
import { USERS } from "../../data/mockData";

const VIEW_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  "my-leaves": "My Leaves",
  apply: "Apply for Leave",
  team: "Team Requests",
  calendar: "Leave Calendar",
};

interface HeaderProps {
  view: string;
  user: User;
  onMenuClick: () => void;
  onRoleSwitch: (user: User) => void;
}

export function Header({ view, user, onMenuClick, onRoleSwitch }: HeaderProps) {
  const switchOptions: { label: string; role: Role; userId: string }[] = [
    { label: "Sarah Mitchell (Manager)", role: "Manager", userId: "u1" },
    { label: "Priya Nair (Employee)", role: "Employee", userId: "u3" },
    { label: "James Okafor (Employee)", role: "Employee", userId: "u2" },
  ];

  function handleSwitch(userId: string) {
    const found = USERS.find(u => u.id === userId);
    if (found) onRoleSwitch(found);
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <h1 className="font-semibold text-slate-800 text-sm flex-1" style={{ fontFamily: "var(--font-serif)" }}>
        {VIEW_TITLES[view] ?? "LeavePro"}
      </h1>

      {/* Role switcher */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400 hidden sm:block">View as:</label>
        <select
          value={user.id}
          onChange={e => handleSwitch(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
        >
          {switchOptions.map(o => (
            <option key={o.userId} value={o.userId}>{o.label}</option>
          ))}
        </select>
      </div>

      <Avatar initials={user.avatar} size="sm" />
    </header>
  );
}
