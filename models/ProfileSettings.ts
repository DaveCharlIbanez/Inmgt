import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IProfileSettings extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  displayName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences: {
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showPhone: boolean;
  };
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSettingsSchema: Schema<IProfileSettings> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    preferences: {
      timezone: {
        type: String,
        default: 'UTC',
      },
      dateFormat: {
        type: String,
        default: 'MM/DD/YYYY',
      },
      currency: {
        type: String,
        default: 'PHP',
      },
    },
    privacy: {
      profileVisible: {
        type: Boolean,
        default: true,
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: false,
      },
    },
    social: {
      linkedin: String,
      twitter: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const ProfileSettings: Model<IProfileSettings> = 
  mongoose.models.ProfileSettings || mongoose.model<IProfileSettings>('ProfileSettings', ProfileSettingsSchema);

export default ProfileSettings;
