import { Teacher } from "@shared/api";

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
