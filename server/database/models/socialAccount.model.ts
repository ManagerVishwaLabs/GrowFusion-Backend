import { model, Schema } from "mongoose";

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
    accessToken: {
      required: true,
      type: String,
    },
    appUserId: {
      trim: true,
      type: String,
    },
    company: {
      index: true,
      ref: "Company",
      required: true,
      type: String,
    },
    displayName: {
      trim: true,
      type: String,
    },
    email: {
      lowercase: true,
      trim: true,
      type: String,
    },
    followersCount: {
      required: true,
      type: Number,
    },
    followsCount: {
      type: Number,
    },
    instagramBusinessAccountId: {
      trim: true,
      type: String,
    },
    isActive: {
      default: true,
      type: Boolean,
    },
    lastSyncedAt: {
      type: Date,
    },
    mediaCount: {
      type: Number,
    },
    mediaName: {
      enum: ["instagram"],
      required: true,
      type: String,
    },
    mediaUsername: {
      required: true,
      trim: true,
      type: String,
    },
    profilePictureUrl: {
      trim: true,
      type: String,
    },
    scopes: [
      {
        type: String,
      },
    ],
    tokenApiUserId: {
      required: true,
      trim: true,
      type: String,
    },
    tokenExpiresAt: {
      type: Date,
    },
    username: {
      ref: "User",
      required: true,
      type: String,
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
