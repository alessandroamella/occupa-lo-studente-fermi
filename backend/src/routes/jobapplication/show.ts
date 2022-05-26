import { Request, Response, Router } from "express";
import { param, validationResult } from "express-validator";

import { isAgencyApproved, isLoggedIn } from "@middlewares";
import { ResErr } from "@routes";
import { JobOfferService } from "@services";
import { logger } from "@shared";
import { isDocument, mongoose } from "@typegoose/typegoose";

/**
 * @openapi
 * /api/joboffer/{jobOfferId}:
 *  get:
 *    summary: Find a JobOffer by _id
 *    parameters:
 *      - in: path
 *        name: jobOfferId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the jobOffer to find
 *    tags:
 *      - joboffer
 *    responses:
 *      '200':
 *        description: Job offer
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JobOffer'
 *      '400':
 *        description: Data validation failed
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
 *        description: Job offer not found
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
    "/:_id",
    isLoggedIn.isAgencyLoggedIn,
    isAgencyApproved,
    param("_id").isMongoId(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ err: "Invalid ObjectId" } as ResErr);
        }

        const { _id } = req.params;

        try {
            const jobOffer = await JobOfferService.findOne({ _id }, false);
            logger.debug("Show jobOffer found jobOffer " + jobOffer?._id);

            if (!jobOffer) {
                return res
                    .status(404)
                    .json({ err: "Job offer not found" } as ResErr);
            }

            const agencyId = isDocument(jobOffer.agency)
                ? jobOffer.agency._id
                : jobOffer.agency;
            if (req.agency?._id?.toString() !== agencyId?.toString()) {
                logger.debug(
                    `Logged in agency ${req.agency?._id} and jobOffers's agency to delete ${agencyId} don't match`
                );
                return res.status(401).json({
                    err: "This job offer is not owned by your current agency"
                });
            }

            res.json(jobOffer?.toObject());
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                logger.debug("Agency create validation error");
                logger.debug(err.message);
                return res.status(400).json({ err: err.message } as ResErr);
            }
            logger.error("Error while creating agency");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while creating agency" } as ResErr);
        }
    }
);

export default router;
