import { Types } from "mongoose";

import { DocumentId } from "./types";

const isEmailAddress = (email: string): boolean => {
  try {
    if (typeof email !== "string") {
      return false;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(trimmedEmail);
  } catch {
    return false;
  }
};

const isObjectId = (id: DocumentId): boolean => {
  try {
    if (typeof id !== "string") {
      return false;
    }

    const trimmedId = id.trim();

    if (!trimmedId) {
      return false;
    }

    return Types.ObjectId.isValid(trimmedId);
  } catch {
    return false;
  }
};

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);

    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidMediaUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    return /\.(jpg|jpeg|png|webp|mp4)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
};

export { isEmailAddress, isObjectId, isValidMediaUrl, isValidUrl };
