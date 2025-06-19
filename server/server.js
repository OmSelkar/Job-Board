import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";

import router from "./routes/companyRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { verifyJwt } from "./middlewares/verifyJwt.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";

// Initialize Express
const app = express();

// Connect to database
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// FIXED: Separate authentication routes from protected routes
// Public routes (no authentication)
app.use("/api/auth", userAuthRoutes);     // LOGIN & REGISTER: /api/auth/login, /api/auth/register
app.use("/api/jobs", jobRoutes);          // Public job listings

// Protected routes (require authentication)
app.use("/api/users", verifyJwt, userRoutes);    // USER PROFILE: /api/users/user, /api/users/profile, etc.
app.use("/api/company", companyRoutes);           // Company routes

// Debug route to test JWT
app.get("/api/test-auth", verifyJwt, (req, res) => {
  res.json({ success: true, message: "JWT working!", user: req.user });
});

// PORT
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});