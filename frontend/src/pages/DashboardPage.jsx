import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DayCard from '../components/DayCard.jsx';
import ProgressTracker from '../components/ProgressTracker.jsx';
import UpdateDataModal from '../components/UpdateDataModal.jsx';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { mergePlans } from '../utils/plan.js';

export default function DashboardPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await api.get('/get-plan');
        setPlan(data.plan);
      } catch (apiError) {
        if (apiError.response?.status === 404) {
          navigate('/onboarding');
        } else if (apiError.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError(apiError.response?.data?.message || 'Unable to fetch plan');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [logout, navigate]);

  const handleToggleDay = async (day) => {
    if (!plan) return;

    const completedDays = new Set(plan.completedDays || []);
    if (completedDays.has(day)) {
      completedDays.delete(day);
    } else {
      completedDays.add(day);
    }

    const workoutsCompleted = Math.min(completedDays.size, plan.workouts?.length ?? 0);
    const mealsCompleted = Math.min(completedDays.size, plan.meals?.length ?? 0);

    const updatedCompletedDays = Array.from(completedDays);
    try {
      const { data } = await api.post('/update-progress', {
        workoutsCompleted,
        mealsCompleted,
        notes: plan.progress?.notes,
        completedDays: updatedCompletedDays,
      });

      setPlan({ ...data.plan, completedDays: updatedCompletedDays });
      setError('');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to update progress');
    }
  };

  const planDays = mergePlans(plan?.workouts, plan?.meals);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/40 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Weekly Plan</h1>
          <p className="mt-1 text-sm text-slate-400">Stay on track by marking workouts and meals as done each day.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-slate-900 transition hover:bg-accent/90"
          >
            Update my data
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Log out
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-slate-300">Loading plan...</div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>
      ) : plan ? (
        <>
          <ProgressTracker plan={plan} />
          <section className="grid gap-6 md:grid-cols-2">
            {planDays.map(({ day, workouts, meals }) => (
              <DayCard
                key={day}
                dayPlan={workouts}
                mealPlan={meals}
                completed={plan.completedDays?.includes(day)}
                onToggle={() => handleToggleDay(day)}
              />
            ))}
          </section>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-slate-300">
          No plan yet. Complete onboarding to generate your personalized program.
        </div>
      )}

      <UpdateDataModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPlanUpdated={(newPlan) => {
          setPlan(newPlan);
          setShowModal(false);
        }}
      />
    </div>
  );
}
