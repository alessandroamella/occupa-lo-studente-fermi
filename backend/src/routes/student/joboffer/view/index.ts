import { Router } from "express";

import addViewRoute from "./add";

const router = Router();

router.use("/", addViewRoute);

export default router;
