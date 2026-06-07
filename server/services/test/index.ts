import { Router } from "express";

import TestProxy from "./test.proxy";

const TestRouter = Router();

TestRouter.get("/instagram/getProfile", TestProxy.getProfile);
TestRouter.post("/instagram/createImagePost", TestProxy.createImagePost);
TestRouter.post("/instagram/createReel", TestProxy.createReel);
TestRouter.post("/instagram/createCarousel", TestProxy.createCarousel);
TestRouter.post("/instagram/createImageStory", TestProxy.createImageStory);
TestRouter.post("/instagram/createVideoStory", TestProxy.createVideoStory);
TestRouter.post("/instagram/publishContent", TestProxy.publishContent);

export default TestRouter;
