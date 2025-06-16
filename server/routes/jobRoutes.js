import express from "express";
import { getJobById, getJobs } from "../controllers/jobController.js";

const router = express.Router();

// route to get all jobs data
router.get("/", getJobs);

// routet to the single job by ID
router.get("/:id", getJobById);

export default router;
