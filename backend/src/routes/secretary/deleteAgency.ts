import { Router } from "express";
import { param, query, validationResult } from "express-validator";

import { secretaryAuth } from "@middlewares";
import { ResErr } from "@routes";
import { AgencyService } from "@services";
import { logger } from "@shared";

/**
 * @openapi
 * /api/secretary/deleteagency/{agencyId}:
 *  get:
 *    summary: Deletes an agency along with all its jobOffers
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
 *      - in: path
 *        name: agencyId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the agency to delete
 *      - in: query
 *        name: notifyAgency
 *        schema:
 *          type: string
 *          enum:
 *            - yes
 *            - no
 *        required: false
 *        description: Whether to send an email to this agency notifying the deletion
 *    tags:
 *      - secretary
 *    responses:
 *      '200':
 *        description: Agency deleted
 *      '400':
 *        description: Invalid agencyId
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '401':
 *        description: Invalid password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '404':
 *        description: Agency not found
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

router.get(
    "/:agencyId",
    param("agencyId").isMongoId(),
    query("notifyAgency").optional().isIn(["yes", "no"]),
    secretaryAuth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                err: errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            } as ResErr);
        }

        const { agencyId } = req.params;
        const { notifyAgency } = req.query;

        const agency = await AgencyService.findOne({ _id: agencyId });
        if (!agency) {
            logger.debug(`Agency to delete "${agencyId}" not found`);
            return res.status(404).json({ err: "Agency not found" } as ResErr);
        }

        await AgencyService.delete(agency);

        logger.debug("deleteAgency notifyAgency=" + notifyAgency);
        if (notifyAgency !== "no") {
            // DEBUG to be implemented
            logger.warn("DEBUG notifyAgency for Agency deletion!");
        }

        return res.sendStatus(200);
    }
);

export default router;
