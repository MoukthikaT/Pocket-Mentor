import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader, { EmptyState } from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getChallenges } from '../services/challengeStore';
import { fixMistake, getLearningOverview } from '../services/learningApi';
import { useAuth } from '../hooks/useAuth';
import { Target, AlertCircle, CheckCircle2, RotateCcw, Sparkles, BookOpen, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Graveyard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [fix, setFix] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLearningOverview()
      .then(setOverview)
      .catch(() => setOverview({ mistakes: [] }));
  }, []);

  const mistakes = useMemo(() => {
    const fromChallenges = getChallenges(user?._id).map((item) => ({
      ...item,
      source: 'AI challenge',
      misconception: item.claim,
      severity: 'medium',
      date: 'Recent',
    }));

    const fromOverview = (overview?.mistakes || []).map((item) => ({
      ...item.data,
      id: item._id,
      topic: item.topic,
      source: item.data.source || item.kind || 'Quiz',
      severity: item.data.severity || 'high',
      date: new Date(item.createdAt || Date.now()).toLocaleDateString(),
    }));

    return [...fromChallenges, ...fromOverview];
  }, [overview, user]);

  const openFix = async (mistake) => {
    setSelected(mistake);
    setLoading(true);
    try {
      const data = await fixMistake({
        topic: mistake.topic,
        misconception: mistake.misconception || mistake.claim,
        correction: mistake.correction,
        notes: mistake.sourceNote,
      });
      setFix(data);
    } catch (err) {
      setFix({
        thought: mistake.misconception || mistake.studentAnswer || 'Misconception registered.',
        correct: mistake.correctAnswer || 'Correct explanation.',
        explanation: 'Review the underlying rule and apply it to similar problems.',
        example: 'Keep this distinction in mind for your exam.',
        quickCheckQuestion: 'Are you confident with this fix now?',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="rose" icon={Target}>Mistake Lab</Badge>}
          title="Mistake Graveyard"
          description="Every wrong answer across Quizzes, Boss Battles, and AI Teaching is logged here for targeted revision."
        />

        {mistakes.length > 0 ? (
          <div className="space-y-4">
            {mistakes.map((mistake, idx) => (
              <Card key={mistake.id || idx} hoverEffect={false} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge variant={mistake.severity === 'high' ? 'rose' : 'yellow'}>
                        {mistake.severity?.toUpperCase() || 'MEDIUM'} SEVERITY
                      </Badge>
                      <Badge variant="cyan">{mistake.topic}</Badge>
                      <span className="text-xs text-slate-400 font-semibold">• Source: {mistake.source}</span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-slate-900">
                        "{mistake.misconception || mistake.question || 'Misconception logged'}"
                      </h4>
                      {mistake.studentAnswer && (
                        <p className="text-xs text-rose-600 mt-1">
                          <strong>Your Answer:</strong> {mistake.studentAnswer}
                        </p>
                      )}
                      {mistake.correctAnswer && (
                        <p className="text-xs text-emerald-700 mt-0.5">
                          <strong>Correct Answer:</strong> {mistake.correctAnswer}
                        </p>
                      )}
                    </div>

                    {mistake.correction && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        💡 <strong>Correction:</strong> {mistake.correction}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    <Button
                      onClick={() => openFix(mistake)}
                      variant={selected === mistake ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {loading && selected === mistake ? 'Generating Fix...' : 'Fix This Mistake →'}
                    </Button>
                  </div>
                </div>

                {/* Expanded Fix Box */}
                {selected === mistake && fix && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#F0F9FC] border border-[#2BBBD7]/30 text-xs text-slate-800 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-[#218DAE] font-bold">
                      <Sparkles size={16} /> Targeted AI Concept Fix
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="font-bold text-rose-600 block">What you thought:</span>
                        <p className="mt-1">{fix.thought}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="font-bold text-emerald-600 block">What is actually correct:</span>
                        <p className="mt-1">{fix.correct}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-[#218DAE] block">Simple Explanation & Example:</span>
                      <p className="mt-1">{fix.explanation}</p>
                      {fix.example && <p className="mt-1 italic text-slate-600">Example: {fix.example}</p>}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button onClick={() => setSelected(null)} variant="cyan" size="sm">
                        Mark Fixed ✓
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Target}
            title="Your Mistake Bank is Clean!"
            description="You haven't logged any wrong answers yet. Challenge yourself with a Boss Battle or Quiz to find weak spots."
            actionText="Fight a Boss"
            onAction={() => navigate('/boss-battle')}
          />
        )}
      </div>
    </AppShell>
  );
}
