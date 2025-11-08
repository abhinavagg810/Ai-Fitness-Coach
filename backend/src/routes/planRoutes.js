import { Router } from 'express';
import { body } from 'express-validator';
import authenticate from '../middlewares/auth.js';
import { generateNextWeek, generateWeeklyPlan, getCurrentPlan, updateProgress } from '../controllers/planController.js';

const router = Router();

router.post('/generate-plan', authenticate, generateWeeklyPlan);
router.get('/get-plan', authenticate, getCurrentPlan);
router.post(
  '/update-progress',
  authenticate,
  [
    body('workoutsCompleted').optional().isNumeric(),
    body('mealsCompleted').optional().isNumeric(),
    body('completedDays').optional().isArray(),
  ],
  updateProgress
);
router.post('/next-week', authenticate, generateNextWeek);

export default router;
