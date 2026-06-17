import { Router } from "express";

import authRoutes from "../services/auth/";
import OAuthRoutes from "../services/oauth/";
import testRoutes from "../services/test/";
import { AuthMiddleware } from "../core/middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/oauth", AuthMiddleware, OAuthRoutes);
router.use("/test", AuthMiddleware, testRoutes);

export default router;
