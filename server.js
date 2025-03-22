import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import getAlljobs from "./routes/getAlljobs.js";
////import applyJob from "./routes/applyJob.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use("/api/users", authRoutes);
app.use("/api/jobs", getAlljobs); // Mount getAlljobs properly
//app.use("/api/applicants", applyJob);

// Sync Database
sequelize.sync()
  .then(() => console.log("✅ Database Synced"))
  .catch(err => console.error("❌ Sync Error:", err));

const PORT = process.env.PORT || 15000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
