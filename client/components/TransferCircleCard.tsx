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
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  School,
  MapPin,
} from "lucide-react";
import { TransferCircle } from "@shared/api";
import { cn } from "@/lib/utils";

interface TransferCircleCardProps {
  circle: TransferCircle;
  className?: string;
}

export default function TransferCircleCard({
  circle,
  className,
}: TransferCircleCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "completed":
        return "bg-primary/10 text-primary border-primary/20";
      case "expired":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "expired":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isExpiringSoon = () => {
    const daysUntilExpiry = Math.ceil(
      (new Date(circle.expiresAt).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-lg",
        circle.status === "active" && "border-success/20 bg-success/5",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Circle {circle.circleNumber}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              Created {formatDate(circle.createdAt)}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(circle.status)}>
            {getStatusIcon(circle.status)}
            <span className="ml-1 capitalize">{circle.status}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Circle Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{circle.teachers.length} Members</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Expires {formatDate(circle.expiresAt)}</span>
          </div>
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon() && circle.status === "active" && (
          <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            <span>Expires soon! Take action quickly.</span>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Circle Members:
          </h4>
          <div className="grid gap-2">
            {circle.teachers.map((teacher, index) => (
              <div
                key={teacher.id}
                className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(teacher.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{teacher.name}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {teacher.phoneNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {teacher.district}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action needed message */}
        {circle.status === "active" && (
          <div className="bg-info/10 text-info p-3 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5" />
              <div>
                <p className="font-medium">Circle is Active!</p>
                <p className="text-xs mt-1">
                  Contact your district education office to proceed with the
                  mutual transfer process for this circle.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
