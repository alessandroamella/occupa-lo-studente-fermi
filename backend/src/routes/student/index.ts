import { Router } from "express";

import agenciesRoute from "./agencies";
import agencyRoute from "./agency";
import authRoutes from "./auth";
import deleteRoute from "./delete";
import jobApplicationRoutes from "./jobapplication";
import jobOffersRoute from "./joboffers";
import showRoute from "./show";

const router = Router();

router.use("/", showRoute);
router.use("/", deleteRoute);
router.use("/agency", agencyRoute);
router.use("/agencies", agenciesRoute);
router.use("/joboffers", jobOffersRoute);
router.use("/auth", authRoutes);
router.use("/jobapplication", jobApplicationRoutes);

export default router;
