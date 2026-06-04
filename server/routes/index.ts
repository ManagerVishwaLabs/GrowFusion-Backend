import { Router } from "express";

import authRoutes from "../services/auth/";
import OAuthRoutes from "../services/oauth/";
import testRoutes from "../services/test/";

const router = Router();

router.use("/auth", authRoutes);
router.use("/oauth", OAuthRoutes);
router.use("/test", testRoutes);

export default router;
