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
import { storage } from "../storage";

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
    const otp = storage.generateOTP();
    storage.setOTP(phoneNumber, otp);

    // In real implementation, send OTP via SMS
    console.log(`📱 OTP for ${phoneNumber}: ${otp}`);

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

    const storedOTP = storage.getOTP(phoneNumber);
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

    const phoneNumber = storage.getPhoneByToken(token);
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

    // Add to storage
    storage.addTeacher(newTeacher);

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

    const phoneNumber = storage.getPhoneByToken(token);
    if (!phoneNumber) {
      const response: APIResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    const teacher = storage.getTeacherByPhone(phoneNumber);
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
