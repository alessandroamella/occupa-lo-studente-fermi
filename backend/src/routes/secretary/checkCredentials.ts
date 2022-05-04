import { Router } from "express";

import { secretaryAuth } from "@middlewares";
import { logger } from "@shared";

/**
 * @openapi
 * /api/secretary/check-credentials:
 *  get:
 *    summary: Check if secretary credentials are valid
 *    parameters:
 *      - in: query
 *        name: username
 *        schema:
 *          type: string
 *        required: true
 *        description: Secretary username
 *      - in: query
 *        name: password
 *        schema:
 *          type: string
 *        required: true
 *        description: Secretary password
 *    tags:
 *      - secretary
 *    responses:
 *      '200':
 *        description: Credentials are valid
 *      '401':
 *        description: Credentials are not valid
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

const router = Router();

router.get("/", secretaryAuth, async (req, res) => {
    // If credentials are not valid, the middleware will send a 401
    if (!req.secretary) {
        return res.status(401).json({ err: "Secretary account not found" });
    }
    try {
        await req.secretary.saveNewLogin(req.ip || "-- unknown --");
    } catch (err) {
        logger.error(
            "Error while saving new login for secretary " + req.secretary._id
        );
        logger.error(err);
    }
    res.sendStatus(200);
});

export default router;
