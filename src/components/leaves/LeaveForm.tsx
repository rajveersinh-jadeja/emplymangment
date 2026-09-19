import { useState } from "react";
import type { LeaveType, User } from "../../types";
import { Button } from "../ui/Button";
import { LEAVE_TYPES } from "../../data/mockData";

function workingDays(from: string, to: string): number {
  if (!from || !to || to < from) return 0;
  let count = 0;
  const cur = new Date(from);
  const end = new Date(to);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

interface LeaveFormProps {
  user: User;
  onSubmit: (payload: {
    employeeId: string;
    employeeName: string;
    employeeAvatar: string;
    department: string;
    type: LeaveType;
    from: string;
    to: string;
    days: number;
    reason: string;
  }) => Promise<void>;
}

export function LeaveForm({ user, onSubmit }: LeaveFormProps) {
  const [type, setType] = useState<LeaveType>("Annual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const days = workingDays(from, to);
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (days === 0) { setError("Please select a valid date range."); return; }
    if (reason.trim().length < 10) { setError("Please provide a more detailed reason (at least 10 characters)."); return; }

    setLoading(true);
    try {
      await onSubmit({ employeeId: user.id, employeeName: user.name, employeeAvatar: user.avatar, department: user.department, type, from, to, days, reason: reason.trim() });
      setSuccess(true);
    } catch {
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setType("Annual"); setFrom(""); setTo(""); setReason(""); setSuccess(false); setError("");
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1" style={{ fontFamily: "var(--font-serif)" }}>Request Submitted</h3>
        <p className="text-slate-500 text-sm mb-1">Your {type} leave request for <strong>{days} day{days > 1 ? "s" : ""}</strong> has been sent for approval.</p>
        <p className="text-slate-400 text-xs mb-6">You will be notified once your manager reviews it.</p>
        <Button variant="secondary" onClick={reset}>Submit another request</Button>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors bg-white";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800" style={{ fontFamily: "var(--font-serif)" }}>Leave Application Form</h2>
        <p className="text-slate-500 text-xs mt-0.5">Applying as <strong>{user.name}</strong> · {user.department}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Leave type */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Leave Type <span className="text-red-400">*</span></label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {LEAVE_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all text-center
                  ${type === t ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Start Date <span className="text-red-400">*</span></label>
            <input type="date" value={from} min={today} onChange={e => { setFrom(e.target.value); if (to && to < e.target.value) setTo(""); }} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">End Date <span className="text-red-400">*</span></label>
            <input type="date" value={to} min={from || today} onChange={e => setTo(e.target.value)} required className={inputClass} />
          </div>
        </div>

        {/* Day count preview */}
        {days > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-lg">
            <span className="text-2xl font-bold text-indigo-700" style={{ fontFamily: "var(--font-mono)" }}>{days}</span>
            <div>
              <p className="text-indigo-700 text-sm font-medium">working day{days > 1 ? "s" : ""} requested</p>
              <p className="text-indigo-500 text-xs">Weekends excluded automatically</p>
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Reason <span className="text-red-400">*</span></label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            rows={4}
            placeholder="Describe the reason for your leave request..."
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs text-slate-400 mt-1">{reason.length} / 300 characters</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Button type="submit" variant="primary" loading={loading} className="flex-1">
            Submit Leave Request
          </Button>
          <Button type="button" variant="secondary" onClick={reset}>Clear</Button>
        </div>
      </form>
    </div>
  );
}
