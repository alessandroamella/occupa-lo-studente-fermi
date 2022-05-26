import { Router } from "express";

// import createRoute from "./create";
// import deleteRoute from "./delete";
import showRoute from "./show";
import updateRoute from "./update";

const router = Router();

// router.use("/", createRoute);
router.use("/", showRoute);
router.use("/", updateRoute);
// router.use("/", deleteRoute);

export default router;
