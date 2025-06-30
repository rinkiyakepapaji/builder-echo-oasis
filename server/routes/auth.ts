import { RequestHandler } from "express";
import {
  LoginRequest,
  LoginResponse,
  OTPVerificationRequest,
  ProfileSetupRequest,
  Teacher,
  TeacherType,
  APIResponse,
} from "@shared/api";

// Mock database - replace with real database
const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    phoneNumber: "9876543210",
    schoolName: "Govt. Primary School Patna",
    teacherType: "primary",
    district: "Patna",
    block: "Patna Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Priya Singh",
    phoneNumber: "9876543211",
    schoolName: "Govt. Middle School Gaya",
    teacherType: "upper-primary",
    district: "Gaya",
    block: "Gaya Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Amit Sharma",
    phoneNumber: "9876543212",
    schoolName: "Govt. High School Muzaffarpur",
    teacherType: "secondary",
    district: "Muzaffarpur",
    block: "Muzaffarpur Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock OTP storage - replace with Redis or database
const otpStorage: Record<string, { otp: string; expires: Date }> = {};

// Mock JWT tokens - replace with real JWT implementation
const mockTokens: Record<string, string> = {};

// Make these available globally
(global as any).mockTokens = mockTokens;
(global as any).mockTeachers = mockTeachers;

// Generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate mock token
function generateToken(phoneNumber: string): string {
  const token = `token_${phoneNumber}_${Date.now()}`;
  mockTokens[token] = phoneNumber;
  console.log(`Generated token: ${token} for phone: ${phoneNumber}`);
  return token;
}

// Verify token
function verifyToken(token: string): string | null {
  const phoneNumber = mockTokens[token];
  console.log(`Verifying token: ${token}, found phone: ${phoneNumber}`);
  return phoneNumber || null;
}

export const sendOTP: RequestHandler = async (req, res) => {
  try {
    const { phoneNumber }: LoginRequest = req.body;

    if (!phoneNumber || phoneNumber.length !== 10) {
      const response: APIResponse = {
        success: false,
        message: "Invalid phone number",
      };
      return res.status(400).json(response);
    }

    // Generate and store OTP
    const otp = generateOTP();
    otpStorage[phoneNumber] = {
      otp,
      expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    };

    // In real implementation, send OTP via SMS
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    const response: APIResponse = {
      success: true,
      message: `OTP sent to ${phoneNumber}`,
    };

    res.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const verifyOTP: RequestHandler = async (req, res) => {
  try {
    const { phoneNumber, otp }: OTPVerificationRequest = req.body;

    if (!phoneNumber || !otp) {
      const response: APIResponse = {
        success: false,
        message: "Phone number and OTP are required",
      };
      return res.status(400).json(response);
    }

    const storedOTP = otpStorage[phoneNumber];
    if (!storedOTP || storedOTP.expires < new Date()) {
      const response: APIResponse = {
        success: false,
        message: "OTP expired or invalid",
      };
      return res.status(400).json(response);
    }

    if (storedOTP.otp !== otp) {
      const response: APIResponse = {
        success: false,
        message: "Invalid OTP",
      };
      return res.status(400).json(response);
    }

    // Remove used OTP
    delete otpStorage[phoneNumber];

    // Generate token
    const token = generateToken(phoneNumber);

    // Check if teacher exists
    const teacher = mockTeachers.find((t) => t.phoneNumber === phoneNumber);

    const response: APIResponse = {
      success: true,
      message: "OTP verified successfully",
      data: {
        token,
        teacher,
      },
    };

    res.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const setupProfile: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      const response: APIResponse = {
        success: false,
        message: "Authorization token required",
      };
      return res.status(401).json(response);
    }

    const phoneNumber = verifyToken(token);
    if (!phoneNumber) {
      const response: APIResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const {
      name,
      schoolName,
      teacherType,
      district,
      block,
    }: ProfileSetupRequest = req.body;

    if (!name || !schoolName || !teacherType || !district || !block) {
      const response: APIResponse = {
        success: false,
        message: "All fields are required",
      };
      return res.status(400).json(response);
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

    // Add to mock database
    mockTeachers.push(newTeacher);

    const response: APIResponse = {
      success: true,
      message: "Profile setup completed",
      data: newTeacher,
    };

    res.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const getProfile: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      const response: APIResponse = {
        success: false,
        message: "Authorization token required",
      };
      return res.status(401).json(response);
    }

    const phoneNumber = verifyToken(token);
    if (!phoneNumber) {
      const response: APIResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const teacher = mockTeachers.find((t) => t.phoneNumber === phoneNumber);
    if (!teacher) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return res.status(404).json(response);
    }

    const response: APIResponse = {
      success: true,
      data: teacher,
    };

    res.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};
