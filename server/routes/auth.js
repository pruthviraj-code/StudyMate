import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { createToken, requireAuth } from '../auth.js';
import { sendError, serverError } from '../helpers.js';

const router = Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  if (name.length < 2 || name.length > 80) return sendError(res, 400, 'Name must be between 2 and 80 characters');
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return sendError(res, 400, 'Enter a valid email address');
  if (password.length < 8 || password.length > 128) return sendError(res, 400, 'Password must be at least 8 characters');
  try {
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return sendError(res, 409, 'An account with this email already exists');
    const passwordHash = bcrypt.hashSync(password, 12);
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, passwordHash);
    const user = { id: Number(result.lastInsertRowid), name, email };
    res.status(201).json({ success: true, data: { token: createToken(user), user } });
  } catch (err) { serverError(res, err); }
});

router.post('/login', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  if (!email || !password) return sendError(res, 400, 'Email and password are required');
  try {
    const row = db.prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?').get(email);
    if (!row || !bcrypt.compareSync(password, row.password_hash)) return sendError(res, 401, 'Incorrect email or password');
    const user = { id: row.id, name: row.name, email: row.email };
    res.json({ success: true, data: { token: createToken(user), user } });
  } catch (err) { serverError(res, err); }
});

router.get('/me', requireAuth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return sendError(res, 401, 'Account not found');
    res.json({ success: true, data: user });
  } catch (err) { serverError(res, err); }
});

export default router;
