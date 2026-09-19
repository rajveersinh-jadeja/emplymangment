import type { LeaveBalance } from "../../types";

interface BalanceCardProps {
  balance: LeaveBalance;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const pct = balance.total > 0 ? Math.round((balance.remaining / balance.total) * 100) : 0;
  const usedPct = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;
  const pendingPct = balance.total > 0 ? (balance.pending / balance.total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-lg">{balance.icon}</span>
          <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">{balance.type}</p>
        </div>
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: balance.color }}
        >
          {balance.remaining}
        </span>
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div className="h-full flex">
          <div className="h-full rounded-full transition-all" style={{ width: `${usedPct}%`, backgroundColor: balance.color, opacity: 0.35 }} />
          <div className="h-full transition-all" style={{ width: `${pendingPct}%`, backgroundColor: balance.color, opacity: 0.6 }} />
          <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: balance.color }} />
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-400">
        <span>{balance.remaining} remaining</span>
        <span>{balance.used} used · {balance.total} total</span>
      </div>

      {balance.pending > 0 && (
        <p className="text-xs text-amber-600 mt-1.5 font-medium">{balance.pending} day{balance.pending > 1 ? "s" : ""} pending approval</p>
      )}
    </div>
  );
}
