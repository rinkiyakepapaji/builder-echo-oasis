import { NextRequest, NextResponse } from "next/server";
import { OTPVerificationRequest, APIResponse } from "@/shared/api";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body: OTPVerificationRequest = await request.json();
    const { phoneNumber, otp } = body;

    if (!phoneNumber || !otp) {
      const response: APIResponse = {
        success: false,
        message: "Phone number and OTP are required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const storedOTP = storage.getOTP(phoneNumber);
    if (!storedOTP || storedOTP.expires < new Date()) {
      const response: APIResponse = {
        success: false,
        message: "OTP expired or invalid",
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (storedOTP.otp !== otp) {
      const response: APIResponse = {
        success: false,
        message: "Invalid OTP",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Remove used OTP
    storage.deleteOTP(phoneNumber);

    // Generate token
    const token = storage.generateToken(phoneNumber);

    // Check if teacher exists
    const teacher = storage.getTeacherByPhone(phoneNumber);

    const response: APIResponse = {
      success: true,
      message: "OTP verified successfully",
      data: {
        token,
        teacher,
      },
    };

    // Set HTTP-only cookie for token
    const nextResponse = NextResponse.json(response);
    nextResponse.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return nextResponse;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
