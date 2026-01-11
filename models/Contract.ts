import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export type ContractStatus = 'draft' | 'pending' | 'active' | 'terminated' | 'completed';

export interface IContract extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  propertyName: string;
  roomNumber?: string;
  startDate: Date;
  endDate?: Date;
  rentAmount: number;
  currency: string;
  status: ContractStatus;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema: Schema<IContract> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    roomNumber: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    rentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'PHP',
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'terminated', 'completed'],
      default: 'pending',
    },
    terms: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Contract: Model<IContract> = mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);

export default Contract;
