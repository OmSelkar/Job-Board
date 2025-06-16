import express from "express";
import { registerUser, loginUser } from "../controllers/userAuthController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/register", upload.fields([{ name: "image" }, { name: "resume" }]), registerUser);
router.post("/login", loginUser);

export default router;
