const KEY_PREFIX = 'pocketMentorChallenges:';

const read = (userId) => {
  if (!userId) return [];
  try { return JSON.parse(localStorage.getItem(`${KEY_PREFIX}${String(userId)}`) || '[]'); } catch { return []; }
};

export const saveChallenge = (entry) => {
  if (!entry?.userId) return;
  localStorage.setItem(`${KEY_PREFIX}${String(entry.userId)}`, JSON.stringify([entry, ...read(entry.userId)]));
};
export const getChallenges = (userId) => read(userId).filter((entry) => entry.userId === userId);
export const getChallengeStats = (userId) => {
  const entries = getChallenges(userId);
  const caught = entries.filter((entry) => entry.correct).length;
  const score = entries.length ? Math.round(entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length) : 0;
  return { entries, caught, score, level: Math.max(1, Math.min(5, Math.floor(caught / 3) + 1)) };
};

export const buildChallenge = (pack, level = 1) => ({
  claim: pack?.material?.quiz?.[0]
    ? `According to your study material, the correct answer to "${pack.material.quiz[0].question}" is "${pack.material.quiz[0].options[pack.material.quiz[0].correctAnswer]}".`
    : '',
  verdict: pack?.material?.quiz?.[0] ? 'true' : '',
  correction: pack?.material?.quiz?.[0]?.explanation || '',
  explanation: pack?.material?.quiz?.[0]?.explanation || '',
  level,
  topic: pack?.topic || '',
});
