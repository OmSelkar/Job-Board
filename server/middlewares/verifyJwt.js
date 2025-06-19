import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function verifyJwt(req, res, next) {
  try {
    const auth = req.headers.authorization;

    console.log("🔍 Auth header:", auth); // Debug log

    // Check if authorization header exists
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Check if it starts with Bearer
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format. Use 'Bearer <token>'",
      });
    }

    const token = auth.split(" ")[1];

    console.log("🔍 Token:", token ? "Token present" : "Token missing"); // Debug log

    // Check if token exists after Bearer
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // Verify JWT with your actual secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Using your actual secret for now

    console.log("🔍 Decoded token:", decoded); // Debug log

    // Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("🔍 User found:", user.name); // Debug log

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ JWT Verification Error:", err.message);

    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}
