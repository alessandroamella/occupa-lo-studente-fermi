import { Router } from "express";

import { isAgencyLoggedIn } from "@middlewares";

const router = Router();

router.post("/", isAgencyLoggedIn.isAgencyLoggedIn, (req, res) => {
    // eslint-disable-next-line no-console
    console.log(req.agency);
});

export default router;
