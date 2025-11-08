import { calculateCompletionPercentage } from '../utils/plan.js';

export default function ProgressTracker({ plan }) {
  const { workoutPct, mealPct } = calculateCompletionPercentage(plan);

  return (
    <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
      <div>
        <p className="text-sm text-slate-300">Workouts Completed: {plan.progress?.workoutsCompleted ?? 0} / {plan.workouts?.length ?? 0}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-primary" style={{ width: `${workoutPct}%` }} />
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-300">Meals Completed: {plan.progress?.mealsCompleted ?? 0} / {plan.meals?.length ?? 0}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-accent" style={{ width: `${mealPct}%` }} />
        </div>
      </div>
    </div>
  );
}
