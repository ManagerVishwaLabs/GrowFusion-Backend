import { Router } from "express";

import AuthProxy from "./auth.proxy";

const authRouter = Router();

authRouter.post("/login", AuthProxy.login);

export default authRouter;
