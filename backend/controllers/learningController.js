import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import LearningRecord from '../models/LearningRecord.js';
import { demoStore } from '../utils/demoStore.js';
import aiService from '../services/aiService.js';

const useMongo = () => Boolean(process.env.MONGODB_URI);

const saveRecord = async ({ userId, kind, topic, data }) => {
  if (useMongo()) return LearningRecord.create({ user: userId, kind, topic, data });
  const record = { _id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, user: userId, kind, topic, data, createdAt: new Date().toISOString() };
  demoStore.learningRecords.push(record);
  return record;
};

const listRecords = async (userId) => (useMongo()
  ? LearningRecord.find({ user: userId }).sort({ createdAt: -1 }).lean()
  : demoStore.learningRecords.filter((record) => String(record.user) === String(userId)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

const getProfile = async (userId) => (useMongo() ? User.findById(userId).select('profile').lean() : demoStore.users.find((user) => String(user._id) === String(userId)));

const updateProfile = asyncHandler(async (req, res) => {
  const profile = req.body?.profile || req.body;
  if (!profile || !Array.isArray(profile.subjects) || !profile.examType || !profile.examDate || !profile.studyGoal) {
    res.status(400);
    throw new Error('Subjects, exam type, exam date, and study goal are required.');
  }
  const normalized = {
    subjects: profile.subjects.filter(Boolean).map((subject) => ({ name: String(subject.name || subject).trim(), confidence: Math.min(5, Math.max(1, Number(subject.confidence) || 3)) })).filter((subject) => subject.name),
    examType: String(profile.examType).trim(),
    examDate: new Date(profile.examDate),
    studyGoal: String(profile.studyGoal).trim(),
  };
  if (!normalized.subjects.length || Number.isNaN(normalized.examDate.getTime())) {
    res.status(400);
    throw new Error('Add at least one subject and a valid exam date.');
  }
  if (useMongo()) {
    const user = await User.findByIdAndUpdate(req.user._id, { profile: normalized }, { new: true }).select('-password');
    return res.json(user);
  }
  const user = demoStore.users.find((item) => String(item._id) === String(req.user._id));
  if (!user) { res.status(404); throw new Error('User not found.'); }
  user.profile = normalized;
  res.json(user);
});

const getOverview = asyncHandler(async (req, res) => {
  const [user, records] = await Promise.all([getProfile(req.user._id), listRecords(req.user._id)]);
  const mistakes = records.filter((record) => record.kind === 'mistake');
  const quizzes = records.filter((record) => record.kind === 'quiz');
  const teaching = records.filter((record) => record.kind === 'teaching');
  const bosses = records.filter((record) => record.kind === 'boss');
  const averageQuiz = quizzes.length ? Math.round(quizzes.reduce((sum, item) => sum + (item.data.percentage || 0), 0) / quizzes.length) : 0;
  const teachingAverage = teaching.length ? Math.round(teaching.reduce((sum, item) => sum + (item.data.report?.overall || 0), 0) / teaching.length) : 0;
  const bossMastery = bosses.length ? Math.round(bosses.reduce((sum, item) => sum + (item.data.mastery || 0), 0) / bosses.length) : 0;
  const readiness = Math.round((averageQuiz * 0.4) + (teachingAverage * 0.2) + (bossMastery * 0.2) + Math.min(100, records.filter((item) => item.kind === 'rescue').length * 10) * 0.2);
  const topicCounts = {};
  mistakes.forEach((item) => { topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1; });
  const weakTopics = Object.entries(topicCounts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([topic, count]) => ({ topic, count }));
  res.json({ profile: user?.profile || null, readiness, averageQuiz, teachingAverage, bossMastery, mistakes, weakTopics, records: records.slice(0, 30), nextActivity: weakTopics[0] ? `Fix your repeated ${weakTopics[0].topic} mistake` : 'Create a revision pack and take your first quiz' });
});

const createTeachingSession = asyncHandler(async (req, res) => {
  const { topic, personality, explanation, notes } = req.body;
  if (!topic || !personality || !explanation) { res.status(400); throw new Error('Topic, friend personality, and explanation are required.'); }
  const result = await aiService.teachFriend({ topic, personality, explanation, notes, profile: (await getProfile(req.user._id))?.profile });
  await saveRecord({ userId: req.user._id, kind: 'teaching', topic, data: { personality, explanation, report: result.report, followUp: result.followUp } });
  (result.missingConcepts || []).forEach(async (concept) => saveRecord({ userId: req.user._id, kind: 'mistake', topic, data: { source: 'teaching', severity: 'medium', misconception: concept, correction: result.feedback } }));
  res.status(201).json(result);
});

const createBossBattle = asyncHandler(async (req, res) => {
  const { topic, answer, question, correctAnswer, level = 'Knowledge', notes } = req.body;
  if (!topic || !answer || !question) { res.status(400); throw new Error('Topic, question, and answer are required.'); }
  const result = await aiService.evaluateBoss({ topic, answer, question, correctAnswer, level, notes });
  await saveRecord({ userId: req.user._id, kind: 'boss', topic, data: result });
  if (!result.correct) await saveRecord({ userId: req.user._id, kind: 'mistake', topic, data: { source: 'boss', severity: level === 'Final Boss' ? 'high' : 'medium', misconception: answer, correction: result.explanation } });
  res.status(201).json(result);
});

const createRescueSession = asyncHandler(async (req, res) => {
  const { topic, notes } = req.body;
  if (!topic) { res.status(400); throw new Error('Choose a topic for Rescue Mode.'); }
  const result = await aiService.createRescue({ topic, notes, profile: (await getProfile(req.user._id))?.profile });
  await saveRecord({ userId: req.user._id, kind: 'rescue', topic, data: result });
  res.status(201).json(result);
});

const createQuizRecord = asyncHandler(async (req, res) => {
  const { topic = 'General revision', percentage, correct, total, incorrectQuestions = [] } = req.body;
  if (typeof percentage !== 'number' || typeof total !== 'number') { res.status(400); throw new Error('Quiz score data is required.'); }
  await saveRecord({ userId: req.user._id, kind: 'quiz', topic, data: { percentage, correct, total, incorrectQuestions } });
  for (const question of incorrectQuestions.slice(0, 10)) {
    await saveRecord({ userId: req.user._id, kind: 'mistake', topic: question.topic || topic, data: { source: 'quiz', severity: percentage < 50 ? 'high' : 'medium', misconception: question.options?.[question.selected] || 'Incorrect answer', correction: question.explanation || question.options?.[question.correctAnswer] } });
  }
  res.status(201).json({ saved: true });
});

const createMistakeFix = asyncHandler(async (req, res) => {
  const { topic, misconception, correction } = req.body;
  if (!topic || !misconception) { res.status(400); throw new Error('A mistake and topic are required.'); }
  const result = await aiService.fixMistake({ topic, misconception, correction });
  res.json(result);
});

export { updateProfile, getOverview, createTeachingSession, createBossBattle, createRescueSession, createQuizRecord, createMistakeFix };
