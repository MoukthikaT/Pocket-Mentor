import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Sparkles, Eye, EyeOff, ArrowRight, CheckCircle2, Lock, Mail, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-body">
      {/* Left Branding Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F172A] via-[#165F76] to-[#218DAE] p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2BBBD7]/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD758]/10 rounded-full blur-3xl -z-0"></div>

        <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="brand-mark">P</div>
          <div>
            <span className="font-display font-extrabold text-white text-xl tracking-tight block">
              POCKET MENTOR
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2BBBD7] block">
              AI Revision Assistant
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FCE59A] text-xs font-bold border border-white/20">
            <Sparkles size={14} className="text-[#2BBBD7]" /> Welcome Back Student
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Master what you actually know, one topic at a time.
          </h2>
          <p className="text-slate-200 text-sm leading-relaxed">
            Log in to continue your personalized revision, challenge your AI friend Anu, defeat topic bosses, and reach 100% exam readiness.
          </p>

          <div className="space-y-3 pt-4 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-[#2BBBD7]" /> Active Recall & Feynman Method Evaluation
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-[#2BBBD7]" /> Real-time Exam Readiness Analytics
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-[#2BBBD7]" /> Auto-updating Smart Mistake Bank
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} Pocket Mentor. All rights reserved.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <Link
          to="/"
          className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-[#218DAE] hover:border-[#218DAE]/40 transition shadow-sm"
        >
          <Home size={14} /> Back to Home
        </Link>

        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="brand-mark">P</div>
              <span className="font-display font-extrabold text-slate-900 text-lg">POCKET MENTOR</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Log in to your account
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Enter your credentials to access your revision dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="student@university.edu"
                  className="input-field pl-10"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#218DAE] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3.5 text-base"
            >
              Log In <ArrowRight size={18} />
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#218DAE] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
