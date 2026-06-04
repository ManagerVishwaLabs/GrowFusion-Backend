import { Router } from "express";

import TestProxy from "./test.proxy";

const TestRouter = Router();

TestRouter.get("/instagram/getProfile", TestProxy.getProfile);

export default TestRouter;
