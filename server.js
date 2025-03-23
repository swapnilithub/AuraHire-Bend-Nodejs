import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import getAllJobs from "./routes/getAlljobs.js";
import jobDetails from "./routes/jobDetails.js"; // Separate GET route
import applyJob from "./routes/applyJob.js";   // Separate POST route
import contact from "./routes/contact.js";
import profile from "./routes/profile.js"
import authRoutesHr from "./routes/authRoutesHr.js"
import hrProfile from "./routes/hrProfile.js"
import createJob from "./routes/createJob.js"
import applicants from "./routes/applicants.js"

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use("/api/users", authRoutes);
app.use("/api/jobs", getAllJobs);  // ✅ Handles GET all jobs
app.use("/api/job", jobDetails);  // ✅ Handles GET /api/jobs/:id
app.use("/api/apply", applyJob);   // ✅ Handles POST /api/apply/:id
app.use("/api/contact", contact);
app.use("/api/profile", profile);
app.use("/api/profile", hrProfile);
app.use("/api", authRoutesHr);
app.use("/api", createJob);
app.use("/api", applicants);
// Sync Database
sequelize.sync()
  .then(() => console.log("✅ Database Synced"))
  .catch(err => console.error("❌ Sync Error:", err));

const PORT = process.env.PORT || 15000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
