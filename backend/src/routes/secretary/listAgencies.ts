import { Router } from "express";

import { checkSecretaryPassword } from "@middlewares";
import { AgencyService } from "@services";
import { logger } from "@shared";
import { ResErr } from "@routes";

/**
 * @openapi
 * /api/secretary/agencies:
 *  get:
 *    summary: List all agencies
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
 *        description: All agencies
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              description: Array of Agency objects
 *              items:
 *                  $ref: '#/components/schemas/Agency'
 *      '401':
 *        description: Invalid password
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

router.get("/", checkSecretaryPassword, async (req, res) => {
    // DEBUG check authentication
    try {
        const agencies = await AgencyService.find({});
        return res.json(agencies);
    } catch (err) {
        logger.error("Error while finding agencies for secretary");
        logger.error(err);

        return res.status(500).json({err: "Error while finding agencies"} as ResErr)
    }
});

export default router;
