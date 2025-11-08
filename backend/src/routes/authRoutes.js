import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';

const router = Router();

const emailValidator = body('email').isEmail().withMessage('Valid email required');
const passwordValidator = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');

router.post('/register', [body('name').notEmpty().withMessage('Name is required'), emailValidator, passwordValidator], register);
router.post('/login', [emailValidator, passwordValidator], login);

export default router;
