import { RequestHandler } from "express";
import { SelectTeachersRequest, APIResponse } from "@shared/api";
import { storage } from "../storage";

export const updateSelections: RequestHandler = async (req, res) => {
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

    const currentUser = storage.getTeacherByPhone(phoneNumber);
    if (!currentUser) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return res.status(404).json(response);
    }

    const { selectedTeacherIds }: SelectTeachersRequest = req.body;

    if (!Array.isArray(selectedTeacherIds)) {
      const response: APIResponse = {
        success: false,
        message: "Selected teacher IDs must be an array",
      };
      return res.status(400).json(response);
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
      return res.status(400).json(response);
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
      return res.status(400).json(response);
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

    res.json(response);
  } catch (error) {
    console.error("Error updating selections:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const getSelections: RequestHandler = async (req, res) => {
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

    const currentUser = storage.getTeacherByPhone(phoneNumber);
    if (!currentUser) {
      const response: APIResponse = {
        success: false,
        message: "Teacher not found",
      };
      return res.status(404).json(response);
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

    res.json(response);
  } catch (error) {
    console.error("Error getting selections:", error);
    const response: APIResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};
