import { useState } from "react";
import type { LeaveType, User } from "../types";
import { submitLeaveRequest } from "../api/leaveApi";
import { LeaveForm } from "../components/leaves/LeaveForm";

interface ApplyLeaveProps {
  user: User;
  onSuccess: () => void;
}

export function ApplyLeave({ user, onSuccess }: ApplyLeaveProps) {
  async function handleSubmit(payload: {
    employeeId: string;
    employeeName: string;
    employeeAvatar: string;
    department: string;
    type: LeaveType;
    from: string;
    to: string;
    days: number;
    reason: string;
  }) {
    const res = await submitLeaveRequest(payload);
    if (!res.success) throw new Error(res.message);
    setTimeout(onSuccess, 1500);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-serif)" }}>Apply for Leave</h2>
        <p className="text-slate-500 text-sm mt-0.5">Fill in the form below. Your manager will be notified automatically.</p>
      </div>
      <LeaveForm user={user} onSubmit={handleSubmit} />

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Policy Reminders</h4>
        <ul className="space-y-1 text-xs text-slate-500">
          <li>• Annual leave requests require at least 3 working days notice.</li>
          <li>• Sick leave must be supported by a medical certificate for absences over 2 days.</li>
          <li>• Unpaid leave requires HR approval in addition to manager approval.</li>
          <li>• Leave cannot be carried over beyond 5 days into the next year.</li>
        </ul>
      </div>
    </div>
  );
}
