// routes/userAuthRoutes.js - PUBLIC AUTH ROUTES
import express from "express";
import { registerUser, loginUser } from "../controllers/userAuthController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Register user - POST /api/auth/register
router.post(
  "/register",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  registerUser
);

// Login user - POST /api/auth/login
router.post("/login", loginUser);

export default router;