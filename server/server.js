import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";

import router from "./routes/companyRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import  {verifyJwt}  from "./middlewares/verifyJwt.js"
import userAuthRoutes from "./routes/userAuthRoutes.js";
// Initialize Express
const app = express();

// Connect to database
await connectDB();
await connectCloudinary();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.get("/", (req, res) => {
  res.send("API Working");
});
// router.get("/user", requireAuth());
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});



app.use("/api/company", companyRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/users", userAuthRoutes);
app.use("/api/users", verifyJwt, userRoutes);

// PORT
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
