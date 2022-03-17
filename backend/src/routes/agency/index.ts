import { Router } from "express";

import createRoute from "./create";
import showRoute from "./show";
import updateRoute from "./update";

const router = Router();

router.use("/", showRoute);
router.use("/", createRoute);
router.use("/", updateRoute);

export default router;
