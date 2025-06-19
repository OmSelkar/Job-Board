// routes/userRoutes.js - PROTECTED ROUTES ONLY
import express from "express";
import {
  applyForJob,
  getUserJobApplications,
  getUserData,
  updateUserResume,
} from "../controllers/userController.js";
import upload from "../config/multer.js";

const router = express.Router();

// All routes here are protected by verifyJwt middleware in server.js
// So no need to add middleware again

// get user data - GET /api/users/user
router.get("/user", getUserData);

// apply for job - POST /api/users/apply
router.post("/apply", applyForJob);

// get applied jobs data - GET /api/users/applications
router.get("/applications", getUserJobApplications);

// update user profile (resume) - POST /api/users/update-resume
router.post("/update-resume", upload.single("resume"), updateUserResume);

export default router;