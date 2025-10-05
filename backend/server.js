// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./src/routes/auth.js";
import taskRoutes from "./src/routes/tasks.js";

// Import Task model for auto-complete logic
import Task from "./src/models/Task.js";

dotenv.config();

const app = express();

// ------------------- Middleware -------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- API Routes -------------------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ----------------- MongoDB Connection -----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Auto-complete overdue tasks every minute
    setInterval(async () => {
      try {
        const now = new Date();
        const result = await Task.updateMany(
          { dueDate: { $lte: now }, completed: false },
          { completed: true }
        );
        if (result.modifiedCount > 0) {
          console.log(`⏰ Auto-completed ${result.modifiedCount} overdue tasks`);
        }
      } catch (err) {
        console.error("❌ Error auto-completing tasks:", err);
      }
    }, 60 * 1000);
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------- Serve Frontend (Vite) -------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

// ------------------- Server -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
