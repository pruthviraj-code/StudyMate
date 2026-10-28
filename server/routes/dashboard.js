import { Router } from 'express';
import db from '../db.js';
import { serverError } from '../helpers.js';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
  try {
    const a = db
      .prepare(
        `SELECT
           COUNT(*) AS total,
           COALESCE(SUM(status = 'Pending'), 0) AS pending,
           COALESCE(SUM(status = 'Completed'), 0) AS completed
         FROM assignments WHERE user_id = ?`
      )
      .get(req.user.id);
    const act = db
      .prepare("SELECT COUNT(*) AS upcoming FROM activities WHERE status = 'Upcoming' AND user_id = ?")
      .get(req.user.id);

    res.json({
      success: true,
      data: {
        totalAssignments: a.total,
        pendingAssignments: a.pending,
        completedAssignments: a.completed,
        upcomingActivities: act.upcoming,
      },
    });
  } catch (err) {
    serverError(res, err);
  }
});

export default router;
