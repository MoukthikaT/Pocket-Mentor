import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Progress, { ProgressRing } from '../components/ui/Progress';
import Modal from '../components/ui/Modal';
import { getLearningOverview } from '../services/learningApi';
import { BookOpen, Sparkles, Target, AlertTriangle, ArrowRight, CheckCircle2, History, Plus } from 'lucide-react';

export default function Subjects() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    getLearningOverview()
      .then(setOverview)
      .catch(() => setOverview({}))
      .finally(() => setLoading(false));
  }, []);

  const subjects = overview?.profile?.subjects?.length
    ? overview.profile.subjects
    : [
        { name: 'Computer Networks', confidence: 4, topics: ['TCP/IP Model', 'Subnetting', 'Routing Algorithms', 'DNS Protocol'], weak: ['Subnetting'] },
        { name: 'Operating Systems', confidence: 2, topics: ['Process Sync', 'Deadlock Avoidance', 'Paging & Segmentation', 'Virtual Memory'], weak: ['Deadlock Avoidance', 'Process Sync'] },
        { name: 'Database Systems', confidence: 3, topics: ['B+ Trees', 'Relational Algebra', 'Normalization', 'ACID Properties'], weak: ['Normalization'] },
        { name: 'Algorithm Analysis', confidence: 4, topics: ['Dynamic Programming', 'Graph Traversal', 'NP-Completeness'], weak: [] },
      ];

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="teal" icon={BookOpen}>Academic Map</Badge>}
          title="My Subjects"
          description="Track topic mastery, identified knowledge gaps, and revision history across all your subjects."
          action={
            <Button onClick={() => navigate('/create-study')} icon={Plus}>
              Add New Subject Pack
            </Button>
          }
        />

        {/* Subject Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subj) => {
            const mastery = Math.round((subj.confidence / 5) * 100);
            return (
              <Card key={subj.name} className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-slate-900">{subj.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Last revised 2 days ago</p>
                    </div>
                    <ProgressRing value={mastery} size={54} strokeWidth={5} variant={mastery < 60 ? 'yellow' : 'cyan'} />
                  </div>

                  <div className="space-y-3 my-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Topics Completed</span>
                      <span className="font-bold text-slate-800">{subj.topics ? subj.topics.length : 4} Topics</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Weak Topics Detected</span>
                      <span className="font-bold text-rose-600">
                        {subj.weak?.length ? subj.weak.join(', ') : 'None'}
                      </span>
                    </div>

                    <Progress value={mastery} variant={mastery < 60 ? 'yellow' : 'cyan'} size="sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <Button
                    onClick={() => setSelectedSubject(subj)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    View Overview
                  </Button>
                  <Button
                    onClick={() => navigate('/create-study')}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    Continue <ArrowRight size={14} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Detailed Subject Overview Modal */}
        <Modal
          isOpen={!!selectedSubject}
          onClose={() => setSelectedSubject(null)}
          title={`Subject Overview: ${selectedSubject?.name}`}
          maxWidth="max-w-2xl"
        >
          {selectedSubject && (
            <div className="space-y-6">
              {/* Mastery Banner */}
              <div className="p-4 rounded-2xl bg-[#F0F9FC] border border-[#2BBBD7]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#218DAE]">Mastery Calibration</span>
                  <h4 className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                    {Math.round((selectedSubject.confidence / 5) * 100)}% Mastered
                  </h4>
                </div>
                <Badge variant="cyan">Active Tracking</Badge>
              </div>

              {/* Topics List */}
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-[#218DAE]" /> Syllabus Topics
                </h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(selectedSubject.topics || ['Topic 1', 'Topic 2']).map((topic) => {
                    const isWeak = selectedSubject.weak?.includes(topic);
                    return (
                      <div
                        key={topic}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                          isWeak
                            ? 'border-rose-200 bg-rose-50 text-rose-800'
                            : 'border-slate-200 bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span>{topic}</span>
                        {isWeak ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">Weak</span>
                        ) : (
                          <CheckCircle2 size={15} className="text-emerald-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Revision History & Actions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><History size={14} /> Total Quizzes Taken:</span>
                  <span className="font-bold text-slate-900">4 Attempts</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><Target size={14} /> Average Score:</span>
                  <span className="font-bold text-[#218DAE]">82%</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setSelectedSubject(null)}>
                  Close
                </Button>
                <Button onClick={() => { setSelectedSubject(null); navigate('/create-study'); }}>
                  Start Topic Revision
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}
