import express from 'express';
import cors from 'cors';
import './db.js';
import authRoutes from './routes/auth.js';
import { requireAuth } from './auth.js';
import assignmentRoutes from './routes/assignments.js';
import activityRoutes from './routes/activities.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/assignments', requireAuth, assignmentRoutes);
app.use('/api/activities', requireAuth, activityRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);

// Unknown API route
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Catches problems such as invalid JSON in the request body
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: 'Invalid request' });
});

app.listen(PORT, () => {
  console.log(`StudyMate API running at http://localhost:${PORT}`);
  console.log('SQLite database ready (server/studymate.db)');
});
