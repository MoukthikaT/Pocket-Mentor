import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Progress from '../components/ui/Progress';
import { getStudyPacks } from '../services/studyStore';
import { submitBossAnswer } from '../services/learningApi';
import { useAuth } from '../hooks/useAuth';
import { Swords, Heart, Zap, AlertTriangle, ShieldCheck, Flame, RotateCcw, Trophy, ArrowRight } from 'lucide-react';

const levels = [
  { name: 'Knowledge', tone: 'teal', hint: 'Recall fundamental definitions' },
  { name: 'Understanding', tone: 'cyan', hint: 'Explain underlying mechanisms' },
  { name: 'Application', tone: 'yellow', hint: 'Apply concept to practical scenario' },
  { name: 'Traps', tone: 'rose', hint: 'Identify misleading distractor options' },
  { name: 'FINAL BOSS', tone: 'purple', hint: 'Master complex multi-step reasoning' },
];

export default function BossBattle() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const packs = getStudyPacks(user?._id) || [];
  const activePack = packs[0];
  const questions = activePack?.material?.quiz || [
    {
      question: 'Which of the following conditions is NOT required for a deadlock to occur?',
      options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
      correctAnswer: 2,
    },
    {
      question: 'In Banker\'s Algorithm, what does the Safety Algorithm check?',
      options: ['Memory fragmentation', 'If there exists a safe sequence of processes', 'CPU cache hit ratio', 'Disk I/O throughput'],
      correctAnswer: 1,
    },
  ];

  const [phase, setPhase] = useState('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hp, setHp] = useState(100);
  const [lives, setLives] = useState(4);
  const [mastery, setMastery] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [damageFlash, setDamageFlash] = useState(false);

  const question = questions[questionIndex % Math.max(questions.length, 1)];
  const level = levels[Math.min(questionIndex, levels.length - 1)];
  const victory = hp <= 0;
  const defeated = lives <= 0;
  const bossName = activePack?.title ? `${activePack.title} Boss` : 'Deadlock & Concurrency Boss';

  useEffect(() => {
    if (victory || defeated) setPhase('end');
  }, [victory, defeated]);

  const startBattle = () => {
    setPhase('battle');
    setLog(['⚔ Warden entered the arena.', `Level 1: ${level.name} Phase initiated.`]);
  };

  const handleAttack = async (optionIndex) => {
    if (loading || victory || defeated) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await submitBossAnswer({
        topic: activePack?.title || 'Operating Systems',
        question: question.question,
        answer: question.options[optionIndex],
        correctAnswer: question.options[question.correctAnswer],
        level: level.name,
      });

      setResult(response);
      setMastery(response.mastery || mastery);

      if (response.correct) {
        setHp((v) => Math.max(0, v - (response.damage || 25)));
        setDamageFlash(true);
        setTimeout(() => setDamageFlash(false), 500);
        setLog((curr) => [`💥 Critical Hit! Boss lost ${response.damage || 25} HP`, ...curr].slice(0, 5));
      } else {
        setLives((v) => Math.max(0, v - 1));
        setLog((curr) => ['💔 Boss attacked! You lost 1 life.', ...curr].slice(0, 5));
      }
      setQuestionIndex((v) => v + 1);
    } catch (err) {
      setResult({ explanation: err.response?.data?.message || 'Attack recorded.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="yellow" icon={Swords}>Gamified Arena</Badge>}
          title="Boss Battle Challenge"
          description="Test your deep understanding against topic bosses. Deal damage with correct answers; protect your lives!"
        />

        {/* Phase 1: Intro Screen */}
        {phase === 'intro' && (
          <Card hoverEffect={false} className="max-w-3xl mx-auto text-center p-8 sm:p-12 space-y-6 bg-gradient-to-b from-[#0F172A] to-[#165F76] text-white">
            <div className="w-24 h-24 rounded-3xl bg-[#FFD758]/20 border border-[#FFD758]/40 flex items-center justify-center text-5xl mx-auto shadow-gold animate-pulse">
              👹
            </div>

            <div>
              <Badge variant="yellow">Level 5 Adaptive Boss</Badge>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-2">
                {bossName}
              </h2>
              <p className="text-sm text-slate-200 mt-2 max-w-md mx-auto">
                Formed from knowledge gaps in your syllabus. Defeat all 5 levels to unlock mastery.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center text-xs">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                <span className="text-slate-300 block">Boss HP</span>
                <span className="font-display font-bold text-lg text-[#FFD758]">100 HP</span>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                <span className="text-slate-300 block">Player Lives</span>
                <span className="font-display font-bold text-lg text-rose-400">❤️❤️❤️❤️</span>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                <span className="text-slate-300 block">Phases</span>
                <span className="font-display font-bold text-lg text-[#2BBBD7]">5 Levels</span>
              </div>
            </div>

            <Button onClick={startBattle} variant="accent" className="px-8 py-3.5 text-base shadow-gold">
              Fight Boss Now <Swords size={18} />
            </Button>
          </Card>
        )}

        {/* Phase 2: Active Battle Screen */}
        {phase === 'battle' && (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Boss Status & Question Area */}
            <div className="lg:col-span-8 space-y-6">
              <Card
                hoverEffect={false}
                className={`p-6 space-y-6 bg-slate-900 text-white transition-all ${damageFlash ? 'ring-4 ring-rose-500 scale-[0.99]' : ''}`}
              >
                {/* Boss Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl">
                      👹
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">{bossName}</h3>
                      <span className="text-xs text-[#2BBBD7] font-semibold">Phase: {level.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-rose-400 font-bold text-sm">
                    {[0, 1, 2, 3].map((idx) => (
                      <Heart key={idx} size={18} className={idx < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-700'} />
                    ))}
                  </div>
                </div>

                {/* HP Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300">BOSS HEALTH</span>
                    <span className="text-[#FFD758]">{hp} / 100 HP</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-[#FFD758] to-emerald-400 transition-all duration-500"
                      style={{ width: `${hp}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="cyan">{level.name} Level</Badge>
                    <span className="text-slate-400">{level.hint}</span>
                  </div>

                  <h4 className="font-display font-bold text-lg text-white leading-relaxed">
                    {question.question}
                  </h4>

                  <div className="grid gap-2.5 pt-2">
                    {question.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={loading}
                        onClick={() => handleAttack(idx)}
                        className="p-3.5 rounded-xl border border-slate-700 bg-slate-800 text-left text-xs font-semibold text-slate-200 hover:bg-[#218DAE] hover:border-[#218DAE] hover:text-white transition flex items-center justify-between group disabled:opacity-50"
                      >
                        <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    ))}
                  </div>

                  {result && (
                    <div className={`p-4 rounded-xl text-xs font-semibold ${result.correct ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200' : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'}`}>
                      <p className="font-bold">{result.correct ? '⚔ DIRECT HIT!' : '💥 BOSS COUNTER-ATTACK!'}</p>
                      <p className="mt-1 leading-relaxed">{result.explanation}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Battle Log Sidebar */}
            <div className="lg:col-span-4">
              <Card hoverEffect={false} className="p-5 space-y-4">
                <CardTitle subtitle="Real-time arena events">Battle Log</CardTitle>
                <div className="space-y-2 text-xs">
                  {log.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Phase 3: Victory / Defeat Screen */}
        {phase === 'end' && (
          <Card hoverEffect={false} className="max-w-2xl mx-auto text-center p-8 sm:p-12 space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FFD758] to-[#2BBBD7] flex items-center justify-center text-4xl mx-auto shadow-xl">
              {victory ? '🏆' : '💥'}
            </div>

            <div>
              <Badge variant={victory ? 'yellow' : 'rose'}>
                {victory ? 'VICTORY ACHIEVED' : 'DEFEAT — RETRY'}
              </Badge>
              <h2 className="font-display font-extrabold text-3xl text-slate-900 mt-2">
                {victory ? 'Boss Defeated!' : 'Keep Practicing'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {victory
                  ? `You successfully retrieved concepts under pressure and defeated ${bossName}!`
                  : 'Your wrong answers have been saved to your Mistake Graveyard for targeted revision.'}
              </p>
            </div>

            <div className="flex justify-center gap-4 text-xs font-bold">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center w-32">
                <span className="text-slate-500 block">Mastery Score</span>
                <span className="text-lg font-display text-[#218DAE]">{mastery || 85}%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center w-32">
                <span className="text-slate-500 block">XP Earned</span>
                <span className="text-lg font-display text-[#FFD758]">{victory ? '+150 XP' : '+30 XP'}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-slate-100">
              <Button onClick={() => window.location.reload()} variant="secondary" icon={RotateCcw}>
                Rematch Boss
              </Button>
              <Button onClick={() => navigate('/graveyard')} variant="primary" icon={ArrowRight}>
                Fix Mistakes in Graveyard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
