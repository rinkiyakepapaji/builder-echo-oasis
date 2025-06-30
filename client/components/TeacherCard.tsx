import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  MapPin,
  School,
  BookOpen,
  UserPlus,
  UserMinus,
  CheckCircle,
} from "lucide-react";
import { Teacher } from "@shared/api";
import { cn } from "@/lib/utils";

interface TeacherCardProps {
  teacher: Teacher;
  isSelected?: boolean;
  onSelect?: (teacher: Teacher) => void;
  onRemove?: (teacher: Teacher) => void;
  showSelectButton?: boolean;
  className?: string;
}

export default function TeacherCard({
  teacher,
  isSelected = false,
  onSelect,
  onRemove,
  showSelectButton = true,
  className,
}: TeacherCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTeacherType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleCardClick = () => {
    if (showSelectButton && onSelect && !isSelected) {
      onSelect(teacher);
    }
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-lg cursor-pointer",
        isSelected && "ring-2 ring-primary bg-primary/5",
        isHovered && !isSelected && "shadow-md scale-[1.02]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-primary rounded-full p-1">
            <CheckCircle className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(teacher.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{teacher.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Phone className="h-3 w-3 mr-1" />
                +91 {teacher.phoneNumber}
              </CardDescription>
            </div>
          </div>
          {teacher.isVerified && (
            <Badge variant="secondary" className="bg-success/10 text-success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* School Information */}
        <div className="flex items-center text-sm text-muted-foreground">
          <School className="h-4 w-4 mr-2" />
          <span className="font-medium">{teacher.schoolName}</span>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          <span>
            {teacher.block}, {teacher.district}
          </span>
        </div>

        {/* Teacher Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{formatTeacherType(teacher.teacherType)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {showSelectButton && (
          <div className="pt-2">
            {isSelected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(teacher);
                }}
                className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Remove from Selection
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(teacher);
                }}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Select for Transfer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
