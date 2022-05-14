import { Router } from "express";
import { query, validationResult } from "express-validator";
import moment from "moment";
import { LeanDocument } from "mongoose";

import { isLoggedIn } from "@middlewares";
import { AgencyClass } from "@models";
import { ResErr } from "@routes";
import { AgencyService } from "@services";
import { logger } from "@shared";
import { isDocumentArray } from "@typegoose/typegoose";

/**
 * @openapi
 * /api/student/agencies:
 *  get:
 *    summary: Find approved agencies along with available job offers
 *    parameters:
 *      - in: query
 *        name: field
 *        schema:
 *          type: string
 *          enum:
 *              - any
 *              - it
 *              - electronics
 *              - chemistry
 *        required: false
 *        description: Field of study, defaults to 'any' if not specified
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: Job offers
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              description: Array of JobOffer objects
 *              items:
 *                  $ref: '#/components/schemas/JobOffer'
 *      '401':
 *        description: Not logged in
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
    "/",
    isLoggedIn.isStudentLoggedIn,
    query("field", "Invalid field query")
        .optional()
        .isIn(["any", "it", "electronics", "chemistry"])
        .trim()
        .toLowerCase(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ err: errors.array().join(", ") } as ResErr);
            }

            const fieldOfStudy = req.query.field || "any";

            const foundAgencies = await AgencyService.find(
                { approvalStatus: "approved" },
                true
            );
            let isErr = false; // in case a job offer isn't populated

            const agencies: LeanDocument<AgencyClass>[] = [];

            logger.debug(
                `Filtering agencies by field of study ${fieldOfStudy}`
            );

            for (const agency of foundAgencies) {
                if (!isDocumentArray(agency.jobOffers)) {
                    logger.error(
                        `Agency ${agency._id} jobOffers ${agency.jobOffers} is not populated in student jobOffers route`
                    );
                    isErr = true;
                    return null;
                }

                const obj = {
                    ...agency.toObject(),
                    jobOffers: agency.jobOffers
                        .filter(
                            j =>
                                (fieldOfStudy === "any"
                                    ? true
                                    : j.fieldOfStudy === fieldOfStudy) &&
                                moment(j.expiryDate).isAfter(moment())
                        )
                        .map(j => j.toObject())
                };
                agencies.push(obj);
            }

            if (isErr) {
                return res
                    .status(500)
                    .json({ err: "Error while finding job offers" } as ResErr);
            }

            return res.json(agencies);
        } catch (err) {
            logger.error("Error while finding job offers");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while finding job offers" } as ResErr);
        }
    }
);

export default router;
