import { useState } from "react";
import type { LeaveRequest, LeaveStatus, LeaveType } from "../../types";
import { StatusBadge, TypeBadge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { LEAVE_TYPES } from "../../data/mockData";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

interface LeaveTableProps {
  requests: LeaveRequest[];
  mode: "employee" | "manager";
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  loadingId?: string | null;
}

export function LeaveTable({ requests, mode, onApprove, onReject, onCancel, loadingId }: LeaveTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | LeaveStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | LeaveType>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.employeeName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchType = typeFilter === "All" || r.type === typeFilter;
    return matchQ && matchStatus && matchType;
  });

  const statuses: ("All" | LeaveStatus)[] = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                ${statusFilter === s ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"}`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1 opacity-60">{requests.filter(r => r.status === s).length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as "All" | LeaveType)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="All">All Types</option>
            {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-40"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">No requests match your filters.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {mode === "manager" && (
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Employee</th>
                )}
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">From</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">To</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Days</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <>
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  >
                    {mode === "manager" && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar initials={r.employeeAvatar} size="xs" />
                          <div>
                            <p className="font-medium text-slate-800 whitespace-nowrap">{r.employeeName}</p>
                            <p className="text-xs text-slate-400">{r.department}</p>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3"><TypeBadge type={r.type} /></td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">{fmt(r.from)}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">{fmt(r.to)}</td>
                    <td className="px-4 py-3 font-medium text-slate-700 tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{r.days}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                        {mode === "manager" && r.status === "Pending" && (
                          <>
                            <Button variant="success" size="sm" loading={loadingId === r.id} onClick={() => onApprove?.(r.id)}>Approve</Button>
                            <Button variant="danger" size="sm" loading={loadingId === r.id} onClick={() => onReject?.(r.id)}>Reject</Button>
                          </>
                        )}
                        {mode === "employee" && r.status === "Pending" && (
                          <Button variant="ghost" size="sm" loading={loadingId === r.id} onClick={() => onCancel?.(r.id)}>Cancel</Button>
                        )}
                        {r.status !== "Pending" && <span className="text-xs text-slate-300">—</span>}
                      </div>
                    </td>
                  </tr>
                  {expandedId === r.id && (
                    <tr key={`${r.id}-detail`} className="bg-slate-50/80">
                      <td colSpan={mode === "manager" ? 7 : 6} className="px-4 py-3">
                        <div className="flex flex-col gap-1 text-xs text-slate-600">
                          <p><span className="font-medium text-slate-700">Reason:</span> {r.reason}</p>
                          <p><span className="font-medium text-slate-700">Applied:</span> {fmt(r.appliedOn)}</p>
                          {r.reviewedBy && <p><span className="font-medium text-slate-700">Reviewed by:</span> {r.reviewedBy} on {fmt(r.reviewedOn!)}</p>}
                          {r.reviewNote && <p><span className="font-medium text-slate-700">Note:</span> {r.reviewNote}</p>}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/30">
        <p className="text-xs text-slate-400">{filtered.length} of {requests.length} requests · Click a row to expand details</p>
      </div>
    </div>
  );
}
