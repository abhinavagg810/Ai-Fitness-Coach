export default function DayCard({ dayPlan, mealPlan, completed, onToggle }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{dayPlan?.day || mealPlan?.day}</h3>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={completed}
            onChange={onToggle}
            className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-primary"
          />
          Done
        </label>
      </div>

      {dayPlan?.exercises?.length ? (
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Workouts</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {dayPlan.exercises.map((exercise) => (
              <li key={exercise.name} className="rounded-lg bg-slate-800/60 p-3">
                <p className="font-medium text-white">{exercise.name}</p>
                <p className="text-xs text-slate-400">
                  Sets: {exercise.sets || '-'} · Reps: {exercise.reps || '-'} · Rest: {exercise.rest || '-'} · Intensity:{' '}
                  {exercise.intensity || 'Moderate'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Rest day</p>
      )}

      {mealPlan ? (
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Meals</h4>
          <p className="text-xs text-slate-400">
            Calories: {mealPlan.totalCalories || '-'} · Protein: {mealPlan.macros?.protein || '-'}g · Carbs:{' '}
            {mealPlan.macros?.carbs || '-'}g · Fat: {mealPlan.macros?.fat || '-'}g
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
            {mealPlan.meals?.map((meal) => (
              <li key={meal}>{meal}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
