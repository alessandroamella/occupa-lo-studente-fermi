import { Router } from "express";

import authRoutes from "./auth";
import currentStudentRoutes from "./current";

const router = Router();

router.use("/auth", authRoutes);
router.use("/current", currentStudentRoutes);

export default router;
