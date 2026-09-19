import type { User, LeaveRequest, LeaveBalance, LeaveType } from "../types";

export const USERS: User[] = [
  { id: "u1", name: "Sarah Mitchell", email: "sarah.mitchell@acme.com", role: "Manager", department: "Engineering", avatar: "SM" },
  { id: "u2", name: "James Okafor", email: "james.okafor@acme.com", role: "Employee", department: "Design", avatar: "JO", managerId: "u1" },
  { id: "u3", name: "Priya Nair", email: "priya.nair@acme.com", role: "Employee", department: "Engineering", avatar: "PN", managerId: "u1" },
  { id: "u4", name: "Lucas Ferreira", email: "lucas.ferreira@acme.com", role: "Employee", department: "Marketing", avatar: "LF", managerId: "u1" },
  { id: "u5", name: "Amara Diallo", email: "amara.diallo@acme.com", role: "Employee", department: "Engineering", avatar: "AD", managerId: "u1" },
  { id: "u6", name: "Chen Wei", email: "chen.wei@acme.com", role: "Employee", department: "Finance", avatar: "CW", managerId: "u1" },
  { id: "u7", name: "Rohan Mehta", email: "rohan.mehta@acme.com", role: "Employee", department: "Engineering", avatar: "RM", managerId: "u1" },
  { id: "u8", name: "Fatima Al-Hassan", email: "fatima.alhassan@acme.com", role: "Employee", department: "HR", avatar: "FH", managerId: "u1" },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "lr1", employeeId: "u2", employeeName: "James Okafor", employeeAvatar: "JO", department: "Design", type: "Annual", status: "Pending", from: "2026-09-22", to: "2026-09-26", days: 5, reason: "Family vacation to Portugal", appliedOn: "2026-09-15" },
  { id: "lr2", employeeId: "u3", employeeName: "Priya Nair", employeeAvatar: "PN", department: "Engineering", type: "Sick", status: "Approved", from: "2026-09-19", to: "2026-09-20", days: 2, reason: "Flu and fever, doctor confirmed", appliedOn: "2026-09-18", reviewedBy: "Sarah Mitchell", reviewedOn: "2026-09-18", reviewNote: "Approved. Get well soon!" },
  { id: "lr3", employeeId: "u4", employeeName: "Lucas Ferreira", employeeAvatar: "LF", department: "Marketing", type: "Personal", status: "Approved", from: "2026-10-03", to: "2026-10-03", days: 1, reason: "Bank appointment and administrative errands", appliedOn: "2026-09-17", reviewedBy: "Sarah Mitchell", reviewedOn: "2026-09-17" },
  { id: "lr4", employeeId: "u5", employeeName: "Amara Diallo", employeeAvatar: "AD", department: "Engineering", type: "Annual", status: "Rejected", from: "2026-10-06", to: "2026-10-10", days: 5, reason: "Attending a wedding abroad", appliedOn: "2026-09-10", reviewedBy: "Sarah Mitchell", reviewedOn: "2026-09-11", reviewNote: "Rejected due to project deadline. Please reschedule." },
  { id: "lr5", employeeId: "u6", employeeName: "Chen Wei", employeeAvatar: "CW", department: "Finance", type: "Maternity", status: "Pending", from: "2026-10-15", to: "2026-12-31", days: 77, reason: "Scheduled maternity leave", appliedOn: "2026-09-12" },
  { id: "lr6", employeeId: "u7", employeeName: "Rohan Mehta", employeeAvatar: "RM", department: "Engineering", type: "Annual", status: "Pending", from: "2026-09-29", to: "2026-10-01", days: 3, reason: "Short break and family time", appliedOn: "2026-09-16" },
  { id: "lr7", employeeId: "u8", employeeName: "Fatima Al-Hassan", employeeAvatar: "FH", department: "HR", type: "Sick", status: "Approved", from: "2026-09-20", to: "2026-09-21", days: 2, reason: "Post-surgery follow-up checkup", appliedOn: "2026-09-19", reviewedBy: "Sarah Mitchell", reviewedOn: "2026-09-19" },
  { id: "lr8", employeeId: "u3", employeeName: "Priya Nair", employeeAvatar: "PN", department: "Engineering", type: "Annual", status: "Cancelled", from: "2026-08-01", to: "2026-08-05", days: 5, reason: "Holiday trip (cancelled)", appliedOn: "2026-07-20" },
];

export const MY_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "my1", employeeId: "u1", employeeName: "Sarah Mitchell", employeeAvatar: "SM", department: "Engineering", type: "Annual", status: "Approved", from: "2026-08-11", to: "2026-08-15", days: 5, reason: "Summer holiday in Greece", appliedOn: "2026-07-28", reviewedBy: "Director", reviewedOn: "2026-07-29" },
  { id: "my2", employeeId: "u1", employeeName: "Sarah Mitchell", employeeAvatar: "SM", department: "Engineering", type: "Sick", status: "Approved", from: "2026-09-02", to: "2026-09-02", days: 1, reason: "Severe migraine", appliedOn: "2026-09-02", reviewedBy: "Director", reviewedOn: "2026-09-02" },
  { id: "my3", employeeId: "u1", employeeName: "Sarah Mitchell", employeeAvatar: "SM", department: "Engineering", type: "Personal", status: "Pending", from: "2026-10-07", to: "2026-10-07", days: 1, reason: "Apartment move", appliedOn: "2026-09-18" },
];

export const LEAVE_TYPES: LeaveType[] = ["Annual", "Sick", "Personal", "Maternity", "Paternity", "Unpaid"];

export const BALANCES: LeaveBalance[] = [
  { type: "Annual", total: 20, used: 8, pending: 0, remaining: 12, color: "#4f46e5", icon: "🌴" },
  { type: "Sick", total: 10, used: 2, pending: 0, remaining: 8, color: "#059669", icon: "🏥" },
  { type: "Personal", total: 5, used: 1, pending: 1, remaining: 3, color: "#d97706", icon: "👤" },
  { type: "Maternity", total: 90, used: 0, pending: 0, remaining: 90, color: "#db2777", icon: "👶" },
  { type: "Paternity", total: 14, used: 0, pending: 0, remaining: 14, color: "#0891b2", icon: "👨‍👧" },
  { type: "Unpaid", total: 30, used: 0, pending: 0, remaining: 30, color: "#64748b", icon: "💼" },
];
