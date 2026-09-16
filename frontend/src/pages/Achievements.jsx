import React, { useState } from 'react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Trophy, Award, Sparkles, Lock, Flame, Swords, Users, Target, BookOpen, CheckCircle2, Zap } from 'lucide-react';

export default function Achievements() {
  const [filter, setFilter] = useState('ALL');

  const allAchievements = [];
  /*
   * Achievement definitions must be connected to persisted user records.
   * No badge is shown until the corresponding activity exists.
   */
  const filtered = allAchievements.filter((item) => {
    if (filter === 'UNLOCKED') return item.status === 'unlocked';
    if (filter === 'IN_PROGRESS') return item.status === 'in_progress';
    if (filter === 'LOCKED') return item.status === 'locked';
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="yellow" icon={Trophy}>Gamified Badges</Badge>}
          title="Achievements & Trophies"
          description="Collect badges, level up your student profile, and earn bonus XP as you master your syllabus."
        />

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['ALL', 'UNLOCKED', 'IN_PROGRESS', 'LOCKED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filter === f
                  ? 'bg-[#FFD758] text-slate-900 shadow-gold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-bold text-slate-900">No achievements yet</h2><p className="mt-2 text-sm text-slate-500">Complete your first learning activity to start earning badges.</p></div> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isUnlocked = item.status === 'unlocked';
            const isInProgress = item.status === 'in_progress';

            return (
              <Card
                key={item.id}
                hoverEffect={isUnlocked}
                className={`flex flex-col justify-between h-full border ${
                  isUnlocked
                    ? 'border-[#FFD758] bg-gradient-to-b from-[#FFFDF5] to-white shadow-gold'
                    : isInProgress
                    ? 'border-[#2BBBD7]/40 bg-white'
                    : 'border-slate-200 bg-slate-50/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                      isUnlocked
                        ? 'bg-[#FFD758] text-slate-900 shadow-md'
                        : isInProgress
                        ? 'bg-[#2BBBD7]/20 text-[#14819A]'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <item.icon size={24} />
                    </div>

                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      isUnlocked
                        ? 'bg-[#FFD758]/30 text-[#8A6700]'
                        : isInProgress
                        ? 'bg-[#2BBBD7]/20 text-[#14819A]'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isUnlocked ? 'UNLOCKED' : isInProgress ? `${item.progress}% DONE` : 'LOCKED'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#FFD758]">{item.xp || '+100 XP'}</span>
                  <span className="text-slate-400">{item.date || item.category}</span>
                </div>
              </Card>
            );
          })}
        </div>}
      </div>
    </AppShell>
  );
}
