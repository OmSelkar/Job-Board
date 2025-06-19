import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
// import EmailService from "../utils/emailService.js";
// import Company from "../models/Company.js";
// ✅ Get user data (secured with middleware)
export const getUserData = async (req, res) => {
  try {
    const userId = req.user._id; // from verifyUser middleware
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });
    if (isAlreadyApplied) {
      return res.json({ success: false, message: "Already Applied" });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.json({ success: false, message: "Job Not Found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });



    res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get job applications for a user
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary");

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update resume
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumeFile = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      user.resume = resumeUpload.secure_url;
    }

    await user.save();
    res.json({ success: true, message: "Resume uploaded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
