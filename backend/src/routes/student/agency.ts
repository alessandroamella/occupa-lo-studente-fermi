import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import moment from "moment";
import { FilterQuery } from "mongoose";

import { isLoggedIn } from "@middlewares";
import { JobOfferDoc } from "@models";
import { ResErr } from "@routes";
import { AgencyService, JobOfferService } from "@services";
import { logger } from "@shared";
import { isDocumentArray } from "@typegoose/typegoose";

/**
 * @openapi
 * /api/student/agency:
 *  get:
 *    summary: Find a single approved agency (without populated jobOffers)
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
 *      - in: query
 *        name: q
 *        schema:
 *          type: string
 *        required: false
 *        description: Search query to find a job offer by title
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: Found agency
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JobOffer'
 *      '400':
 *        description: Invalid ObjectId param
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '401':
 *        description: Not logged in
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
    "/:id",
    isLoggedIn.isStudentLoggedIn,
    param("id").isMongoId(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ err: "Invalid ObjectId" } as ResErr);
            }

            const agencies = await AgencyService.find({
                fields: { _id: req.params.id, approvalStatus: "approved" },
                lean: true,
                populateJobOffers: false,
                showHashedPassword: false,
                showPersonalData: false
            });

            return agencies.length > 0
                ? res.json(agencies[0])
                : res.status(404).json({ err: "Agency not found" } as ResErr);
        } catch (err) {
            logger.error("Error while finding agency for student");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while finding agency" } as ResErr);
        }
    }
);

export default router;
