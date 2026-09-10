import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
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
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Set New Password</h1>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              Create a new secure password for your Pocket Mentor account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div>
                <label className="label">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="input-field pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full py-3">
                Reset Password <ArrowRight size={16} />
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">Password Reset Complete!</h2>
            <p className="text-xs text-slate-500">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full py-3">
              Proceed to Login <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
