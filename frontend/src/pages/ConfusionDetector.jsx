import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader, { EmptyState } from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Brain, HelpCircle, CheckCircle2, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

export default function ConfusionDetector() {
  const navigate = useNavigate();

  const confusions = [
    {
      id: 'c1',
      topic: 'Operating Systems',
      concept: 'Process vs Thread',
      whatYouThought: 'Processes share memory address space directly like threads.',
      whatIsCorrect: 'Processes have separate address spaces; threads within the same process share memory space.',
      simpleExplanation: 'Think of a process as a separate house (isolated), and threads as people living inside the same house sharing rooms.',
      example: 'Chrome tabs running in separate processes vs multiple download threads inside one process.',
      quickCheck: 'If one thread crashes, does the whole process crash? (Yes, usually, because memory is shared).',
    },
    {
      id: 'c2',
      topic: 'Computer Networks',
      concept: 'TCP vs UDP',
      whatYouThought: 'UDP guarantees packet delivery order just like TCP.',
      whatIsCorrect: 'UDP is connectionless and does not guarantee delivery or packet ordering; TCP is connection-oriented.',
      simpleExplanation: 'TCP is like a phone call (handshake, confirmed reception), UDP is like sending a postcard (send and hope it gets there).',
      example: 'Video streaming and online games use UDP for speed; file downloads use TCP for accuracy.',
      quickCheck: 'Which protocol is preferred for real-time multiplayer gaming? (UDP).',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="cyan" icon={Brain}>Pattern Recognition</Badge>}
          title="AI Confusion Detector"
          description="When you repeatedly struggle with a concept, Pocket Mentor breaks down your misconception with supportive explanations."
        />

        <div className="space-y-6 max-w-4xl">
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
        </div>
      </div>
    </AppShell>
  );
}
