import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

const protectCompany = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    res.json({ success: false, message: "Not Authorized, Login Again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = await Company.findById(decoded.id).select("-password"); // except the hashpassword & attaching company to req field so other route can use it
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const userAuthMiddleware = (req, res, next) => {
  const token = req.headers.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};


const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // attach to req
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};



const verifyUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach userId to request object
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};
export { protectCompany, userAuthMiddleware,verifyUser,verifyUserToken,protect };
