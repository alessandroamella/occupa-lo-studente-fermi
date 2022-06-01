import { Router } from "express";

import { secretaryAuth } from "@middlewares";
import { ResErr } from "@routes";
import { AgencyService } from "@services";
import { logger } from "@shared";

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

router.get("/", secretaryAuth, async (req, res) => {
    try {
        const agencies = await AgencyService.find({
            fields: {},
            lean: true,
            populateJobOffers: true,
            showHashedPassword: false,
            showPersonalData: true
        });
        return res.json(agencies);
    } catch (err) {
        logger.error("Error while finding agencies for secretary");
        logger.error(err);

        return res
            .status(500)
            .json({ err: "Error while finding agencies" } as ResErr);
    }
});

export default router;
