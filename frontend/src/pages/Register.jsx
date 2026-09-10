import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Sparkles, Eye, EyeOff, ArrowRight, User, Mail, Lock, CheckCircle2, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const response = await api.post('/auth/register', {
        ...form,
        confirmPassword: form.password,
      });
      login(response.data, response.data.token);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <Sparkles size={14} className="text-[#2BBBD7]" /> Join Pocket Mentor Today
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Transform your study routine with personalized AI revision.
          </h2>
          <p className="text-slate-200 text-sm leading-relaxed">
            Create your account to unlock AI note summarization, Feynman teaching roleplay, gamified boss battles, and smart mistake analytics.
          </p>

          <div className="space-y-3 pt-4 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-[#2BBBD7]" /> Free account setup with zero configuration
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-[#2BBBD7]" /> Personalized onboarding tailored to your exam
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-[#2BBBD7]" /> XP rewards & daily streak tracking
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} Pocket Mentor. All rights reserved.
        </div>
      </div>

      {/* Right Register Form */}
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
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Get started with Pocket Mentor in less than a minute.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Alex Johnson"
                  className="input-field pl-10"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Create a strong password"
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
              className="w-full py-3.5 text-base mt-2"
            >
              Start Free Account <ArrowRight size={18} />
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#218DAE] hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
