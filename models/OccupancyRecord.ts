import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export type OccupancyStatus = 'planned' | 'checked-in' | 'checked-out' | 'vacant' | 'overdue';

export interface IOccupancyRecord extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  propertyName: string;
  roomNumber?: string;
  moveInDate: Date;
  moveOutDate?: Date;
  status: OccupancyStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OccupancyRecordSchema: Schema<IOccupancyRecord> = new Schema(
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
    moveInDate: {
      type: Date,
      required: true,
    },
    moveOutDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['planned', 'checked-in', 'checked-out', 'vacant', 'overdue'],
      default: 'planned',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const OccupancyRecord: Model<IOccupancyRecord> =
  mongoose.models.OccupancyRecord || mongoose.model<IOccupancyRecord>('OccupancyRecord', OccupancyRecordSchema);

export default OccupancyRecord;
