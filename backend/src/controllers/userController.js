import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const submitData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.user;
    const { personal, bodyData, medicalData, foodPreferences } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        data: { personal, bodyData, medicalData, foodPreferences },
      },
      { new: true }
    ).select('-password');

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
};
