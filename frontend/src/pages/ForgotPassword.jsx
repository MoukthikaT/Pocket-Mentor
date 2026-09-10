import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="brand-mark">P</div>
          <span className="font-display font-extrabold text-slate-900 text-lg">POCKET MENTOR</span>
        </div>

        {!submitted ? (
          <>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Forgot Password?</h1>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    className="input-field pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full py-3">
                Send Reset Link <ArrowRight size={16} />
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">Check your inbox</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We have sent a password reset link to <strong className="text-slate-700">{email}</strong>. Please check your email inbox or spam folder.
            </p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#218DAE] hover:underline">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
