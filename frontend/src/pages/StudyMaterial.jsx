import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Layers3, ListChecks, Sparkles } from 'lucide-react';
import { getStudyPack } from '../services/studyStore';

const resources = [
  { label: 'Summary', icon: ListChecks, action: 'summary' },
  { label: 'Quick revision', icon: Sparkles, action: 'quick-revision' },
  { label: 'Key concepts', icon: BrainCircuit, action: 'key-concepts' },
  { label: 'Flashcards', icon: Layers3, action: 'flashcards' },
  { label: 'Practice quiz', icon: BrainCircuit, action: 'quiz' },
];

export default function StudyMaterial() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { packId } = useParams();
  const pack = state?.pack || (packId ? getStudyPack(packId) : null);
  const material = pack?.material || state?.material;
  const weakTopics = state?.weakTopics || [];

  const handleResourceClick = (action) => {
    if (action === 'flashcards') return navigate('/flashcards', { state: { pack, material } });
    if (action === 'quiz') return navigate('/quiz', { state: { pack, material } });
    document.getElementById(action)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!material) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="card-surface p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No study material found</h2>
          <p className="mt-2 text-slate-600">Please generate a revision pack first.</p>
          <button className="btn-primary mt-5" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">Study material</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{pack?.title || state?.note?.title || 'Revision Pack'}</h1>
          </div>
          <div className="flex gap-3"><button className="btn-secondary gap-2" onClick={() => navigate('/dashboard')}><ArrowLeft size={16} />Dashboard</button><button className="btn-primary" onClick={() => navigate('/create-study')}>Create another pack</button></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {weakTopics.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Revision focus</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Review these missed questions</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {weakTopics.map((question, index) => <li key={index}>• {question.question}</li>)}
                </ul>
              </div>
            )}
            <div id="summary" className="card-surface scroll-mt-6 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Summary</p>
              <p className="mt-3 whitespace-pre-line text-slate-700">{material.summary}</p>
            </div>

            <div id="quick-revision" className="card-surface scroll-mt-6 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick Revision</p>
              <p className="mt-3 whitespace-pre-line text-slate-700">{material.quickRevision}</p>
            </div>

            <div id="key-concepts" className="card-surface scroll-mt-6 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Key Concepts</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {material.keyConcepts?.map((concept, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {concept}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Generated resources</p>
              <div className="mt-4 space-y-3">
                {resources.map(({ label, icon: Icon, action }) => (
                  <button key={label} onClick={() => handleResourceClick(action)} className="flex w-full items-center gap-3 rounded-xl bg-primary-50 px-4 py-3 text-left text-sm font-medium text-primary-700 transition hover:bg-primary-100">
                    <Icon size={17} /> {label}<span className="ml-auto text-xs">{action === 'flashcards' || action === 'quiz' ? 'Open →' : 'View ↓'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick stats</p>
              <div className="mt-4 text-sm text-slate-700">
                <p>Flashcards: {material.flashcards?.length || 0}</p>
                <p>Quiz questions: {material.quiz?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
