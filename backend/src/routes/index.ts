import { Router } from "express";

import { logger } from "@shared";

import { ResErr } from "./ResErr";
import agencyRoutes from "./agency";
import studentRoutes from "./student";

logger.info("Loading API routes...");

const router = Router();

router.use("/agency", agencyRoutes);
router.use("/student", studentRoutes);

// Fallback route
router.all("*", (req, res) =>
    res.status(404).json({ err: "Route doesn't exist" } as ResErr)
);

export * from "./ResErr";

export default router;
