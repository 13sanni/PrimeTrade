import Task from '../models/task.model.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a task title' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      userId,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all tasks for a user with pagination
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Get total count of tasks
    const totalTasks = await Task.countDocuments({ userId });

    // Get paginated tasks
    const tasks = await Task.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: 'Tasks fetched successfully',
      tasks,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch a single task
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task fetched successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
