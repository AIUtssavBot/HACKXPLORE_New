import mongoose from 'mongoose';
import { UserRole } from './User';

export enum EventStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface IEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizingCommittee: string;
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  status: EventStatus;
  maxAttendees?: number;
  attendees: mongoose.Types.ObjectId[];
  sponsors: {
    name: string;
    logo?: string;
    description?: string;
    stall?: {
      location: string;
      items: string[];
    };
  }[];
  feedback: {
    attendee: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    timestamp: Date;
  }[];
  marketingMaterials: {
    type: string;
    url: string;
    createdAt: Date;
  }[];
  budget?: {
    allocated: number;
    spent: number;
  };
}

const eventSchema = new mongoose.Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  organizingCommittee: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.PENDING,
  },
  maxAttendees: Number,
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  sponsors: [{
    name: {
      type: String,
      required: true,
    },
    logo: String,
    description: String,
    stall: {
      location: String,
      items: [String],
    },
  }],
  feedback: [{
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  marketingMaterials: [{
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  budget: {
    allocated: Number,
    spent: Number,
  },
}, {
  timestamps: true,
});

// Virtual for getting event status
eventSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

// Virtual for getting attendance count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees.length;
});

// Virtual for getting average rating
eventSchema.virtual('averageRating').get(function() {
  if (!this.feedback.length) return 0;
  const sum = this.feedback.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / this.feedback.length;
});

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema); 