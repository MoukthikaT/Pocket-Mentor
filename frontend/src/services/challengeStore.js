const KEY = 'pocketMentorChallenges';

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
};

export const saveChallenge = (entry) => localStorage.setItem(KEY, JSON.stringify([entry, ...read()]));
export const getChallenges = (userId) => read().filter((entry) => !userId || entry.userId === userId);
export const getChallengeStats = (userId) => {
  const entries = getChallenges(userId);
  const caught = entries.filter((entry) => entry.correct).length;
  const score = entries.length ? Math.round(entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length) : 0;
  return { entries, caught, score, level: Math.max(1, Math.min(5, Math.floor(caught / 3) + 1)) };
};

export const buildChallenge = (topic = 'this topic', level = 1) => ({
  claim: `A reliable way to master ${topic} is to memorize isolated answers without checking the reasoning behind them.`,
  verdict: 'false',
  correction: `Understanding the reasoning, checking examples, and practising retrieval are more reliable ways to master ${topic}.`,
  explanation: `The claim sounds efficient, but memorising answers alone makes it difficult to apply knowledge to unfamiliar questions.`,
  level,
  topic,
});
