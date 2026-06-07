import { Schema, model } from "mongoose";

interface SocialMediaAccountType {
  company: string;
  mediaName: "instagram";
  tokenApiUserId?: string;
  appUserId?: string;
  mediaUsername?: string;
  username: string;
  displayName?: string;
  email?: string;
  profilePictureUrl?: string;
  followersCount?: number;
  followsCount?: number;
  mediaCount?: number;
  accessToken: string;
  tokenExpiresAt?: Date;
  instagramBusinessAccountId?: string;
  scopes?: string[];
  isActive?: boolean;
  lastSyncedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const SocialMediaAccountSchema = new Schema<SocialMediaAccountType>(
  {
    company: {
      type: String,
      ref: "Company",
      required: true,
      index: true,
    },
    username: {
      type: String,
      ref: "User",
      required: true,
    },
    mediaName: {
      type: String,
      enum: ["instagram"],
      required: true,
    },
    tokenApiUserId: {
      type: String,
      required: true,
      trim: true,
    },
    appUserId: {
      type: String,
      trim: true,
    },
    mediaUsername: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    profilePictureUrl: {
      type: String,
      trim: true,
    },
    followersCount: {
      type: Number,
      required: true,
    },
    followsCount: {
      type: Number,
    },
    mediaCount: {
      type: Number,
    },
    accessToken: {
      type: String,
      required: true,
    },
    tokenExpiresAt: {
      type: Date,
    },
    instagramBusinessAccountId: {
      type: String,
      trim: true,
    },
    scopes: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSyncedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

SocialMediaAccountSchema.index(
  {
    company: 1,
    mediaName: 1,
    tokenApiUserId: 1,
    username: 1,
  },
  {
    unique: true,
  },
);

const SocialAccount = model<SocialMediaAccountType>(
  "SocialMediaAccount",
  SocialMediaAccountSchema,
  "socialMediaAccount",
);

export { SocialMediaAccountType };
export default SocialAccount;
