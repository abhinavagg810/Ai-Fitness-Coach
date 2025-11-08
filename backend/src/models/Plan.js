import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: Number },
    rest: { type: String },
    intensity: { type: String },
  },
  { _id: false }
);

const MealSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    totalCalories: { type: Number },
    macros: {
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number },
    },
    meals: [{ type: String }],
  },
  { _id: false }
);

const WorkoutDaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    exercises: { type: [ExerciseSchema], default: [] },
  },
  { _id: false }
);

const ProgressSchema = new mongoose.Schema(
  {
    workoutsCompleted: { type: Number, default: 0 },
    mealsCompleted: { type: Number, default: 0 },
    notes: { type: String },
  },
  { _id: false }
);

const PlanSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    workouts: { type: [WorkoutDaySchema], default: [] },
    meals: { type: [MealSchema], default: [] },
    completedDays: { type: [String], default: [] },
    progress: { type: ProgressSchema, default: () => ({}) },
    dateGenerated: { type: Date, default: Date.now },
  },
  { _id: false }
);

export default PlanSchema;
