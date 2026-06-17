import { Router } from "express";

import { AuthMiddleware } from "../core/middlewares/auth.middleware";
import authRoutes from "../services/auth/";
import OAuthRoutes from "../services/oauth/";
import testRoutes from "../services/test/";

const router = Router();

router.use("/auth", authRoutes);
router.use("/oauth", OAuthRoutes);
router.use("/test", AuthMiddleware, testRoutes);

export default router;
