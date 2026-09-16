import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../hooks/useAuth';
import { getDashboardStats } from '../services/studyStore';
import { getLearningOverview } from '../services/learningApi';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Target,
  Swords,
  Users,
  BookOpen,
  Trophy,
  CalendarDays,
  ShieldCheck,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardTitle } from '../components/ui/Card';
import Progress, { ProgressRing } from '../components/ui/Progress';
import Badge from '../components/ui/Badge';
import { LoadingState } from '../components/ui/PageHeader';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { packs, attempts, averageScore, weakTopics } = getDashboardStats(user?._id);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningOverview()
      .then(setOverview)
      .catch(() => setOverview({}))
      .finally(() => setLoading(false));
  }, []);

  const profile = overview?.profile || user?.profile;
  const readiness = overview?.readiness || 0;
  const daysUntilExam = profile?.examDate
    ? Math.max(0, Math.ceil((new Date(profile.examDate) - new Date()) / 86400000))
    : null;

  const weakest = overview?.weakTopics?.[0] || weakTopics?.[0];
  const strongest = profile?.subjects?.length
    ? [...profile.subjects].sort((a, b) => b.confidence - a.confidence)[0]
    : null;

  const records = overview?.records || [];

  const achievements = useMemo(
    () => [
      { id: 1, label: 'First Topic Mastered', unlocked: attempts.some((attempt) => Number(attempt.percentage) >= 80), icon: BookOpen, color: 'cyan' },
      { id: 2, label: 'Consistent learner', unlocked: records.length > 1, icon: Flame, color: 'yellow' },
      { id: 3, label: 'Teach Like A Pro', unlocked: records.some((item) => item.kind === 'teaching'), icon: Users, color: 'teal' },
      { id: 4, label: 'Boss Crusher', unlocked: records.some((item) => item.kind === 'boss'), icon: Swords, color: 'yellow' },
    ],
    [packs.length, records]
  );

  if (loading) {
    return (
      <AppShell>
        <LoadingState message="Loading your Pocket Mentor Command Center..." />
      </AppShell>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        {/* Command Center Greeting & Quick Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="cyan" icon={Sparkles}>Command Center</Badge>
              {daysUntilExam !== null && (
                <Badge variant="yellow" icon={CalendarDays}>{daysUntilExam} Days Until Exam</Badge>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {firstName} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here is your active learning intelligence summary for today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/create-study')}
              variant="primary"
              icon={Plus}
            >
              New Revision Pack
            </Button>
            <Button
              onClick={() => navigate('/rescue')}
              variant="accent"
              icon={Flame}
            >
              5-Min Rescue
            </Button>
          </div>
        </div>

        {/* Mission Banner & Readiness Score */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Mission Banner */}
          <div className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#165F76] to-[#218DAE] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#2BBBD7]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3 max-w-lg">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2BBBD7] bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  Your Next Mission
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {weakest ? `Defeat the "${weakest.topic}" Knowledge Gap` : 'Build Your First Revision Pack'}
                </h2>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {weakest
                    ? `AI detected a repeated misconception in ${weakest.topic}. Resolve it now through Feynman teaching or a Boss battle.`
                    : 'Upload your lecture notes or paste syllabus topics to start your personalized learning journey.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(weakest ? '/boss-battle' : '/create-study')}
                    className="btn-accent px-5 py-2.5 text-xs font-extrabold text-slate-900 shadow-gold"
                  >
                    {weakest ? 'Enter Boss Arena' : 'Build Pack Now'} <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => navigate('/teach')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/20 transition"
                  >
                    <Users size={15} /> Teach Anu
                  </button>
                </div>
              </div>

              {/* Meter */}
              <div className="shrink-0 mx-auto sm:mx-0 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <ProgressRing value={readiness} size={110} strokeWidth={10} variant="cyan" />
                <p className="text-[11px] font-bold text-slate-200 mt-2 uppercase tracking-wider">Exam Readiness</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="lg:col-span-4 space-y-4">
            <Card hoverEffect={false} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strongest Subject</span>
                <Badge variant="cyan">Top Caliber</Badge>
              </div>
              <p className="font-display text-xl font-bold text-slate-900 truncate">
                {strongest?.name || 'No subject data yet'}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <span>Confidence Rating</span>
                <span className="font-bold text-[#218DAE]">{strongest ? `${strongest.confidence}/5` : '—'}</span>
              </div>
              <Progress value={strongest ? strongest.confidence * 20 : 0} variant="teal" size="sm" className="mt-2" />
            </Card>

            <Card hoverEffect={false} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weakest Subject</span>
                <Badge variant="rose">Action Needed</Badge>
              </div>
              <p className="font-display text-xl font-bold text-slate-900 truncate">
                {weakest?.topic || 'No mistakes recorded'}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <span>Mistake Signals</span>
                <span className="font-bold text-rose-600">{weakest?.count || weakest?.missed || 0} Recorded</span>
              </div>
              <Progress value={weakest ? Math.min(100, (weakest.count || weakest.missed || 0) * 20) : 0} variant="yellow" size="sm" className="mt-2" />
            </Card>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Quick Arena Actions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate('/create-study')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#218DAE]/10 text-[#218DAE] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <BookOpen size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900">AI Revision</h4>
              <p className="text-xs text-slate-500 mt-1">60-sec summaries & key concept notes.</p>
            </div>

            <div
              onClick={() => navigate('/teach')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2BBBD7]/10 text-[#14819A] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Users size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900">Teach a Friend</h4>
              <p className="text-xs text-slate-500 mt-1">Feynman method roleplay with Anu.</p>
            </div>

            <div
              onClick={() => navigate('/boss-battle')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFD758]/20 text-[#8A6700] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Swords size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900">Fight a Boss</h4>
              <p className="text-xs text-slate-500 mt-1">5-level gamified topic battle.</p>
            </div>

            <div
              onClick={() => navigate('/rescue')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Flame size={20} />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900">5-Minute Rescue</h4>
              <p className="text-xs text-slate-500 mt-1">Rapid emergency revision before exam.</p>
            </div>
          </div>
        </div>

        {/* Section 3 Columns: Subject Mastery, Weekly Activity, Achievements */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Subject Mastery Cards */}
          <div className="lg:col-span-5">
            <Card hoverEffect={false} className="h-full">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <CardTitle subtitle="Real-time calibration based on performance">Subject Mastery</CardTitle>
                <button
                  onClick={() => navigate('/subjects')}
                  className="text-xs font-bold text-[#218DAE] hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {profile?.subjects?.length ? profile.subjects.map((subject) => (
                  <div key={subject.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800">{subject.name}</span>
                      <span className={subject.confidence <= 2 ? 'text-rose-600' : 'text-[#218DAE]'}>
                        {subject.confidence * 20}% Mastery
                      </span>
                    </div>
                    <Progress value={subject.confidence * 20} variant={subject.confidence <= 2 ? 'yellow' : 'cyan'} size="sm" />
                  </div>
                )) : <p className="text-sm text-slate-500">Add your first subject and notes to see mastery here.</p>}
              </div>
            </Card>
          </div>

          {/* Weekly Activity Graph */}
          <div className="lg:col-span-4">
            <Card hoverEffect={false} className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <CardTitle subtitle="Revision frequency across days">Weekly Activity</CardTitle>
                  <Badge variant="cyan">{records.length ? 'Activity recorded' : 'No activity yet'}</Badge>
                </div>

                {records.length === 0 ? <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center text-sm text-slate-500">Complete your first learning activity to start your weekly chart.</div> : <div className="flex items-end justify-between gap-2 h-36 pt-4">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - idx));
                    const heights = records.filter((item) => new Date(item.createdAt).toDateString() === date.toDateString()).length;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className={`w-full max-w-[24px] rounded-t-lg transition-all ${idx === 4 ? 'bg-gradient-to-t from-[#218DAE] to-[#2BBBD7]' : 'bg-slate-200'}`}
                          style={{ height: `${Math.min(100, heights * 30)}%` }}
                        />
                        <span className="text-[10px] font-bold text-slate-500">{day}</span>
                      </div>
                    );
                  })}
                </div>}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#F0F9FC] border border-[#2BBBD7]/20 text-xs font-semibold text-[#14819A]">
                {records.length ? `${records.length} learning activities recorded.` : 'Complete a learning activity to start your history.'}
              </div>
            </Card>
          </div>

          {/* Achievements Preview */}
          <div className="lg:col-span-3">
            <Card hoverEffect={false} className="h-full">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <CardTitle subtitle="Gamified badges">Achievements</CardTitle>
                <button
                  onClick={() => navigate('/achievements')}
                  className="text-xs font-bold text-[#218DAE] hover:underline"
                >
                  All →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {achievements.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-center space-y-1 ${
                      item.unlocked
                        ? 'border-[#FFD758]/60 bg-[#FFD758]/10 text-slate-900'
                        : 'border-slate-100 bg-slate-50 text-slate-400 opacity-60'
                    }`}
                  >
                    <item.icon size={20} className="mx-auto text-[#8A6700]" />
                    <p className="text-[10px] font-bold truncate">{item.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Mistakes Widget */}
        <Card hoverEffect={false}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <CardTitle subtitle="Auto-logged wrong answers waiting for correction">
              Recent Mistake Signals
            </CardTitle>
            <Button onClick={() => navigate('/graveyard')} variant="secondary" size="sm">
              Open Mistake Bank →
            </Button>
          </div>

          {overview?.mistakes?.length ? (
            <div className="grid sm:grid-cols-3 gap-4">
              {overview.mistakes.slice(0, 3).map((mistake) => (
                <div
                  key={mistake._id}
                  onClick={() => navigate('/graveyard')}
                  className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 cursor-pointer hover:bg-rose-50 transition"
                >
                  <Badge variant="rose" className="mb-2">{mistake.topic}</Badge>
                  <p className="text-xs font-bold text-slate-800 line-clamp-2">
                    {mistake.data?.misconception || 'Concept requires re-revision.'}
                  </p>
                  <span className="text-[10px] font-bold text-rose-700 mt-3 block">Fix This Mistake →</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
              No unresolved mistakes logged! Take a quiz or fight a boss to test your skills.
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
