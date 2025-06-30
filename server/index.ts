import express from "express";
import cors from "cors";
import { sendOTP, verifyOTP, setupProfile, getProfile } from "./routes/auth";
import { getDashboard } from "./routes/dashboard";
import { updateSelections, getSelections } from "./routes/selections";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/ping", (req, res) => {
    res.json({ message: "TeacherConnect API is running!" });
  });

  // Authentication routes
  app.post("/api/auth/send-otp", sendOTP);
  app.post("/api/auth/verify-otp", verifyOTP);
  app.post("/api/auth/setup-profile", setupProfile);
  app.get("/api/auth/profile", getProfile);

  // Dashboard routes
  app.get("/api/dashboard", getDashboard);

  // Teacher selection routes
  app.post("/api/selections", updateSelections);
  app.get("/api/selections", getSelections);

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`🚀 TeacherConnect server running on port ${port}`);
    console.log(`📱 API available at http://localhost:${port}/api`);
  });
}
