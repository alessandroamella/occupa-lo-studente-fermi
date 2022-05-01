import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import moment from "moment";

import { secretaryAuth } from "@middlewares";
import { ResErr } from "@routes";
import { AgencyService } from "@services";
import { logger } from "@shared";

/**
 * @openapi
 * /api/secretary/approve/{agencyId}:
 *  get:
 *    summary: Approve or reject an agency
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
 *        description: ObjectId of the agency to approve
 *      - in: query
 *        name: action
 *        schema:
 *          type: string
 *          enum:
 *            - approve
 *            - reject
 *        required: true
 *        description: Whether to approve or reject this agency
 *    tags:
 *      - secretary
 *    responses:
 *      '200':
 *        description: Agency approved
 *      '400':
 *        description: Invalid agencyId or query params
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
 *      '403':
 *        description: Agency was already approved or rejected
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
    query("action").isIn(["approve", "reject"]),
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
        const { action } = req.query;

        const agency = await AgencyService.findOne({ _id: agencyId });
        if (!agency) {
            logger.debug(`Agency to approve "${agencyId}" not found`);
            return res.status(404).json({ err: "Agency not found" } as ResErr);
        }

        if (agency.approvalDate) {
            logger.debug(
                `Agency to approve ${agencyId} was already: ${agency.approvalStatus}`
            );
            return res.status(403).json({
                err: `Agency "${agency.agencyName}" with _id ${
                    agency._id
                } was already ${agency.approvalStatus} on ${moment(
                    agency.approvalDate
                ).format("DD/MM/YYYY")}`
            });
        }

        if (action === "approve") {
            await agency.approveAgency();
            logger.info(
                `Agency "${agency.agencyName}" with _id ${
                    agency._id
                } just got approved by secretary ${
                    req.secretary?.username || "--unknown username--"
                }`
            );
        } else if (action === "reject") {
            await agency.rejectAgency();
            logger.info(
                `Agency "${agency.agencyName}" with _id ${
                    agency._id
                } just got rejected by secretary ${
                    req.secretary?.username || "--unknown username--"
                }`
            );
        } else {
            logger.error("Invalid action in agency approve route");
            return res
                .status(500)
                .json({ err: "Error while validating action" });
        }

        return res.sendStatus(200);
    }
);

export default router;
