import express from 'express';
import { createNote, deleteNote, getNoteById, getNotes } from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createNote).get(protect, getNotes);
router.route('/:id').get(protect, getNoteById).delete(protect, deleteNote);

export default router;
