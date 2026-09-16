import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, BrainCircuit, CheckCircle2, ChevronLeft, ShieldAlert, Sparkles, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getStudyPacks } from '../services/studyStore';
import { buildChallenge, getChallengeStats, saveChallenge } from '../services/challengeStore';

export default function AIChallenge() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const packs = getStudyPacks(user?._id);
  const stats = getChallengeStats(user?._id);
  const challenge = useMemo(() => buildChallenge(packs[0], stats.level), [packs, stats.level]);
  const [verdict, setVerdict] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = challenge?.verdict && verdict === challenge.verdict;
  const reasoningStrong = reasoning.trim().length >= 25;
  const score = (isCorrect ? 55 : 0) + (reasoningStrong ? 35 : 10);

  const submit = () => {
    if (!verdict || reasoning.trim().length < 10) return;
    saveChallenge({ id: crypto.randomUUID?.() || Date.now(), userId: user?._id, topic: challenge.topic, claim: challenge.claim, correction: challenge.correction, correct: isCorrect, score, reasoning, createdAt: new Date().toISOString() });
    setSubmitted(true);
  };

  if (!challenge?.claim) return <main className="min-h-screen px-4 py-8 sm:px-6"><div className="mx-auto max-w-5xl"><section className="card-surface p-8 text-center"><h1 className="text-2xl font-bold text-slate-900">No challenge material yet</h1><p className="mt-2 text-slate-600">Create a revision pack from your own notes before starting a challenge.</p><button className="btn-primary mt-5" onClick={() => navigate('/create-study')}>Create revision pack</button></section></div></main>;

  return <main className="min-h-screen px-4 py-8 sm:px-6"><div className="mx-auto max-w-5xl">
    <div className="mb-8 flex items-center justify-between gap-3"><button className="btn-secondary gap-2" onClick={() => navigate('/dashboard')}><ChevronLeft size={16} />Dashboard</button><Link className="text-sm font-semibold text-primary-700 hover:text-primary-800" to="/graveyard">Mistake Graveyard →</Link></div>
    <section className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-primary-900 p-6 text-white shadow-soft sm:p-10">
      <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-indigo-100"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5"><Bot size={16} />AI vs Student</span><span>Challenge the Mentor · Level {challenge.level}</span></div>
      <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">Can you catch your mentor’s mistake?</h1><p className="mt-3 max-w-2xl text-indigo-100">Don’t accept a convincing explanation automatically. Inspect it, challenge it, then teach the correction back.</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-3"><Metric icon={Target} label="Mistakes caught" value={stats.caught} /><Metric icon={BrainCircuit} label="Critical thinking" value={stats.score ? `${stats.score}%` : '—'} /><Metric icon={Sparkles} label="Challenger level" value={stats.level} /></div>
    </section>

    <section className="card-surface mt-6 p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">AI claim · {challenge.topic}</p><div className="mt-4 flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700"><Bot /></div><p className="text-xl font-semibold leading-8 text-slate-800">“{challenge.claim}”</p></div>
      {!submitted ? <><fieldset className="mt-8"><legend className="font-bold text-slate-900">Is this claim accurate?</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{['true', 'false'].map((option) => <button type="button" key={option} onClick={() => setVerdict(option)} className={`rounded-2xl border p-4 text-left font-bold capitalize transition ${verdict === option ? 'border-primary-500 bg-primary-50 text-primary-800 ring-2 ring-primary-100' : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'}`}>{option === 'true' ? '✓ True — the claim holds up' : '× False — something is wrong'}</button>)}</div></fieldset><label className="mt-7 block font-bold text-slate-900">What is wrong, and what is the corrected idea?<textarea value={reasoning} onChange={(event) => setReasoning(event.target.value)} className="input-field mt-3 min-h-32 resize-y" placeholder="Explain your reasoning in your own words…" /></label><button className="btn-primary mt-5 gap-2" onClick={submit} disabled={!verdict || reasoning.trim().length < 10}><ShieldAlert size={17} />Submit correction</button></> : <Feedback correct={isCorrect} strong={reasoningStrong} challenge={challenge} score={score} onNext={() => window.location.reload()} />}
    </section>
  </div></main>;
}

function Metric({ icon: Icon, label, value }) { return <div className="rounded-2xl bg-white/10 p-4"><Icon size={18} className="text-cyan-200" /><p className="mt-4 text-2xl font-black">{value}</p><p className="mt-1 text-xs font-medium text-indigo-100">{label}</p></div>; }
function Feedback({ correct, strong, challenge, score, onNext }) { return <div className={`mt-8 rounded-2xl border p-6 ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}><div className="flex gap-3"><CheckCircle2 className={correct ? 'text-emerald-600' : 'text-amber-600'} /><div><p className="font-black text-slate-900">{correct ? 'Okay… you caught me.' : 'That explanation sounded convincing — but it was not correct.'}</p><p className="mt-1 text-sm text-slate-700">Detection: {correct ? 'Correct' : 'Needs another look'} · Reasoning: {strong ? 'Strong' : 'Keep explaining the why'}</p></div></div><div className="mt-5 rounded-xl bg-white/70 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Mentor correction</p><p className="mt-2 text-slate-800">{challenge.correction}</p><p className="mt-2 text-sm text-slate-600">{challenge.explanation}</p></div><p className="mt-5 font-bold text-slate-900">Critical thinking score: {score}%</p><button className="btn-primary mt-4" onClick={onNext}>Next challenge</button></div>; }
