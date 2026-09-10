const STORAGE_KEY = 'pocketMentorStudyHistory';

const readHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
};

const writeHistory = (history) => localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

export const createStudyPack = ({ note, material, userId }) => {
  const pack = { id: note?._id || `pack-${Date.now()}`, ownerId: userId, title: note?.title || 'Revision Pack', createdAt: new Date().toISOString(), material, attempts: [] };
  const history = readHistory().filter((item) => item.id !== pack.id);
  writeHistory([pack, ...history]);
  return pack;
};

export const getStudyPacks = () => readHistory();
export const getStudyPack = (id) => readHistory().find((pack) => pack.id === id);

export const saveQuizAttempt = (packId, attempt) => {
  writeHistory(readHistory().map((pack) => pack.id === packId
    ? { ...pack, attempts: (pack.attempts || []).some((item) => item.id === attempt.id) ? pack.attempts : [{ ...attempt, completedAt: new Date().toISOString() }, ...(pack.attempts || [])] }
    : pack));
};

export const getDashboardStats = (userId) => {
  const packs = readHistory().filter((pack) => !userId || pack.ownerId === userId);
  const attempts = packs.flatMap((pack) => pack.attempts || []);
  const averageScore = attempts.length ? Math.round(attempts.reduce((total, attempt) => total + attempt.percentage, 0) / attempts.length) : 0;
  const weakTopics = Object.values(attempts.flatMap((attempt) => attempt.incorrectQuestions || []).reduce((topics, question) => {
    const topic = question.topic || question.question || 'Needs review';
    topics[topic] = topics[topic] || { topic, missed: 0, packId: question.packId };
    topics[topic].missed += 1;
    return topics;
  }, {})).sort((a, b) => b.missed - a.missed);
  return { packs, attempts, averageScore, weakTopics };
};
