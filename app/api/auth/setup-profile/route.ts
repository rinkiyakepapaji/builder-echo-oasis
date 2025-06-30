import { NextRequest, NextResponse } from "next/server";
import { ProfileSetupRequest, Teacher, APIResponse } from "@/shared/api";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
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

    const body: ProfileSetupRequest = await request.json();
    const { name, schoolName, teacherType, district, block } = body;

    if (!name || !schoolName || !teacherType || !district || !block) {
      const response: APIResponse = {
        success: false,
        message: "All fields are required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Create new teacher
    const newTeacher: Teacher = {
      id: `teacher_${Date.now()}`,
      name,
      phoneNumber,
      schoolName,
      teacherType,
      district,
      block,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to storage
    storage.addTeacher(newTeacher);

    const response: APIResponse = {
      success: true,
      message: "Profile setup completed",
      data: newTeacher,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error setting up profile:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
