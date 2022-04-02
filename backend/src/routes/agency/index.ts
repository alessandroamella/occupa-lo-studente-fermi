import { Router } from "express";

import createRoute from "./create";
import listRoute from "./list";
import showRoute from "./show";
import updateRoute from "./update";

const router = Router();

router.use("/", showRoute);
router.use("/", listRoute);
router.use("/", createRoute);
router.use("/", updateRoute);

export default router;
