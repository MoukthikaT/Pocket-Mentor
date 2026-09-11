import dotenv from 'dotenv';

// IMPORTANT:
// Load environment variables BEFORE importing routes/services
// that use process.env.
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import studyMaterialRoutes from './routes/studyMaterialRoutes.js';
import learningRoutes from './routes/learningRoutes.js';

import {
  errorHandler,
  notFound,
} from './middleware/errorMiddleware.js';

const app = express();

const PORT = process.env.PORT || 5041;

// --------------------------------------------------
// ENVIRONMENT CHECK
// --------------------------------------------------

console.log('------------------------------------');
console.log('ENVIRONMENT CHECK');
console.log(
  'GEMINI_API_KEY:',
  process.env.GEMINI_API_KEY
    ? 'GEMINI KEY FOUND'
    : 'GEMINI KEY NOT FOUND'
);
console.log(
  'GEMINI_MODEL:',
  process.env.GEMINI_MODEL || 'NOT SET'
);
console.log('------------------------------------');

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  'http://localhost:5173',
  'https://pocket-mentor-frontend.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Pocket Mentor backend is running.',
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/study-material', studyMaterialRoutes);
app.use('/api/learning', learningRoutes);

// --------------------------------------------------
// ERROR HANDLING
// --------------------------------------------------

app.use(notFound);
app.use(errorHandler);

// --------------------------------------------------
// DATABASE
// --------------------------------------------------

if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.log(
    'MongoDB URI not configured; running in in-memory demo mode.'
  );
}

// --------------------------------------------------
// SERVER
// --------------------------------------------------

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use.`
    );

    process.exit(1);
  }

  throw error;
});