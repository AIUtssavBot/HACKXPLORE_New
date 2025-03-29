import mongoose from 'mongoose';
import { UserRole } from './User';

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  readBy: mongoose.Types.ObjectId[];
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
}

export interface IChat {
  name: string;
  type: 'group' | 'direct';
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  allowedRoles: UserRole[];
  createdBy: mongoose.Types.ObjectId;
  lastActivity: Date;
  isActive: boolean;
}

const messageSchema = new mongoose.Schema<IMessage>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  attachments: [{
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
});

const chatSchema = new mongoose.Schema<IChat>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['group', 'direct'],
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [messageSchema],
  allowedRoles: [{
    type: String,
    enum: Object.values(UserRole),
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Update lastActivity when new message is added
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

// Virtual for unread messages count for a user
chatSchema.methods.getUnreadCount = function(userId: mongoose.Types.ObjectId) {
  return this.messages.reduce((count, message) => {
    if (!message.readBy.includes(userId)) {
      return count + 1;
    }
    return count;
  }, 0);
};

// Virtual for last message
chatSchema.virtual('lastMessage').get(function() {
  if (this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Indexes for efficient queries
chatSchema.index({ participants: 1 });
chatSchema.index({ allowedRoles: 1 });
chatSchema.index({ lastActivity: -1 });

export const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema); 