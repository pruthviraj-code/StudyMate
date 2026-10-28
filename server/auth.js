import jwt from 'jsonwebtoken';
import { sendError } from './helpers.js';

const JWT_SECRET = process.env.JWT_SECRET || 'development-only-change-this-secret-before-deployment';

export function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return sendError(res, 401, 'Please log in to continue');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: Number(payload.sub), email: payload.email };
    next();
  } catch {
    return sendError(res, 401, 'Your session has expired. Please log in again.');
  }
}
