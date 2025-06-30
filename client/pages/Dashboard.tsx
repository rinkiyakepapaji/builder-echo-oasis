import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  Users,
  LogOut,
  User,
  Bell,
  ArrowRight,
  MapPin,
  School,
  RefreshCw,
  Phone,
} from "lucide-react";
import TeacherCard from "@/components/TeacherCard";
import { Teacher, DashboardResponse, APIResponse } from "@shared/api";

export default function Dashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentUser, setCurrentUser] = useState<Teacher | null>(null);
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: APIResponse<DashboardResponse> = await response.json();

      if (data.success && data.data) {
        setTeachers(data.data.teachers);
        // Get current user from token or separate endpoint
        fetchCurrentUser();
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: APIResponse<Teacher> = await response.json();
      if (data.success && data.data) {
        setCurrentUser(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch current user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSelectTeacher = (teacher: Teacher) => {
    if (selectedTeachers.length >= 9) {
      setError("Maximum 9 teachers can be selected for a transfer circle");
      return;
    }

    if (teacher.id === currentUser?.id) {
      setError("You cannot select yourself for transfer");
      return;
    }

    setSelectedTeachers([...selectedTeachers, teacher]);
    setError("");
  };

  const handleRemoveTeacher = (teacher: Teacher) => {
    setSelectedTeachers(selectedTeachers.filter((t) => t.id !== teacher.id));
  };

  const handleCreateCircle = async () => {
    if (selectedTeachers.length < 1) {
      setError("Please select at least 1 other teacher");
      return;
    }

    if (selectedTeachers.length > 9) {
      setError("Maximum 9 teachers allowed in a circle");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/transfers/create-circle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teacherIds: selectedTeachers.map((t) => t.id),
        }),
      });

      const data: APIResponse = await response.json();

      if (data.success) {
        setSelectedTeachers([]);
        setError("");
        // Show success message or navigate to circles page
        alert(
          "Transfer circle created successfully! All members will be notified.",
        );
      } else {
        setError(data.message || "Failed to create transfer circle");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    if (teacher.id === currentUser?.id) return false;
    if (teacher.teacherType !== currentUser?.teacherType) return false;

    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phoneNumber.includes(searchTerm);

    const matchesDistrict =
      !districtFilter || teacher.district === districtFilter;

    return matchesSearch && matchesDistrict;
  });

  const uniqueDistricts = Array.from(
    new Set(teachers.map((t) => t.district)),
  ).sort();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-2">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TeacherConnect</h1>
                <p className="text-primary-foreground/80 text-sm">
                  Teacher Transfer Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/20 text-primary-foreground">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-primary-foreground/80">
                      {currentUser.schoolName}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Find Teachers
                </CardTitle>
                <CardDescription>
                  Search for teachers of your type (
                  {currentUser?.teacherType.replace("-", " ")}) for mutual
                  transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, school, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={districtFilter}
                    onValueChange={setDistrictFilter}
                  >
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by district" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Districts</SelectItem>
                      {uniqueDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert className="border-destructive bg-destructive/10">
                    <AlertDescription className="text-destructive">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Teachers List */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    isSelected={selectedTeachers.some(
                      (t) => t.id === teacher.id,
                    )}
                    onSelect={handleSelectTeacher}
                    onRemove={handleRemoveTeacher}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No teachers found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || districtFilter
                      ? "Try adjusting your search criteria"
                      : "No other teachers of your type are currently registered"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Selected Teachers */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Transfer Circle</span>
                  <Badge variant="secondary">
                    {selectedTeachers.length + 1}/10
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Selected teachers for mutual transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current User */}
                {currentUser && (
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">You</p>
                    </div>
                  </div>
                )}

                {/* Selected Teachers */}
                {selectedTeachers.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTeachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {teacher.phoneNumber}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTeacher(teacher)}
                          className="text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No teachers selected</p>
                  </div>
                )}

                {selectedTeachers.length > 0 && (
                  <Button
                    onClick={handleCreateCircle}
                    className="w-full"
                    disabled={selectedTeachers.length < 1}
                  >
                    Create Transfer Circle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Minimum 2 members (including you)</p>
                  <p>• Maximum 10 members total</p>
                  <p>• All members will be notified</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
