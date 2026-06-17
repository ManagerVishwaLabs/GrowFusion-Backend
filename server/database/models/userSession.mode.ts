import { model, Schema, Types } from "mongoose";

interface UserSessionType {
  userId: Types.ObjectId;
  tokenId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  isRevoked?: boolean;
  revokedAt?: Date;
  userAgent?: string;
  ipAddress?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSessionSchema = new Schema<UserSessionType>(
  {
    userId: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
    tokenId: {
      required: true,
      type: String,
    },
    refreshTokenHash: {
      required: true,
      type: String,
    },
    expiresAt: {
      required: true,
      type: Date,
    },
    isRevoked: {
      default: false,
      type: Boolean,
    },
    revokedAt: {
      default: null,
      type: Date,
    },
    userAgent: {
      trim: true,
      type: String,
    },
    ipAddress: {
      type: String,
    },
    isActive: {
      default: true,
      type: Boolean,
    },
  },
  { timestamps: true },
);

UserSessionSchema.index({ tokenId: 1 }, { unique: true });
UserSessionSchema.index({ userId: 1, isRevoked: 1 });
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserSession = model<UserSessionType>(
  "UserSession",
  UserSessionSchema,
  "userSessions",
);

export type { UserSessionType };
export default UserSession;
