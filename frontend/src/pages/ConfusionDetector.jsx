import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader, { EmptyState } from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Brain, HelpCircle, CheckCircle2, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { getLearningOverview } from '../services/learningApi';

export default function ConfusionDetector() {
  const navigate = useNavigate();
  const [confusions, setConfusions] = useState([]);

  useEffect(() => {
    getLearningOverview()
      .then((data) => setConfusions((data.mistakes || []).map((item) => ({ ...item.data, id: item._id, topic: item.topic }))))
      .catch(() => setConfusions([]));
  }, []);

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="cyan" icon={Brain}>Pattern Recognition</Badge>}
          title="AI Confusion Detector"
          description="When you repeatedly struggle with a concept, Pocket Mentor breaks down your misconception with supportive explanations."
        />

        {confusions.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No confusion signals recorded yet. Complete a quiz or learning activity to identify one.</div> : <div className="space-y-6 max-w-4xl">
          {confusions.map((item) => (
            <Card key={item.id} hoverEffect={false} className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Badge variant="teal">{item.topic}</Badge>
                  <h3 className="font-display font-bold text-base text-slate-900">{item.concept}</h3>
                </div>
                <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Repeated Struggle Detected
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
                    What you thought:
                  </span>
                  <p className="text-xs text-rose-950 leading-relaxed">{item.whatYouThought}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                    What is actually correct:
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed">{item.whatIsCorrect}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F0F9FC] border border-[#2BBBD7]/20 space-y-2 text-xs">
                <span className="font-bold text-[#218DAE] flex items-center gap-1.5">
                  <Lightbulb size={16} /> Simple Explanation:
                </span>
                <p className="text-slate-700 leading-relaxed">{item.simpleExplanation}</p>
                <p className="text-slate-600 italic">Example: {item.example}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800">Quick Concept Check:</span>
                  <p className="text-slate-600 mt-0.5">{item.quickCheck}</p>
                </div>
                <Button onClick={() => navigate('/boss-battle')} variant="primary" size="sm" className="shrink-0">
                  Test This Concept <ArrowRight size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>}
      </div>
    </AppShell>
  );
}
