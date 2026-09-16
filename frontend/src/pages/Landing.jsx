import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Swords,
  Target,
  Flame,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Play,
  Award,
  BookOpen,
  HelpCircle,
  RefreshCw,
  Clock,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../context/ThemeContext';

const featureDetails = {
  revision: {
    label: 'Revision Packs',
    icon: BookOpen,
    eyebrow: 'START WITH YOUR MATERIAL',
    title: 'Turn your own notes into a revision session.',
    description:
      'Add the study material you actually want to revise. Pocket Mentor can organise that material into a concise summary, key concepts, flashcards and quiz questions.',
    points: [
      'Use your own pasted notes or uploaded material.',
      'Generated content is based on the material you provide.',
      'Review summaries and key concepts before testing yourself.',
    ],
  },

  teach: {
    label: 'Teach a Friend',
    icon: Users,
    eyebrow: 'LEARN BY EXPLAINING',
    title: 'Explain it in your own words.',
    description:
      'Teach a fictional beginner AI friend and practise explaining an idea clearly. The experience is designed around active recall rather than simply reading an answer.',
    points: [
      'Explain a concept as if you were teaching someone new.',
      'Respond to follow-up questions.',
      'Use the feedback to identify parts of your explanation that need work.',
    ],
  },

  battle: {
    label: 'Boss Battle',
    icon: Swords,
    eyebrow: 'PRACTISE UNDER PRESSURE',
    title: 'Turn your revision questions into a challenge.',
    description:
      'Boss Battle gives your practice a game-like layer. Questions are generated from the study material associated with your learning session, so the challenge stays connected to what you are studying.',
    points: [
      'Answer questions based on your supplied study material.',
      'Correct answers damage the opponent.',
      'Mistakes can be used to identify areas for further revision.',
    ],
  },

  mistakes: {
    label: 'Mistake Bank',
    icon: Target,
    eyebrow: 'LEARN FROM WRONG ANSWERS',
    title: 'Do something with the questions you missed.',
    description:
      'Instead of letting an incorrect answer disappear, Pocket Mentor can keep track of mistakes so they can become part of your future revision.',
    points: [
      'Keep a record of incorrect attempts.',
      'Identify repeated problem areas.',
      'Return to those areas for another round of practice.',
    ],
  },

  rescue: {
    label: '5-Minute Rescue',
    icon: Clock,
    eyebrow: 'WHEN TIME IS SHORT',
    title: 'Use the few minutes you have wisely.',
    description:
      'Rescue Mode is designed for a quick revision session when you do not have much time. It focuses on the material already available in your Pocket Mentor workspace.',
    points: [
      'Quickly revisit important material.',
      'Focus on areas that need attention.',
      'Finish with a short readiness check.',
    ],
  },

  readiness: {
    label: 'Exam Readiness',
    icon: ShieldCheck,
    eyebrow: 'SEE YOUR PROGRESS',
    title: 'Understand where you stand.',
    description:
      'Your readiness view brings together learning activity and practice results to give you a clearer picture of your preparation.',
    points: [
      'Review your practice performance.',
      'See areas that may require additional revision.',
      'Use your results to decide what to practise next.',
    ],
  },
};

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const openFeature = (feature) => {
    setSelectedFeature(feature);
  };

  const closeFeature = () => {
    setSelectedFeature(null);
  };

  const selected = selectedFeature
    ? featureDetails[selectedFeature]
    : null;

  return (
    <div className="landing-page min-h-screen overflow-hidden bg-[#F7FAFB] font-body text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8">

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3"
          >
            <div className="brand-mark">P</div>

            <div className="text-left">
              <div className="font-logo text-lg text-slate-900">
                Pocket Mentor
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#218DAE]">
                Personal Revision Workspace
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#why" className="transition hover:text-[#218DAE]">
              The study gap
            </a>
            <a href="#journey" className="transition hover:text-[#218DAE]">
              Your study loop
            </a>
            <a href="#features" className="transition hover:text-[#218DAE]">
              The toolkit
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isAuthenticated && (
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:text-[#218DAE] sm:block"
              >
                Log in
              </Link>
            )}

            <button
              onClick={handleStart}
              className="btn-primary"
            >
              {isAuthenticated ? 'Dashboard' : 'Get Started'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-[#FDFEFE] via-[#F0FAFC] to-[#FFF7DF]">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(33,141,174,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(33,141,174,0.06)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#2BBBD7]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[500px] w-[500px] rounded-full bg-[#FCE59A]/30 blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-32 h-4 w-16 rotate-45 rounded-full bg-[#A4E8DE]/80" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">

          <div className="lg:col-span-7">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2BBBD7]/25 bg-[#2BBBD7]/10 px-4 py-2 text-xs font-bold text-[#167A91]">
              <Sparkles size={14} />
              A revision space built around your material
            </div>

            <h1 className="max-w-3xl font-display text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[62px]">
              Your notes are the
              <span className="mt-1 block text-[#218DAE]">
                starting point.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Pocket Mentor turns the material you provide into different
              ways to revise — from quick summaries and flashcards to
              teaching, quizzes and game-style challenges.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleStart}
                className="btn-primary px-7 py-3.5 text-base shadow-lg shadow-[#218DAE]/20"
              >
                Start with my notes
                <ArrowRight size={18} />
              </button>

              <a
                href="#journey"
                className="btn-secondary px-7 py-3.5 text-base"
              >
                <Play size={16} />
                See the study loop
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#218DAE]" />
                Your material
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#218DAE]" />
                Active practice
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#218DAE]" />
                Progress tracking
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative lg:col-span-5">

            <div className="relative rounded-[30px] border border-[#B9E5EE] bg-gradient-to-br from-[#DDF7F7] via-[#EAF8FA] to-[#FFF0C7] p-3 shadow-2xl shadow-[#218DAE]/15 sm:p-5">

              <div className="rounded-2xl bg-white p-5 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)] sm:p-6">

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#218DAE] text-white">
                      <BookOpen size={20} />
                    </div>

                    <div>
                      <div className="text-sm font-bold">
                        My Study Space
                      </div>
                      <div className="text-xs text-slate-400">
                        Built from your material
                      </div>
                    </div>
                  </div>

                    <span className="rounded-full bg-[#E4F7EC] px-2.5 py-1 text-[10px] font-bold text-[#207447]">
                    READY WHEN YOU ARE
                  </span>
                </div>

                <div className="mt-5 space-y-3">

                  <div className="rounded-2xl bg-[#F0F9FC] p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#218DAE]">
                      <Sparkles size={14} />
                      REVISION
                    </div>

                    <div className="mt-2 h-2 w-4/5 rounded-full bg-slate-200">
                      <div className="h-full w-3/5 rounded-full bg-[#2BBBD7]" />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Your supplied material becomes the starting point.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      onClick={() => openFeature('teach')}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-1 hover:border-[#2BBBD7]/50 hover:shadow-md"
                    >
                      <Users size={18} className="text-[#218DAE]" />
                      <div className="mt-3 text-xs font-bold">
                        Teach
                      </div>
                      <div className="mt-1 text-[10px] text-slate-400">
                        Explain it
                      </div>
                    </button>

                    <button
                      onClick={() => openFeature('battle')}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-1 hover:border-[#FFD758] hover:shadow-md"
                    >
                      <Swords size={18} className="text-[#8A6700]" />
                      <div className="mt-3 text-xs font-bold">
                        Battle
                      </div>
                      <div className="mt-1 text-[10px] text-slate-400">
                        Test yourself
                      </div>
                    </button>

                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <Target size={17} className="text-[#2BBBD7]" />
                      <span className="text-xs font-semibold">
                        Keep improving
                      </span>
                    </div>

                    <ChevronRight size={16} className="text-slate-400" />
                  </div>

                </div>
              </div>

              <div className="absolute -right-5 -top-5 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:block">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-[#FFD758] p-2">
                    <Zap size={15} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      Practice
                    </div>
                    <div className="text-[10px] text-slate-400">
                      One step at a time
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* THE STUDY GAP */}
      <section id="why" className="relative overflow-hidden border-b border-white/10 bg-[#0F172A] py-24 text-white">
        <div className="pointer-events-none absolute -right-20 top-12 h-40 w-40 rotate-12 rounded-[2rem] bg-[#2BBBD7]/10" />
        <div className="pointer-events-none absolute bottom-10 left-[-3rem] h-28 w-28 rounded-full border-[18px] border-[#FFD758]/15" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="relative max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7EEBE0]">
              THE STUDY GAP
            </span>

            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Familiarity is not the same as knowing.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Pocket Mentor turns passive notes into moments where you retrieve,
              explain, test and repair your understanding.
            </p>
          </div>

          <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: RefreshCw,
                accent: 'bg-[#DDF7F7] text-[#14819A]',
                border: 'border-t-[#2BBBD7]',
                title: 'The familiarity trap',
                text: 'A page can look familiar while the idea disappears the moment you close it.',
              },
              {
                icon: HelpCircle,
                accent: 'bg-[#FFE5DF] text-[#C25B4A]',
                border: 'border-t-[#FF9F8F]',
                title: 'The blank-page test',
                text: 'Explaining an idea in your own words reveals what is clear and what is still fuzzy.',
              },
              {
                icon: Target,
                accent: 'bg-[#FFF0C7] text-[#9A6D00]',
                border: 'border-t-[#F6C453]',
                title: 'The useful miss',
                text: 'A wrong answer becomes a signal you can revisit instead of a score you simply forget.',
              },
              {
                icon: Flame,
                accent: 'bg-[#E8E0FF] text-[#6C55A8]',
                border: 'border-t-[#9F8BE8]',
                title: 'The short window',
                text: 'When time is tight, a focused pass through your own material beats searching everywhere.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-white/10 border-t-4 ${item.border} bg-white/[0.06] p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg`}
              >
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${item.accent}`}>
                  <item.icon size={21} />
                </div>

                <h3 className="font-display text-base font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* STUDY LOOP */}
      <section id="journey" className="bg-[#F7FCFC] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#218DAE]">
              YOUR STUDY LOOP
            </span>

            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Turn one pack into a repeatable practice loop.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              One study session can move through different activities depending
              on what you want to practise.
            </p>
          </div>

          <div className="relative mt-14 grid gap-4 md:grid-cols-5">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-10 hidden h-px bg-[#A4E8DE] md:block" />

            {[
              ['01', 'LEARN', 'Start from the notes and material you provide.', BookOpen],
              ['02', 'TEACH', 'Explain an idea in your own words.', Users],
              ['03', 'TEST', 'Answer questions connected to your material.', Swords],
              ['04', 'FIX', 'Return to mistakes instead of ignoring them.', Target],
              ['05', 'REPEAT', 'Practise again and track your progress.', ShieldCheck],
            ].map(([number, title, text, Icon]) => (
              <div
                key={title}
                className="relative z-10 rounded-2xl border border-white bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-black text-[#B9E5EE]">
                    {number}
                  </span>

                  <div className="rounded-xl bg-[#218DAE]/10 p-2.5 text-[#218DAE]">
                    <Icon size={19} />
                  </div>
                </div>

                <h3 className="mt-5 font-display text-lg font-extrabold">
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TOOLKIT */}
      <section id="features" className="bg-[#0F172A] py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7EEBE0]">
                THE TOOLKIT
              </span>

              <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Different ways to use your study material
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Six focused ways to turn your own material into active practice.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {[
              ['revision', 'AI Revision Packs', 'Summaries, key concepts, flashcards and quizzes from your material.', BookOpen],
              ['teach', 'Teach a Friend', 'Practise explaining concepts to a fictional beginner.', Users],
              ['battle', 'Boss Battle', 'Turn material-based questions into a game-style challenge.', Swords],
              ['mistakes', 'Smart Mistake Bank', 'Keep track of questions you got wrong and revisit them.', Target],
              ['rescue', '5-Minute Rescue', 'A quick revision mode for when you have very little time.', Clock],
              ['readiness', 'Exam Readiness', 'Bring together practice activity to understand your progress.', ShieldCheck],
            ].map(([id, title, text, Icon]) => (
              <div
                key={id}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#7EEBE0]/40 hover:bg-white/10 hover:shadow-xl"
              >

                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7EEBE0]/15 text-[#7EEBE0]">
                    <Icon size={23} />
                  </div>

                  <button
                    onClick={() => openFeature(id)}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-[#7EEBE0] transition hover:bg-[#7EEBE0]/10"
                  >
                    Open panel
                    <ChevronRight size={14} />
                  </button>
                </div>

                <h3 className="mt-6 font-display text-xl font-extrabold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {text}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* GAMIFICATION */}
      <section className="bg-[#FFF7DF] py-20 text-slate-900">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">

          <div>
            <span className="inline-flex rounded-full border border-[#F6C453]/40 bg-[#FFD758]/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8A6700]">
              A little game goes a long way
            </span>

            <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Make practice feel like progress.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              Pocket Mentor adds game-style elements to revision so that
              answering questions, fixing mistakes and maintaining consistency
              feel more engaging.
            </p>

            <div className="mt-8 space-y-3">

              <div className="flex items-center gap-4 rounded-2xl border border-[#F0DDB5] bg-white/70 p-4">
                <Zap className="text-[#FFD758]" size={20} />
                <div>
                  <div className="text-sm font-bold">XP and progress</div>
                  <div className="text-xs text-slate-500">
                    Make your study activity visible.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#B9E5EE] bg-white/70 p-4">
                <Flame className="text-[#2BBBD7]" size={20} />
                <div>
                  <div className="text-sm font-bold">Study streaks</div>
                  <div className="text-xs text-slate-500">
                    Keep a consistent revision habit.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#E8E0FF] bg-white/70 p-4">
                <Award className="text-[#FFD758]" size={20} />
                <div>
                  <div className="text-sm font-bold">Achievements</div>
                  <div className="text-xs text-slate-500">
                    Celebrate completed learning activities.
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-[30px] border border-[#F0DDB5] bg-white/70 p-6 shadow-xl shadow-[#F6C453]/15">

              <div className="rounded-2xl bg-[#0F172A] p-5 text-white">

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    YOUR PROGRESS
                  </span>

                  <span className="rounded-full bg-[#FFD758]/10 px-2 py-1 text-[10px] font-bold text-[#FFD758]">
                    ACTIVE
                  </span>
                </div>

                <div className="mt-7">
                  <div className="flex items-end justify-between">
                    <span className="font-display text-4xl font-black">
                      Keep going
                    </span>

                    <span className="text-xs text-slate-500">
                      one session at a time
                    </span>
                  </div>

                  <div className="mt-5 h-3 rounded-full bg-white/10">
                    <div className="h-full w-3/5 rounded-full bg-[#2BBBD7]" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <div className="text-lg font-black">XP</div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      earned
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <div className="text-lg font-black">🔥</div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      streak
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <div className="text-lg font-black">✓</div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      practice
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F172A] px-5 py-20 text-center text-white">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
          Ready to make your notes useful?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-200">
          Bring your own study material and build a revision session around it.
        </p>

        <button
          onClick={handleStart}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FFD758] px-7 py-3.5 text-sm font-extrabold text-slate-900 shadow-xl transition hover:-translate-y-1"
        >
          Get Started
          <ArrowRight size={17} />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] px-5 pb-8 pt-14 text-slate-300 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
            <div className="max-w-xs">
              <div className="flex items-center gap-3">
                <div className="brand-mark">P</div>
                <div>
                  <div className="font-logo text-base text-white">POCKET MENTOR</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#7EEBE0]">Personal revision workspace</div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-400">
                Bring your own material. Build a better way to remember it.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD758]">Explore</h3>
              <div className="mt-4 space-y-3 text-sm">
                <a href="#why" className="block transition hover:text-white">The study gap</a>
                <a href="#journey" className="block transition hover:text-white">Your study loop</a>
                <a href="#features" className="block transition hover:text-white">The toolkit</a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#7EEBE0]">Practice</h3>
              <div className="mt-4 space-y-3 text-sm">
                <button onClick={handleStart} className="block text-left transition hover:text-white">Revision packs</button>
                <button onClick={handleStart} className="block text-left transition hover:text-white">Teach a Friend</button>
                <button onClick={handleStart} className="block text-left transition hover:text-white">Boss Battle</button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFB3A6]">Start with one page</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Turn the material you already have into your next study session.</p>
              <button onClick={handleStart} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FFD758] px-4 py-2.5 text-xs font-extrabold text-slate-900 transition hover:-translate-y-0.5">
                Begin a session <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Pocket Mentor</span>
            <div className="flex gap-5">
              <Link to="/login" className="transition hover:text-white">Log in</Link>
              <Link to="/register" className="transition hover:text-white">Create account</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* FEATURE MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
          onClick={closeFeature}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={closeFeature}
              className="absolute right-5 top-5 z-10 rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="bg-gradient-to-br from-[#F0F9FC] to-white px-7 pb-7 pt-8 sm:px-9">

              <div className="flex items-start gap-4 pr-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#218DAE] text-white shadow-lg shadow-[#218DAE]/20">
                  <selected.icon size={25} />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#218DAE]">
                    {selected.eyebrow}
                  </span>

                  <h3 className="mt-1 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {selected.title}
                  </h3>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-600">
                {selected.description}
              </p>
            </div>

            <div className="px-7 py-7 sm:px-9">

              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                What happens here
              </h4>

              <div className="mt-4 space-y-3">
                {selected.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#218DAE]"
                    />

                    <span className="text-sm leading-6 text-slate-600">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    closeFeature();
                    handleStart();
                  }}
                  className="btn-primary flex-1 py-3"
                >
                  Try Pocket Mentor
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={closeFeature}
                  className="btn-secondary flex-1 py-3"
                >
                  Continue exploring
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}