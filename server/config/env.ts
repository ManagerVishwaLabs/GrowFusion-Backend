import dotenv from "dotenv";

dotenv.config();

const env = {
  CLIENT_URL: process.env.CLIENT_URL || "",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "",
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID || "",

  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET || "",

  INSTAGRAM_FORCE_RE_AUTH: process.env.INSTAGRAM_FORCE_RE_AUTH || "true",

  INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "30m",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  JWT_ISSUER: process.env.JWT_ISSUER || "GrowFusion-BACKEND",
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || "GrowFusion-FRONTEND",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  TEMP_CLIENT: process.env.TEMP_CLIENT || "",
  MONGO_URI: process.env.MONGO_URI || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER || "",
  PORT: process.env.PORT || 8000,
};

export default env;
