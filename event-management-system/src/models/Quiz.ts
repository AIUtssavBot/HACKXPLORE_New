import mongoose from 'mongoose';

export interface IQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'puzzle';
  timeLimit?: number; // in seconds
  hints?: string[];
}

export interface IQuiz {
  title: string;
  description: string;
  eventId?: mongoose.Types.ObjectId;
  questions: IQuestion[];
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  participants: {
    userId: mongoose.Types.ObjectId;
    score: number;
    answers: {
      questionIndex: number;
      selectedAnswer: number;
      isCorrect: boolean;
      timeSpent: number;
    }[];
    startedAt: Date;
    completedAt?: Date;
  }[];
  createdBy: mongoose.Types.ObjectId;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  totalPoints: number;
  passingScore: number;
  isAIGenerated: boolean;
  aiPrompt?: string;
}

const questionSchema = new mongoose.Schema<IQuestion>({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length >= 2, 'At least 2 options are required'],
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
  },
  explanation: String,
  points: {
    type: Number,
    required: true,
    min: 1,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'puzzle'],
    required: true,
  },
  timeLimit: Number,
  hints: [String],
});

const quizSchema = new mongoose.Schema<IQuiz>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  questions: [questionSchema],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    answers: [{
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
      timeSpent: Number,
    }],
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: Date,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  totalPoints: {
    type: Number,
    required: true,
  },
  passingScore: {
    type: Number,
    required: true,
  },
  isAIGenerated: {
    type: Boolean,
    default: false,
  },
  aiPrompt: String,
}, {
  timestamps: true,
});

// Virtual for getting current participants count
quizSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for getting average score
quizSchema.virtual('averageScore').get(function() {
  if (this.participants.length === 0) return 0;
  const totalScore = this.participants.reduce((sum, p) => sum + p.score, 0);
  return totalScore / this.participants.length;
});

// Virtual for checking if quiz is ongoing
quizSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return now >= this.startTime && now <= this.endTime;
});

// Indexes for efficient queries
quizSchema.index({ startTime: 1, endTime: 1 });
quizSchema.index({ eventId: 1 });
quizSchema.index({ 'participants.userId': 1 });

export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', quizSchema); 