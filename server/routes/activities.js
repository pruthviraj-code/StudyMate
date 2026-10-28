import { Router } from 'express';
import db from '../db.js';
import { sendError, serverError, validateId } from '../helpers.js';

const router = Router();
router.param('id', validateId);

const TYPES = ['Exam', 'Seminar', 'Practical', 'Event', 'Other'];
const STATUSES = ['Upcoming', 'Completed'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function cleanActivity(body = {}) {
  return {
    title: String(body.title ?? '').trim(),
    activity_type: body.activity_type || 'Other',
    activity_date: String(body.activity_date ?? '').trim(),
    description: String(body.description ?? '').trim(),
    status: body.status || 'Upcoming',
  };
}

function validateActivity(a) {
  if (!a.title) return 'Title is required';
  if (a.title.length > 150) return 'Title must be 150 characters or less';
  if (!TYPES.includes(a.activity_type)) return 'Invalid activity type';
  if (!DATE_PATTERN.test(a.activity_date) || Number.isNaN(Date.parse(a.activity_date))) {
    return 'Date must be a valid date (YYYY-MM-DD)';
  }
  if (!STATUSES.includes(a.status)) return 'Status must be Upcoming or Completed';
  return null;
}

// GET /api/activities
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM activities WHERE user_id = ? ORDER BY activity_date ASC, id ASC').all(req.user.id);
    res.json({ success: true, data: rows });
  } catch (err) {
    serverError(res, err);
  }
});

// POST /api/activities
router.post('/', (req, res) => {
  const a = cleanActivity(req.body);
  const error = validateActivity(a);
  if (error) return sendError(res, 400, error);

  try {
    const result = db
      .prepare(
        'INSERT INTO activities (user_id, title, activity_type, activity_date, description, status) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(req.user.id, a.title, a.activity_type, a.activity_date, a.description, a.status);
    const row = db.prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?').get(result.lastInsertRowid, req.user.id);
    res.status(201).json({ success: true, message: 'Activity created', data: row });
  } catch (err) {
    serverError(res, err);
  }
});

// DELETE /api/activities/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM activities WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    if (result.changes === 0) return sendError(res, 404, 'Activity not found');
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    serverError(res, err);
  }
});

export default router;
