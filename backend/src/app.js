import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authrouter from './routes/auth.routes.js';
import taskRouter from './routes/task.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', authrouter);
app.use('/api/tasks', taskRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
