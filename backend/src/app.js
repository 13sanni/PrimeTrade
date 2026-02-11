import express from 'express';
import cors from 'cors';
import authrouter from './routes/auth.routes.js';
import taskRouter from './routes/task.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests and same-origin requests with no Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  })
);
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
