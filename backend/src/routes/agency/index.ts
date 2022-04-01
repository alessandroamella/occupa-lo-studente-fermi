import { Router } from "express";

import createRoute from "./create";
import showAllRoute from "./showAll";
import showOneRoute from "./showOne";
import updateRoute from "./update";

const router = Router();

router.use("/", showOneRoute);
router.use("/", showAllRoute);
router.use("/", createRoute);
router.use("/", updateRoute);

export default router;
