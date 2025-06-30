import { Teacher, TeacherSelection, TransferCircle } from "@shared/api";

// Shared storage for mock data - replace with real database in production
export class MockStorage {
  private static instance: MockStorage;
  private tokens: Record<string, string> = {};
  private teachers: Teacher[] = [
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
  private otpStorage: Record<string, { otp: string; expires: Date }> = {};
  private teacherSelections: TeacherSelection[] = [];
  private transferCircles: TransferCircle[] = [];
  private circleCounter = 0;

  public static getInstance(): MockStorage {
    if (!MockStorage.instance) {
      MockStorage.instance = new MockStorage();
    }
    return MockStorage.instance;
  }

  // Token methods
  public setToken(token: string, phoneNumber: string): void {
    this.tokens[token] = phoneNumber;
    console.log(`🔑 Token stored: ${token} -> ${phoneNumber}`);
  }

  public getPhoneByToken(token: string): string | null {
    const phone = this.tokens[token];
    console.log(`🔍 Token lookup: ${token} -> ${phone || "not found"}`);
    return phone || null;
  }

  public deleteToken(token: string): void {
    delete this.tokens[token];
  }

  // Teacher methods
  public getAllTeachers(): Teacher[] {
    return this.teachers;
  }

  public getTeacherByPhone(phoneNumber: string): Teacher | undefined {
    return this.teachers.find((t) => t.phoneNumber === phoneNumber);
  }

  public getTeacherById(id: string): Teacher | undefined {
    return this.teachers.find((t) => t.id === id);
  }

  public addTeacher(teacher: Teacher): void {
    this.teachers.push(teacher);
    console.log(`👨‍🏫 Teacher added: ${teacher.name} (${teacher.phoneNumber})`);
  }

  public updateTeacher(id: string, updates: Partial<Teacher>): Teacher | null {
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.teachers[index] = { ...this.teachers[index], ...updates };
    return this.teachers[index];
  }

  // Teacher Selection methods
  public updateTeacherSelections(
    teacherId: string,
    selectedTeacherIds: string[],
  ): void {
    // Remove existing selections for this teacher
    this.teacherSelections = this.teacherSelections.filter(
      (s) => s.teacherId !== teacherId,
    );

    // Add new selection
    if (selectedTeacherIds.length > 0) {
      const selection: TeacherSelection = {
        id: `selection_${Date.now()}_${Math.random()}`,
        teacherId,
        selectedTeacherIds,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.teacherSelections.push(selection);
      console.log(
        `✅ Selections updated for teacher ${teacherId}: ${selectedTeacherIds.length} teachers selected`,
      );
    }

    // Check for new circles after updating selections
    this.detectAndCreateCircles();
  }

  public getTeacherSelections(teacherId: string): string[] {
    const selection = this.teacherSelections.find(
      (s) => s.teacherId === teacherId,
    );
    return selection ? selection.selectedTeacherIds : [];
  }

  // Circle detection and management
  private detectAndCreateCircles(): void {
    const potentialCircles = this.findMutualSelectionGroups();

    potentialCircles.forEach((teacherIds) => {
      // Check if this circle already exists
      const existingCircle = this.transferCircles.find(
        (circle) =>
          circle.teachers.length === teacherIds.length &&
          teacherIds.every((id) => circle.teachers.some((t) => t.id === id)),
      );

      if (!existingCircle) {
        this.createTransferCircle(teacherIds);
      }
    });
  }

  private findMutualSelectionGroups(): string[][] {
    const groups: string[][] = [];
    const visited = new Set<string>();

    // Get all teachers who have made selections
    const activeTeachers = this.teacherSelections.map((s) => s.teacherId);

    for (const teacherId of activeTeachers) {
      if (visited.has(teacherId)) continue;

      const group = this.findConnectedGroup(teacherId, new Set());

      // Only consider groups of 2-10 members
      if (group.size >= 2 && group.size <= 10) {
        const groupArray = Array.from(group);

        // Check if this is a valid mutual selection group
        if (this.isValidMutualGroup(groupArray)) {
          groups.push(groupArray);
          groupArray.forEach((id) => visited.add(id));
        }
      }
    }

    return groups;
  }

  private findConnectedGroup(
    teacherId: string,
    visited: Set<string>,
  ): Set<string> {
    visited.add(teacherId);
    const group = new Set([teacherId]);

    const selections = this.getTeacherSelections(teacherId);

    for (const selectedId of selections) {
      // Check if selected teacher also selected this teacher (mutual)
      const mutualSelections = this.getTeacherSelections(selectedId);
      if (mutualSelections.includes(teacherId)) {
        group.add(selectedId);

        // Recursively find connected teachers
        if (!visited.has(selectedId)) {
          const connectedGroup = this.findConnectedGroup(selectedId, visited);
          connectedGroup.forEach((id) => group.add(id));
        }
      }
    }

    return group;
  }

  private isValidMutualGroup(teacherIds: string[]): boolean {
    // Check if all teachers in the group have mutually selected each other
    for (let i = 0; i < teacherIds.length; i++) {
      const teacherId = teacherIds[i];
      const selections = this.getTeacherSelections(teacherId);

      // Check if this teacher selected all other teachers in the group
      const otherTeachers = teacherIds.filter((id) => id !== teacherId);
      const hasSelectedAll = otherTeachers.every((otherId) =>
        selections.includes(otherId),
      );

      if (!hasSelectedAll) return false;
    }

    return true;
  }

  private createTransferCircle(teacherIds: string[]): void {
    const teachers = teacherIds
      .map((id) => this.getTeacherById(id))
      .filter(Boolean) as Teacher[];

    if (teachers.length !== teacherIds.length) {
      console.error("Some teachers not found when creating circle");
      return;
    }

    this.circleCounter++;

    const circle: TransferCircle = {
      id: `circle_${Date.now()}_${Math.random()}`,
      circleNumber: this.circleCounter,
      teachers,
      status: "active",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    this.transferCircles.push(circle);

    console.log(
      `🎯 New transfer circle created: Circle ${circle.circleNumber} with ${teachers.length} teachers`,
    );
    console.log(`Members: ${teachers.map((t) => t.name).join(", ")}`);

    // Send notifications
    this.sendCircleNotifications(circle);
  }

  private sendCircleNotifications(circle: TransferCircle): void {
    console.log(`🔔 CIRCLE ${circle.circleNumber} FORMED! 🔔`);
    console.log(`📅 Created: ${circle.createdAt.toLocaleString()}`);
    console.log(`👥 Members (${circle.teachers.length}):`);
    circle.teachers.forEach((teacher, index) => {
      console.log(
        `  ${index + 1}. ${teacher.name} - ${teacher.phoneNumber} (${teacher.schoolName})`,
      );
    });
    console.log(`📧 Email & WhatsApp notifications sent to all members`);
    console.log(`⏰ Circle expires: ${circle.expiresAt.toLocaleDateString()}`);
    console.log("═".repeat(60));
  }

  public getCirclesForTeacher(teacherId: string): TransferCircle[] {
    return this.transferCircles.filter((circle) =>
      circle.teachers.some((teacher) => teacher.id === teacherId),
    );
  }

  public getAllCircles(): TransferCircle[] {
    return this.transferCircles;
  }

  // OTP methods
  public setOTP(phoneNumber: string, otp: string, expiresInMinutes = 5): void {
    this.otpStorage[phoneNumber] = {
      otp,
      expires: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    };
    console.log(`📱 OTP stored for ${phoneNumber}: ${otp}`);
  }

  public getOTP(phoneNumber: string): { otp: string; expires: Date } | null {
    return this.otpStorage[phoneNumber] || null;
  }

  public deleteOTP(phoneNumber: string): void {
    delete this.otpStorage[phoneNumber];
  }

  // Utility methods
  public generateToken(phoneNumber: string): string {
    const token = `token_${phoneNumber}_${Date.now()}_${Math.random()}`;
    this.setToken(token, phoneNumber);
    return token;
  }

  public generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

// Export singleton instance
export const storage = MockStorage.getInstance();
