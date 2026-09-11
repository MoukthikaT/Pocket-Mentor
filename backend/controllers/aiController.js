import asyncHandler from '../utils/asyncHandler.js';
import aiService from '../services/aiService.js';

const generateRevisionPack = asyncHandler(async (req, res) => {
  const { topic, notes } = req.body;

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  if (!topic || !topic.trim()) {
    res.status(400);
    throw new Error('Please enter the subject name.');
  }

  if (!notes || !notes.trim()) {
    res.status(400);
    throw new Error(
      'Please provide your own study notes before generating AI content.'
    );
  }

  if (notes.trim().length < 30) {
    res.status(400);
    throw new Error(
      'Please provide at least 30 characters of your own study material for better AI results.'
    );
  }

  // --------------------------------------------------
  // REAL AI GENERATION
  // --------------------------------------------------

  try {
    console.log('====================================');
    console.log('AI REVISION PACK REQUEST');
    console.log('Topic:', topic);
    console.log('Notes length:', notes.trim().length);
    console.log('====================================');

    const revisionPack = await aiService.generateRevisionPack(
      topic.trim(),
      notes.trim()
    );

    console.log('AI REVISION PACK GENERATED SUCCESSFULLY');

    return res.status(200).json({
      success: true,
      data: revisionPack,
    });
  } catch (error) {
    // ------------------------------------------------
    // PRINT THE REAL ERROR IN BACKEND TERMINAL
    // ------------------------------------------------

    console.error('');
    console.error('==========================================');
    console.error('        REAL AI GENERATION ERROR');
    console.error('==========================================');

    console.error('Message:', error?.message);

    if (error?.status) {
      console.error('Status:', error.status);
    }

    if (error?.statusCode) {
      console.error('Status Code:', error.statusCode);
    }

    if (error?.code) {
      console.error('Code:', error.code);
    }

    if (error?.type) {
      console.error('Type:', error.type);
    }

    if (error?.response?.data) {
      console.error('Response Data:', error.response.data);
    }

    console.error('Full Error:', error);

    console.error('==========================================');
    console.error('');

    // ------------------------------------------------
    // SEND USEFUL ERROR TO FRONTEND
    // ------------------------------------------------

    res.status(error?.statusCode || error?.status || 500);

    throw new Error(
      error?.message ||
        'We could not generate your revision pack right now. Please try again.'
    );
  }
});

export { generateRevisionPack };