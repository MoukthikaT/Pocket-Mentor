import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, GraduationCap, BookOpen, Target, BrainCircuit, Calendar, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import { saveProfile } from '../services/learningApi';
import { useAuth } from '../hooks/useAuth';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    examType: 'University Semester Exams',
    subjects: [
      { name: 'Computer Networks', confidence: 3 },
      { name: 'Operating Systems', confidence: 2 },
      { name: 'Database Systems', confidence: 4 },
    ],
    examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    studyGoal: 'Pass with Distinction (Top 10%)',
    preferredStyle: 'Visual & Practice Problems',
  });

  const [customSubject, setCustomSubject] = useState('');

  const examOptions = [
    'University Semester Exams',
    'Competitive Exam (GATE / GRE)',
    'High School / A-Levels',
    'Professional Certification',
  ];

  const goalOptions = [
    'Pass with Distinction (Top 10%)',
    'Solid Understanding (B+ or above)',
    'Emergency Revision (Pass Guaranteed)',
    'Master Core Concepts from Scratch',
  ];

  const styleOptions = [
    'Visual & Practice Problems',
    'Roleplay Teaching (Feynman Method)',
    'Gamified Challenges & Boss Fights',
    'Rapid Flashcards & Quick Summaries',
  ];

  const addSubject = () => {
    if (!customSubject.trim()) return;
    if (formData.subjects.some((s) => s.name.toLowerCase() === customSubject.trim().toLowerCase())) return;
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: customSubject.trim(), confidence: 3 }],
    });
    setCustomSubject('');
  };

  const removeSubject = (index) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index),
    });
  };

  const updateConfidence = (index, confidence) => {
    const updated = [...formData.subjects];
    updated[index].confidence = confidence;
    setFormData({ ...formData, subjects: updated });
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await saveProfile({
        subjects: formData.subjects,
        examType: formData.examType,
        examDate: formData.examDate,
        studyGoal: formData.studyGoal,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save profile', err);
      // Navigate anyway so user experience is smooth
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-body">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="brand-mark">P</div>
          <div>
            <span className="font-display font-extrabold text-slate-900 text-lg">POCKET MENTOR</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#218DAE] block">
              Personalized Setup
            </span>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-500">
          Step {step} of 5
        </div>
      </div>

      {/* Main Setup Card Container */}
      <div className="max-w-2xl mx-auto w-full my-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={(step / 5) * 100} variant="teal" size="sm" />
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl transition-all duration-300">
          {/* Step 1: Exam Type */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 text-[#218DAE]">
                <GraduationCap size={28} />
                <span className="text-xs font-extrabold uppercase tracking-widest bg-[#218DAE]/10 px-3 py-1 rounded-full">
                  Step 1: Preparation Target
                </span>
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  What are you preparing for, {user?.name?.split(' ')[0] || 'Student'}?
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Pocket Mentor tailors difficulty and revision pacing based on your exam format.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {examOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, examType: option })}
                    className={`
                      p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-200 flex items-center justify-between
                      ${formData.examType === option
                        ? 'border-[#218DAE] bg-[#218DAE]/5 text-[#218DAE] shadow-sm ring-2 ring-[#218DAE]/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }
                    `}
                  >
                    <span>{option}</span>
                    {formData.examType === option && <CheckCircle2 size={18} className="text-[#218DAE]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Subjects */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 text-[#2BBBD7]">
                <BookOpen size={28} />
                <span className="text-xs font-extrabold uppercase tracking-widest bg-[#2BBBD7]/10 px-3 py-1 rounded-full text-[#14819A]">
                  Step 2: Subject Plate
                </span>
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  What subjects are on your plate?
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Add the subjects you are revising for this semester or exam season.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Operating Systems, Calculus, Organic Chemistry"
                  className="input-field flex-1"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                />
                <Button onClick={addSubject} variant="cyan" size="md">
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.subjects.map((sub, idx) => (
                  <span
                    key={sub.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold"
                  >
                    {sub.name}
                    <button
                      onClick={() => removeSubject(idx)}
                      className="text-slate-400 hover:text-rose-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confidence levels & Exam date */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 text-[#FFD758]">
                <BrainCircuit size={28} className="text-[#8A6700]" />
                <span className="text-xs font-extrabold uppercase tracking-widest bg-[#FFD758]/20 px-3 py-1 rounded-full text-[#8A6700]">
                  Step 3: Confidence & Timeline
                </span>
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  How confident are you right now?
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Set your self-assessed rating (1 = Struggle, 5 = Mastered) to prioritize your initial missions.
                </p>
              </div>

              <div className="space-y-3">
                {formData.subjects.map((sub, idx) => (
                  <div key={sub.name} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-bold text-sm text-slate-800">{sub.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold mr-1">Rating:</span>
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => updateConfidence(idx, lvl)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition ${sub.confidence === lvl ? 'bg-[#218DAE] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="label flex items-center gap-2">
                  <Calendar size={16} className="text-[#218DAE]" /> Target Exam Date
                </label>
                <input
                  type="date"
                  className="input-field max-w-xs"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 4: Study Goal */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 text-emerald-600">
                <Target size={28} />
                <span className="text-xs font-extrabold uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full text-emerald-800">
                  Step 4: Goal & Style
                </span>
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  What's your primary goal?
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Select your objective so AI Mentor generates the right intensity of challenges.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, studyGoal: goal })}
                    className={`
                      p-4 rounded-2xl border text-left font-semibold text-sm transition flex items-center justify-between
                      ${formData.studyGoal === goal
                        ? 'border-[#218DAE] bg-[#218DAE]/5 text-[#218DAE] shadow-sm ring-2 ring-[#218DAE]/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }
                    `}
                  >
                    <span>{goal}</span>
                    {formData.studyGoal === goal && <CheckCircle2 size={18} className="text-[#218DAE]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Finished Plan Ready */}
          {step === 5 && (
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FFD758] to-[#2BBBD7] flex items-center justify-center mx-auto shadow-xl shadow-[#2BBBD7]/20 text-white font-black text-3xl">
                ✨
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-[#FFD758]/20 text-[#8A6700] text-xs font-bold uppercase tracking-wider">
                  Setup Completed
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                  Your personal study plan is ready!
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  We've configured your weak topic tracking, AI friend Anu's roleplay mode, and your customized exam countdown.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold text-slate-500">Target Exam:</span>
                  <span className="font-bold">{formData.examType}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold text-slate-500">Total Subjects:</span>
                  <span className="font-bold">{formData.subjects.length} Subjects</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold text-slate-500">Exam Target:</span>
                  <span className="font-bold">{formData.studyGoal}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
            {step > 1 ? (
              <Button
                variant="secondary"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                <ArrowLeft size={16} /> Back
              </Button>
            ) : <div />}

            {step < 5 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="px-6"
              >
                Next <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                loading={loading}
                variant="accent"
                className="px-8 text-base shadow-gold"
              >
                Launch Dashboard <Sparkles size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-4">
        Pocket Mentor AI Assistant • Personalized Revision Engine
      </div>
    </div>
  );
}
