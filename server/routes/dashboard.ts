import { RequestHandler } from "express";
import { Teacher, DashboardResponse, APIResponse } from "@shared/api";

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
    teacherType: "primary",
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
    teacherType: "primary",
    district: "Muzaffarpur",
    block: "Muzaffarpur Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Sunita Devi",
    phoneNumber: "9876543213",
    schoolName: "Govt. Primary School Bhagalpur",
    teacherType: "primary",
    district: "Bhagalpur",
    block: "Bhagalpur Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Ramesh Yadav",
    phoneNumber: "9876543214",
    schoolName: "Govt. Middle School Darbhanga",
    teacherType: "primary",
    district: "Darbhanga",
    block: "Darbhanga Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Geeta Kumari",
    phoneNumber: "9876543215",
    schoolName: "Govt. Primary School Sitamarhi",
    teacherType: "primary",
    district: "Sitamarhi",
    block: "Sitamarhi Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Vikash Kumar",
    phoneNumber: "9876543216",
    schoolName: "Govt. Middle School Begusarai",
    teacherType: "upper-primary",
    district: "Begusarai",
    block: "Begusarai Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    name: "Kavita Singh",
    phoneNumber: "9876543217",
    schoolName: "Govt. Middle School Samastipur",
    teacherType: "upper-primary",
    district: "Samastipur",
    block: "Samastipur Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    name: "Manoj Jha",
    phoneNumber: "9876543218",
    schoolName: "Govt. High School Madhubani",
    teacherType: "secondary",
    district: "Madhubani",
    block: "Madhubani Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    name: "Renu Sharma",
    phoneNumber: "9876543219",
    schoolName: "Govt. High School Vaishali",
    teacherType: "secondary",
    district: "Vaishali",
    block: "Vaishali Sadar",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock JWT tokens - replace with real JWT implementation
const mockTokens: Record<string, string> = {};

// Verify token
function verifyToken(token: string): string | null {
  return mockTokens[token] || null;
}

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

    const phoneNumber = verifyToken(token);
    if (!phoneNumber) {
      const response: APIResponse = {
        success: false,
        message: "Invalid token",
      };
      return res.status(401).json(response);
    }

    // Get current user
    const currentUser = mockTeachers.find((t) => t.phoneNumber === phoneNumber);
    if (!currentUser) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return res.status(404).json(response);
    }

    // Filter teachers of the same type
    const teachers = mockTeachers.filter(
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
