import { Schema, model } from "mongoose";

import { UserRole } from "../../utils/constants";
import { UserRoleType } from "../../utils/types";

interface UserType {
  fullName: string;
  fullName: string;
  lastName?: string;
  username: string;
  company: string;
  email: string;
  designation?: string;
  designation?: string;
  passwordHash?: string;
  phoneNumber?: string;
  phoneNumber?: string;
  userRole?: UserRoleType;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<UserType>(
  {
    company: {
      required: true,
      type: String,
    },
    designation: String,
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
    },
    fullName: {
      required: true,
      trim: true,
      type: String,
    },
    isActive: {
      default: true,
      type: Boolean,
    },
    lastName: {
      trim: true,
      type: String,
    },
    passwordHash: {
      type: String,
    },
    phoneNumber: String,
    username: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
    },
    userRole: {
      default: UserRole.USER,
      enum: [UserRole.ADMIN, UserRole.USER],
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.index({ username: 1 }, { unique: true });

const User = model<UserType>("User", UserSchema, "users");

export { UserType };
export default User;
