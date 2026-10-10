require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'EduCareer AI Backend & Database',
    database: 'SQLite (Prisma ORM)',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/roadmaps', roadmapRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/resumes', resumeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Start Express server
async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`
======================================================
   EduCareer AI Express Backend Server Running!
   Port: http://localhost:${PORT}
   Database: file:./prisma/dev.db (SQLite)
   Health: http://localhost:${PORT}/api/health
======================================================
`);
  });
}

startServer();
