import { useState } from 'react';
import { login, signup } from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const { login: storeLogin } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const action = mode === 'login' ? login : signup;
      const data = await action(form);
      storeLogin(data);
    } catch (err) {
      setError(err.message || 'Unable to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-cream-100 px-5 py-16">
      <div className="w-full max-w-md bg-white shadow-xl border border-cream-200 p-8">
        <div className="text-center mb-6">
          <p className="font-script text-latte-500 text-3xl">Velvet Bean</p>
          <h1 className="font-display text-espresso-700 text-3xl font-light mt-2">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="font-body text-muted text-sm mt-2">
            Email and password are required to start ordering.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-cream-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-espresso-300"
              placeholder="name@email.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-cream-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-espresso-300"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-espresso-600 text-cream-100 py-2.5 font-body tracking-widest uppercase text-xs hover:bg-espresso-500 transition-colors"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-body text-muted">
          {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-espresso-600 hover:text-espresso-500 underline"
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </div>
      </div>
    </section>
  );
}
