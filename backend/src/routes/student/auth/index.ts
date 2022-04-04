import { Router } from "express";

import googleRoutes from "./google";
import logoutRoutes from "./logout";
import signupRoutes from "./signup";

const router = Router();

router.use("/google", googleRoutes);
router.use("/signup", signupRoutes);
router.use("/logout", logoutRoutes);

export default router;
