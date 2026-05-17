import { Schema, InferSchemaType, model } from "mongoose";

import { UserRole } from "../../utils/commonConstants";

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
      // unique: true,
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
      // unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
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

export type UserType = InferSchemaType<typeof UserSchema>;

export type CreateUserType = Omit<
  UserType,
  "lastName" | "userRole" | "isActive" | "createdAt" | "updatedAt"
> & {
  lastName?: string;
  userRole?: typeof UserRole.ADMIN | typeof UserRole.USER;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.index({ username: 1 }, { unique: true });

const User = model("User", UserSchema, "users");

export default User;
