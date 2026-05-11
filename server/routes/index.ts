import { Router } from "express";

import authRoutes from "../services/auth/";

const router = Router();

router.use("/auth", authRoutes);

export default router;
