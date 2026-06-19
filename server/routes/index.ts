import { Router } from "express";

import { AuthMiddleware } from "../core/middlewares/auth.middleware";
import AuthRoutes from "../services/auth/";
import InvitationRoutes from "../services/invitation";
import OAuthRoutes from "../services/oauth/";
import testRoutes from "../services/test/";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/oauth", OAuthRoutes);
router.use("/test", AuthMiddleware, testRoutes);
router.use("/invitation", InvitationRoutes);

export default router;
