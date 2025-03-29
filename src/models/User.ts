import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  COMMITTEE_MEMBER = 'COMMITTEE_MEMBER',
  ATTENDEE = 'ATTENDEE'
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  qrCode?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },
  department: {
    type: String,
    required: function(this: IUser) {
      return this.role === UserRole.COMMITTEE_MEMBER;
    },
  },
  qrCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  profileImage: String,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 