import { useState } from 'react';
import { api } from '../services/api';

const initialForm = { name: '', email: '', password: '', confirmPassword: '' };

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    setForm(initialForm);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = mode === 'login' ? await api.login(form) : await api.register(form);
      onAuthenticated(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <main className="auth-shell">
      <section className="auth-copy">
        <div className="brand"><span>✓</span> TaskFlow</div>
        <h1>Focus on what<br />matters most.</h1>
        <p>A calm, capable workspace for turning plans into progress.</p>
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
      </section>

      <section className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="eyebrow">WELCOME TO TASKFLOW</p>
          <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p className="muted">
            {isLogin ? 'Sign in to continue to your workspace.' : 'Start organising your best work today.'}
          </p>

          {error && <div className="error">{error}</div>}

          {!isLogin && (
            <label>
              Name
              <input name="name" required value={form.name} onChange={updateField} placeholder="Your name" />
            </label>
          )}
          <label>
            Email address
            <input name="email" required type="email" value={form.email} onChange={updateField} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input name="password" required type="password" minLength="6" value={form.password} onChange={updateField} placeholder="At least 6 characters" />
          </label>
          {!isLogin && (
            <label>
              Confirm password
              <input name="confirmPassword" required type="password" value={form.confirmPassword} onChange={updateField} placeholder="Repeat your password" />
            </label>
          )}

          <button className="primary full" disabled={loading}>
            {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'} <span>→</span>
          </button>
          <p className="switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" onClick={toggleMode}>{isLogin ? 'Create one' : 'Sign in'}</button>
          </p>
        </form>
      </section>
    </main>
  );
}
