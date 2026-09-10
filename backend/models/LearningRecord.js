import mongoose from 'mongoose';

const learningRecordSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kind: {
      type: String,
      enum: ['teaching', 'boss', 'rescue', 'quiz', 'mistake'],
      required: true,
    },
    topic: { type: String, required: true, trim: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const LearningRecord = mongoose.model('LearningRecord', learningRecordSchema);

export default LearningRecord;
