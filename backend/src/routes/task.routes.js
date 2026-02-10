import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const taskRouter = express.Router();

// All task routes are protected
taskRouter.use(protect);

// Create a new task
taskRouter.post('/', createTask);

// Get all tasks
taskRouter.get('/', getTasks);

// Get a single task by ID
taskRouter.get('/:id', getTaskById);

// Update a task
taskRouter.put('/:id', updateTask);

// Delete a task
taskRouter.delete('/:id', deleteTask);

export default taskRouter;
