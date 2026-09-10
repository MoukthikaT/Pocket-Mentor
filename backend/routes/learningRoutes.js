import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createBossBattle, createMistakeFix, createQuizRecord, createRescueSession, createTeachingSession, getOverview, updateProfile } from '../controllers/learningController.js';

const router = express.Router();
router.use(protect);
router.get('/overview', getOverview);
router.put('/profile', updateProfile);
router.post('/teaching', createTeachingSession);
router.post('/boss', createBossBattle);
router.post('/rescue', createRescueSession);
router.post('/quiz', createQuizRecord);
router.post('/mistakes/fix', createMistakeFix);

export default router;
