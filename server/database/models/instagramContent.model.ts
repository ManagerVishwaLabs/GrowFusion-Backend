import { Types } from "mongoose";
import { Schema, model } from "mongoose";

enum InstagramContentStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  FAILED = "failed",
  DELETED = "deleted",
}

interface InstagramContentType {
  username: string;
  company: string;
  socialAccountId: Types.ObjectId;
  instagramBusinessAccountId: string;
  instagramCreationId?: string;
  instagramMediaId?: string;
  childCreationIds?: string[];
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "REELS" | "CAROUSEL_ALBUM" | "STORY";
  source?: "USER" | "SYNCED";
  mediaUrl?: string;
  childMediaUrls?: string[];
  instagramMediaUrl?: string;
  instagramChildMediaUrls?: string[];
  permalink?: string;
  mediaProductType?: string;
  thumbnailUrl?: string;
  commentsCount?: number;
  likeCount?: number;
  isCommentEnabled?: boolean;
  status?: InstagramContentStatus;
  publishedAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const InstagramContentSchema = new Schema<InstagramContentType>(
  {
    username: {
      type: String,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      ref: "Company",
      required: true,
    },
    socialAccountId: {
      type: Schema.Types.ObjectId,
      ref: "SocialMediaAccount",
      required: true,
    },
    instagramBusinessAccountId: {
      type: String,
      required: true,
      index: true,
    },
    instagramCreationId: String,
    instagramMediaId: String,
    childCreationIds: [String],
    caption: String,
    mediaProductType: String,
    thumbnailUrl: String,
    commentsCount: Number,
    likeCount: Number,
    isCommentEnabled: Boolean,
    mediaType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "REELS", "CAROUSEL_ALBUM", "STORY"],
      required: true,
    },
    source: {
      type: String,
      enum: ["USER", "SYNCED"],
      default: "USER",
      required: true,
    },
    mediaUrl: String,
    childMediaUrls: [String],
    instagramMediaUrl: String,
    instagramChildMediaUrls: [String],
    permalink: String,
    status: {
      type: String,
      default: InstagramContentStatus.DRAFT,
    },
    publishedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

InstagramContentSchema.index(
  {
    username: 1,
    company: 1,
    instagramBusinessAccountId: 1,
    instagramCreationId: 1,
    instagramMediaId: 1,
  },
  {
    unique: true,
  },
);

const InstagramContent = model<InstagramContentType>(
  "InstagramContent",
  InstagramContentSchema,
  "instagramContents",
);

export default InstagramContent;
export { InstagramContentType };
