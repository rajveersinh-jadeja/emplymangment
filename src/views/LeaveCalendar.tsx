import { useEffect, useState } from "react";
import type { LeaveRequest } from "../types";
import { fetchTeamRequests } from "../api/leaveApi";
import { Avatar } from "../components/ui/Avatar";
import { TypeBadge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export function LeaveCalendar() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date(2026, 8)); // Sept 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    fetchTeamRequests().then(r => setRequests(r.data.filter(req => req.status === "Approved"))).finally(() => setLoading(false));
  }, []);

  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();

  function leavesOn(day: number): LeaveRequest[] {
    const d = `${year}-${pad(mon + 1)}-${pad(day)}`;
    return requests.filter(r => r.from <= d && r.to >= d);
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === mon;
  const todayDay = isCurrentMonth ? today.getDate() : -1;

  const selectedLeaves = selectedDay ? leavesOn(selectedDay) : [];

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-serif)" }}>Leave Calendar</h2>
        <p className="text-slate-500 text-sm mt-0.5">Approved team leave, month by month.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => { setMonth(new Date(year, mon - 1)); setSelectedDay(null); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-sm"
            >‹</button>
            <h3 className="font-semibold text-slate-800">
              {month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </h3>
            <button
              onClick={() => { setMonth(new Date(year, mon + 1)); setSelectedDay(null); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-sm"
            >›</button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e${i}`} className="h-14 rounded" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const leaves = leavesOn(day);
                const isToday = day === todayDay;
                const isSelected = day === selectedDay;
                const isWeekend = new Date(year, mon, day).getDay() % 6 === 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`h-14 rounded-lg p-1 flex flex-col items-start text-left transition-all
                      ${isSelected ? "bg-indigo-50 ring-2 ring-indigo-400" : "hover:bg-slate-50"}
                      ${isWeekend ? "opacity-40" : ""}`}
                  >
                    <span className={`text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full mb-0.5
                      ${isToday ? "bg-indigo-600 text-white" : "text-slate-500"}`}>
                      {day}
                    </span>
                    {leaves.slice(0, 2).map(l => (
                      <span key={l.id} className="w-full text-xs truncate px-1 rounded bg-emerald-100 text-emerald-800 leading-tight mb-px text-center">
                        {l.employeeAvatar}
                      </span>
                    ))}
                    {leaves.length > 2 && (
                      <span className="text-xs text-slate-400 px-1">+{leaves.length - 2}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">
              {selectedDay
                ? `${selectedDay} ${month.toLocaleDateString("en-GB", { month: "long" })}`
                : "Select a date"}
            </h3>
          </div>

          {!selectedDay ? (
            <div className="py-12 text-center text-slate-400 text-sm px-4">
              Click on a day to see who is on leave.
            </div>
          ) : selectedLeaves.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm px-4">
              No approved leave on this day.
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {selectedLeaves.map(r => (
                <div key={r.id} className="px-4 py-3 flex items-start gap-3">
                  <Avatar initials={r.employeeAvatar} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{r.employeeName}</p>
                    <p className="text-xs text-slate-400 mb-1">{r.department}</p>
                    <TypeBadge type={r.type} />
                    <p className="text-xs text-slate-400 mt-1">{fmt(r.from)} – {fmt(r.to)} · {r.days}d</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-3.5 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">All On Leave This Month</h4>
            <div className="space-y-2">
              {requests
                .filter(r => {
                  const s = new Date(r.from), e = new Date(r.to);
                  return (s.getFullYear() === year && s.getMonth() === mon) ||
                    (e.getFullYear() === year && e.getMonth() === mon);
                })
                .slice(0, 5)
                .map(r => (
                  <div key={r.id} className="flex items-center gap-2">
                    <Avatar initials={r.employeeAvatar} size="xs" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{r.employeeName}</p>
                      <p className="text-xs text-slate-400">{fmt(r.from)} – {fmt(r.to)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
