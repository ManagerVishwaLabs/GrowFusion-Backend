import { Types } from "mongoose";
import { Schema, model } from "mongoose";

enum InstagramContentStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  FAILED = "failed",
  DELETED = "deleted",
}

interface InstagramContentType {
  socialAccountId: Types.ObjectId;
  instagramBusinessAccountId: string;
  instagramCreationId?: string;
  instagramMediaId?: string;
  childCreationIds?: string[];
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "REELS" | "CAROUSEL" | "STORY";
  mediaUrls: string[];
  permalink?: string;
  status?: InstagramContentStatus;
  publishedAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const InstagramContentSchema = new Schema<InstagramContentType>(
  {
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
    mediaType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "REELS", "CAROUSEL", "STORY"],
      required: true,
    },
    mediaUrls: [String],
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

const InstagramContent = model<InstagramContentType>(
  "InstagramContent",
  InstagramContentSchema,
  "instagramContents",
);

export default InstagramContent;
export { InstagramContentType };
