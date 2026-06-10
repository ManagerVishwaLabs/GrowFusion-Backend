import { Schema, model } from "mongoose";

import { UserRole } from "../../utils/constants";
import { UserRoleType } from "../../utils/types";

interface UserType {
  fullName: string;
  lastName?: string;
  username: string;
  company: string;
  email: string;
  designation?: string;
  passwordHash?: string;
  phoneNumber?: string;
  userRole?: UserRoleType;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<UserType>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      required: true,
    },
    designation: String,
    phoneNumber: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
    },
    userRole: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.USER],
      default: UserRole.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
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
