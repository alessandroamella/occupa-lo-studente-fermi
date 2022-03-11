import { Router } from "express";

import agencyRoutes from "./agency";

const router = Router();

router.use("/agency", agencyRoutes);

export default router;
