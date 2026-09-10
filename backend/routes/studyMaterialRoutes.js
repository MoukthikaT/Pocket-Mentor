import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, (req, res) => {
  res.json({ message: 'Study material endpoint ready.' });
});

export default router;
