import { model, Schema } from "mongoose";

interface InvitationType {
  company: string;
  inviter: string;
  inviteeName: string;
  inviteCode: string;
  inviteeEmail: string;
  status: "pending" | "accepted" | "rejected" | "expired" | "revoked";
  expiryDate?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  revokedAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const InvitationSchema = new Schema<InvitationType>(
  {
    company: {
      ref: "Company",
      required: true,
      type: String,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    inviter: {
      required: true,
      ref: "User",
      type: String,
    },
    inviteeName: {
      required: true,
      type: String,
    },
    inviteeEmail: {
      required: true,
      type: String,
    },
    status: {
      default: "pending",
      enum: ["pending", "accepted", "rejected", "expired", "revoked"],
      required: true,
      type: String,
    },
    expiryDate: Date,
    acceptedAt: Date,
    rejectedAt: Date,
    revokedAt: Date,
    isActive: {
      default: true,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

InvitationSchema.index(
  {
    company: 1,
    invitee: 1,
    status: 1,
    inviteCode: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "pending",
    },
  },
);
const Invitation = model<InvitationType>(
  "Invitation",
  InvitationSchema,
  "invitations",
);

export { InvitationType };
export default Invitation;
