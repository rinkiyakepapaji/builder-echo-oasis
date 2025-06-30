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

// Teacher selection - each teacher can select multiple others
export interface TeacherSelection {
  id: string;
  teacherId: string;
  selectedTeacherIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Transfer circle - automatically formed when mutual selections exist
export interface TransferCircle {
  id: string;
  circleNumber: number; // Circle 1, Circle 2, etc.
  teachers: Teacher[];
  status: "active" | "completed" | "expired";
  createdAt: Date;
  expiresAt: Date;
}

export interface DashboardResponse {
  teachers: Teacher[];
  mySelections: string[]; // IDs of teachers I've selected
  myCircles: TransferCircle[]; // Circles I'm part of
}

export interface SelectTeachersRequest {
  selectedTeacherIds: string[];
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
