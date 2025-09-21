// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./src/routes/auth.js";
import taskRoutes from "./src/routes/tasks.js";
import Task from "./src/models/Task.js"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // aauto = complete tasks every minute
    setInterval(async () => {
      const now = new Date();
      await Task.updateMany(
        { dueDate: { $lte: now }, completed: false },
        { completed: true }
      );
      console.log("Auto-completed due tasks");
    }, 60 * 1000); // runs every 1 minute

  })
  .catch((err) => console.error(" MongoDB connection error:", err));

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
