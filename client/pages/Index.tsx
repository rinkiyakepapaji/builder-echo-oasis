import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <div className="text-center text-white">
        <svg
          className="animate-spin h-8 w-8 text-white mx-auto mb-4"
          viewBox="0 0 50 50"
        >
          <circle
            className="opacity-30"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
          />
          <circle
            className="text-white"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset="75"
          />
        </svg>
        <p className="text-white/80">Loading TeacherConnect...</p>
      </div>
    </div>
  );
}
