import { useEffect, useState } from "react";
import type { LeaveRequest, LeaveBalance, User } from "../types";
import { fetchTeamRequests, fetchBalances, fetchMyRequests } from "../api/leaveApi";
import { StatusBadge, TypeBadge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { BalanceCard } from "../components/leaves/BalanceCard";
import { Spinner } from "../components/ui/Spinner";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function StatTile({ label, value, sub, color }: { label: string; value: number | string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold mb-0.5" style={{ fontFamily: "var(--font-serif)", color }}>{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}

interface DashboardProps {
  user: User;
  onNavigate: (view: "team" | "apply" | "my-leaves") => void;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const [team, setTeam] = useState<LeaveRequest[]>([]);
  const [mine, setMine] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeamRequests(), fetchMyRequests(), fetchBalances()]).then(([t, m, b]) => {
      setTeam(t.data); setMine(m.data); setBalances(b.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const pending = team.filter(r => r.status === "Pending").length;
  const today = new Date().toISOString().slice(0, 10);
  const onLeaveToday = team.filter(r => r.status === "Approved" && r.from <= today && r.to >= today).length;
  const myPending = mine.filter(r => r.status === "Pending").length;

  const recent = user.role === "Manager"
    ? [...team].sort((a, b) => b.appliedOn.localeCompare(a.appliedOn)).slice(0, 6)
    : [...mine].sort((a, b) => b.appliedOn.localeCompare(a.appliedOn)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-serif)" }}>
          Good morning, {user.name.split(" ")[0]} 👋
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {user.role === "Manager" ? (
          <>
            <StatTile label="Pending Approvals" value={pending} sub="Requires your action" color="#d97706" />
            <StatTile label="On Leave Today" value={onLeaveToday} sub="Team members absent" color="#4f46e5" />
            <StatTile label="Approved This Month" value={team.filter(r => r.status === "Approved").length} sub="Total approved" color="#059669" />
            <StatTile label="Total Requests" value={team.length} sub="All team requests" color="#64748b" />
          </>
        ) : (
          <>
            <StatTile label="Annual Leave" value={balances.find(b => b.type === "Annual")?.remaining ?? "—"} sub="Days remaining" color="#4f46e5" />
            <StatTile label="Sick Leave" value={balances.find(b => b.type === "Sick")?.remaining ?? "—"} sub="Days remaining" color="#059669" />
            <StatTile label="My Pending" value={myPending} sub="Awaiting approval" color="#d97706" />
            <StatTile label="Total Applied" value={mine.length} sub="All my requests" color="#64748b" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent requests */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">
              {user.role === "Manager" ? "Recent Team Requests" : "My Recent Requests"}
            </h3>
            <button
              onClick={() => onNavigate(user.role === "Manager" ? "team" : "my-leaves")}
              className="text-indigo-600 text-xs hover:underline font-medium"
            >
              View all →
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No requests yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recent.map(r => (
                <div key={r.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                  <Avatar initials={r.employeeAvatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{r.employeeName}</p>
                    <p className="text-xs text-slate-400">{r.department} · {fmt(r.from)} – {fmt(r.to)}</p>
                  </div>
                  <TypeBadge type={r.type} />
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave balance */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">Leave Balance</h3>
            <button onClick={() => onNavigate("my-leaves")} className="text-indigo-600 text-xs hover:underline font-medium">Details →</button>
          </div>
          <div className="p-4 space-y-3">
            {balances.slice(0, 4).map(b => (
              <div key={b.type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{b.type}</span>
                  <span className="text-slate-500 tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{b.remaining}/{b.total}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(b.remaining / b.total) * 100}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <button
              onClick={() => onNavigate("apply")}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + Apply for Leave
            </button>
          </div>
        </div>
      </div>

      {/* Pending actions for manager */}
      {user.role === "Manager" && pending > 0 && (
        <div className="flex items-center gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">{pending} request{pending > 1 ? "s" : ""} awaiting your approval</p>
            <p className="text-xs text-amber-600">Review and respond to keep your team unblocked.</p>
          </div>
          <button
            onClick={() => onNavigate("team")}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
          >
            Review now
          </button>
        </div>
      )}
    </div>
  );
}
