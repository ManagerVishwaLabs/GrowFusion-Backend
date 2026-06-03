import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: process.env.MONGO_URI || "",

  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  CLIENT_URL: process.env.CLIENT_URL || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID || "",
  INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI || "",
};
