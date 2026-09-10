import asyncHandler from '../utils/asyncHandler.js';
import aiService from '../services/aiService.js';

const generateRevisionPack = asyncHandler(async (req, res) => {
  const { topic, notes } = req.body;

  if (!topic || !notes) {
    res.status(400);
    throw new Error('Topic and notes are required.');
  }

  if (notes.trim().length < 30) {
    res.status(400);
    throw new Error('Please provide more detailed notes for better revision material.');
  }

  try {
    const revisionPack = await aiService.generateRevisionPack(topic, notes);
    res.json(revisionPack);
  } catch (error) {
    res.status(500);
    throw new Error('We could not generate your revision pack right now. Please try again.');
  }
});

export { generateRevisionPack };
