import mongoose from 'mongoose';

const studyMaterialSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * Indicates that this material was generated
     * from the student's uploaded/pasted notes.
     */
    sourceType: {
      type: String,
      enum: ['user-notes'],
      default: 'user-notes',
    },

    summary: {
      type: String,
      required: true,
    },

    quickRevision: {
      type: String,
      required: true,
    },

    keyConcepts: {
      type: [String],
      default: [],
    },

    /*
     * --------------------------------------------------
     * FLASHCARDS
     * --------------------------------------------------
     *
     * Flashcards are generated from the user's notes.
     */
    flashcards: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          required: true,
        },

        /*
         * The actual note statement used to create
         * this flashcard.
         */
        sourceNote: {
          type: String,
          default: '',
        },
      },
    ],

    /*
     * --------------------------------------------------
     * QUIZ
     * --------------------------------------------------
     *
     * Quiz questions must be based on the supplied
     * study material.
     */
    quiz: [
      {
        question: {
          type: String,
          required: true,
        },

        options: {
          type: [String],
          default: [],
        },

        /*
         * Index of the correct option.
         *
         * Example:
         * options = ['A', 'B', 'C', 'D']
         * correctAnswer = 1
         */
        correctAnswer: {
          type: Number,
          required: true,
        },

        explanation: {
          type: String,
          default: '',
        },

        topic: {
          type: String,
          default: '',
        },

        difficulty: {
          type: String,
          default: 'medium',
        },

        /*
         * IMPORTANT:
         *
         * This stores the part of the student's notes
         * that the question was created from.
         *
         * It prevents the quiz from becoming a generic
         * subject-based question bank.
         */
        sourceNote: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StudyMaterial = mongoose.model(
  'StudyMaterial',
  studyMaterialSchema
);

export default StudyMaterial;