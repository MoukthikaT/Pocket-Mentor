import express from 'express';
import { explainConcept, generateRevisionPack } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateRevisionPack);
router.post('/explain', protect, explainConcept);

export default router;
