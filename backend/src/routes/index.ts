import { Router } from "express";

import { logger } from "@shared";

import { ResErr } from "./ResErr";
import agencyRoutes from "./agency";
import jobApplicationRoutes from "./jobapplication";
import jobOfferRoutes from "./joboffer";
import secretaryRoutes from "./secretary";
import studentRoutes from "./student";

logger.info("Loading API routes...");

const router = Router();

router.use("/agency", agencyRoutes);
router.use("/student", studentRoutes);
router.use("/joboffer", jobOfferRoutes);
router.use("/secretary", secretaryRoutes);
router.use("/jobapplication", jobApplicationRoutes);

// Fallback route
router.all("*", (req, res) =>
    res.status(404).json({ err: "Route doesn't exist" } as ResErr)
);

export * from "./ResErr";

export default router;
