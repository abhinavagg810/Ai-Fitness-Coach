import { useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const initialState = {
  personal: {
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
  },
  bodyData: {
    bmi: '',
    bodyFat: '',
    activityLevel: '',
    experienceLevel: '',
  },
  medicalData: {
    conditions: '',
    injuries: '',
    allergies: '',
  },
  foodPreferences: {
    type: '',
    preferredCuisines: '',
    dislikes: '',
    calorieTarget: '',
  },
};

export default function UserForm({ onPlanGenerated }) {
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();

  const handleChange = (section, field) => (event) => {
    const value = event.target.value;
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const normalizeArrayField = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        personal: {
          ...formState.personal,
          age: Number(formState.personal.age),
          height: Number(formState.personal.height),
          weight: Number(formState.personal.weight),
        },
        bodyData: {
          ...formState.bodyData,
          bmi: Number(formState.bodyData.bmi),
          bodyFat: Number(formState.bodyData.bodyFat),
        },
        medicalData: {
          conditions: normalizeArrayField(formState.medicalData.conditions),
          injuries: normalizeArrayField(formState.medicalData.injuries),
          allergies: normalizeArrayField(formState.medicalData.allergies),
        },
        foodPreferences: {
          ...formState.foodPreferences,
          preferredCuisines: normalizeArrayField(formState.foodPreferences.preferredCuisines),
          dislikes: normalizeArrayField(formState.foodPreferences.dislikes),
          calorieTarget: Number(formState.foodPreferences.calorieTarget),
        },
      };

      await api.post('/submit-data', payload);
      const { data } = await api.post('/generate-plan');

      if (localStorage.getItem('token')) {
        const existingUser = user || {};
        login(localStorage.getItem('token'), { ...existingUser, ...payload.personal });
      }

      onPlanGenerated(data.plan);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to submit data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded bg-red-500/20 px-4 py-2 text-sm text-red-200">{error}</div>}
      <section className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-lg font-semibold text-primary">Personal Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(formState.personal).map(([field, value]) => (
            <label key={field} className="flex flex-col text-sm">
              <span className="mb-1 capitalize text-slate-300">{field.replace(/([A-Z])/g, ' $1')}</span>
              <input
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-primary focus:outline-none"
                value={value}
                onChange={handleChange('personal', field)}
                required={['name', 'age', 'gender', 'height', 'weight', 'goal'].includes(field)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-lg font-semibold text-primary">Body & Experience</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(formState.bodyData).map(([field, value]) => (
            <label key={field} className="flex flex-col text-sm">
              <span className="mb-1 capitalize text-slate-300">{field.replace(/([A-Z])/g, ' $1')}</span>
              <input
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-primary focus:outline-none"
                value={value}
                onChange={handleChange('bodyData', field)}
                required
              />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-lg font-semibold text-primary">Medical Details</h2>
        <p className="text-xs text-slate-400">Separate multiple items with commas.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(formState.medicalData).map(([field, value]) => (
            <label key={field} className="flex flex-col text-sm">
              <span className="mb-1 capitalize text-slate-300">{field}</span>
              <input
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-primary focus:outline-none"
                value={value}
                onChange={handleChange('medicalData', field)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-lg font-semibold text-primary">Food Preferences</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(formState.foodPreferences).map(([field, value]) => (
            <label key={field} className="flex flex-col text-sm">
              <span className="mb-1 capitalize text-slate-300">{field.replace(/([A-Z])/g, ' $1')}</span>
              <input
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-primary focus:outline-none"
                value={value}
                onChange={handleChange('foodPreferences', field)}
                required={field !== 'dislikes'}
              />
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Generating plan...' : 'Generate My Plan'}
      </button>
    </form>
  );
}
