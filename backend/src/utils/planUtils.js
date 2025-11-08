export function summarizePlanProgress(plan) {
  const totalWorkoutDays = plan.workouts?.length ?? 0;
  const totalMealDays = plan.meals?.length ?? 0;

  return {
    week: plan.week,
    workoutsCompleted: plan.progress?.workoutsCompleted ?? 0,
    mealsCompleted: plan.progress?.mealsCompleted ?? 0,
    notes: plan.progress?.notes,
    totalWorkoutDays,
    totalMealDays,
  };
}

export function calculateCompletionPercentage(plan) {
  const workoutPct = plan.workouts?.length
    ? Math.min(100, Math.round((plan.progress?.workoutsCompleted ?? 0) / plan.workouts.length * 100))
    : 0;
  const mealPct = plan.meals?.length
    ? Math.min(100, Math.round((plan.progress?.mealsCompleted ?? 0) / plan.meals.length * 100))
    : 0;

  return { workoutPct, mealPct };
}
