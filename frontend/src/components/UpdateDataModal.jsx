import { useState } from 'react';
import api from '../services/api.js';

const initialFormState = {
  weight: '',
  energy: 'Stable',
  notes: '',
  workoutsCompleted: '',
  mealsCompleted: '',
};

export default function UpdateDataModal({ isOpen, onClose, onPlanUpdated }) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setForm(initialFormState);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/update-progress', {
        workoutsCompleted: Number(form.workoutsCompleted),
        mealsCompleted: Number(form.mealsCompleted),
        notes: form.notes,
      });
      const { data } = await api.post('/next-week', {
        additionalData: {
          weight: Number(form.weight),
          energy: form.energy,
          notes: form.notes,
        },
      });
      onPlanUpdated(data.plan);
      handleClose();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to update plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Update My Data</h3>
          <button onClick={handleClose} className="text-slate-400 transition hover:text-white">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          {error && <div className="rounded bg-red-500/20 px-4 py-2 text-sm text-red-200">{error}</div>}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col">
              <span className="mb-1 text-slate-300">Current Weight (kg)</span>
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                type="number"
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 text-slate-300">Energy Levels</span>
              <select
                name="energy"
                value={form.energy}
                onChange={handleChange}
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-primary focus:outline-none"
              >
                <option>Stable</option>
                <option>High</option>
                <option>Low</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col">
              <span className="mb-1 text-slate-300">Workouts Completed</span>
              <input
                name="workoutsCompleted"
                value={form.workoutsCompleted || ''}
                onChange={handleChange}
                type="number"
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 text-slate-300">Meals Completed</span>
              <input
                name="mealsCompleted"
                value={form.mealsCompleted || ''}
                onChange={handleChange}
                type="number"
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-primary focus:outline-none"
              />
            </label>
          </div>
          <label className="flex flex-col">
            <span className="mb-1 text-slate-300">Notes</span>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-primary focus:outline-none"
            />
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Updating...' : 'Generate Next Week'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
