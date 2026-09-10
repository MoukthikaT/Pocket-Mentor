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
    },
    summary: {
      type: String,
      required: true,
    },
    quickRevision: {
      type: String,
      required: true,
    },
    keyConcepts: [String],
    flashcards: [
      {
        question: String,
        answer: String,
      },
    ],
    quiz: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
        topic: String,
        difficulty: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

export default StudyMaterial;
