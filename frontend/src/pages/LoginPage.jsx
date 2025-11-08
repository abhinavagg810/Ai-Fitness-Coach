import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/login', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/40">
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-400">Log in to view your personalized fitness plan.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div className="rounded bg-red-500/20 px-4 py-2 text-sm text-red-200">{error}</div>}
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-slate-300">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-primary focus:outline-none"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-slate-300">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-primary focus:outline-none"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
