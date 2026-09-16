import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader, { EmptyState } from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { getStudyPacks } from '../services/studyStore';
import { useAuth } from '../hooks/useAuth';
import { FileText, Search, Plus, Trash2, Sparkles, BookOpen, Filter, ArrowUpDown } from 'lucide-react';

export default function Notes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const packs = getStudyPacks(user?._id) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [activeNoteModal, setActiveNoteModal] = useState(null);

  // Filter & Sort
  const filteredPacks = packs.filter((pack) => {
    const matchesSearch = (pack.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pack.topic || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'ALL' || pack.topic === filterSubject;
    return matchesSearch && matchesSubject;
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="teal" icon={FileText}>Notes Library</Badge>}
          title="My Notes & Revision Packs"
          description="Upload, search, filter, and revise all your lecture notes and AI-generated study packs."
          action={
            <Button onClick={() => navigate('/create-study')} icon={Plus}>
              Create / Upload Notes
            </Button>
          }
        />

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes by title or topic..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                className="input-field py-2 text-xs font-semibold"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="ALL">All Subjects</option>
                {[...new Set(packs.map((pack) => pack.topic).filter(Boolean))].map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-slate-400" />
              <select
                className="input-field py-2 text-xs font-semibold"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Newest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredPacks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => (
              <Card key={pack.id} className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant="cyan">{pack.subject || 'General'}</Badge>
                    <span className="text-[10px] text-slate-400">
                      {new Date(pack.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 line-clamp-1">{pack.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {pack.notes ? pack.notes.slice(0, 100) + '...' : 'Uploaded notes content summary.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>Questions: {pack.material?.quiz?.length || 0}</span>
                    <span className="font-bold text-[#218DAE]">Based on your attempts</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    onClick={() => navigate(`/study-material/${pack.id}`, { state: { pack } })}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    Open Pack
                  </Button>
                  <Button
                    onClick={() => navigate('/quiz', { state: { quiz: pack.material?.quiz } })}
                    variant="secondary"
                    size="sm"
                  >
                    Take Quiz
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No Notes Found"
            description="You haven't created any revision packs or uploaded notes matching your filter criteria yet."
            actionText="Create Your First Pack"
            onAction={() => navigate('/create-study')}
          />
        )}
      </div>
    </AppShell>
  );
}
