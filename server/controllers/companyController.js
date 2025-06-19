import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
// import { sendEmail } from "../services/emailService.js"; // your mail util

// Register a new Company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.file;
  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExist = await Company.findOne({ email });
    if (companyExist) {
      return res.json({
        success: false,
        message: "Company Already Registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = cloudinary.uploader.upload(imageFile.path);
    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: (await imageUpload).secure_url,
    });
    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Company Login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (await bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Company Data
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};
// Post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, category, level } = req.body;

  const companyId = req.company._id;
  // console.log(companyId, { title, description, location, salary });
  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      category,
      level,
    });

    await newJob.save();

    res.json({ success: true, newJob });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//  Get company job Applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;
    const applications = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location");

    res.json({ success: true, applications });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
// Get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const jobsRaw = await Job.find({ companyId: req.company._id });
    const jobs = await Promise.all(
      jobsRaw.map(async (job) => {
        const count = await JobApplication.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicants: count,
        };
      })
    );
    res.json({ success: true, jobsData: jobs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change job application status
export const changeJobApplicationsStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    // Find job application and update status
    await JobApplication.findOneAndUpdate({ _id: id }, { status });
    res.json({ success: true, message: "Status Changed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Change job Visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);
    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
      await job.save();
    }
    res.json({
      success: true,
      job,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
