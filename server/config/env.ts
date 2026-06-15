import dotenv from "dotenv";

dotenv.config();

export const env = {
  CLIENT_URL: process.env.CLIENT_URL || "",
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID || "",

  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET || "",

  INSTAGRAM_FORCE_RE_AUTH: process.env.INSTAGRAM_FORCE_RE_AUTH || "true",

  INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  JWT_SECRET: process.env.JWT_SECRET || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  TEMP_CLIENT: process.env.TEMP_CLIENT || "",
  MONGO_URI: process.env.MONGO_URI || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER || "",
  PORT: process.env.PORT || 8000,
};
