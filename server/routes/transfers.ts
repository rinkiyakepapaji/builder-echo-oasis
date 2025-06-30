import { RequestHandler } from "express";
import { TransferCircle, Teacher, APIResponse } from "@shared/api";

// Mock database - replace with real database
let mockCircles: TransferCircle[] = [];

// Mock teachers database (same as other files - in real app, use shared DB)
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
  // Add more mock teachers as needed
];

// Access global mock data
const getMockTokens = () => (global as any).mockTokens || {};
const getMockTeachers = () => (global as any).mockTeachers || mockTeachers;

// Verify token
function verifyToken(token: string): string | null {
  const tokens = getMockTokens();
  return tokens[token] || null;
}

// Send notification (mock implementation)
async function sendNotifications(circle: TransferCircle) {
  console.log("=== TRANSFER CIRCLE NOTIFICATION ===");
  console.log(`Circle ID: ${circle.id}`);
  console.log(`Status: ${circle.status}`);
  console.log(`Created: ${circle.createdAt}`);
  console.log(`Expires: ${circle.expiresAt}`);
  console.log("Teachers in circle:");

  circle.teachers.forEach((teacher, index) => {
    console.log(
      `${index + 1}. ${teacher.name} - ${teacher.phoneNumber} (${teacher.schoolName})`,
    );
  });

  console.log("\n📧 Email notifications sent to all teachers");
  console.log("📱 WhatsApp notifications sent to all teachers");
  console.log("=====================================\n");

  // In real implementation:
  // - Send emails using services like SendGrid, AWS SES, etc.
  // - Send WhatsApp messages using services like Twilio, etc.
  // - Store notification logs in database
}

export const createCircle: RequestHandler = async (req, res) => {
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

    const { teacherIds }: { teacherIds: string[] } = req.body;

    if (!teacherIds || !Array.isArray(teacherIds)) {
      const response: APIResponse = {
        success: false,
        message: "Teacher IDs are required",
      };
      return res.status(400).json(response);
    }

    if (teacherIds.length < 1 || teacherIds.length > 9) {
      const response: APIResponse = {
        success: false,
        message: "Circle must have between 1-9 other teachers",
      };
      return res.status(400).json(response);
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

    // Get selected teachers
    const selectedTeachers = mockTeachers.filter((t) =>
      teacherIds.includes(t.id),
    );

    if (selectedTeachers.length !== teacherIds.length) {
      const response: APIResponse = {
        success: false,
        message: "Some teachers not found",
      };
      return res.status(400).json(response);
    }

    // Verify all teachers are of same type
    const allSameType = selectedTeachers.every(
      (t) => t.teacherType === currentUser.teacherType,
    );

    if (!allSameType) {
      const response: APIResponse = {
        success: false,
        message: "All teachers must be of the same type",
      };
      return res.status(400).json(response);
    }

    // Create transfer circle
    const circle: TransferCircle = {
      id: `circle_${Date.now()}`,
      teachers: [currentUser, ...selectedTeachers],
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Validate circle size (2-10 members including current user)
    if (circle.teachers.length < 2 || circle.teachers.length > 10) {
      const response: APIResponse = {
        success: false,
        message: "Circle must have between 2-10 members",
      };
      return res.status(400).json(response);
    }

    // Add to mock database
    mockCircles.push(circle);

    // Send notifications to all teachers
    await sendNotifications(circle);

    const response: APIResponse = {
      success: true,
      message: "Transfer circle created successfully",
      data: circle,
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

export const getCircles: RequestHandler = async (req, res) => {
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

    // Get circles that include current user
    const userCircles = mockCircles.filter((circle) =>
      circle.teachers.some((t) => t.id === currentUser.id),
    );

    const response: APIResponse = {
      success: true,
      data: userCircles,
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

export const updateCircleStatus: RequestHandler = async (req, res) => {
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

    const { circleId } = req.params;
    const { status }: { status: "confirmed" | "rejected" } = req.body;

    if (!status || !["confirmed", "rejected"].includes(status)) {
      const response: APIResponse = {
        success: false,
        message: "Valid status is required",
      };
      return res.status(400).json(response);
    }

    // Find circle
    const circle = mockCircles.find((c) => c.id === circleId);
    if (!circle) {
      const response: APIResponse = {
        success: false,
        message: "Circle not found",
      };
      return res.status(404).json(response);
    }

    // Verify user is part of the circle
    const currentUser = mockTeachers.find((t) => t.phoneNumber === phoneNumber);
    const isPartOfCircle = circle.teachers.some(
      (t) => t.phoneNumber === phoneNumber,
    );

    if (!isPartOfCircle) {
      const response: APIResponse = {
        success: false,
        message: "You are not part of this circle",
      };
      return res.status(403).json(response);
    }

    // Update circle status
    circle.status = status;

    const response: APIResponse = {
      success: true,
      message: `Circle ${status} successfully`,
      data: circle,
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
