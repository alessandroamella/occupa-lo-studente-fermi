import { Router } from "express";

import getRoute from "./get";
import viewRoutes from "./view";

const router = Router();

router.use("/", getRoute);
router.use("/view", viewRoutes);

export default router;
