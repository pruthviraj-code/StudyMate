export function sendError(res, status, message) {
  return res.status(status).json({ success: false, message });
}

export function serverError(res, err) {
  console.error(err);
  return res
    .status(500)
    .json({ success: false, message: 'Server error. Please try again.' });
}

// Used with router.param('id', validateId) so every :id route checks the id first
export function validateId(req, res, next, value) {
  if (!/^\d+$/.test(value)) {
    return sendError(res, 400, 'Invalid id');
  }
  next();
}
