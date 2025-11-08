import { Router } from 'express';
import { body } from 'express-validator';
import authenticate from '../middlewares/auth.js';
import { submitData } from '../controllers/userController.js';

const router = Router();

router.post(
  '/submit-data',
  authenticate,
  [
    body('personal').notEmpty().withMessage('Personal data required'),
    body('bodyData').notEmpty().withMessage('Body data required'),
    body('medicalData').notEmpty().withMessage('Medical data required'),
    body('foodPreferences').notEmpty().withMessage('Food preferences required'),
  ],
  submitData
);

export default router;
