import type { LeaveStatus, LeaveType } from "../../types";

const STATUS_MAP: Record<LeaveStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  Pending:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   label: "Pending" },
  Approved:  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", label: "Approved" },
  Rejected:  { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500",     label: "Rejected" },
  Cancelled: { bg: "bg-slate-50",   text: "text-slate-500",   border: "border-slate-200",   dot: "bg-slate-400",   label: "Cancelled" },
};

const TYPE_MAP: Record<LeaveType, string> = {
  Annual:    "bg-indigo-50 text-indigo-700",
  Sick:      "bg-emerald-50 text-emerald-700",
  Personal:  "bg-amber-50 text-amber-700",
  Maternity: "bg-pink-50 text-pink-700",
  Paternity: "bg-cyan-50 text-cyan-700",
  Unpaid:    "bg-slate-100 text-slate-600",
};

export function StatusBadge({ status }: { status: LeaveStatus }) {
  const c = STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function TypeBadge({ type }: { type: LeaveType }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${TYPE_MAP[type]}`}>
      {type}
    </span>
  );
}
