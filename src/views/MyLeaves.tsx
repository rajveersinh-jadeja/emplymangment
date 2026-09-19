import { useEffect, useState } from "react";
import type { LeaveRequest, LeaveBalance, User } from "../types";
import { fetchMyRequests, fetchBalances, cancelLeave } from "../data/mockData";
import { BalanceCard } from "../components/leaves/BalanceCard";
import { LeaveTable } from "../components/leaves/LeaveTable";
import { Spinner } from "../components/ui/Spinner";

interface MyLeavesProps {
  user: User;
}

export function MyLeaves({ user }: MyLeavesProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    Promise.all([fetchMyRequests(), fetchBalances()]).then(([r, b]) => {
      setRequests(r.data); setBalances(b.data);
    }).finally(() => setLoading(false));
  }, []);

  async function handleCancel(id: string) {
    setLoadingId(id);
    const res = await cancelLeave(id);
    if (res.success) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Cancelled" } : r));
      const updated = await fetchBalances();
      setBalances(updated.data);
      setToast("Request cancelled.");
      setTimeout(() => setToast(""), 3000);
    }
    setLoadingId(null);
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-slate-900 text-white text-sm rounded-lg shadow-lg animate-in">
          {toast}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-serif)" }}>My Leave Balance</h2>
        <p className="text-slate-500 text-sm mt-0.5">Your entitlements for the current leave year.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {balances.map(b => <BalanceCard key={b.type} balance={b} />)}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "var(--font-serif)" }}>My Leave History</h2>
        <p className="text-slate-500 text-sm mb-4">All your leave applications for this year.</p>
        <LeaveTable
          requests={requests}
          mode="employee"
          onCancel={handleCancel}
          loadingId={loadingId}
        />
      </div>
    </div>
  );
}
