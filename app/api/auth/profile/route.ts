import { NextRequest, NextResponse } from "next/server";
import { APIResponse } from "@/shared/api";
import { storage } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("auth-token")?.value;

    if (!token) {
      const response: APIResponse = {
        success: false,
        message: "Authorization token required",
      };
      return NextResponse.json(response, { status: 401 });
    }

    const phoneNumber = storage.getPhoneByToken(token);
    if (!phoneNumber) {
      const response: APIResponse = {
        success: false,
        message: "Invalid token",
      };
      return NextResponse.json(response, { status: 401 });
    }

    const teacher = storage.getTeacherByPhone(phoneNumber);
    if (!teacher) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: APIResponse = {
      success: true,
      data: teacher,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting profile:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
