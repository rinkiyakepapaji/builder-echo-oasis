import { NextRequest, NextResponse } from "next/server";
import { SelectTeachersRequest, APIResponse } from "@/shared/api";
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

    const currentUser = storage.getTeacherByPhone(phoneNumber);
    if (!currentUser) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const body: SelectTeachersRequest = await request.json();
    const { selectedTeacherIds } = body;

    if (!Array.isArray(selectedTeacherIds)) {
      const response: APIResponse = {
        success: false,
        message: "Selected teacher IDs must be an array",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate teacher IDs exist and are of same type
    const allTeachers = storage.getAllTeachers();
    const selectedTeachers = selectedTeacherIds
      .map((id) => allTeachers.find((t) => t.id === id))
      .filter(Boolean);

    if (selectedTeachers.length !== selectedTeacherIds.length) {
      const response: APIResponse = {
        success: false,
        message: "Some selected teachers not found",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if all selected teachers are of same type
    const invalidTypeTeachers = selectedTeachers.filter(
      (t) => t!.teacherType !== currentUser.teacherType,
    );

    if (invalidTypeTeachers.length > 0) {
      const response: APIResponse = {
        success: false,
        message: "All selected teachers must be of the same type",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Update selections (this will trigger circle detection)
    storage.updateTeacherSelections(currentUser.id, selectedTeacherIds);

    // Get updated data
    const mySelections = storage.getTeacherSelections(currentUser.id);
    const myCircles = storage.getCirclesForTeacher(currentUser.id);

    const response: APIResponse = {
      success: true,
      message: "Selections updated successfully",
      data: {
        mySelections,
        myCircles,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating selections:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

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

    const currentUser = storage.getTeacherByPhone(phoneNumber);
    if (!currentUser) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const mySelections = storage.getTeacherSelections(currentUser.id);
    const myCircles = storage.getCirclesForTeacher(currentUser.id);

    const response: APIResponse = {
      success: true,
      data: {
        mySelections,
        myCircles,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting selections:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
