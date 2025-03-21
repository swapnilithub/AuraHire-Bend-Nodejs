import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";  // Import auth routes

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);  // Updated API path

// Sync Database
sequelize.sync()
  .then(() => console.log("✅ Database Synced"))
  .catch(err => console.error("❌ Sync Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
