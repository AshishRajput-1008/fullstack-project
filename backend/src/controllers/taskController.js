import Task from "../models/Task.js";

// get all tasks
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 4; // pagination for list
    const skip = (page - 1) * limit;

    const total = await Task.countDocuments({ user: userId });
    const tasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);
    res.json({ tasks, page, pages, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBoardTasks = async (req, res) => {
  // max 15 for board
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(15);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single task by id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create task

export const createTask = async (req, res) => {
  const { title, description, dueDate, priority, completed } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      dueDate: dueDate || null,
      priority: priority || "normal",
      completed: completed || false,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.priority = req.body.priority || task.priority;

    if (req.body.completed !== undefined) task.completed = req.body.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
