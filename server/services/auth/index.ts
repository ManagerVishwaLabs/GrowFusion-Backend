import { Router } from "express";

import AuthProxy from "./auth.proxy";

const authRouter = Router();

authRouter.post("/register", AuthProxy.register);
authRouter.post("/registerUser", AuthProxy.registerUser);
authRouter.post("/login", AuthProxy.login);
authRouter.post("/refresh", AuthProxy.refresh);
authRouter.post("/logout", AuthProxy.logout);

export default authRouter;
