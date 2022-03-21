import { Router } from "express";
import { query, validationResult } from "express-validator";
import { ResErr } from "routes/ResErr";
import { JobOfferService } from "services/jobOffer";

import { isStudentLoggedIn } from "@middlewares";

/**
 * @openapi
 * /api/student/joboffers:
 *  get:
 *    summary: Find available job offers
 *    parameters:
 *      - in: path
 *        name: fieldOfStudy
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
 *      '400':
 *        description: Invalid query params
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
    isStudentLoggedIn.isStudentLoggedIn,
    query("fieldOfStudy", "Invalid fieldOfStudy query")
        .optional()
        .isIn(["any", "it", "electronics", "chemistry"]),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ err: errors.array().join(", ") } as ResErr);
        }

        const { fieldOfStudy } = req.query;

        // Find job offers that haven't expired yet

        const jobOffers = await JobOfferService.find({
            fieldOfStudy,
            expiryDate: { $lt: new Date() }
        });

        return res.json(jobOffers);
    }
);

export default router;
