import express from "express";
import {
  applyForJob,
  getUserJobApplications,
  getUserData,
  updateUserResume,
} from "../controllers/userController.js";
import upload from "../config/multer.js";
import { verifyUserToken,protect,verifyUser } from "../middlewares/authMiddleware.js";
import { registerUser, loginUser } from "../controllers/userAuthController.js";
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  registerUser
);
// get user data
router.get("/user", verifyUser, getUserData);

// apply for job
router.post("/apply", verifyUser, applyForJob);

// get applied jobs data
router.get("/applications", verifyUser, getUserJobApplications);

router.post("/register", registerUser);

router.post("/login", loginUser);
// update user profile (resume)
router.post(
  "/update-resume",
  verifyUser,
  upload.single("resume"),
  updateUserResume
);

export default router;
