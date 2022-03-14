import { Router } from "express";

import { logger } from "@shared";

import agencyRoutes from "./agency";
import studentRoutes from "./student";

logger.info("Loading API routes...");

const router = Router();

router.use("/agency", agencyRoutes);
router.use("/student", studentRoutes);

export * from "./ResErr";

export default router;
