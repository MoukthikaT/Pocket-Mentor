import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Flame,
  Heart,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react';
import { getStudyPacks, saveQuizAttempt } from '../services/studyStore';
import { useAuth } from '../hooks/useAuth';

function RobotCharacter({ enemy = false, hit = false, defeated = false }) {
  return (
    <div
      className={[
        'relative flex h-64 w-52 items-end justify-center transition-all duration-500',
        hit ? (enemy ? 'animate-bounce' : 'animate-pulse') : '',
        defeated ? 'translate-y-8 opacity-40 grayscale' : '',
      ].join(' ')}
    >
      {/* shadow */}
      <div className="absolute bottom-1 h-6 w-36 rounded-full bg-slate-950/40 blur-md" />

      {/* legs */}
      <div className="absolute bottom-5 flex gap-5">
        <div className="h-16 w-8 rounded-b-xl rounded-t-md bg-gradient-to-b from-slate-500 to-slate-900 shadow-lg" />
        <div className="h-16 w-8 rounded-b-xl rounded-t-md bg-gradient-to-b from-slate-500 to-slate-900 shadow-lg" />
      </div>

      {/* feet */}
      <div className="absolute bottom-1 flex gap-7">
        <div className="h-5 w-12 rounded-full bg-slate-900" />
        <div className="h-5 w-12 rounded-full bg-slate-900" />
      </div>

      {/* left arm */}
      <div
        className={[
          'absolute left-3 top-28 h-10 w-16 origin-right rounded-full bg-gradient-to-r',
          enemy
            ? 'from-indigo-700 to-blue-400'
            : 'from-cyan-700 to-cyan-300',
          'shadow-lg',
          hit ? '-rotate-12' : 'rotate-6',
        ].join(' ')}
      />

      {/* right arm */}
      <div
        className={[
          'absolute right-3 top-28 h-10 w-16 origin-left rounded-full bg-gradient-to-r',
          enemy
            ? 'from-blue-400 to-indigo-700'
            : 'from-cyan-300 to-cyan-700',
          'shadow-lg',
          hit ? 'rotate-12' : '-rotate-6',
        ].join(' ')}
      />

      {/* shoulders */}
      <div
        className={`absolute top-24 h-16 w-48 rounded-[35%] ${
          enemy
            ? 'bg-gradient-to-b from-indigo-500 to-blue-900'
            : 'bg-gradient-to-b from-cyan-400 to-cyan-800'
        } shadow-xl`}
      />

      {/* body */}
      <div
        className={`absolute top-28 h-28 w-32 rounded-2xl border-2 border-white/20 ${
          enemy
            ? 'bg-gradient-to-b from-indigo-700 via-blue-800 to-slate-950'
            : 'bg-gradient-to-b from-cyan-700 via-cyan-800 to-slate-950'
        } shadow-2xl`}
      >
        {/* chest screen */}
        <div className="absolute left-1/2 top-7 flex h-10 w-12 -translate-x-1/2 items-center justify-center rounded-md border border-white/30 bg-slate-950 shadow-inner">
          <div
            className={`h-4 w-4 rounded-sm ${
              enemy ? 'bg-blue-400' : 'bg-cyan-300'
            } shadow-[0_0_14px_rgba(56,189,248,.8)]`}
          />
        </div>

        {/* waist */}
        <div className="absolute bottom-0 left-1/2 h-5 w-20 -translate-x-1/2 rounded-t-md bg-slate-900" />
      </div>

      {/* neck */}
      <div className="absolute top-[78px] h-10 w-12 rounded-md bg-slate-800" />

      {/* head */}
      <div
        className={`absolute top-8 h-20 w-24 rounded-[45%] border-2 border-white/20 ${
          enemy
            ? 'bg-gradient-to-b from-indigo-600 to-blue-900'
            : 'bg-gradient-to-b from-cyan-500 to-cyan-900'
        } shadow-2xl`}
      >
        {/* visor */}
        <div className="absolute left-1/2 top-7 h-7 w-20 -translate-x-1/2 rounded-full border border-blue-200/30 bg-slate-950 shadow-inner">
          <div className="absolute left-4 top-2 h-2 w-10 rounded-full bg-blue-400/80 blur-[1px]" />
        </div>
      </div>

      {/* helmet top */}
      <div
        className={`absolute top-1 h-10 w-20 rounded-t-[50%] ${
          enemy ? 'bg-blue-900' : 'bg-cyan-800'
        } shadow-lg`}
      />

      {/* antenna */}
      <div className="absolute top-0 flex flex-col items-center">
        <div className="h-5 w-1 rounded-full bg-slate-500" />
        <div
          className={`h-3 w-3 rounded-full ${
            enemy ? 'bg-blue-400' : 'bg-cyan-300'
          } shadow-[0_0_12px_rgba(56,189,248,.9)]`}
        />
      </div>
    </div>
  );
}

function HealthBar({ value, label, enemy = false }) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
        <span>{label}</span>
        <span>{Math.max(0, value)} HP</span>
      </div>

      <div className="h-4 overflow-hidden rounded-full border border-white/10 bg-slate-950">
        <div
          className={[
            'h-full rounded-full transition-all duration-700',
            enemy
              ? 'bg-gradient-to-r from-blue-700 via-indigo-500 to-cyan-300'
              : 'bg-gradient-to-r from-cyan-700 via-cyan-400 to-yellow-300',
          ].join(' ')}
          style={{ width: `${Math.max(0, value)}%` }}
        />
      </div>
    </div>
  );
}

function PersonCharacter({ enemy = false, hit = false, defeated = false }) {
  return (
    <div className={`relative mx-auto h-64 w-52 transition-all duration-500 ${hit ? 'animate-bounce' : ''} ${defeated ? 'translate-y-8 opacity-40 grayscale' : ''}`}>
      <div className="absolute bottom-1 left-1/2 h-5 w-36 -translate-x-1/2 rounded-full bg-black/40 blur-md" />
      <div className="absolute bottom-3 left-[4.5rem] h-20 w-6 rounded-b-xl bg-slate-900" />
      <div className="absolute bottom-3 right-[4.5rem] h-20 w-6 rounded-b-xl bg-slate-900" />
      <div className={`absolute bottom-0 left-14 h-6 w-12 rounded-full ${enemy ? 'bg-indigo-950' : 'bg-cyan-950'}`} />
      <div className={`absolute bottom-0 right-14 h-6 w-12 rounded-full ${enemy ? 'bg-indigo-950' : 'bg-cyan-950'}`} />
      <div className={`absolute left-1/2 top-28 h-28 w-32 -translate-x-1/2 rounded-[2rem] border-2 border-white/20 ${enemy ? 'bg-gradient-to-b from-rose-700 to-indigo-950' : 'bg-gradient-to-b from-cyan-500 to-blue-950'} shadow-2xl`} />
      <div className={`absolute left-4 top-32 h-12 w-16 origin-right -rotate-12 rounded-full ${enemy ? 'bg-rose-700' : 'bg-cyan-600'} shadow-lg`} />
      <div className={`absolute right-4 top-32 h-12 w-16 origin-left rotate-12 rounded-full ${enemy ? 'bg-indigo-700' : 'bg-blue-700'} shadow-lg`} />
      <div className="absolute left-1/2 top-[5.4rem] h-8 w-7 -translate-x-1/2 bg-amber-700" />
      <div className="absolute left-1/2 top-8 h-24 w-20 -translate-x-1/2 rounded-[45%] border-2 border-white/20 bg-amber-300 shadow-xl">
        <div className="absolute -top-2 left-1/2 h-10 w-24 -translate-x-1/2 rounded-t-full bg-slate-950" />
        <div className="absolute left-4 top-10 h-2 w-2 rounded-full bg-slate-900" />
        <div className="absolute right-4 top-10 h-2 w-2 rounded-full bg-slate-900" />
        <div className="absolute bottom-4 left-1/2 h-1 w-7 -translate-x-1/2 rounded-full bg-rose-700" />
      </div>
      <div className={`absolute left-1/2 top-[8.1rem] h-3 w-8 -translate-x-1/2 rounded-full ${enemy ? 'bg-yellow-300' : 'bg-cyan-200'} shadow-[0_0_14px_rgba(56,189,248,.8)]`} />
    </div>
  );
}

export default function BossBattle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const passedPack = location.state?.pack;

  const [pack, setPack] = useState(passedPack || null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(100);
  const [battleFinished, setBattleFinished] = useState(false);
  const [hit, setHit] = useState(null);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  useEffect(() => {
    if (!passedPack) {
      const packs = getStudyPacks(user?._id);
      if (packs.length > 0) {
        setPack(packs[0]);
      }
    }
  }, [passedPack]);

  /*
   * IMPORTANT:
   * Questions come ONLY from the generated quiz stored inside
   * the user's study pack.
   *
   * No fallback questions.
   * No random predefined academic questions.
   */
  const questions = useMemo(() => {
    const quiz = pack?.material?.quiz;

    if (!Array.isArray(quiz)) return [];

    return quiz.filter(
      (item) =>
        item &&
        typeof item.question === 'string' &&
        Array.isArray(item.options) &&
        item.options.length > 0
    );
  }, [pack]);

  const question = questions[currentQuestion];

  const handleAnswer = (index) => {
    if (answered || !question) return;

    setSelectedAnswer(index);
    setAnswered(true);

    const correct = Number(index) === Number(question.correctAnswer);

    if (correct) {
      setScore((prev) => prev + 1);
      setBossHp((prev) => Math.max(0, prev - 25));
      setHit('boss');
    } else {
      setPlayerHp((prev) => Math.max(0, prev - 20));
      setHit('player');

      setIncorrectQuestions((prev) => [
        ...prev,
        {
          ...question,
          packId: pack?.id,
        },
      ]);
    }

    setTimeout(() => setHit(null), 650);
  };

  const nextQuestion = () => {
    if (!answered) return;

    if (currentQuestion >= questions.length - 1) {
      const finalScore =
        score + (selectedAnswer === Number(question?.correctAnswer) ? 1 : 0);

      const percentage = Math.round(
        (finalScore / Math.max(questions.length, 1)) * 100
      );

      saveQuizAttempt(pack?.id, {
        id: `battle-${Date.now()}`,
        percentage,
        score: finalScore,
        total: questions.length,
        incorrectQuestions,
      }, user?._id);

      setBattleFinished(true);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  if (!pack) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-12 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <Brain className="mx-auto mb-5 text-cyan-300" size={50} />
          <h1 className="text-3xl font-black">No Study Pack Found</h1>
          <p className="mt-3 text-slate-400">
            Create a study pack using your own notes first.
          </p>

          <button
            className="mt-7 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950"
            onClick={() => navigate('/create-study')}
          >
            Create Study Pack
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-12 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <Swords className="mx-auto mb-5 text-cyan-300" size={50} />

          <h1 className="text-3xl font-black">Battle Not Ready</h1>

          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            This study pack does not contain a generated quiz yet. Generate
            the revision pack again using your own study material.
          </p>

          <button
            className="mt-7 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950"
            onClick={() => navigate(`/study-material/${pack.id}`)}
          >
            Back to Study Pack
          </button>
        </div>
      </div>
    );
  }

  if (battleFinished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl">
          <div className="relative px-6 py-12 text-center sm:px-10">
            <div className="absolute inset-0 bg-cyan-400/5" />

            <div className="relative">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-yellow-300/30 bg-yellow-300/10">
                <Trophy size={46} className="text-yellow-300" />
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                Battle Complete
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                {score}/{questions.length}
              </h1>

              <p className="mt-2 text-lg text-slate-400">
                {percentage}% mastery for this quiz
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                <p className="text-sm text-slate-400">Study Pack</p>
                <p className="mt-1 text-lg font-bold">{pack.title}</p>

                <p className="mt-4 text-sm text-slate-400">
                  The battle used questions generated from this study pack's
                  supplied learning material.
                </p>
              </div>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate(`/study-material/${pack.id}`)}
                  className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 font-bold hover:bg-white/15"
                >
                  Review Material
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 hover:bg-cyan-300"
                >
                  Battle Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect =
    answered && Number(selectedAnswer) === Number(question.correctAnswer);

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* header */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={17} />
            Exit Battle
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-300 sm:flex">
            <Sparkles size={14} />
            Pocket Mentor Battle
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
            <Flame size={17} className="text-yellow-300" />
            <span className="font-bold">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* title */}
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Boss Battle
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Defeat the Knowledge Boss
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">
            Answer questions from your own study material. Correct answers
            damage the boss. Wrong answers cost you HP.
          </p>
        </div>

        {/* battle arena */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#03050d] shadow-2xl">
          {/* arena lights */}
          <div className="absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-8 px-5 pb-7 pt-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:px-10">
            {/* player */}
            <div className="order-2 md:order-1">
              <div className="mx-auto max-w-xs text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-cyan-300">
                  <Shield size={14} />
                  You
                </div>

                <HealthBar value={playerHp} label="Player HP" />

                <div className="mt-3 flex justify-center">
                  <PersonCharacter hit={hit === 'player'} />
                </div>
              </div>
            </div>

            {/* VS */}
            <div className="order-1 flex justify-center md:order-2">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-yellow-300/20 bg-yellow-300/5 shadow-[0_0_40px_rgba(250,204,21,.08)]">
                <Swords size={26} className="text-yellow-300" />

                {hit && (
                  <div className="absolute -inset-4 animate-ping rounded-full border border-cyan-300/20" />
                )}
              </div>
            </div>

            {/* boss */}
            <div className="order-3">
              <div className="mx-auto max-w-xs text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-300">
                  <Zap size={14} />
                  Knowledge Boss
                </div>

                <HealthBar value={bossHp} label="Boss HP" enemy />

                <div className="mt-3 flex justify-center">
                  <PersonCharacter
                    enemy
                    hit={hit === 'boss'}
                    defeated={bossHp <= 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* question area */}
          <div className="border-t border-white/10 bg-white/[0.025] px-5 py-6 sm:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Question {currentQuestion + 1}
                </span>

                {question.difficulty && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                    {question.difficulty}
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl sm:p-7">
                <h2 className="text-lg font-bold leading-relaxed sm:text-xl">
                  {question.question}
                </h2>

                <div className="mt-5 grid gap-3">
                  {question.options.map((option, index) => {
                    const selected = selectedAnswer === index;
                    const correct =
                      answered &&
                      index === Number(question.correctAnswer);

                    return (
                      <button
                        key={`${option}-${index}`}
                        type="button"
                        disabled={answered}
                        onClick={() => handleAnswer(index)}
                        className={[
                          'group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                          correct
                            ? 'border-emerald-400/50 bg-emerald-400/10'
                            : selected && !isCorrect
                              ? 'border-red-400/50 bg-red-400/10'
                              : 'border-white/10 bg-white/[0.03] hover:border-cyan-300/30 hover:bg-cyan-300/5',
                        ].join(' ')}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-black text-slate-300">
                          {String.fromCharCode(65 + index)}
                        </span>

                        <span className="flex-1 text-sm font-medium text-slate-200">
                          {option}
                        </span>

                        {correct && (
                          <CheckCircle2
                            size={19}
                            className="text-emerald-400"
                          />
                        )}

                        {selected && !isCorrect && (
                          <XCircle size={19} className="text-red-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div
                    className={[
                      'mt-5 rounded-xl border p-4',
                      isCorrect
                        ? 'border-emerald-400/20 bg-emerald-400/5'
                        : 'border-red-400/20 bg-red-400/5',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2
                          className="mt-0.5 text-emerald-400"
                          size={20}
                        />
                      ) : (
                        <Heart
                          className="mt-0.5 text-red-400"
                          size={20}
                        />
                      )}

                      <div>
                        <p className="font-bold">
                          {isCorrect
                            ? 'Direct hit! ⚡'
                            : 'The boss attacked!'}
                        </p>

                        {question.explanation && (
                          <p className="mt-1 text-sm leading-relaxed text-slate-400">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {answered && (
                  <button
                    onClick={nextQuestion}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
                  >
                    {currentQuestion === questions.length - 1
                      ? 'Finish Battle'
                      : 'Next Attack'}
                    <Zap size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* footer info */}
        <div className="mt-5 flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-600 sm:flex-row">
          <Brain size={14} />
          <span>
            Questions are generated from the study material you provided.
          </span>
        </div>
      </div>
    </div>
  );
}