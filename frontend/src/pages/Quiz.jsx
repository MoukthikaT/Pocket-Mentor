import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Quiz() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const questions = state?.material?.quiz || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  if (!questions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="card-surface p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No quiz found</h2>
          <button className="btn-primary mt-5" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];

  const handleOptionClick = (optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const isAnswered = selectedAnswers[currentIndex] !== undefined;

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = () => {
    const unanswered = questions.some((_, idx) => selectedAnswers[idx] === undefined);
    if (unanswered) {
      alert('Please answer every question before submitting.');
      return;
    }

    const attemptId = globalThis.crypto?.randomUUID?.() || `attempt-${Date.now()}`;
    navigate('/quiz-result', { state: { quiz: questions, answers: selectedAnswers, material: state?.material, pack: state?.pack, attemptId } });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Quiz</h1>
          <button className="btn-secondary" onClick={() => navigate('/study-material', { state })}>Back</button>
        </div>

        <div className="card-surface p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">{question.question}</h2>

          <div className="mt-6 space-y-3">
            {question.options.map((option, idx) => {
              const selected = selectedAnswers[currentIndex] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionClick(idx)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-base font-medium transition ${
                    selected
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button className="btn-secondary" onClick={prevQuestion} disabled={currentIndex === 0}>
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button className="btn-primary" onClick={nextQuestion} disabled={!isAnswered}>
                Next
              </button>
            ) : (
              <button className="btn-primary" onClick={submitQuiz}>
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
