import type { LeaveRequest, LeaveBalance, ApiResponse, LeaveStatus } from "../types";
import { LEAVE_REQUESTS, MY_LEAVE_REQUESTS, BALANCES } from "../data/mockData";

// Simulated REST API with network latency
const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

let _teamRequests: LeaveRequest[] = [...LEAVE_REQUESTS];
let _myRequests: LeaveRequest[] = [...MY_LEAVE_REQUESTS];
let _balances: LeaveBalance[] = BALANCES.map(b => ({ ...b }));

// GET /api/leaves/team
export async function fetchTeamRequests(): Promise<ApiResponse<LeaveRequest[]>> {
  await delay();
  return { success: true, data: [..._teamRequests], message: "OK" };
}

// GET /api/leaves/my
export async function fetchMyRequests(): Promise<ApiResponse<LeaveRequest[]>> {
  await delay();
  return { success: true, data: [..._myRequests], message: "OK" };
}

// GET /api/leaves/balance
export async function fetchBalances(): Promise<ApiResponse<LeaveBalance[]>> {
  await delay(250);
  return { success: true, data: [..._balances], message: "OK" };
}

// POST /api/leaves
export async function submitLeaveRequest(
  payload: Omit<LeaveRequest, "id" | "status" | "appliedOn">
): Promise<ApiResponse<LeaveRequest>> {
  await delay(600);
  const newRequest: LeaveRequest = {
    ...payload,
    id: `lr${Date.now()}`,
    status: "Pending",
    appliedOn: new Date().toISOString().slice(0, 10),
  };
  _myRequests = [newRequest, ..._myRequests];
  _teamRequests = [newRequest, ..._teamRequests];

  // Deduct pending days from balance
  _balances = _balances.map(b =>
    b.type === payload.type ? { ...b, pending: b.pending + payload.days, remaining: b.remaining - payload.days } : b
  );

  return { success: true, data: newRequest, message: "Leave request submitted successfully" };
}

// PATCH /api/leaves/:id/approve
export async function approveLeave(id: string, reviewNote?: string): Promise<ApiResponse<LeaveRequest>> {
  await delay(500);
  let updated: LeaveRequest | undefined;
  _teamRequests = _teamRequests.map(r => {
    if (r.id === id) {
      updated = { ...r, status: "Approved", reviewedBy: "Sarah Mitchell", reviewedOn: new Date().toISOString().slice(0, 10), reviewNote };
      return updated;
    }
    return r;
  });
  if (!updated) return { success: false, data: null as any, message: "Request not found" };
  return { success: true, data: updated, message: "Leave approved" };
}

// PATCH /api/leaves/:id/reject
export async function rejectLeave(id: string, reviewNote?: string): Promise<ApiResponse<LeaveRequest>> {
  await delay(500);
  let updated: LeaveRequest | undefined;
  _teamRequests = _teamRequests.map(r => {
    if (r.id === id) {
      updated = { ...r, status: "Rejected", reviewedBy: "Sarah Mitchell", reviewedOn: new Date().toISOString().slice(0, 10), reviewNote };
      return updated;
    }
    return r;
  });
  if (!updated) return { success: false, data: null as any, message: "Request not found" };

  // Restore balance if rejected
  _balances = _balances.map(b =>
    b.type === updated!.type ? { ...b, pending: Math.max(0, b.pending - updated!.days), remaining: b.remaining + updated!.days } : b
  );

  return { success: true, data: updated, message: "Leave rejected" };
}

// PATCH /api/leaves/:id/cancel
export async function cancelLeave(id: string): Promise<ApiResponse<LeaveRequest>> {
  await delay(400);
  let updated: LeaveRequest | undefined;
  _myRequests = _myRequests.map(r => {
    if (r.id === id && r.status === "Pending") {
      updated = { ...r, status: "Cancelled" };
      return updated;
    }
    return r;
  });
  _teamRequests = _teamRequests.map(r => (r.id === id ? { ...r, status: "Cancelled" } : r));

  if (!updated) return { success: false, data: null as any, message: "Cannot cancel this request" };

  _balances = _balances.map(b =>
    b.type === updated!.type ? { ...b, pending: Math.max(0, b.pending - updated!.days), remaining: b.remaining + updated!.days } : b
  );

  return { success: true, data: updated, message: "Request cancelled" };
}
