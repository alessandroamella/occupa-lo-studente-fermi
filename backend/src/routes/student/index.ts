import { Router } from "express";

import authRoutes from "./auth";
import currentStudentRoutes from "./current";
import jobOffersRoutes from "./joboffers";

const router = Router();

router.use("/auth", authRoutes);
router.use("/current", currentStudentRoutes);
router.use("/joboffers", jobOffersRoutes);

export default router;
