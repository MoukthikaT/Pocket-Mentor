import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { getStudyPacks } from '../services/studyStore';
import { submitBossAnswer } from '../services/learningApi';
import { useAuth } from '../hooks/useAuth';

import {
  Swords,
  Heart,
  Zap,
  Trophy,
  RotateCcw,
  ArrowRight,
  Target,
  Flame,
  Sparkles,
  Skull,
  Shield,
  Brain,
} from 'lucide-react';

const levels = [
  {
    name: 'Knowledge',
    hint: 'Recall the fundamentals',
  },
  {
    name: 'Understanding',
    hint: 'Explain the concept',
  },
  {
    name: 'Application',
    hint: 'Apply the concept',
  },
  {
    name: 'Traps',
    hint: 'Watch for misleading options',
  },
  {
    name: 'FINAL BOSS',
    hint: 'Solve the hardest challenge',
  },
];

/* =========================================================
   PLAYER CHARACTER
========================================================= */

function PlayerCharacter({ action }) {
  const attacking = action === 'player-attacking';
  const hit = action === 'player-hit';

  return (
    <div
      className={`
        relative flex flex-col items-center
        transition-all duration-500 ease-out
        ${attacking ? 'translate-x-[110px] sm:translate-x-[170px] scale-110' : ''}
        ${hit ? 'translate-x-[-12px] rotate-[-6deg]' : ''}
      `}
    >
      {/* Attack slash */}
      {attacking && (
        <div className="absolute right-[-105px] top-[48px] z-20">
          <div className="relative">
            <div className="absolute -inset-5 rounded-full bg-[#FFD758]/30 blur-xl" />

            <Swords
              size={48}
              className="relative text-[#FFD758] animate-pulse"
            />

            <div className="absolute top-1/2 left-[-45px] w-14 h-1 bg-[#2BBBD7] rounded-full shadow-[0_0_15px_rgba(43,187,215,0.9)]" />
          </div>
        </div>
      )}

      {/* Head */}
      <div
        className={`
          relative z-10 w-[55px] h-[55px] sm:w-[65px] sm:h-[65px]
          rounded-full border-4 border-[#2BBBD7]
          bg-[#F5CBA7]
          shadow-[0_0_25px_rgba(43,187,215,0.35)]
          ${hit ? 'animate-pulse' : ''}
        `}
      >
        {/* Hair */}
        <div className="absolute -top-2 left-2 right-2 h-5 rounded-t-full bg-[#172033]" />

        {/* Eyes */}
        <div className="absolute top-[25px] left-[13px] flex gap-3">
          <div className="w-2 h-2 rounded-full bg-[#0F172A]" />
          <div className="w-2 h-2 rounded-full bg-[#0F172A]" />
        </div>

        {/* Smile */}
        <div className="absolute bottom-[11px] left-1/2 -translate-x-1/2 w-5 h-2 border-b-2 border-[#0F172A] rounded-full" />
      </div>

      {/* Body */}
      <div className="relative -mt-1 w-[70px] h-[85px] sm:w-[82px] sm:h-[100px] rounded-t-[28px] bg-gradient-to-b from-[#2BBBD7] to-[#218DAE] border-2 border-[#55D5EA] shadow-[0_0_25px_rgba(43,187,215,0.25)]">

        {/* Chest emblem */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0F172A] border border-[#FFD758]/50 flex items-center justify-center">
          <Brain size={19} className="text-[#FFD758]" />
        </div>

        {/* Left arm */}
        <div
          className={`
            absolute top-4 -left-7 w-7 h-16
            rounded-full bg-[#218DAE]
            origin-top
            border-2 border-[#55D5EA]
            ${attacking ? 'rotate-[-55deg]' : 'rotate-[15deg]'}
            transition-transform duration-500
          `}
        />

        {/* Right arm */}
        <div
          className={`
            absolute top-4 -right-7 w-7 h-16
            rounded-full bg-[#218DAE]
            origin-top
            border-2 border-[#55D5EA]
            ${attacking ? 'rotate-[55deg]' : 'rotate-[-15deg]'}
            transition-transform duration-500
          `}
        />
      </div>

      {/* Legs */}
      <div className="flex gap-3 -mt-1">
        <div
          className={`
            w-7 h-12 rounded-b-xl bg-[#172033]
            ${attacking ? 'rotate-[-15deg]' : ''}
            transition-transform duration-500
          `}
        />
        <div
          className={`
            w-7 h-12 rounded-b-xl bg-[#172033]
            ${attacking ? 'rotate-[15deg]' : ''}
            transition-transform duration-500
          `}
        />
      </div>

      {/* Weapon */}
      {attacking && (
        <div className="absolute top-[70px] right-[-80px] rotate-[-25deg] z-30">
          <div className="w-20 h-2 rounded-full bg-[#FFD758] shadow-[0_0_18px_rgba(255,215,88,0.9)]" />
        </div>
      )}

      <div className="mt-3 text-xs font-black tracking-[0.2em] text-[#2BBBD7]">
        YOU
      </div>

      <div className="text-[9px] font-bold text-slate-500">
        CHALLENGER
      </div>

      {/* Lives */}
      <div className="flex gap-1 mt-2">
        {[0, 1, 2, 3].map((i) => (
          <Heart
            key={i}
            size={13}
            className={
              i < 4
                ? 'fill-[#2BBBD7] text-[#2BBBD7]'
                : 'text-slate-700'
            }
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   BOSS CHARACTER
========================================================= */

function BossCharacter({ action }) {
  const attacking = action === 'boss-attacking';
  const hit = action === 'boss-hit';

  return (
    <div
      className={`
        relative flex flex-col items-center
        transition-all duration-500 ease-out
        ${attacking ? 'translate-x-[-110px] sm:translate-x-[-170px] scale-110' : ''}
        ${hit ? 'translate-x-[15px] rotate-[7deg] scale-95' : ''}
      `}
    >
      {/* Boss attack */}
      {attacking && (
        <div className="absolute left-[-110px] top-[60px] z-30">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-[#FFD758]/30 blur-xl" />

            <Zap
              size={55}
              className="relative text-[#FFD758] animate-pulse"
            />

            <div className="absolute top-1/2 right-[-55px] w-16 h-1 bg-[#FFD758] rounded-full shadow-[0_0_18px_rgba(255,215,88,0.9)]" />
          </div>
        </div>
      )}

      {/* Boss horns */}
      <div className="flex justify-between w-[75px] sm:w-[90px] -mb-3 z-0">
        <div className="w-7 h-10 bg-[#FFD758] rounded-t-full rotate-[-25deg] border-2 border-[#E7B932]" />
        <div className="w-7 h-10 bg-[#FFD758] rounded-t-full rotate-[25deg] border-2 border-[#E7B932]" />
      </div>

      {/* Boss head */}
      <div
        className={`
          relative z-10
          w-[70px] h-[65px] sm:w-[82px] sm:h-[75px]
          rounded-[45%]
          bg-gradient-to-b from-[#405B70] to-[#20364A]
          border-4 border-[#FFD758]
          shadow-[0_0_35px_rgba(255,215,88,0.35)]
          ${hit ? 'animate-pulse' : ''}
        `}
      >
        {/* Eyes */}
        <div className="absolute top-[25px] left-[15px] flex gap-5">
          <div className="w-4 h-3 rounded-full bg-[#FFD758] shadow-[0_0_10px_rgba(255,215,88,0.9)]" />
          <div className="w-4 h-3 rounded-full bg-[#FFD758] shadow-[0_0_10px_rgba(255,215,88,0.9)]" />
        </div>

        {/* Angry eyebrows */}
        <div className="absolute top-[18px] left-[13px] w-5 h-1 bg-[#0F172A] rotate-[20deg]" />
        <div className="absolute top-[18px] right-[13px] w-5 h-1 bg-[#0F172A] rotate-[-20deg]" />

        {/* Mouth */}
        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-9 h-4 bg-[#0F172A] rounded-b-full border-t-2 border-[#FFD758]" />
      </div>

      {/* Body */}
      <div className="relative -mt-1 w-[85px] h-[95px] sm:w-[100px] sm:h-[110px] rounded-t-[35px] bg-gradient-to-b from-[#405B70] to-[#20364A] border-2 border-[#FFD758]/70 shadow-[0_0_30px_rgba(33,141,174,0.35)]">

        {/* Core */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#0F172A] border-2 border-[#FFD758] flex items-center justify-center">
          <Skull size={23} className="text-[#FFD758]" />
        </div>

        {/* Arms */}
        <div
          className={`
            absolute top-7 -left-9 w-9 h-20
            rounded-full bg-[#30495D]
            border-2 border-[#FFD758]/50
            origin-top
            ${attacking ? 'rotate-[55deg]' : 'rotate-[-20deg]'}
            transition-transform duration-500
          `}
        />

        <div
          className={`
            absolute top-7 -right-9 w-9 h-20
            rounded-full bg-[#30495D]
            border-2 border-[#FFD758]/50
            origin-top
            ${attacking ? 'rotate-[-55deg]' : 'rotate-[20deg]'}
            transition-transform duration-500
          `}
        />
      </div>

      {/* Legs */}
      <div className="flex gap-4 -mt-1">
        <div className="w-9 h-12 rounded-b-xl bg-[#182B3A]" />
        <div className="w-9 h-12 rounded-b-xl bg-[#182B3A]" />
      </div>

      <div className="mt-3 text-xs font-black tracking-[0.2em] text-[#FFD758]">
        BOSS
      </div>

      <div className="text-[9px] font-bold text-slate-500">
        KNOWLEDGE OVERLORD
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function BossBattle() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const packs = getStudyPacks(user?._id) || [];
  const activePack = packs[0];

  const questions = activePack?.material?.quiz || [
    {
      question: 'Which data structure follows the Last-In-First-Out principle?',
      options: ['Queue', 'Stack', 'Array', 'Graph'],
      correctAnswer: 1,
    },
    {
      question: 'What is the main purpose of an operating system?',
      options: [
        'Only to browse the internet',
        'Only to run games',
        'To manage hardware and provide services to applications',
        'To replace the CPU',
      ],
      correctAnswer: 2,
    },
    {
      question: 'Which language is commonly used for machine learning?',
      options: ['HTML', 'Python', 'CSS', 'SQL'],
      correctAnswer: 1,
    },
  ];

  const [phase, setPhase] = useState('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [bossHP, setBossHP] = useState(100);
  const [lives, setLives] = useState(4);
  const [mastery, setMastery] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [battleAction, setBattleAction] = useState(null);
  const [battleMessage, setBattleMessage] = useState('');
  const [battleLog, setBattleLog] = useState([]);
  const [roundDamage, setRoundDamage] = useState(0);
  const [screenFlash, setScreenFlash] = useState(false);

  const question = questions[questionIndex % questions.length];

  const level =
    levels[Math.min(questionIndex, levels.length - 1)];

  const bossName = activePack?.title
    ? `${activePack.title} Boss`
    : 'Knowledge Overlord';

  /* =========================================================
     START
  ========================================================= */

  const startBattle = () => {
    setPhase('battle');

    setBattleLog([
      '⚔️ Battle initiated',
      '🎯 Target locked',
      '🔥 Correct answers damage the boss',
    ]);

    setBattleMessage(
      'Choose your answer. Correct = ATTACK. Wrong = COUNTER-ATTACK.'
    );
  };

  /* =========================================================
     ATTACK
  ========================================================= */

  const handleAttack = async (optionIndex) => {
    if (loading || battleAction || phase !== 'battle') {
      return;
    }

    setLoading(true);
    setResult(null);
    setRoundDamage(0);

    try {
      const response = await submitBossAnswer({
        topic: activePack?.title || 'Operating Systems',
        question: question.question,
        answer: question.options[optionIndex],
        correctAnswer: question.options[question.correctAnswer],
        level: level.name,
      });

      setResult(response);

      if (response.mastery !== undefined) {
        setMastery(response.mastery);
      }

      /* ================================================
         CORRECT
         PLAYER ATTACKS BOSS
      ================================================= */

      if (response.correct) {
        const damage = response.damage || 25;

        setRoundDamage(damage);

        setBattleMessage(
          `⚔️ PERFECT ANSWER! YOU ATTACKED THE BOSS! -${damage} HP`
        );

        setBattleLog((current) =>
          [
            '⚔️ YOU ATTACKED THE BOSS',
            `💥 DIRECT HIT: -${damage} HP`,
            ...current,
          ].slice(0, 5)
        );

        setBattleAction('player-attacking');

        setTimeout(() => {
          setBattleAction('boss-hit');
          setScreenFlash(true);

          setBossHP((currentHP) =>
            Math.max(0, currentHP - damage)
          );

          setTimeout(() => {
            setScreenFlash(false);
          }, 300);
        }, 550);

        setTimeout(() => {
          setBattleAction(null);

          setBossHP((currentHP) => {
            if (currentHP <= 0) {
              setPhase('end');
            } else {
              setQuestionIndex((current) => current + 1);

              setBattleMessage(
                '🔥 The boss survived! Prepare your next attack.'
              );
            }

            return currentHP;
          });

          setLoading(false);
        }, 1250);
      }

      /* ================================================
         WRONG
         BOSS ATTACKS PLAYER
      ================================================= */

      else {
        setBattleMessage(
          '⚡ WRONG ANSWER! THE BOSS COUNTER-ATTACKS!'
        );

        setBattleLog((current) =>
          [
            '⚡ BOSS COUNTER-ATTACKED',
            '❤️ YOU LOST 1 LIFE',
            ...current,
          ].slice(0, 5)
        );

        setBattleAction('boss-attacking');

        setTimeout(() => {
          setBattleAction('player-hit');
          setScreenFlash(true);

          setLives((currentLives) =>
            Math.max(0, currentLives - 1)
          );

          setTimeout(() => {
            setScreenFlash(false);
          }, 300);
        }, 550);

        setTimeout(() => {
          setBattleAction(null);

          setLives((currentLives) => {
            if (currentLives <= 1) {
              setPhase('end');
            } else {
              setQuestionIndex((current) => current + 1);

              setBattleMessage(
                '💪 You survived! Strike back with the next answer.'
              );
            }

            return currentLives;
          });

          setLoading(false);
        }, 1250);
      }
    } catch (error) {
      console.error(error);

      setResult({
        correct: false,
        explanation:
          error.response?.data?.message ||
          'Unable to record the attack. Please try again.',
      });

      setBattleMessage(
        'Something went wrong while recording the attack.'
      );

      setLoading(false);
      setBattleAction(null);
    }
  };

  /* =========================================================
     REMATCH
  ========================================================= */

  const rematch = () => {
    setPhase('battle');
    setQuestionIndex(0);
    setBossHP(100);
    setLives(4);
    setMastery(0);
    setResult(null);
    setBattleAction(null);
    setRoundDamage(0);

    setBattleMessage(
      'New battle started. Defeat the boss!'
    );

    setBattleLog([
      '⚔️ Rematch started',
      '🎯 Target locked',
    ]);
  };

  /* =========================================================
     INTRO
  ========================================================= */

  if (phase === 'intro') {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto pb-10">

          <div className="relative overflow-hidden rounded-[30px] bg-[#0F172A] border border-[#218DAE]/40 shadow-2xl">

            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'linear-gradient(#2BBBD7 1px, transparent 1px), linear-gradient(90deg, #2BBBD7 1px, transparent 1px)',
                backgroundSize: '42px 42px',
              }}
            />

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#2BBBD7]/10 blur-3xl" />

            <div className="relative px-5 py-10 sm:px-12 sm:py-14 text-center">

              <div className="inline-flex items-center gap-2 rounded-full border border-[#2BBBD7]/30 bg-[#2BBBD7]/10 px-4 py-2 text-xs font-black tracking-wider text-[#2BBBD7]">
                <Swords size={15} />
                POCKET MENTOR ARENA
              </div>

              <h1 className="mt-6 text-4xl sm:text-6xl font-black text-white">
                BOSS
                <span className="text-[#2BBBD7]"> BATTLE</span>
              </h1>

              <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
                Your knowledge is your weapon.
                <br />
                <span className="text-[#2BBBD7] font-bold">
                  Correct answer → YOU ATTACK
                </span>
                {' • '}
                <span className="text-[#FFD758] font-bold">
                  Wrong answer → BOSS ATTACKS
                </span>
              </p>

              {/* INTRO ARENA */}

              <div className="relative mt-10 h-[330px] sm:h-[400px] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-[#10253A] via-[#102D40] to-[#0F172A]">

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07111D] to-transparent" />

                {/* Floor */}
                <div className="absolute left-1/2 bottom-8 -translate-x-1/2 w-[85%] h-24 rounded-[50%] border border-[#2BBBD7]/30 bg-[#2BBBD7]/5 shadow-[0_0_70px_rgba(43,187,215,0.12)]" />

                {/* Player */}
                <div className="absolute left-[10%] sm:left-[20%] bottom-10">
                  <PlayerCharacter action={null} />
                </div>

                {/* VS */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

                  <div className="absolute -inset-8 rounded-full bg-[#FFD758]/20 blur-2xl" />

                  <div className="relative w-16 h-16 rounded-full bg-[#FFD758] text-[#0F172A] flex items-center justify-center font-black shadow-[0_0_35px_rgba(255,215,88,0.35)]">
                    VS
                  </div>
                </div>

                {/* Boss */}
                <div className="absolute right-[10%] sm:right-[20%] bottom-10">
                  <BossCharacter action={null} />
                </div>

              </div>

              {/* RULES */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">

                <div className="rounded-2xl border border-[#2BBBD7]/20 bg-[#2BBBD7]/5 p-5">
                  <Swords
                    className="mx-auto text-[#2BBBD7]"
                    size={25}
                  />

                  <div className="mt-3 text-sm font-black text-white">
                    CORRECT
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Your character attacks the boss
                  </div>
                </div>

                <div className="rounded-2xl border border-[#FFD758]/20 bg-[#FFD758]/5 p-5">
                  <Zap
                    className="mx-auto text-[#FFD758]"
                    size={25}
                  />

                  <div className="mt-3 text-sm font-black text-white">
                    WRONG
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    The boss attacks your character
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <Heart
                    className="mx-auto text-[#2BBBD7]"
                    size={25}
                  />

                  <div className="mt-3 text-sm font-black text-white">
                    4 LIVES
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Survive the battle
                  </div>
                </div>

              </div>

              <button
                onClick={startBattle}
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#2BBBD7] px-9 py-4 font-black text-[#0F172A] shadow-[0_10px_40px_rgba(43,187,215,0.25)] hover:-translate-y-1 hover:bg-[#45C9E0] transition"
              >
                <Swords size={20} />
                ENTER THE ARENA
                <ArrowRight size={19} />
              </button>

            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  /* =========================================================
     END
  ========================================================= */

  if (phase === 'end') {
    const won = bossHP <= 0;

    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">

          <div className="relative overflow-hidden rounded-[30px] bg-[#0F172A] border border-[#218DAE]/40 p-8 sm:p-12 text-center shadow-2xl">

            <div className="relative">

              <div className="mx-auto w-24 h-24 rounded-[28px] bg-[#FFD758]/10 border border-[#FFD758]/30 flex items-center justify-center">

                {won ? (
                  <Trophy
                    size={48}
                    className="text-[#FFD758]"
                  />
                ) : (
                  <Skull
                    size={48}
                    className="text-[#2BBBD7]"
                  />
                )}

              </div>

              <div className="mt-7 text-xs font-black uppercase tracking-[0.25em] text-[#2BBBD7]">
                {won ? 'ARENA CLEARED' : 'BATTLE OVER'}
              </div>

              <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
                {won ? 'BOSS DEFEATED!' : 'YOU WERE DEFEATED'}
              </h1>

              <p className="mt-4 max-w-lg mx-auto text-sm text-slate-400">
                {won
                  ? `You defeated ${bossName} using your knowledge.`
                  : 'The boss won this round, but every mistake is a revision opportunity.'}
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-8">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs text-slate-500">
                    Boss HP
                  </div>
                  <div className="mt-1 text-3xl font-black text-[#2BBBD7]">
                    {bossHP}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs text-slate-500">
                    Your Lives
                  </div>
                  <div className="mt-1 text-3xl font-black text-[#FFD758]">
                    {lives}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs text-slate-500">
                    Mastery
                  </div>
                  <div className="mt-1 text-3xl font-black text-[#2BBBD7]">
                    {mastery || 0}%
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs text-slate-500">
                    XP
                  </div>
                  <div className="mt-1 text-3xl font-black text-[#FFD758]">
                    {won ? '+150' : '+30'}
                  </div>
                </div>

              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-8">

                <button
                  onClick={rematch}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white hover:bg-white/10 transition"
                >
                  <RotateCcw size={17} />
                  REMATCH
                </button>

                <button
                  onClick={() => navigate('/graveyard')}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2BBBD7] px-5 py-3 text-sm font-black text-[#0F172A] hover:bg-[#45C9E0] transition"
                >
                  FIX MISTAKES
                  <ArrowRight size={17} />
                </button>

              </div>

            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  /* =========================================================
     BATTLE SCREEN
  ========================================================= */

  return (
    <AppShell>

      <div className="max-w-6xl mx-auto pb-10">

        {screenFlash && (
          <div className="fixed inset-0 z-50 pointer-events-none bg-[#FFD758]/20" />
        )}

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">

          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#218DAE]">
              <span className="w-2 h-2 rounded-full bg-[#2BBBD7] animate-pulse" />
              LIVE ARENA
            </div>

            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[#0F172A]">
              {bossName}
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-white">
              <Flame
                size={16}
                className="text-[#FFD758]"
              />

              <span className="text-xs font-black">
                PHASE {Math.min(questionIndex + 1, 5)} / 5
              </span>
            </div>

          </div>
        </div>

        {/* ARENA */}

        <div className="relative overflow-hidden rounded-[30px] bg-[#0F172A] border border-[#218DAE]/40 shadow-2xl">

          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(#2BBBD7 1px, transparent 1px), linear-gradient(90deg, #2BBBD7 1px, transparent 1px)',
              backgroundSize: '45px 45px',
            }}
          />

          <div className="relative p-4 sm:p-7">

            {/* =====================================
                FIGHTING ARENA
            ====================================== */}

            <div className="relative h-[350px] sm:h-[440px] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#10253A] via-[#102D40] to-[#0A1622]">

              {/* Background glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-[#2BBBD7]/5 blur-3xl" />

              {/* Floor */}
              <div className="absolute left-1/2 bottom-7 -translate-x-1/2 w-[90%] h-28 rounded-[50%] border border-[#2BBBD7]/25 bg-[#2BBBD7]/5 shadow-[0_0_80px_rgba(43,187,215,0.1)]" />

              {/* Arena center */}
              <div className="absolute left-1/2 bottom-7 -translate-x-1/2 h-28 w-px bg-[#2BBBD7]/15" />

              {/* Player */}

              <div className="absolute left-[7%] sm:left-[16%] bottom-9">
                <PlayerCharacter action={battleAction} />
              </div>

              {/* CENTER */}

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">

                {battleAction === 'player-attacking' ? (

                  <div className="text-center">

                    <div className="relative">
                      <div className="absolute -inset-8 rounded-full bg-[#2BBBD7]/20 blur-2xl" />

                      <Swords
                        size={50}
                        className="relative mx-auto text-[#2BBBD7] animate-pulse"
                      />
                    </div>

                    <div className="mt-3 text-xs font-black tracking-widest text-[#2BBBD7]">
                      ATTACK!
                    </div>

                  </div>

                ) : battleAction === 'boss-attacking' ? (

                  <div className="text-center">

                    <div className="relative">
                      <div className="absolute -inset-8 rounded-full bg-[#FFD758]/20 blur-2xl" />

                      <Zap
                        size={50}
                        className="relative mx-auto text-[#FFD758] animate-pulse"
                      />
                    </div>

                    <div className="mt-3 text-xs font-black tracking-widest text-[#FFD758]">
                      COUNTER!
                    </div>

                  </div>

                ) : battleAction === 'boss-hit' ? (

                  <div className="text-center">

                    <Sparkles
                      size={55}
                      className="mx-auto text-[#2BBBD7] animate-pulse"
                    />

                    <div className="mt-2 text-xs font-black text-[#2BBBD7]">
                      DIRECT HIT!
                    </div>

                  </div>

                ) : battleAction === 'player-hit' ? (

                  <div className="text-center">

                    <Zap
                      size={55}
                      className="mx-auto text-[#FFD758] animate-pulse"
                    />

                    <div className="mt-2 text-xs font-black text-[#FFD758]">
                      YOU GOT HIT!
                    </div>

                  </div>

                ) : (

                  <div className="relative">

                    <div className="absolute -inset-7 rounded-full bg-[#FFD758]/10 blur-xl" />

                    <div className="relative w-16 h-16 rounded-full bg-[#FFD758] text-[#0F172A] flex items-center justify-center font-black shadow-[0_0_35px_rgba(255,215,88,0.3)]">
                      VS
                    </div>

                  </div>
                )}

              </div>

              {/* Boss */}

              <div className="absolute right-[7%] sm:right-[16%] bottom-9">
                <BossCharacter action={battleAction} />
              </div>

              {/* Action message */}

              {battleAction && (
                <div className="absolute left-1/2 top-5 -translate-x-1/2 z-40">

                  <div
                    className={`
                      whitespace-nowrap rounded-full px-5 py-2
                      text-xs sm:text-sm font-black shadow-xl
                      ${
                        battleAction === 'player-attacking' ||
                        battleAction === 'boss-hit'
                          ? 'bg-[#2BBBD7] text-[#0F172A]'
                          : 'bg-[#FFD758] text-[#0F172A]'
                      }
                    `}
                  >
                    {battleAction === 'player-attacking'
                      ? '⚔️ YOU ATTACK THE BOSS!'
                      : battleAction === 'boss-hit'
                        ? `💥 BOSS HIT! -${roundDamage} HP`
                        : battleAction === 'boss-attacking'
                          ? '⚡ BOSS ATTACKS YOU!'
                          : '💥 YOU GOT HIT! -1 LIFE'}
                  </div>

                </div>
              )}

            </div>

            {/* HEALTH HUD */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

              {/* Boss HP */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                <div className="flex justify-between items-center mb-2">

                  <div className="flex items-center gap-2">
                    <Skull
                      size={16}
                      className="text-[#FFD758]"
                    />

                    <span className="text-xs font-black text-slate-400">
                      BOSS HEALTH
                    </span>
                  </div>

                  <span className="text-xs font-black text-[#FFD758]">
                    {bossHP} / 100
                  </span>

                </div>

                <div className="h-3 rounded-full bg-[#020617] overflow-hidden">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#218DAE] to-[#2BBBD7] transition-all duration-700"
                    style={{
                      width: `${bossHP}%`,
                    }}
                  />

                </div>

              </div>

              {/* Lives */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                <div className="flex justify-between items-center mb-2">

                  <div className="flex items-center gap-2">

                    <Heart
                      size={16}
                      className="text-[#2BBBD7]"
                    />

                    <span className="text-xs font-black text-slate-400">
                      YOUR LIVES
                    </span>

                  </div>

                  <span className="text-xs font-black text-[#2BBBD7]">
                    {lives} / 4
                  </span>

                </div>

                <div className="flex gap-2">

                  {[0, 1, 2, 3].map((index) => (
                    <Heart
                      key={index}
                      size={22}
                      className={
                        index < lives
                          ? 'fill-[#2BBBD7] text-[#2BBBD7]'
                          : 'text-slate-700'
                      }
                    />
                  ))}

                </div>

              </div>

            </div>

            {/* MESSAGE */}

            <div className="mt-5 rounded-2xl border border-[#2BBBD7]/20 bg-[#2BBBD7]/5 px-5 py-4 text-center">

              <div className="flex items-center justify-center gap-2">

                <Swords
                  size={16}
                  className="text-[#2BBBD7]"
                />

                <span className="text-sm font-black text-white">
                  {battleMessage}
                </span>

              </div>

            </div>

            {/* QUESTION */}

            <div className="mt-5 rounded-[26px] bg-white p-5 sm:p-7">

              <div className="flex flex-wrap justify-between items-center gap-3">

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-[#218DAE]/10 flex items-center justify-center">

                    <Target
                      size={17}
                      className="text-[#218DAE]"
                    />

                  </div>

                  <div>

                    <div className="text-[10px] font-black uppercase tracking-widest text-[#218DAE]">
                      {level.name} Attack
                    </div>

                    <div className="text-xs text-slate-400">
                      {level.hint}
                    </div>

                  </div>

                </div>

                <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-500">
                  QUESTION {questionIndex + 1}
                </div>

              </div>

              <h2 className="mt-6 text-xl sm:text-2xl font-black leading-relaxed text-[#0F172A]">
                {question.question}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                ⚔️ Correct answer = attack the boss
                {' • '}
                ⚡ Wrong answer = boss attacks you
              </p>

              {/* OPTIONS */}

              <div className="grid sm:grid-cols-2 gap-3 mt-6">

                {question.options.map((option, index) => (

                  <button
                    key={index}
                    disabled={loading || !!battleAction}
                    onClick={() => handleAttack(index)}
                    className="
                      group relative text-left rounded-2xl
                      border-2 border-slate-200 bg-slate-50 p-4
                      transition-all duration-200
                      hover:-translate-y-1
                      hover:border-[#2BBBD7]
                      hover:bg-[#2BBBD7]/5
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    <div className="flex items-center gap-3">

                      <div className="
                        w-10 h-10 shrink-0 rounded-xl
                        bg-[#0F172A] text-white
                        flex items-center justify-center
                        text-xs font-black
                        group-hover:bg-[#218DAE]
                        transition
                      ">
                        {String.fromCharCode(65 + index)}
                      </div>

                      <span className="text-sm font-bold leading-relaxed text-slate-700">
                        {option}
                      </span>

                      <ArrowRight
                        size={16}
                        className="ml-auto shrink-0 text-slate-300 group-hover:text-[#218DAE] group-hover:translate-x-1 transition"
                      />

                    </div>

                  </button>

                ))}

              </div>

              {/* RESULT */}

              {result && !battleAction && (

                <div
                  className={`
                    mt-5 rounded-2xl border p-4
                    ${
                      result.correct
                        ? 'border-[#2BBBD7]/30 bg-[#2BBBD7]/10'
                        : 'border-[#FFD758]/40 bg-[#FFD758]/10'
                    }
                  `}
                >

                  <div className="flex items-center gap-2">

                    {result.correct ? (
                      <Swords
                        size={18}
                        className="text-[#218DAE]"
                      />
                    ) : (
                      <Zap
                        size={18}
                        className="text-[#FFD758]"
                      />
                    )}

                    <span className="text-sm font-black text-[#0F172A]">
                      {result.correct
                        ? '⚔️ DIRECT HIT!'
                        : '⚡ BOSS COUNTER-ATTACK!'}
                    </span>

                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {result.explanation}
                  </p>

                </div>
              )}

            </div>

            {/* BATTLE LOG */}

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">

              <div className="flex items-center gap-2 mb-3">

                <Swords
                  size={15}
                  className="text-[#2BBBD7]"
                />

                <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                  Battle Log
                </span>

              </div>

              <div className="flex flex-wrap gap-2">

                {battleLog.map((item, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400"
                  >
                    {item}
                  </div>

                ))}

              </div>

            </div>

          </div>
        </div>

      </div>

    </AppShell>
  );
}