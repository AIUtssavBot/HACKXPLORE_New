import mongoose from 'mongoose';

export enum ReimbursementStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

export interface IReimbursement {
  amount: number;
  description: string;
  billImage: string;
  submittedBy: mongoose.Types.ObjectId;
  submittedAt: Date;
  status: ReimbursementStatus;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  eventId: mongoose.Types.ObjectId;
  department: string;
  receiptNumber?: string;
  comments?: string[];
  category: string;
  paymentMethod?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
}

const reimbursementSchema = new mongoose.Schema<IReimbursement>({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  billImage: {
    type: String,
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: Object.values(ReimbursementStatus),
    default: ReimbursementStatus.PENDING,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: Date,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  receiptNumber: String,
  comments: [String],
  category: {
    type: String,
    required: true,
  },
  paymentMethod: String,
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
  },
}, {
  timestamps: true,
});

// Virtual for getting time elapsed since submission
reimbursementSchema.virtual('timeElapsed').get(function() {
  return Date.now() - this.submittedAt.getTime();
});

// Index for efficient queries
reimbursementSchema.index({ submittedBy: 1, status: 1 });
reimbursementSchema.index({ eventId: 1, department: 1 });

export const Reimbursement = mongoose.models.Reimbursement || mongoose.model<IReimbursement>('Reimbursement', reimbursementSchema); 