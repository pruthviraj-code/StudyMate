import { Router } from 'express';
import db from '../db.js';
import { sendError, serverError, validateId } from '../helpers.js';

const router = Router();
router.param('id', validateId);

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Pending', 'Completed'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function cleanAssignment(body = {}) {
  return {
    title: String(body.title ?? '').trim(),
    subject: String(body.subject ?? '').trim(),
    description: String(body.description ?? '').trim(),
    due_date: String(body.due_date ?? '').trim(),
    priority: body.priority || 'Medium',
    status: body.status || 'Pending',
  };
}

function validateAssignment(a) {
  if (!a.title) return 'Title is required';
  if (a.title.length > 150) return 'Title must be 150 characters or less';
  if (!a.subject) return 'Subject is required';
  if (a.subject.length > 100) return 'Subject must be 100 characters or less';
  if (!DATE_PATTERN.test(a.due_date) || Number.isNaN(Date.parse(a.due_date))) {
    return 'Due date must be a valid date (YYYY-MM-DD)';
  }
  if (!PRIORITIES.includes(a.priority)) return 'Priority must be Low, Medium or High';
  if (!STATUSES.includes(a.status)) return 'Status must be Pending or Completed';
  return null;
}

// GET /api/assignments
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM assignments WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
    res.json({ success: true, data: rows });
  } catch (err) {
    serverError(res, err);
  }
});

// GET /api/assignments/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM assignments WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!row) return sendError(res, 404, 'Assignment not found');
    res.json({ success: true, data: row });
  } catch (err) {
    serverError(res, err);
  }
});

// POST /api/assignments
router.post('/', (req, res) => {
  const a = cleanAssignment(req.body);
  const error = validateAssignment(a);
  if (error) return sendError(res, 400, error);

  try {
    const result = db
      .prepare(
        'INSERT INTO assignments (user_id, title, subject, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .run(req.user.id, a.title, a.subject, a.description, a.due_date, a.priority, a.status);
    const row = db.prepare('SELECT * FROM assignments WHERE id = ? AND user_id = ?').get(result.lastInsertRowid, req.user.id);
    res.status(201).json({ success: true, message: 'Assignment created', data: row });
  } catch (err) {
    serverError(res, err);
  }
});

// PUT /api/assignments/:id
router.put('/:id', (req, res) => {
  const a = cleanAssignment(req.body);
  const error = validateAssignment(a);
  if (error) return sendError(res, 400, error);

  try {
    const result = db
      .prepare(
        'UPDATE assignments SET title = ?, subject = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?'
      )
      .run(a.title, a.subject, a.description, a.due_date, a.priority, a.status, req.params.id, req.user.id);
    if (result.changes === 0) return sendError(res, 404, 'Assignment not found');

    const row = db.prepare('SELECT * FROM assignments WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    res.json({ success: true, message: 'Assignment updated', data: row });
  } catch (err) {
    serverError(res, err);
  }
});

// PATCH /api/assignments/:id/status
router.patch('/:id/status', (req, res) => {
  const status = req.body?.status;
  if (!STATUSES.includes(status)) {
    return sendError(res, 400, 'Status must be Pending or Completed');
  }

  try {
    const result = db
      .prepare('UPDATE assignments SET status = ? WHERE id = ? AND user_id = ?')
      .run(status, req.params.id, req.user.id);
    if (result.changes === 0) return sendError(res, 404, 'Assignment not found');

    const row = db.prepare('SELECT * FROM assignments WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    res.json({ success: true, message: 'Status updated', data: row });
  } catch (err) {
    serverError(res, err);
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM assignments WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    if (result.changes === 0) return sendError(res, 404, 'Assignment not found');
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (err) {
    serverError(res, err);
  }
});

export default router;
