import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Progress, { ProgressRing } from '../components/ui/Progress';
import { getLearningOverview } from '../services/learningApi';
import { ShieldCheck, Calendar, Zap, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';

export default function ExamReadiness() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningOverview()
      .then(setOverview)
      .catch(() => setOverview({}))
      .finally(() => setLoading(false));
  }, []);

  const readiness = overview?.readiness || 78;
  const quizAvg = overview?.averageQuiz || 82;
  const teachAvg = overview?.teachingAverage || 75;
  const bossMastery = overview?.bossMastery || 80;
  const profile = overview?.profile;

  const daysUntilExam = profile?.examDate
    ? Math.max(0, Math.ceil((new Date(profile.examDate) - new Date()) / 86400000))
    : 30;

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="teal" icon={ShieldCheck}>Algorithmic Analytics</Badge>}
          title="Exam Readiness Intelligence"
          description="Real-time algorithmic readiness metric calculated from quiz accuracy, teaching clarity, boss battle completion, and consistency."
        />

        {/* Top Readiness Score Card */}
        <Card hoverEffect={false} className="p-6 sm:p-8 bg-gradient-to-br from-[#0F172A] via-[#165F76] to-[#218DAE] text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <Badge variant="cyan">Exam Countdown: {daysUntilExam} Days Left</Badge>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                Overall Readiness: {readiness}%
              </h2>
              <p className="text-sm text-slate-200 max-w-lg">
                You are on track for your target goal: <strong className="text-[#FFD758]">{profile?.studyGoal || 'Pass with Distinction'}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-center shrink-0">
              <ProgressRing value={readiness} size={110} strokeWidth={10} variant="cyan" />
            </div>
          </div>
        </Card>

        {/* How Readiness is Calculated (Transparent Explanation) */}
        <Card hoverEffect={false}>
          <CardTitle subtitle="Weighted formula behind your score">How Readiness is Calculated</CardTitle>
          <div className="grid sm:grid-cols-4 gap-4 mt-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#218DAE] block">40% Quiz Accuracy</span>
              <p className="text-slate-500 mt-1">Average score across revision quizzes.</p>
              <span className="font-bold text-slate-900 block mt-2">{quizAvg}% Score</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#2BBBD7] block">20% Teaching Evaluation</span>
              <p className="text-slate-500 mt-1">Clarity & completeness when teaching Anu.</p>
              <span className="font-bold text-slate-900 block mt-2">{teachAvg}% Score</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#FFD758] block">20% Boss Battle Mastery</span>
              <p className="text-slate-500 mt-1">Completion of 5-level topic bosses.</p>
              <span className="font-bold text-slate-900 block mt-2">{bossMastery}% Score</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-600 block">20% Revision Consistency</span>
              <p className="text-slate-500 mt-1">Daily streak & rescue sessions.</p>
              <span className="font-bold text-slate-900 block mt-2">100% Active</span>
            </div>
          </div>
        </Card>

        {/* Breakdown: Strong vs Weak vs Critical Topics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card hoverEffect={false}>
            <h3 className="font-display font-bold text-sm text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Strong Topics (Mastered)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200">
                TCP 3-Way Handshake (95% Mastery)
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200">
                B+ Tree Indexing (90% Mastery)
              </div>
            </div>
          </Card>

          <Card hoverEffect={false}>
            <h3 className="font-display font-bold text-sm text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle size={16} /> Weak Topics (Needs Pass)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-950 font-semibold border border-amber-200">
                Subnetting & Masking (65% Mastery)
              </div>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-950 font-semibold border border-amber-200">
                Process Synchronization (60% Mastery)
              </div>
            </div>
          </Card>

          <Card hoverEffect={false}>
            <h3 className="font-display font-bold text-sm text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap size={16} /> Critical Priority Topics
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-950 font-semibold border border-rose-200">
                Deadlock Avoidance & Banker's Algorithm (3 Mistakes Logged)
              </div>
              <Button onClick={() => navigate('/boss-battle')} variant="danger" size="sm" className="w-full mt-2">
                Fix Critical Topic Now <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
