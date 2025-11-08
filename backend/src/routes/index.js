import { Router } from 'express';
import authRoutes from './authRoutes.js';
import planRoutes from './planRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.use(authRoutes);
router.use(planRoutes);
router.use(userRoutes);

export default router;
