import { Router } from "express";
import { query, validationResult } from "express-validator";
import { LeanDocument, Types } from "mongoose";

import { isLoggedIn } from "@middlewares";
import { AgencyDoc } from "@models";
import { ResErr } from "@routes";
import { AgencyService, JobOfferService } from "@services";
import { logger } from "@shared";

/**
 * @openapi
 * /api/student/joboffers:
 *  get:
 *    summary: Find joboffers from approved agencies
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
    query("q", "Invalid search query")
        .optional()
        .isString()
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

            const fieldOfStudy: string | undefined =
                typeof req.query.field === "string" && req.query.field !== "any"
                    ? req.query.field
                    : undefined;
            const searchQuery: string | undefined =
                typeof req.query.q === "string" ? req.query.q : undefined;

            const jobOffers = await JobOfferService.searchQuery({
                fieldOfStudy,
                searchQuery,
                firstQuery: true
            });

            logger.debug(
                `First searchQuery returned ${jobOffers.length} documents`
            );

            if (searchQuery) {
                const agencies = (await AgencyService.find({
                    fields: {
                        approvalStatus: "approved",
                        $text: {
                            $search: searchQuery,
                            $language: "it",
                            $caseSensitive: false
                        }
                    },
                    lean: true,
                    projection: { score: { $meta: "textScore" } },
                    sortBy: { score: { $meta: "textScore" } }
                })) as LeanDocument<AgencyDoc[]>;
                logger.debug(
                    `JobOffers text search found ${agencies.length} matching agencies`
                );

                for (const a of agencies) {
                    // NO SEARCH QUERY (already performed on agency)
                    // find agency jobOffers and push them if not already pushed
                    const agencyJobOffers = await JobOfferService.searchQuery({
                        fieldOfStudy,
                        idsIn: a.jobOffers as Types.ObjectId[]
                    });
                    for (const j of agencyJobOffers) {
                        if (
                            !jobOffers.find(
                                e => e._id.toString() === j._id.toString()
                            )
                        ) {
                            // JobOffer not in array, push it

                            logger.debug(`Second searchQuery pushing ${j._id}`);
                            jobOffers.push(j);
                        }
                    }
                }
            }

            return res.json(jobOffers);
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
