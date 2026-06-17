import { Router } from "express";

import { AuthMiddleware } from "../../core/middlewares/auth.middleware";
import OAuthProxy from "./oauth.proxy";

const OAuthRouter = Router();

OAuthRouter.get(
  "/instagram",
  AuthMiddleware,
  OAuthProxy.instagramOauthRedirect,
);
OAuthRouter.get("/instagram/callback", OAuthProxy.instagramOauthCallback);

export default OAuthRouter;
