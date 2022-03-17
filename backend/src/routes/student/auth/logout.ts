import { Router } from "express";

import { Envs } from "@config";

import { logger } from "@shared";

/**
 * @openapi
 * /api/student/auth/logout:
 *  get:
 *    summary: Logout student if logged in
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: Always returns 200, even if not logged in
 */

const router = Router();

router.get("/", (req, res) => {
    logger.debug(
        "Logging out student " + (req.student?._id || "-- not logged in --")
    );
    res.clearCookie(Envs.env.AUTH_COOKIE_NAME);
    res.sendStatus(200);
});

export default router;
