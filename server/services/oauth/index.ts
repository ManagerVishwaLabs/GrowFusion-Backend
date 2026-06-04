import { Router } from "express";

import OAuthProxy from "./oauth.proxy";

const OAuthRouter = Router();

OAuthRouter.get("/instagram", OAuthProxy.instagramOauthRedirect);
OAuthRouter.get("/instagram/callback", OAuthProxy.instagramOauthCallback);

export default OAuthRouter;
