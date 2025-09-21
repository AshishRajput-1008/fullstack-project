import express from "express";
import protect from "../middleware/auth.js";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getBoardTasks,
} from "../controllers/taskController.js";

const router = express.Router();

// Route /api/tasks - list with pagination   ==========    4 per page
router.get("/", protect, getTasks);

// Route: /api/tasks/board =========== max 15 tasks for priority board
router.get("/board", protect, getBoardTasks);

// Route: /api/tasks ========= create task
router.post("/", protect, createTask);

// Route: /api/tasks/:id -====single task operations
router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
