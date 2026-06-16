import crypto from "crypto";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import env from "./env";

type TokenPayload = {
  sub: string;
  username: string;
  role: string;
  company: string;
  jti: string;
  type: "access" | "refresh";
};

type AccessTokenPayload = {
  userId: string;
  username: string;
  role: string;
  company: string;
};

const accessSecret: Secret = env.JWT_ACCESS_SECRET;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET;

const createOptions = (expiresIn: SignOptions["expiresIn"]): SignOptions => ({
  algorithm: "HS512",
  expiresIn,
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
});

const createAccessToken = ({
  userId,
  username,
  role,
  company,
}: AccessTokenPayload) =>
  jwt.sign(
    {
      sub: userId,
      username,
      role,
      company,
      type: "access",
      jti: crypto.randomUUID(),
    } satisfies TokenPayload,
    accessSecret,
    createOptions(env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"]),
  );

const createRefreshToken = ({ userId }: { userId: string }) =>
  jwt.sign(
    {
      sub: userId,
      type: "refresh",
      jti: crypto.randomUUID(),
    },
    refreshSecret,
    createOptions(env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"]),
  );

export { createAccessToken, createRefreshToken };
