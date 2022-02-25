import { Router } from "express";

import showRoute from "./show";

const router = Router();

router.use("/", showRoute);

export default router;
