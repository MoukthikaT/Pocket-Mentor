import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  Home,
  History,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', form);

      login(response.data, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FBFC] font-body lg:flex">

      {/* LEFT — LOGIN FORM */}
      <section className="relative flex min-h-screen w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-1/2">

        <Link
          to="/"
          className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#218DAE]/40 hover:text-[#218DAE] sm:left-8 sm:top-8"
        >
          <Home size={14} />
          Home
        </Link>

        <div className="w-full max-w-md">

          <div className="mb-5 flex items-center justify-center gap-2 lg:hidden">
            <div className="brand-mark">P</div>
            <span className="font-logo text-lg text-slate-900">
              POCKET MENTOR
            </span>
          </div>

          <div className="rounded-[28px] border border-[#D5E8EC] bg-white p-7 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.35)] sm:p-9">

            <div className="mb-6">
              <span className="inline-flex rounded-full bg-[#E7F7F9] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#167A91]">
                Your study desk is waiting
              </span>

              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900">
                Pick up where you left off
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue with your saved notes, revision packs and
                learning progress.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <div>
                <label className="label">Email Address</label>

                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                    size={17}
                  />

                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="input-field !pl-12"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="label mb-0">Password</label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#218DAE] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                    size={17}
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="input-field !pl-12 !pr-12"
                    value={form.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold leading-5 text-rose-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3.5 text-base"
              >
                Log In
                <ArrowRight size={18} />
              </Button>
            </form>

            <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
              New to Pocket Mentor?{' '}
              <Link
                to="/register"
                className="font-bold text-[#218DAE] hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT — LOGIN INFORMATION */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#165F76] to-[#218DAE] text-white lg:flex lg:w-1/2 lg:flex-col lg:justify-center">

        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#2BBBD7]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-[#FFD758]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-xl px-12">

          <div className="mb-6">
            <div
              className="mb-8 flex cursor-pointer items-center gap-3"
              onClick={() => navigate('/')}
            >
              <div className="brand-mark">P</div>

              <div>
                <div className="font-logo text-xl">
                  POCKET MENTOR
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2BBBD7]">
                  Personal Revision Workspace
                </div>
              </div>
            </div>

            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FCE59A]">
              Your study history stays with you
            </span>

            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight xl:text-5xl">
              Come back to
              <br />
              <span className="text-[#2BBBD7]">where you stopped.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-200">
              Pocket Mentor keeps your learning activities connected so you
              can revisit your material, see your progress and continue
              practising without starting from zero.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <History className="mb-4 text-[#2BBBD7]" size={21} />
              <h3 className="text-sm font-bold">Continue</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Return to saved revision sessions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <BarChart3 className="mb-4 text-[#FFD758]" size={21} />
              <h3 className="text-sm font-bold">Track</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                See how your practice is progressing.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <RefreshCw className="mb-4 text-[#2BBBD7]" size={21} />
              <h3 className="text-sm font-bold">Revise</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Revisit areas that need another attempt.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}