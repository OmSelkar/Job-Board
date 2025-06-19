import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { v2 as cloudinary } from "cloudinary";
// import EmailService from "../utils/emailService.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (req.files?.image) {
      const uploadRes = await cloudinary.uploader.upload(
        req.files.image[0].path
      );
      newUser.image = uploadRes.secure_url;
    }

    if (req.files?.resume) {
      const uploadRes = await cloudinary.uploader.upload(
        req.files.resume[0].path
      );
      newUser.resume = uploadRes.secure_url;
    }

    await newUser.save();


    const token = generateToken(newUser._id);

    res.json({
      success: true,
      user: { ...newUser._doc, password: undefined },
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      success: true,
      user: { ...user._doc, password: undefined },
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
