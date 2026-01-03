import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IHomeSettings extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  layout: {
    sidebarCollapsed: boolean;
    gridView: boolean;
  };
  dashboard: {
    widgets: string[];
    defaultView: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HomeSettingsSchema: Schema<IHomeSettings> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },
    language: {
      type: String,
      default: 'en',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },
    layout: {
      sidebarCollapsed: {
        type: Boolean,
        default: false,
      },
      gridView: {
        type: Boolean,
        default: true,
      },
    },
    dashboard: {
      widgets: {
        type: [String],
        default: ['overview', 'activity', 'stats'],
      },
      defaultView: {
        type: String,
        default: 'dashboard',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const HomeSettings: Model<IHomeSettings> = 
  mongoose.models.HomeSettings || mongoose.model<IHomeSettings>('HomeSettings', HomeSettingsSchema);

export default HomeSettings;
