import { Router } from "express";

import AuthProxy from "./auth.proxy";

const authRouter = Router();

authRouter.post("/register", AuthProxy.register);

export default authRouter;
