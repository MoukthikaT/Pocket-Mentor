import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Layers3, ListChecks, Sparkles } from 'lucide-react';
import { getStudyPack } from '../services/studyStore';
import { useAuth } from '../hooks/useAuth';
import { explainConcept } from '../services/learningApi';

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
  const { user } = useAuth();
  const pack = state?.pack?.ownerId === user?._id
    ? state.pack
    : (packId ? getStudyPack(packId, user?._id) : null);
  const material = pack?.material || state?.material;
  const weakTopics = state?.weakTopics || [];
  const [explainLevel, setExplainLevel] = useState('beginner');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState('');

  const requestExplanation = async (level, concept = selectedConcept) => {
    if (!concept || !pack?.sourceNotes) return;
    setExplainLevel(level);
    setExplainLoading(true);
    setExplainError('');
    try {
      const result = await explainConcept({ topic: pack.topic, concept, level, notes: pack.sourceNotes });
      setExplanation(result);
    } catch (error) {
      setExplainError(error.response?.data?.message || 'This concept could not be explained from the supplied notes.');
    } finally {
      setExplainLoading(false);
    }
  };

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
            <div className="card-surface border border-cyan-200 bg-cyan-50/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Explain It to Me</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Choose a concept from this pack</h2>
              <p className="mt-1 text-sm text-slate-600">Explanations use only the notes that created this revision pack.</p>
              <select className="input-field mt-4" value={selectedConcept} onChange={(event) => { setSelectedConcept(event.target.value); setExplanation(null); }}>
                <option value="">Select a concept</option>
                {(material.keyConcepts || []).map((concept) => <option key={concept} value={concept}>{concept}</option>)}
              </select>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['exam-ready', 'Exam-ready']].map(([level, label]) => (
                  <button key={level} type="button" disabled={!selectedConcept || explainLoading} onClick={() => requestExplanation(level)} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${explainLevel === level ? 'bg-cyan-700 text-white' : 'bg-white text-slate-700 hover:bg-cyan-100'}`}>{label}</button>
                ))}
              </div>
              {explainLoading && <p className="mt-4 text-sm text-cyan-700">Building this explanation from your notes...</p>}
              {explainError && <p className="mt-4 text-sm text-rose-600">{explainError}</p>}
              {explanation && !explainLoading && <div className="mt-4 space-y-3 rounded-xl bg-white p-4 text-sm text-slate-700">
                <h3 className="font-bold text-slate-900">{explanation.title || selectedConcept}</h3>
                <p>{explanation.explanation}</p>
                {explanation.keyPoints?.length > 0 && <ul className="list-disc space-y-1 pl-5">{explanation.keyPoints.map((point, index) => <li key={index}>{point}</li>)}</ul>}
                {explanation.example && <p><strong>Example from your material:</strong> {explanation.example}</p>}
                {explanation.checkQuestion && <div className="rounded-lg bg-slate-50 p-3"><strong>Quick check:</strong> {explanation.checkQuestion}<br /><span className="text-slate-500">Answer: {explanation.checkAnswer}</span></div>}
              </div>}
            </div>
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
