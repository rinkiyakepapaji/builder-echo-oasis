import { NextRequest, NextResponse } from "next/server";
import { DashboardResponse, APIResponse } from "@/shared/api";
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

    // Get current user
    const currentUser = storage.getTeacherByPhone(phoneNumber);
    if (!currentUser) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Filter teachers of the same type
    const allTeachers = storage.getAllTeachers();
    const teachers = allTeachers.filter(
      (teacher) => teacher.teacherType === currentUser.teacherType,
    );

    // Get user's selections and circles
    const mySelections = storage.getTeacherSelections(currentUser.id);
    const myCircles = storage.getCirclesForTeacher(currentUser.id);

    const dashboardData: DashboardResponse = {
      teachers,
      mySelections,
      myCircles,
    };

    const response: APIResponse = {
      success: true,
      data: dashboardData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting dashboard:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
