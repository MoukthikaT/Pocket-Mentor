import asyncHandler from '../utils/asyncHandler.js';
import aiService from '../services/aiService.js';

const generateRevisionPack = asyncHandler(async (req, res) => {
  const { topic, notes } = req.body;

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const cleanTopic = topic?.trim();
  const cleanNotes = notes?.trim();

  if (!cleanTopic) {
    res.status(400);
    throw new Error(
      'Please enter the subject or topic name.'
    );
  }

  /*
   * IMPORTANT:
   *
   * Subject/topic alone is NOT enough.
   *
   * Pocket Mentor must generate flashcards, quizzes,
   * summaries and revision material ONLY from the
   * student's supplied study material.
   */

  if (!cleanNotes) {
    res.status(400);
    throw new Error(
      'Please provide your own study notes before generating AI content.'
    );
  }

  if (cleanNotes.length < 30) {
    res.status(400);
    throw new Error(
      'Please provide at least 30 characters of your own study material.'
    );
  }

  // --------------------------------------------------
  // GENERATE FROM USER MATERIAL ONLY
  // --------------------------------------------------

  try {
    console.log('');
    console.log('====================================');
    console.log('POCKET MENTOR - REVISION PACK');
    console.log('====================================');
    console.log('Topic:', cleanTopic);
    console.log('Notes length:', cleanNotes.length);
    console.log('Source: USER SUPPLIED NOTES ONLY');
    console.log('====================================');

    /*
     * The topic is only used as a label/context.
     *
     * The actual academic source is cleanNotes.
     */
    const revisionPack =
      await aiService.generateRevisionPack(
        cleanTopic,
        cleanNotes
      );

    // ------------------------------------------------
    // SAFETY CHECK
    // ------------------------------------------------

    if (!revisionPack) {
      res.status(500);

      throw new Error(
        'No revision material was generated.'
      );
    }

    /*
     * Make the source explicit in the response.
     *
     * This can also be used by the frontend to show
     * "Generated from your notes".
     */

    const responseData = {
      ...revisionPack,

      generatedFrom: 'provided-study-material',

      noteBased: true,

      source: {
        type: 'user-notes',
        topic: cleanTopic,
        noteLength: cleanNotes.length,
      },
    };

    console.log(
      'Revision pack generated successfully.'
    );

    console.log(
      'Flashcards:',
      responseData.flashcards?.length || 0
    );

    console.log(
      'Quiz questions:',
      responseData.quiz?.length || 0
    );

    console.log(
      'Generated from user notes: YES'
    );

    console.log('====================================');
    console.log('');

    return res.status(200).json({
      success: true,
      data: responseData,
    });

  } catch (error) {
    // ------------------------------------------------
    // BACKEND ERROR LOGGING
    // ------------------------------------------------

    console.error('');
    console.error(
      '=========================================='
    );
    console.error(
      'POCKET MENTOR AI GENERATION ERROR'
    );
    console.error(
      '=========================================='
    );

    console.error(
      'Message:',
      error?.message
    );

    if (error?.status) {
      console.error(
        'Status:',
        error.status
      );
    }

    if (error?.statusCode) {
      console.error(
        'Status Code:',
        error.statusCode
      );
    }

    if (error?.code) {
      console.error(
        'Code:',
        error.code
      );
    }

    if (error?.type) {
      console.error(
        'Type:',
        error.type
      );
    }

    if (error?.response?.data) {
      console.error(
        'Response Data:',
        error.response.data
      );
    }

    console.error(
      'Full Error:',
      error
    );

    console.error(
      '=========================================='
    );
    console.error('');

    // ------------------------------------------------
    // FRONTEND ERROR
    // ------------------------------------------------

    res.status(
      error?.statusCode ||
      error?.status ||
      500
    );

    throw new Error(
      error?.message ||
      'We could not generate your revision pack right now. Please try again.'
    );
  }
});

const explainConcept = asyncHandler(async (req, res) => {
  const { topic, concept, level, notes } = req.body;
  if (!topic?.trim() || !concept?.trim()) {
    res.status(400);
    throw new Error('A topic and concept are required.');
  }
  if (!notes?.trim() || notes.trim().length < 30) {
    res.status(400);
    throw new Error('Please provide the study material used to explain this concept.');
  }
  const result = await aiService.explainConcept({ topic: topic.trim(), concept: concept.trim(), level, notes: notes.trim() });
  res.json({ ...result, noteBased: true });
});

export {
  generateRevisionPack,
  explainConcept,
};