export function calculateCompletionPercentage(plan) {
  if (!plan) return { workoutPct: 0, mealPct: 0 };
  const totalWorkouts = plan.workouts?.length ?? 0;
  const totalMeals = plan.meals?.length ?? 0;
  const workoutsCompleted = plan.progress?.workoutsCompleted ?? 0;
  const mealsCompleted = plan.progress?.mealsCompleted ?? 0;

  return {
    workoutPct: totalWorkouts ? Math.min(100, Math.round((workoutsCompleted / totalWorkouts) * 100)) : 0,
    mealPct: totalMeals ? Math.min(100, Math.round((mealsCompleted / totalMeals) * 100)) : 0,
  };
}

export function mergePlans(workouts = [], meals = []) {
  const map = new Map();
  workouts.forEach((day) => {
    map.set(day.day, { workouts: day, meals: null });
  });
  meals.forEach((day) => {
    const entry = map.get(day.day) || { workouts: null, meals: null };
    entry.meals = day;
    map.set(day.day, entry);
  });

  return Array.from(map.entries())
    .sort((a, b) => {
      const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })
    .map(([day, value]) => ({ day, ...value }));
}
