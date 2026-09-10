import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveQuizAttempt } from '../services/studyStore';
import { saveQuizRecord } from '../services/learningApi';

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="card-surface p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No quiz result found</h2>
          <button className="btn-primary mt-5" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const { quiz, answers } = state;
  let correct = 0;

  const results = quiz.map((question, index) => {
    const selected = answers[index];
    const isCorrect = selected === question.correctAnswer;
    if (isCorrect) correct += 1;

    return {
      ...question,
      selected,
      isCorrect,
    };
  });

  const total = quiz.length;
  const percentage = Math.round((correct / total) * 100);
  const incorrectQuestions = results.filter((result) => !result.isCorrect).map((result) => ({ ...result, packId: state.pack?.id }));

  useEffect(() => {
    if (state.pack?.id) saveQuizAttempt(state.pack.id, { id: state.attemptId, percentage, correct, total, incorrectQuestions });
    saveQuizRecord({ topic: state.pack?.title || state.material?.topic || 'General revision', percentage, correct, total, incorrectQuestions }).catch(() => {});
  // Persist this completed attempt only once when the result screen opens.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="card-surface p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">Quiz Results</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">{percentage}%</h1>
          <p className="mt-2 text-lg text-slate-600">
            {percentage >= 90 ? 'Excellent! You have a strong understanding of this topic.' :
              percentage >= 70 ? 'Good work! Review a few weak areas.' :
              percentage >= 50 ? 'You\'re getting there. A little more revision will help.' :
              'Keep reviewing. Your weak topics are highlighted below.'}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Correct</p>
              <p className="text-2xl font-bold text-slate-900">{correct}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Incorrect</p>
              <p className="text-2xl font-bold text-slate-900">{total - correct}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => navigate(`/study-material/${state.pack?.id || ''}`, { state: { pack: state.pack, material: state.material, weakTopics: incorrectQuestions } })}>Revise Weak Topics</button>
            <button className="btn-secondary" onClick={() => navigate('/quiz', { state: { pack: state.pack, material: state.material } })}>Try Quiz Again</button>
          </div>
        </div>

        <div className="mt-8 card-surface p-8">
          <h2 className="text-2xl font-bold text-slate-900">Answer Review</h2>
          <div className="mt-6 space-y-5">
            {results.map((item, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-slate-800">{index + 1}. {item.question}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Your answer: {item.options[item.selected] ?? 'No answer'}
                </p>
                <p className="mt-1 text-sm text-slate-600">Correct answer: {item.options[item.correctAnswer]}</p>
                <p className="mt-2 text-sm text-slate-700">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
