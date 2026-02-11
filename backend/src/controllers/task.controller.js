import Task from '../models/task.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Create a new task
export const createTask = asyncHandler(async (req, res) => {
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
});

// Fetch all tasks for a user with pagination
export const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  // Calculate skip value
  const skip = (page - 1) * limit;
  const query = { userId };

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escapedSearch, 'i');
    query.$or = [{ title: pattern }, { description: pattern }];
  }

  // Get total count of tasks
  const totalTasks = await Task.countDocuments(query);

  // Get paginated tasks
  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

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
});

// Fetch a single task
export const getTaskById = asyncHandler(async (req, res) => {
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
});

// Update a task
export const updateTask = asyncHandler(async (req, res) => {
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
});

// Delete a task
export const deleteTask = asyncHandler(async (req, res) => {
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
});
