import { Router } from "express";

import googleRoutes from "./google";
import signupRoutes from "./signup";

const router = Router();

router.use("/google", googleRoutes);
router.use("/signup", signupRoutes);

export default router;
