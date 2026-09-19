export type Role = "Employee" | "Manager";
export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";
export type LeaveType = "Annual" | "Sick" | "Personal" | "Maternity" | "Paternity" | "Unpaid";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar: string;
  managerId?: string;
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  pending: number;
  remaining: number;
  color: string;
  icon: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  type: LeaveType;
  status: LeaveStatus;
  from: string;
  to: string;
  days: number;
  reason: string;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  reviewNote?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
