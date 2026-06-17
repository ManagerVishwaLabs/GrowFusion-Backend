import { model, Schema, Types } from "mongoose";

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
    caption: String,
    childCreationIds: [String],
    childMediaUrls: [String],
    commentsCount: Number,
    company: {
      ref: "Company",
      required: true,
      type: String,
    },
    instagramBusinessAccountId: {
      index: true,
      required: true,
      type: String,
    },
    instagramChildMediaUrls: [String],
    instagramCreationId: String,
    instagramMediaId: String,
    instagramMediaUrl: String,
    isActive: {
      default: true,
      type: Boolean,
    },
    isCommentEnabled: Boolean,
    likeCount: Number,
    mediaProductType: String,
    mediaType: {
      enum: ["IMAGE", "VIDEO", "REELS", "CAROUSEL_ALBUM", "STORY"],
      required: true,
      type: String,
    },
    mediaUrl: String,
    permalink: String,
    publishedAt: Date,
    socialAccountId: {
      ref: "SocialMediaAccount",
      required: true,
      type: Schema.Types.ObjectId,
    },
    source: {
      default: "USER",
      enum: ["USER", "SYNCED"],
      required: true,
      type: String,
    },
    status: {
      default: InstagramContentStatus.DRAFT,
      type: String,
    },
    thumbnailUrl: String,
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

InstagramContentSchema.index(
  {
    company: 1,
    instagramBusinessAccountId: 1,
    instagramCreationId: 1,
    instagramMediaId: 1,
    username: 1,
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
