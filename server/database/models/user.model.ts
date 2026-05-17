import { Schema, model } from "mongoose";

import { UserRole } from "../../utils/constants";
import { UserRoleType } from "../../utils/types";

interface UserType {
  firstName: string;
  lastName?: string;
  username: string;
  company: string;
  email: string;
  passwordHash?: string;
  userRole?: UserRoleType;
  isActive?: boolean;
}

const UserSchema = new Schema(
  {
    firstName: {
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
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false,
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

const User = model("User", UserSchema, "users");

export { UserType };
export default User;
