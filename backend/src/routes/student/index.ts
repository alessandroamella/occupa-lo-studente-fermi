import { Router } from "express";

import authRoutes from "./auth";
import deleteRoute from "./delete";
import jobOffersRoute from "./joboffers";
import showRoute from "./show";

const router = Router();

router.use("/", showRoute);
router.use("/", deleteRoute);
router.use("/auth", authRoutes);
router.use("/joboffers", jobOffersRoute);

export default router;
