import { Router } from "express";

import createRoute from "./create";

const router = Router();

router.use("/", createRoute);

export default router;
