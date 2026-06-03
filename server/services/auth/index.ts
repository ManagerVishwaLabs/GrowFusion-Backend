import { Router } from "express";

import AuthProxy from "./auth.proxy";

const authRouter = Router();

authRouter.post("/register", AuthProxy.register);
authRouter.post("/login", AuthProxy.login);
authRouter.get("/oauth/instagram", AuthProxy.instagramOauthRedirect);
authRouter.get("/oauth/instagram/callback", AuthProxy.instagramOauthCallback);

export default authRouter;
