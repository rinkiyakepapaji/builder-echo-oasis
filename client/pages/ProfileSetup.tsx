import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  User,
  School,
  MapPin,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { ProfileSetupRequest, TeacherType, APIResponse } from "@shared/api";

const teacherTypes: { value: TeacherType; label: string }[] = [
  { value: "primary", label: "Primary Teacher (Class I-V)" },
  { value: "upper-primary", label: "Upper Primary Teacher (Class VI-VIII)" },
  { value: "secondary", label: "Secondary Teacher (Class IX-X)" },
  {
    value: "higher-secondary",
    label: "Higher Secondary Teacher (Class XI-XII)",
  },
  { value: "special-education", label: "Special Education Teacher" },
  { value: "physical-education", label: "Physical Education Teacher" },
  { value: "art-education", label: "Art Education Teacher" },
];

const districts = [
  "Araria",
  "Arwal",
  "Aurangabad",
  "Banka",
  "Begusarai",
  "Bhagalpur",
  "Bhojpur",
  "Buxar",
  "Darbhanga",
  "East Champaran",
  "Gaya",
  "Gopalganj",
  "Jamui",
  "Jehanabad",
  "Kaimur",
  "Katihar",
  "Khagaria",
  "Kishanganj",
  "Lakhisarai",
  "Madhepura",
  "Madhubani",
  "Munger",
  "Muzaffarpur",
  "Nalanda",
  "Nawada",
  "Patna",
  "Purnia",
  "Rohtas",
  "Saharsa",
  "Samastipur",
  "Saran",
  "Sheikhpura",
  "Sheohar",
  "Sitamarhi",
  "Siwan",
  "Supaul",
  "Vaishali",
  "West Champaran",
];

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    name: "",
    schoolName: "",
    teacherType: undefined as TeacherType | undefined,
    district: undefined as string | undefined,
    block: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.schoolName ||
      !formData.teacherType ||
      !formData.district ||
      !formData.block
    ) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const request: ProfileSetupRequest = {
        name: formData.name,
        schoolName: formData.schoolName,
        teacherType: formData.teacherType as TeacherType,
        district: formData.district,
        block: formData.block,
      };

      const response = await fetch("/api/auth/setup-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(request),
      });

      const data: APIResponse = await response.json();

      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Failed to setup profile");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-white/80 mt-2">
            Let's set up your teacher profile to get started
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">
              Teacher Information
            </CardTitle>
            <CardDescription>
              This information will be visible to other teachers for transfer
              coordination
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="border-destructive bg-destructive/10 mb-6">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* School Name */}
                <div className="space-y-2">
                  <Label htmlFor="school">School Name</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="school"
                      type="text"
                      placeholder="Enter your school name"
                      value={formData.schoolName}
                      onChange={(e) =>
                        setFormData({ ...formData, schoolName: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Teacher Type */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="teacherType">Teacher Type</Label>
                  <Select
                    value={formData.teacherType || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        teacherType: value as TeacherType,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select your teaching category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {teacherTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* District */}
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={formData.district || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, district: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select district" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Block */}
                <div className="space-y-2">
                  <Label htmlFor="block">Block</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="block"
                      type="text"
                      placeholder="Enter your block"
                      value={formData.block}
                      onChange={(e) =>
                        setFormData({ ...formData, block: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">
                      Privacy Notice
                    </p>
                    <p>
                      Your phone number will be visible to other teachers of the
                      same type to facilitate transfer coordination. Other
                      personal information remains private.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up profile...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
