import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, APIResponse } from "@/shared/api";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber || phoneNumber.length !== 10) {
      const response: APIResponse = {
        success: false,
        message: "Invalid phone number",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Generate and store OTP
    const otp = storage.generateOTP();
    storage.setOTP(phoneNumber, otp);

    // In real implementation, send OTP via SMS
    console.log(`📱 OTP for ${phoneNumber}: ${otp}`);

    const response: APIResponse = {
      success: true,
      message: `OTP sent to ${phoneNumber}`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error sending OTP:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
