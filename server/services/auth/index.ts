import { Router } from "express";

import AuthProxy from "./auth.proxy";

const authRouter = Router();

authRouter.post("/register", AuthProxy.register);
authRouter.post("/login", AuthProxy.login);

export default authRouter;
