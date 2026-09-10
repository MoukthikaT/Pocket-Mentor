import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Brain,
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
  BarChart3,
  TrendingUp,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('teach');

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body selection:bg-[#2BBBD7]/20 selection:text-[#218DAE]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="brand-mark">P</div>
            <div>
              <span className="font-display font-black text-xl text-slate-900 tracking-tight block">
                POCKET MENTOR
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#218DAE] block">
                AI Revision Assistant
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#why" className="hover:text-[#218DAE] transition">Why Pocket Mentor</a>
            <a href="#journey" className="hover:text-[#218DAE] transition">Learning Journey</a>
            <a href="#features" className="hover:text-[#218DAE] transition">Features</a>
            <a href="#gamification" className="hover:text-[#218DAE] transition">Gamification</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#218DAE] transition"
                >
                  Log in
                </Link>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary"
                >
                  Start Learning <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-white via-slate-50 to-[#F0F9FC]">
        {/* Subtle background glow shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#2BBBD7]/15 to-[#FCE59A]/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2BBBD7]/10 border border-[#2BBBD7]/30 text-[#14819A] text-xs font-bold tracking-wide uppercase">
                <Sparkles size={14} className="text-[#2BBBD7]" />
                Your AI-Powered Personal Revision Mentor
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Study smarter. <br />
                <span className="bg-gradient-to-r from-[#218DAE] via-[#2BBBD7] to-[#14819A] bg-clip-text text-transparent">
                  Know what you actually know.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Pocket Mentor uses AI to personalize your revision, challenge your understanding, find your weak topics, and help you master them.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleStart}
                  className="btn-primary text-base px-8 py-4 w-full sm:w-auto shadow-xl shadow-[#218DAE]/25"
                >
                  Start Learning <ArrowRight size={18} />
                </button>
                <a
                  href="#journey"
                  className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
                >
                  See How It Works <Play size={16} className="fill-current" />
                </a>
              </div>

              {/* Mini Feature Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2BBBD7]" /> Personalised Revision Pack
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2BBBD7]" /> Teach AI Friend Mode
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2BBBD7]" /> Gamified Boss Battles
                </span>
              </div>
            </div>

            {/* Right Hero Visual: Dynamic Interactive Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card Shell */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-[#218DAE]/15 relative overflow-hidden backdrop-blur-xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2BBBD7] to-[#218DAE] flex items-center justify-center text-white font-bold shadow-md">
                        <Brain size={20} />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900">AI Active Mentor</h4>
                        <p className="text-xs text-[#2BBBD7] font-semibold">Analyzing computer science notes...</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFD758]/20 text-[#8A6700] text-xs font-bold flex items-center gap-1">
                      <Zap size={12} className="fill-[#FFD758]" /> 94% Mastery
                    </span>
                  </div>

                  {/* Dynamic Mock Content Card */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#F0F9FC] border border-[#2BBBD7]/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#218DAE]">Weak Spot Detected</span>
                        <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">High Priority</span>
                      </div>
                      <p className="font-display font-bold text-sm text-slate-800">Deadlock Prevention Algorithms</p>
                      <p className="text-xs text-slate-600 mt-1">You missed 2 questions in the last quiz. Let's fix this misconception.</p>
                    </div>

                    {/* Interactive Tab Preview inside Hero */}
                    <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-center">
                      <button
                        onClick={() => setActiveTab('teach')}
                        className={`py-2 rounded-lg transition ${activeTab === 'teach' ? 'bg-white text-[#218DAE] shadow-sm' : 'text-slate-500'}`}
                      >
                        Teach Anu
                      </button>
                      <button
                        onClick={() => setActiveTab('boss')}
                        className={`py-2 rounded-lg transition ${activeTab === 'boss' ? 'bg-white text-[#218DAE] shadow-sm' : 'text-slate-500'}`}
                      >
                        Boss Battle
                      </button>
                      <button
                        onClick={() => setActiveTab('rescue')}
                        className={`py-2 rounded-lg transition ${activeTab === 'rescue' ? 'bg-white text-[#218DAE] shadow-sm' : 'text-slate-500'}`}
                      >
                        5-Min Rescue
                      </button>
                    </div>

                    {/* Tab Preview Box */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm min-h-[140px] flex flex-col justify-between">
                      {activeTab === 'teach' && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-[#2BBBD7] text-white flex items-center justify-center text-xs font-bold">A</span>
                            <span className="text-xs font-bold text-slate-700">Anu (Beginner AI Friend):</span>
                          </div>
                          <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            "Wait, why does sem_wait() decrease the semaphore count? Explain like I'm 15!"
                          </p>
                          <div className="mt-3 flex justify-end">
                            <span className="px-3 py-1 rounded-xl bg-[#218DAE] text-white text-xs font-semibold">
                              Explain Now →
                            </span>
                          </div>
                        </div>
                      )}

                      {activeTab === 'boss' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                              <Swords size={14} /> DEADLOCK BOSS
                            </span>
                            <span className="text-xs font-bold text-slate-700">Boss HP: 65/100</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                            <div className="bg-rose-500 h-full w-2/3 rounded-full"></div>
                          </div>
                          <p className="text-xs text-slate-700 font-semibold">
                            Q: Which condition is NOT required for a deadlock?
                          </p>
                        </div>
                      )}

                      {activeTab === 'rescue' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                              <Clock size={14} /> 5-MINUTE EMERGENCY RESCUE
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">04:52</span>
                          </div>
                          <p className="text-xs text-slate-600">
                            ⚡ 5 Must-Know Concepts summarized before your exam starts.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating Micro Card 1 */}
                  <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center gap-3 animate-float hidden sm:flex">
                    <div className="w-8 h-8 rounded-xl bg-[#FFD758] flex items-center justify-center text-slate-900 font-black text-xs">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">7 Day Streak!</p>
                      <p className="text-[10px] text-slate-500">+150 XP Earned</p>
                    </div>
                  </div>

                  {/* Floating Micro Card 2 */}
                  <div className="absolute -bottom-4 -left-4 p-3 rounded-2xl bg-[#0F172A] text-white border border-slate-800 shadow-xl flex items-center gap-3 animate-float-delayed hidden sm:flex">
                    <div className="w-8 h-8 rounded-xl bg-[#2BBBD7] flex items-center justify-center text-white font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold">Mistake Resolved</p>
                      <p className="text-[10px] text-slate-400">Process Synchronization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Why Pocket Mentor? */}
      <section id="why" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#218DAE]">The Problem With Passive Studying</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Why traditional revision fails most students
            </h2>
            <p className="text-slate-600 mt-4 text-base">
              Rereading notes giving you a false sense of security. Pocket Mentor transforms how you revise by forcing active recall and targeted feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#218DAE]/40 transition hover:shadow-card-hover">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-4">
                <RefreshCw size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Revising Everything Equally</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students waste hours reviewing concepts they already know, while weak spots remain untouched.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#218DAE]/40 transition hover:shadow-card-hover">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-4">
                <HelpCircle size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Illusion of Competence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Recognizing a formula on paper is NOT the same as explaining it or applying it under exam conditions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#218DAE]/40 transition hover:shadow-card-hover">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold mb-4">
                <Target size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Forgotten Mistakes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Incorrect quiz answers are ignored instead of being logged, analyzed, and systematically corrected.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#218DAE]/40 transition hover:shadow-card-hover">
              <div className="w-12 h-12 rounded-xl bg-[#2BBBD7]/20 text-[#14819A] flex items-center justify-center font-bold mb-4">
                <Flame size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Last-Minute Panic</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cramming complex subjects 2 hours before an exam leads to anxiety and poor retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section C & D: Learning Journey Flow */}
      <section id="journey" className="py-24 bg-gradient-to-b from-[#F0F9FC] via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-[#FFD758]/30 text-[#8A6700] text-xs font-bold uppercase tracking-wider">
              The Master Methodology
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4">
              LEARN → TEACH → FIGHT → FIX → MASTER
            </h2>
            <p className="text-slate-600 mt-4 text-base">
              Five scientific stages to guarantee 100% concept mastery before your exam.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'LEARN',
                badge: 'AI Revision',
                desc: 'Upload notes or paste text to generate 60-second AI summaries & key concepts.',
                color: 'from-[#218DAE] to-[#1B7692]',
                icon: BookOpen,
              },
              {
                step: '02',
                title: 'TEACH',
                badge: 'Feynman Method',
                desc: 'Explain concepts to fictional AI friends like Anu. Get instant evaluation on clarity.',
                color: 'from-[#2BBBD7] to-[#1AA1BD]',
                icon: Users,
              },
              {
                step: '03',
                title: 'FIGHT',
                badge: 'Boss Battle',
                desc: 'Challenge topic bosses in gamified levels. Deal damage with correct answers!',
                color: 'from-[#FFD758] to-[#E5B82E]',
                icon: Swords,
                darkText: true,
              },
              {
                step: '04',
                title: 'FIX',
                badge: 'Mistake Graveyard',
                desc: 'Every wrong answer is stored in your lab with clear explanations & re-quizzes.',
                color: 'from-rose-500 to-rose-700',
                icon: Target,
              },
              {
                step: '05',
                title: 'MASTER',
                badge: 'Exam Readiness',
                desc: 'Track your real-time Readiness Score & enter exam hall with complete confidence.',
                color: 'from-emerald-500 to-emerald-700',
                icon: ShieldCheck,
              },
            ].map((item, idx) => (
              <div key={item.title} className="relative group">
                <div className="h-full p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display font-black text-2xl text-slate-300 group-hover:text-[#218DAE] transition">
                        {item.step}
                      </span>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} ${item.darkText ? 'text-slate-900' : 'text-white'} flex items-center justify-center font-bold shadow-md`}>
                        <item.icon size={20} />
                      </div>
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-slate-900 mb-1">{item.title}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#218DAE] block mb-3">{item.badge}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section E: Feature Showcase */}
      <section id="features" className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#218DAE]">Comprehensive Toolkit</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Everything you need to conquer your syllabus
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-card-hover transition">
              <div className="w-12 h-12 rounded-2xl bg-[#218DAE]/10 text-[#218DAE] flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">AI Revision Packs</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Instant 60-second topic summaries, key formulas, flashcards, and quizzes generated from your syllabus.
              </p>
              <span className="text-xs font-bold text-[#218DAE] flex items-center gap-1">
                Explore Revision →
              </span>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-card-hover transition">
              <div className="w-12 h-12 rounded-2xl bg-[#2BBBD7]/15 text-[#14819A] flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Teach a Friend (Anu)</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Roleplay as the teacher! Explain concepts to Anu, get feedback on clarity, missing details, and accuracy.
              </p>
              <span className="text-xs font-bold text-[#2BBBD7] flex items-center gap-1">
                Meet Anu →
              </span>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-card-hover transition">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD758]/30 text-[#8A6700] flex items-center justify-center mb-6">
                <Swords size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Gamified Boss Battles</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Face topic bosses across 5 difficulty levels. Correct answers deal massive HP damage; mistakes cost lives!
              </p>
              <span className="text-xs font-bold text-[#8A6700] flex items-center gap-1">
                Fight Bosses →
              </span>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-card-hover transition">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Smart Mistake Bank</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Auto-logs every incorrect answer across quizzes and battles. Fix mistakes with 1-click targeted practice.
              </p>
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                Fix Mistakes →
              </span>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-card-hover transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                <Flame size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">5-Minute Rescue Mode</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Got an exam in 10 minutes? Rapid recall summary, top traps to avoid, and rapid readiness check.
              </p>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                Emergency Revision →
              </span>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-card-hover transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Exam Readiness Score</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Algorithmic readiness metric based on quiz accuracy, teaching clarity, boss completion, and consistency.
              </p>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                Check Readiness →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section G: Gamification & Rewards */}
      <section id="gamification" className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3 py-1 rounded-full bg-[#FFD758]/20 text-[#FFD758] text-xs font-bold tracking-widest uppercase">
                Gamified Learning Engine
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Turn revision into a rewarding habit
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Stay motivated every single day with XP points, streak multipliers, level progression, and unlockable achievement badges.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD758] text-slate-900 flex items-center justify-center font-bold shrink-0">
                    <Zap size={20} className="fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">XP & Level Progression</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Earn XP for every quiz completed, topic taught to Anu, and boss defeated.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-[#2BBBD7] text-white flex items-center justify-center font-bold shrink-0">
                    <Flame size={20} className="fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Daily Study Streaks</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Build consistent study habits and unlock streak protection bonuses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Achievement Trophies</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Collect rare badges like "Teach Like A Pro", "Mistake Crusher", and "Rescue Survivor".</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Trophy Showcase */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-2xl relative">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#FFD758] to-[#FCE59A] flex items-center justify-center text-slate-900 font-black text-3xl shadow-gold mb-3">
                    🏆
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-white">Student Leaderboard Ready</h3>
                  <p className="text-xs text-slate-400 mt-1">Level 5 Master Student • 1,450 XP</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                    <span className="text-xs font-semibold text-slate-400 block">Streak</span>
                    <span className="font-display font-black text-xl text-[#FFD758]">7 Days 🔥</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                    <span className="text-xs font-semibold text-slate-400 block">Readiness</span>
                    <span className="font-display font-black text-xl text-[#2BBBD7]">88%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                    <span className="text-xs font-semibold text-slate-400 block">Bosses Defeated</span>
                    <span className="font-display font-black text-xl text-rose-400">12</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                    <span className="text-xs font-semibold text-slate-400 block">Mistakes Fixed</span>
                    <span className="font-display font-black text-xl text-emerald-400">34</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section H: Final Call To Action */}
      <section className="py-24 bg-gradient-to-r from-[#218DAE] via-[#1B7692] to-[#0F172A] text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-white/10 text-[#FCE59A] text-xs font-bold uppercase tracking-widest border border-white/20">
            Stop Rereading. Start Mastering.
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
            Ready to experience your personal AI revision mentor?
          </h2>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto font-medium">
            Join thousands of students mastering their exams with active recall, AI teaching roleplays, and gamified revision.
          </p>

          <div className="pt-4">
            <button
              onClick={handleStart}
              className="btn-accent text-base px-10 py-4 font-extrabold text-slate-900 shadow-2xl hover:scale-105 transition"
            >
              Enter Pocket Mentor <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Section I: Footer */}
      <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="brand-mark">P</div>
                <span className="font-display font-extrabold text-white text-lg">POCKET MENTOR</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Your AI-powered personal revision mentor. Helping students personalize study plans, identify weak topics, and master exams.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition">AI Revision</a></li>
                <li><a href="#journey" className="hover:text-white transition">Teach a Friend</a></li>
                <li><a href="#features" className="hover:text-white transition">Boss Battles</a></li>
                <li><a href="#features" className="hover:text-white transition">Mistake Graveyard</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#why" className="hover:text-white transition">Why Active Recall</a></li>
                <li><a href="#journey" className="hover:text-white transition">Learning Journey</a></li>
                <li><a href="#gamification" className="hover:text-white transition">XP & Streaks</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Contact Us</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Pocket Mentor. All rights reserved. Built with AI & Passion for Hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
}
