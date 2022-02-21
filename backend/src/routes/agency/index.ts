import { Router } from "express";

import showRoute from "./show";

const router = Router();

router.get("/", showRoute);

export default router;
