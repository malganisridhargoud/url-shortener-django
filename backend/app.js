import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server health checks while restricting browser requests.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'TaskFlow API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
