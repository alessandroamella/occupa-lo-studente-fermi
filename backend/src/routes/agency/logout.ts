import { Request, Response, Router } from "express";

import { Envs } from "@config";

import { logger } from "@shared";

/**
 * @openapi
 * /api/agency/logout:
 *  get:
 *    summary: Logout as agency, returns 200 even if not logged in
 *    tags:
 *      - agency
 *    responses:
 *      '200':
 *        description: Logout successful (empty response)
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

const router = Router();

router.get("/", (req: Request, res: Response) => {
    logger.debug(
        "Logging out agency " + (req.agency?._id || "-- not logged in --")
    );
    res.clearCookie(Envs.env.AGENCY_AUTH_COOKIE_NAME);
    res.sendStatus(200);
});

export default router;
