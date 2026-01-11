import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'client' | 'owner';

export interface IWalletTransaction {
  id: string;
  type: 'Top-up' | 'Payment';
  amount: number;
  reference: string;
  status: 'Processing' | 'Success' | 'Failed';
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  isActive: boolean;
  walletBalance?: number;
  walletTransactions?: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'client', 'owner'],
      required: [true, 'Role is required'],
      default: 'client',
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    walletTransactions: {
      type: [{
        id: { type: String, required: true },
        type: { type: String, enum: ['Top-up', 'Payment'], required: true },
        amount: { type: Number, required: true },
        reference: { type: String, required: true },
        status: { type: String, enum: ['Processing', 'Success', 'Failed'], required: true },
        createdAt: { type: Date, default: Date.now },
      }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
