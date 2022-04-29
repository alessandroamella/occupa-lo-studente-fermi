import { Router } from "express";

import { Envs } from "@config";

import { logger } from "@shared";

import googleRoutes from "./google";
import logoutRoutes from "./logout";
import signupRoutes from "./signup";
import testAuthRoutes from "./testAuth";

const router = Router();

router.use("/google", googleRoutes);
router.use("/signup", signupRoutes);
router.use("/logout", logoutRoutes);

if (Envs.env.NODE_ENV === "test") {
    logger.warn("Using student test auth routes");
    router.use("/testauth", testAuthRoutes);
}

export default router;
