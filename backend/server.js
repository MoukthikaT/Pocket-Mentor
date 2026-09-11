import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import studyMaterialRoutes from './routes/studyMaterialRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5041;

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://pocket-mentor-frontend.onrender.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Pocket Mentor backend is running.',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/study-material', studyMaterialRoutes);
app.use('/api/learning', learningRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.log(
    'MongoDB URI not configured; running in in-memory demo mode.'
  );
}

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Pocket Mentor may already be running; stop the existing server before starting another one.`
    );
    process.exit(1);
  }

  throw error;
});