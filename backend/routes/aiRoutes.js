import express from 'express';
import { generateRevisionPack } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateRevisionPack);

export default router;
