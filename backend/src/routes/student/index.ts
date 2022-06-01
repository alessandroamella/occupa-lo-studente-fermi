import { Router } from "express";

import agenciesRoute from "./agencies";
import agencyRoute from "./agency";
import authRoutes from "./auth";
import deleteRoute from "./delete";
import jobApplicationRoutes from "./jobapplication";
import jobOffersRoute from "./joboffer";
import showRoute from "./show";
import updateRoute from "./update";

const router = Router();

router.use("/", showRoute);
router.use("/", updateRoute);
router.use("/", deleteRoute);
router.use("/agency", agencyRoute);
router.use("/agencies", agenciesRoute);
router.use("/joboffers", jobOffersRoute);
router.use("/auth", authRoutes);
router.use("/jobapplication", jobApplicationRoutes);

export default router;
