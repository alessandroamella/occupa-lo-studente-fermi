import { Router } from "express";

import deleteRoute from "./delete";

const router = Router();

router.use("/", deleteRoute);

export default router;
