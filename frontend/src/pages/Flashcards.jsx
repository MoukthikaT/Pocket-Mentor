import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Flashcards() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const flashcards = state?.material?.flashcards || [];
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!flashcards.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="card-surface p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No flashcards available</h2>
          <button className="btn-primary mt-5" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const current = flashcards[index];

  const prevCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  const nextCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Flashcards</h1>
          <button className="btn-secondary" onClick={() => navigate('/study-material', { state })}>Back</button>
        </div>

        <div className="card-surface p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Card {index + 1} of {flashcards.length}</p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-lg font-semibold text-slate-900">Question</p>
            <p className="mt-4 text-lg text-slate-700">{current.question}</p>

            {showAnswer && (
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-lg font-semibold text-slate-900">Answer</p>
                <p className="mt-3 text-slate-700">{current.answer}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => setShowAnswer((prev) => !prev)}>
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            <button className="btn-secondary" onClick={prevCard}>Previous</button>
            <button className="btn-secondary" onClick={nextCard}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
