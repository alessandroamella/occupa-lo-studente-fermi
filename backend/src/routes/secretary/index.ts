import { Router } from "express";

import listRoute from "./listAgencies";

const router = Router();

router.use("/agencies", listRoute);

export default router;
