import { useEffect, useState } from "react";
import type { LeaveRequest } from "../types";
import { fetchTeamRequests, approveLeave, rejectLeave } from "../data/mockData";
import { LeaveTable } from "../components/leaves/LeaveTable";
import { Spinner } from "../components/ui/Spinner";

export function TeamRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchTeamRequests().then(r => setRequests(r.data)).finally(() => setLoading(false));
  }, []);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleApprove(id: string) {
    setLoadingId(id);
    const res = await approveLeave(id);
    if (res.success) {
      setRequests(prev => prev.map(r => r.id === id ? res.data : r));
      showToast("Leave approved successfully.");
    } else {
      showToast(res.message, "error");
    }
    setLoadingId(null);
  }

  async function handleReject(id: string) {
    setLoadingId(id);
    const res = await rejectLeave(id, "Please coordinate with the team and reapply.");
    if (res.success) {
      setRequests(prev => prev.map(r => r.id === id ? res.data : r));
      showToast("Leave rejected.");
    } else {
      showToast(res.message, "error");
    }
    setLoadingId(null);
  }

  if (loading) return <Spinner />;

  const pending = requests.filter(r => r.status === "Pending");

  return (
    <div className="space-y-5">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 text-sm rounded-lg shadow-lg
          ${toast.type === "success" ? "bg-slate-900 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-serif)" }}>Team Leave Requests</h2>
        <p className="text-slate-500 text-sm mt-0.5">
          {pending.length > 0
            ? `${pending.length} request${pending.length > 1 ? "s" : ""} pending your review.`
            : "All requests have been reviewed."}
        </p>
      </div>

      <LeaveTable
        requests={requests}
        mode="manager"
        onApprove={handleApprove}
        onReject={handleReject}
        loadingId={loadingId}
      />
    </div>
  );
}
