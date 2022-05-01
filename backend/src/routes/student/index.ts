import { Router } from "express";

import agenciesRoute from "./agencies";
import authRoutes from "./auth";
import deleteRoute from "./delete";
import showRoute from "./show";

const router = Router();

router.use("/", showRoute);
router.use("/", deleteRoute);
router.use("/agencies", agenciesRoute);
router.use("/auth", authRoutes);

export default router;
