import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm.jsx';

export default function OnboardingPage() {
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  const handlePlanGenerated = (newPlan) => {
    setPlan(newPlan);
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white">Tell us about yourself</h1>
        <p className="mt-2 text-sm text-slate-400">
          Share your goals, medical history, and food preferences to receive a personalized 7-day plan powered by AI.
        </p>
      </header>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-black/40">
        <UserForm onPlanGenerated={handlePlanGenerated} />
      </div>
      {plan && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
          Plan generated! Redirecting to dashboard...
        </div>
      )}
    </div>
  );
}
