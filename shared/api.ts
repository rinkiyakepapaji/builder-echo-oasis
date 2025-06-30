/**
 * Shared types between client and server for Teacher Transfer Platform
 */

export interface Teacher {
  id: string;
  name: string;
  phoneNumber: string;
  schoolName: string;
  teacherType: TeacherType;
  district: string;
  block: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TeacherType =
  | "primary"
  | "upper-primary"
  | "secondary"
  | "higher-secondary"
  | "special-education"
  | "physical-education"
  | "art-education";

export interface LoginRequest {
  phoneNumber: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  teacher?: Teacher;
}

export interface OTPVerificationRequest {
  phoneNumber: string;
  otp: string;
}

export interface ProfileSetupRequest {
  name: string;
  schoolName: string;
  teacherType: TeacherType;
  district: string;
  block: string;
}

export interface TransferRequest {
  fromTeacherId: string;
  toTeacherIds: string[];
}

export interface TransferCircle {
  id: string;
  teachers: Teacher[];
  status: "pending" | "confirmed" | "rejected";
  createdAt: Date;
  expiresAt: Date;
}

export interface DashboardResponse {
  teachers: Teacher[];
  activeCircles: TransferCircle[];
  pendingRequests: TransferRequest[];
}

export interface NotificationRequest {
  circleId: string;
  type: "email" | "whatsapp" | "both";
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
