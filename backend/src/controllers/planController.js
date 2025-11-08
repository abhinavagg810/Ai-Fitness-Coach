import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generatePlan } from '../services/openaiService.js';
import { summarizePlanProgress } from '../utils/planUtils.js';

export const generateWeeklyPlan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user?.data) {
      return res.status(400).json({ message: 'User data not found. Submit onboarding data first.' });
    }

    const planData = await generatePlan(user.data);
    const { workouts = [], meals = [] } = planData;

    const plan = {
      week: user.currentWeek,
      workouts,
      meals,
      completedDays: [],
      progress: {
        workoutsCompleted: 0,
        mealsCompleted: 0,
      },
      dateGenerated: new Date(),
    };

    user.plans = user.plans.filter((existingPlan) => existingPlan.week !== user.currentWeek);
    user.plans.push(plan);
    await user.save();

    return res.status(201).json({ plan });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentPlan = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const plan = user.plans.find((p) => p.week === user.currentWeek);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not generated yet' });
    }

    return res.json({ plan: plan.toObject ? plan.toObject() : plan });
  } catch (error) {
    return next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.user;
    const { workoutsCompleted, mealsCompleted, notes, completedDays } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const planIndex = user.plans.findIndex((p) => p.week === user.currentWeek);
    if (planIndex === -1) {
      return res.status(404).json({ message: 'Plan not generated yet' });
    }

    user.plans[planIndex].progress = {
      workoutsCompleted: Number.isFinite(workoutsCompleted) ? workoutsCompleted : user.plans[planIndex].progress.workoutsCompleted,
      mealsCompleted: Number.isFinite(mealsCompleted) ? mealsCompleted : user.plans[planIndex].progress.mealsCompleted,
      notes: notes ?? user.plans[planIndex].progress.notes,
    };

    if (Array.isArray(completedDays)) {
      user.plans[planIndex].completedDays = completedDays;
    }

    await user.save();

    const responsePlan = user.plans[planIndex].toObject ? user.plans[planIndex].toObject() : user.plans[planIndex];

    return res.json({ plan: responsePlan });
  } catch (error) {
    return next(error);
  }
};

export const generateNextWeek = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { additionalData } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentPlan = user.plans.find((p) => p.week === user.currentWeek);
    const planSummary = currentPlan ? summarizePlanProgress(currentPlan) : undefined;

    const mergedData = {
      ...user.data,
      progressSummary: planSummary,
      additionalData,
    };

    const nextWeek = user.currentWeek + 1;
    const planData = await generatePlan(mergedData, planSummary);
    const { workouts = [], meals = [] } = planData;

    const plan = {
      week: nextWeek,
      workouts,
      meals,
      completedDays: [],
      progress: {
        workoutsCompleted: 0,
        mealsCompleted: 0,
      },
      dateGenerated: new Date(),
    };

    user.currentWeek = nextWeek;
    user.plans.push(plan);
    await user.save();

    return res.status(201).json({ plan });
  } catch (error) {
    return next(error);
  }
};
