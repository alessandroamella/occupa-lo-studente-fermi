import { Router } from "express";

import createRoute from "./create";
import deleteRoute from "./delete";

const router = Router();

router.use("/", createRoute);
router.use("/", deleteRoute);

export default router;
