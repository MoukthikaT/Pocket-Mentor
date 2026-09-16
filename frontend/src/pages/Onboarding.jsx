import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Target,
  BrainCircuit,
  Calendar,
  Plus,
  X,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import { saveProfile } from '../services/learningApi';
import { useAuth } from '../hooks/useAuth';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  /*
   * IMPORTANT:
   * No academic subjects are preloaded here.
   *
   * The student must provide their own subjects.
   * Pocket Mentor should never assume a subject or
   * academic topic before the student supplies it.
   */

  const [formData, setFormData] = useState({
    examType: 'University Semester Exams',
    subjects: [],
    examDate: '',
    studyGoal: 'Solid Understanding',
    preferredStyle: 'Rapid Revision',
  });

  const [customSubject, setCustomSubject] = useState('');

  const examOptions = [
    'University Semester Exams',
    'Competitive Exam',
    'School / Board Exams',
    'Professional Certification',
    'Other',
  ];

  const goalOptions = [
    'Solid Understanding',
    'Improve Exam Performance',
    'Quick Revision',
    'Build Strong Fundamentals',
  ];

  const styleOptions = [
    'Rapid Revision',
    'Practice Questions',
    'Explain It in My Own Words',
    'Game-Based Practice',
  ];

  const addSubject = () => {
    const subject = customSubject.trim();

    if (!subject) return;

    const exists = formData.subjects.some(
      (item) =>
        item.name.toLowerCase() === subject.toLowerCase()
    );

    if (exists) {
      setCustomSubject('');
      return;
    }

    setFormData((current) => ({
      ...current,
      subjects: [
        ...current.subjects,
        {
          name: subject,
          confidence: 3,
        },
      ],
    }));

    setCustomSubject('');
  };

  const removeSubject = (index) => {
    setFormData((current) => ({
      ...current,
      subjects: current.subjects.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateConfidence = (index, confidence) => {
    setFormData((current) => ({
      ...current,
      subjects: current.subjects.map((subject, i) =>
        i === index
          ? {
              ...subject,
              confidence,
            }
          : subject
      ),
    }));
  };

  const canContinue = () => {
    if (step === 2) {
      return formData.subjects.length > 0;
    }

    return true;
  };

  const handleNext = () => {
    if (!canContinue()) return;

    setStep((current) => current + 1);
  };

  const handleFinish = async () => {
    setLoading(true);

    try {
      await saveProfile({
        subjects: formData.subjects,
        examType: formData.examType,
        examDate: formData.examDate,
        studyGoal: formData.studyGoal,
        preferredStyle: formData.preferredStyle,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save profile', err);

      /*
       * Keep the existing UX behavior:
       * even if profile saving fails, don't trap
       * the student on onboarding.
       */
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FBFC] px-4 py-5 font-body sm:px-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="mx-auto flex w-full max-w-4xl items-center justify-between py-3">

        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-3"
        >

          <div className="brand-mark">
            P
          </div>

          <div className="text-left">

            <p className="font-logo text-lg text-slate-900">
              POCKET MENTOR
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#218DAE]">
              Your study setup
            </p>

          </div>

        </button>


        <div className="text-right">

          <p className="text-xs font-black text-slate-700">
            Step {step} of 5
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            A few details before you begin
          </p>

        </div>

      </header>


      {/* =====================================================
          PROGRESS
      ====================================================== */}

      <div className="mx-auto mt-5 w-full max-w-4xl">

        <Progress
          value={(step / 5) * 100}
          variant="teal"
          size="sm"
        />

      </div>


      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <main className="mx-auto flex w-full max-w-4xl justify-center py-8 sm:py-12">

        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-10">

          {/* =================================================
              STEP 1
          ================================================== */}

          {step === 1 && (
            <div className="animate-fade-in">

              <StepHeading
                icon={<GraduationCap size={24} />}
                label="Preparation"
                title={`What are you preparing for${
                  user?.name
                    ? `, ${user.name.split(' ')[0]}`
                    : ''
                }?`}
                description="This helps us understand the kind of study routine you're setting up."
              />


              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {examOptions.map((option) => (
                  <ChoiceCard
                    key={option}
                    selected={formData.examType === option}
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        examType: option,
                      }))
                    }
                  >
                    {option}
                  </ChoiceCard>
                ))}

              </div>

            </div>
          )}


          {/* =================================================
              STEP 2 — USER SUBJECTS ONLY
          ================================================== */}

          {step === 2 && (
            <div className="animate-fade-in">

              <StepHeading
                icon={<BookOpen size={24} />}
                label="Your subjects"
                title="What are you studying?"
                description="Add the subjects you actually need to revise. We won't fill this list for you."
              />


              <div className="mt-8 rounded-2xl border border-[#218DAE]/15 bg-[#218DAE]/[0.035] p-4 sm:p-5">

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="relative flex-1">

                    <BookOpen
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) =>
                        setCustomSubject(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSubject();
                        }
                      }}
                      placeholder="Type a subject and press Add"
                      className="input-field pl-11"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={addSubject}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#218DAE] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1b7895]"
                  >
                    <Plus size={17} />
                    Add subject
                  </button>

                </div>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Examples are only placeholders. Enter your own subjects;
                  Pocket Mentor does not preload academic topics.
                </p>

              </div>


              {/* Subject list */}

              <div className="mt-6">

                {formData.subjects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center">

                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <BookOpen size={20} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      No subjects added yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add at least one subject to continue.
                    </p>

                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">

                    {formData.subjects.map((subject, index) => (
                      <div
                        key={`${subject.name}-${index}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 shadow-sm"
                      >

                        <span className="h-2 w-2 rounded-full bg-[#2BBBD7]" />

                        {subject.name}

                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          className="ml-1 rounded-md p-0.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                          aria-label={`Remove ${subject.name}`}
                        >
                          <X size={14} />
                        </button>

                      </div>
                    ))}

                  </div>
                )}

              </div>

            </div>
          )}


          {/* =================================================
              STEP 3
          ================================================== */}

          {step === 3 && (
            <div className="animate-fade-in">

              <StepHeading
                icon={<BrainCircuit size={24} />}
                label="Confidence"
                title="How comfortable are you with these subjects?"
                description="This is your own starting estimate. You can change it later."
              />


              <div className="mt-8 space-y-3">

                {formData.subjects.map((subject, index) => (
                  <div
                    key={`${subject.name}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-sm font-black text-slate-800">
                          {subject.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          1 = Need more help · 5 = Very comfortable
                        </p>

                      </div>


                      <div className="flex items-center gap-1.5">

                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              updateConfidence(
                                index,
                                level
                              )
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black transition ${
                              subject.confidence === level
                                ? 'bg-[#218DAE] text-white shadow-md'
                                : 'border border-slate-200 bg-white text-slate-500 hover:border-[#218DAE]/30 hover:text-[#218DAE]'
                            }`}
                          >
                            {level}
                          </button>
                        ))}

                      </div>

                    </div>

                  </div>
                ))}

              </div>


              <div className="mt-7 max-w-xs">

                <label className="label flex items-center gap-2">
                  <Calendar
                    size={15}
                    className="text-[#218DAE]"
                  />
                  Target exam date
                </label>

                <input
                  type="date"
                  className="input-field"
                  value={formData.examDate}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      examDate: e.target.value,
                    }))
                  }
                />

              </div>

            </div>
          )}


          {/* =================================================
              STEP 4
          ================================================== */}

          {step === 4 && (
            <div className="animate-fade-in">

              <StepHeading
                icon={<Target size={24} />}
                label="Your goal"
                title="What would you like to get out of your revision?"
                description="Choose the goal that best matches what you need right now."
              />


              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {goalOptions.map((goal) => (
                  <ChoiceCard
                    key={goal}
                    selected={formData.studyGoal === goal}
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        studyGoal: goal,
                      }))
                    }
                  >
                    {goal}
                  </ChoiceCard>
                ))}

              </div>


              <div className="mt-8">

                <p className="text-sm font-black text-slate-800">
                  How do you like to practise?
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  You can use every mode later; this just tells us what
                  you'd like to start with.
                </p>


                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  {styleOptions.map((style) => (
                    <ChoiceCard
                      key={style}
                      selected={
                        formData.preferredStyle === style
                      }
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          preferredStyle: style,
                        }))
                      }
                    >
                      {style}
                    </ChoiceCard>
                  ))}

                </div>

              </div>

            </div>
          )}


          {/* =================================================
              STEP 5
          ================================================== */}

          {step === 5 && (
            <div className="animate-fade-in">

              <div className="mx-auto flex max-w-xl flex-col items-center text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#218DAE]/10 text-[#218DAE]">
                  <CheckCircle2 size={31} />
                </div>


                <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#218DAE]">
                  You're all set
                </p>

                <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Your study space is ready.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  We've saved the preferences you entered. Next, bring in
                  the material you actually want to study.
                </p>


                {/* Summary */}

                <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">

                  <SummaryRow
                    label="Preparation"
                    value={formData.examType}
                  />

                  <SummaryRow
                    label="Subjects"
                    value={`${formData.subjects.length} added`}
                  />

                  <SummaryRow
                    label="Goal"
                    value={formData.studyGoal}
                  />

                  {formData.examDate && (
                    <SummaryRow
                      label="Exam date"
                      value={formData.examDate}
                    />
                  )}

                </div>


                {/* Subjects */}

                <div className="mt-4 w-full text-left">

                  <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
                    Your subjects
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {formData.subjects.map((subject) => (
                      <span
                        key={subject.name}
                        className="rounded-lg bg-[#218DAE]/10 px-3 py-1.5 text-xs font-bold text-[#218DAE]"
                      >
                        {subject.name}
                      </span>
                    ))}

                  </div>

                </div>

              </div>

            </div>
          )}


          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div className="mt-9 flex items-center justify-between border-t border-slate-100 pt-6">

            {step > 1 ? (
              <Button
                variant="secondary"
                onClick={() =>
                  setStep((current) => current - 1)
                }
                disabled={loading}
              >
                <ArrowLeft size={16} />
                Back
              </Button>
            ) : (
              <div />
            )}


            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canContinue()}
                className="px-6"
              >
                Continue
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                loading={loading}
                variant="accent"
                className="px-7"
              >
                Go to dashboard
                <Sparkles size={17} />
              </Button>
            )}

          </div>

        </div>

      </main>


      <footer className="pb-5 text-center text-[10px] font-semibold text-slate-400">
        Your setup stays yours. Add the material you want Pocket Mentor to work with.
      </footer>

    </div>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function StepHeading({
  icon,
  label,
  title,
  description,
}) {
  return (
    <div>

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#218DAE]/10 text-[#218DAE]">
          {icon}
        </div>

        <span className="rounded-full bg-[#218DAE]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#218DAE]">
          {label}
        </span>

      </div>

      <h2 className="mt-6 max-w-2xl font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


function ChoiceCard({
  selected,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-bold transition-all ${
        selected
          ? 'border-[#218DAE] bg-[#218DAE]/5 text-[#218DAE] shadow-sm ring-2 ring-[#218DAE]/10'
          : 'border-slate-200 bg-white text-slate-700 hover:border-[#218DAE]/30 hover:bg-slate-50'
      }`}
    >

      <span>{children}</span>

      {selected && (
        <CheckCircle2
          size={18}
          className="shrink-0 text-[#218DAE]"
        />
      )}

    </button>
  );
}


function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-slate-200 py-2.5 last:border-0">

      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <span className="text-right text-xs font-black text-slate-700">
        {value}
      </span>

    </div>
  );
}