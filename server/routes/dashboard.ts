import { RequestHandler } from "express";
import { Teacher, DashboardResponse, APIResponse } from "@shared/api";
import { storage } from "../storage";

export const getDashboard: RequestHandler = async (req, res) => {
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

    // Get current user
    const currentUser = storage.getTeacherByPhone(phoneNumber);
    if (!currentUser) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return res.status(404).json(response);
    }

    // Filter teachers of the same type
    const allTeachers = storage.getAllTeachers();
    const teachers = allTeachers.filter(
      (teacher) => teacher.teacherType === currentUser.teacherType,
    );

    const dashboardData: DashboardResponse = {
      teachers,
      activeCircles: [],
      pendingRequests: [],
    };

    const response: APIResponse = {
      success: true,
      data: dashboardData,
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
