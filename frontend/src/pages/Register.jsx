import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  Home,
  CheckCircle2,
  BookOpen,
  Brain,
  Target,
  Sparkles,
} from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [legalModal, setLegalModal] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name) {
      setError('Please enter your full name.');
      return;
    }

    if (name.length < 2) {
      setError('Please enter a valid name.');
      return;
    }

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please create a password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreed) {
      setError(
        'Please agree to the Terms of Service and Privacy Policy.'
      );
      return;
    }

    // -----------------------------
    // REGISTER
    // -----------------------------

    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      const data = response.data;

      /*
       * Supports the common response structures
       * used by the Pocket Mentor backend.
       */

      const token =
        data?.token ||
        data?.data?.token ||
        data?.accessToken ||
        data?.data?.accessToken;

      const registeredUser =
        data?.user ||
        data?.data?.user ||
        data?.data;

      if (token && registeredUser) {
        login(registeredUser, token);

        navigate('/onboarding');
        return;
      }

      /*
       * If backend does not automatically log the user in,
       * redirect them to Login.
       */

      navigate('/login', {
        state: {
          message:
            'Account created successfully. Please log in.',
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Unable to create your account right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FBFC] flex">

      {/* =====================================================
          LEFT INFORMATION PANEL
          ===================================================== */}

      <section className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-[#0F172A] text-white">

        {/* Background decoration */}

        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#218DAE]/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#2BBBD7]/10 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col gap-10 p-10 xl:p-14">

          {/* BRAND */}

          <Link
            to="/"
            className="flex items-center gap-3 w-fit"
          >
            <div className="brand-mark">
              P
            </div>

            <div>
              <div className="font-logo text-xl">
                POCKET MENTOR
              </div>

              <div className="text-[10px] uppercase tracking-[0.22em] text-[#2BBBD7] font-bold">
                Learn your way
              </div>
            </div>
          </Link>

          {/* MAIN CONTENT */}

          <div className="max-w-lg">

            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[#FCE59A] text-xs font-semibold">
              {/* <Sparkles size={14} /> */}

              A study space built around your notes
            </div>

            <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight mt-4">
              Your notes.
              <br />

              <span className="text-[#2BBBD7]">
                Your learning.
              </span>
            </h1>

            <p className="mt-4 text-slate-300 leading-relaxed text-base">
              Pocket Mentor turns the material you provide into
              a focused revision experience, helping you
              understand, practise and revisit what matters.
            </p>

            {/* FEATURE 1 */}

            <div className="mt-6 space-y-2.5">

              <div className="flex items-center gap-4 rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">

                <div className="w-11 h-11 rounded-xl bg-[#218DAE]/20 text-[#2BBBD7] flex items-center justify-center shrink-0">
                  <BookOpen size={21} />
                </div>

                <div>
                  <p className="font-semibold text-white text-sm">
                    Build revision packs
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Work with the study material you provide.
                  </p>
                </div>

              </div>

              {/* FEATURE 2 */}

              <div className="flex items-center gap-4 rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">

                <div className="w-11 h-11 rounded-xl bg-[#2BBBD7]/15 text-[#2BBBD7] flex items-center justify-center shrink-0">
                  <Brain size={21} />
                </div>

                <div>
                  <p className="font-semibold text-white text-sm">
                    Test your understanding
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Revise through questions and active recall.
                  </p>
                </div>

              </div>

              {/* FEATURE 3 */}

              <div className="flex items-center gap-4 rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">

                <div className="w-11 h-11 rounded-xl bg-[#FCE59A]/10 text-[#FCE59A] flex items-center justify-center shrink-0">
                  <Target size={21} />
                </div>

                <div>
                  <p className="font-semibold text-white text-sm">
                    Find what needs more practice
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Use your attempts to guide your next revision.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* BOTTOM QUOTE */}

          <div className="pt-8 border-t border-white/10">

            <p className="text-sm text-slate-400">
              “Good revision is not about studying everything
              again. It is about knowing what to work on next.”
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          RIGHT REGISTER SECTION
          ===================================================== */}

      <section className="relative w-full lg:w-[52%] flex items-center justify-center px-5 py-6 sm:px-8">

        <div className="w-full max-w-xl">

          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#218DAE]/40 hover:text-[#218DAE]"
          >
            <Home size={14} />
            Home
          </Link>

          {/* MOBILE BRAND */}

          <div className="lg:hidden flex items-center gap-3 mb-6">

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="brand-mark">
                P
              </div>

              <div>

                <div className="font-logo text-lg text-slate-900">
                  POCKET MENTOR
                </div>

                <div className="text-[9px] uppercase tracking-[0.2em] text-[#218DAE] font-bold">
                  Learn your way
                </div>

              </div>
            </Link>

          </div>

          {/* PAGE HEADER */}

          <div className="mb-5">

              <div className="w-12 h-12 rounded-2xl bg-[#F6C453]/25 text-[#9A6D00] flex items-center justify-center mb-3">
              <UserRound size={24} />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              Create your account
            </h2>

            <p className="mt-2 text-slate-500">
              Set up your Pocket Mentor space and start building
              your personalised revision experience.
            </p>

          </div>

          {/* FORM CARD */}

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-900/5 p-6 sm:p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-3.5"
            >

              {/* =================================================
                  FULL NAME
                  ================================================= */}

              <div>

                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Full name
                </label>

                <div className="relative">

                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="input-field !pl-12"
                    required
                  />

                </div>

              </div>

              {/* =================================================
                  EMAIL
                  ================================================= */}

              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input-field !pl-12"
                    required
                  />

                </div>

              </div>

              {/* =================================================
                  PASSWORD
                  ================================================= */}

              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="input-field !pl-12 !pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 transition"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  At least 8 characters, including one uppercase
                  letter and one number.
                </p>

              </div>

              {/* =================================================
                  CONFIRM PASSWORD
                  ================================================= */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Confirm password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter your password again"
                    className="input-field !pl-12 !pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 transition"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* =================================================
                  TERMS CHECKBOX
                  ================================================= */}

              <label className="flex items-start gap-3 cursor-pointer pt-1">

                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) =>
                    setAgreed(e.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#218DAE] focus:ring-[#218DAE]"
                />

                <span className="text-xs sm:text-sm text-slate-500 leading-relaxed">

                  I agree to the{' '}

                  <button
                    type="button"
                    onClick={() =>
                      setLegalModal('terms')
                    }
                    className="font-semibold text-[#218DAE] hover:text-[#176D86] underline underline-offset-2"
                  >
                    Terms of Service
                  </button>

                  {' '}and{' '}

                  <button
                    type="button"
                    onClick={() =>
                      setLegalModal('privacy')
                    }
                    className="font-semibold text-[#218DAE] hover:text-[#176D86] underline underline-offset-2"
                  >
                    Privacy Policy
                  </button>

                  .
                </span>

              </label>

              {/* =================================================
                  ERROR MESSAGE
                  ================================================= */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* =================================================
                  REGISTER BUTTON
                  ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading ? (
                  'Creating your account...'
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

            {/* =================================================
                LOGIN LINK
                ================================================= */}

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">

              <p className="text-sm text-slate-500">

                Already have an account?{' '}

                <Link
                  to="/login"
                  className="font-bold text-[#218DAE] hover:text-[#176D86] transition"
                >
                  Log in
                </Link>

              </p>

            </div>

          </div>

          {/* SMALL TRUST MESSAGE */}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

            <CheckCircle2
              size={15}
              className="text-[#218DAE]"
            />

            Your account is ready for your own study material.

          </div>

        </div>

      </section>

      {/* =====================================================
          TERMS / PRIVACY MODAL
          ===================================================== */}

      {legalModal && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          onClick={() => setLegalModal(null)}
        >

          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#218DAE]">
                  Pocket Mentor
                </p>

                <h3 className="mt-1 font-display text-xl sm:text-2xl font-extrabold text-slate-900">

                  {legalModal === 'terms'
                    ? 'Terms of Service'
                    : 'Privacy Policy'}

                </h3>

              </div>

              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="max-h-[65vh] overflow-y-auto px-6 py-6 sm:px-8">

              {/* =================================================
                  TERMS
                  ================================================= */}

              {legalModal === 'terms' ? (

                <div className="space-y-5 text-sm leading-7 text-slate-600">

                  <section>

                    <h4 className="font-bold text-slate-900">
                      1. Using Pocket Mentor
                    </h4>

                    <p className="mt-1">
                      Pocket Mentor is a learning and revision
                      platform designed to help students organise
                      and practise their own study material.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      2. Your Study Material
                    </h4>

                    <p className="mt-1">
                      You are responsible for the notes, text,
                      images and other study material that you
                      provide to Pocket Mentor. You should only
                      upload material that you are permitted to use.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      3. AI-Generated Learning Content
                    </h4>

                    <p className="mt-1">
                      Pocket Mentor may generate summaries,
                      flashcards, quizzes and other learning
                      assistance based on the material you provide.
                      You should review generated content before
                      relying on it for academic purposes.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      4. Account Responsibility
                    </h4>

                    <p className="mt-1">
                      You are responsible for keeping your account
                      credentials secure and for activity carried
                      out through your account.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      5. Educational Use
                    </h4>

                    <p className="mt-1">
                      Pocket Mentor is intended as a study aid.
                      It does not replace textbooks, teachers,
                      official course material or professional
                      academic guidance.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      6. Changes
                    </h4>

                    <p className="mt-1">
                      These terms may be updated as Pocket Mentor
                      evolves. Important changes should be
                      communicated appropriately to users.
                    </p>

                  </section>

                </div>

              ) : (

                /* =================================================
                   PRIVACY POLICY
                   ================================================= */

                <div className="space-y-5 text-sm leading-7 text-slate-600">

                  <section>

                    <h4 className="font-bold text-slate-900">
                      1. Information We Collect
                    </h4>

                    <p className="mt-1">
                      Pocket Mentor may collect account information
                      such as your name and email address, along
                      with information required to provide the
                      learning features of the platform.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      2. Study Material
                    </h4>

                    <p className="mt-1">
                      Notes and study material that you provide
                      may be processed to create summaries,
                      flashcards, quizzes and other requested
                      learning content.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      3. Learning Activity
                    </h4>

                    <p className="mt-1">
                      Your quiz attempts, scores and learning
                      activity may be stored to provide features
                      such as progress tracking, revision history
                      and mistake review.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      4. Account Security
                    </h4>

                    <p className="mt-1">
                      We use appropriate technical measures to
                      help protect account information. However,
                      no online service can guarantee absolute
                      security.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      5. Your Information
                    </h4>

                    <p className="mt-1">
                      Pocket Mentor should only request information
                      that is relevant to providing and improving
                      the learning experience.
                    </p>

                  </section>

                  <section>

                    <h4 className="font-bold text-slate-900">
                      6. Privacy Questions
                    </h4>

                    <p className="mt-1">
                      If you have questions about how information
                      is handled, please contact the Pocket Mentor
                      team through the appropriate support channel.
                    </p>

                  </section>

                </div>

              )}

            </div>

            {/* =================================================
                MODAL FOOTER
                ================================================= */}

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">

              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="btn-primary w-full justify-center sm:w-auto"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}