import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { JobOffer } from "@models";
import { ResErr } from "@routes";
import { JobOfferService } from "@services";
import { logger } from "@shared";
import { isDocument, mongoose } from "@typegoose/typegoose";

import schema from "./schema/validatorSchema";

/**
 * @openapi
 * /api/joboffer:
 *  post:
 *    summary: Create a new job offer
 *    tags:
 *      - joboffer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/JobOffer'
 *    responses:
 *      '200':
 *        description: Created job offer
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
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

const router = Router();

router.post("/", checkSchema(schema), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            err: errors
                .array()
                .map(e => e.msg)
                .join(", ")
        });
    }

    const {
        agency,
        title,
        description,
        fieldOfStudy,
        expiryDate,
        mustHaveDiploma,
        numberOfPositions
    } = req.body;

    const jobOfferDoc = new JobOffer({
        agency,
        title,
        description,
        fieldOfStudy,
        expiryDate,
        mustHaveDiploma,
        numberOfPositions
    });

    try {
        await JobOfferService.create(jobOfferDoc);
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            logger.debug("JobOffer create validation error");
            logger.debug(err.message);
            return res.status(400).json({ err: err.message } as ResErr);
        }
        logger.error("Error while creating job offer");
        logger.error(err);
        return res
            .status(500)
            .json({ err: "Error while creating job offer" } as ResErr);
    }

    logger.info(
        `Created new jobOffer "${jobOfferDoc.title}" for agency ${
            isDocument(jobOfferDoc.agency)
                ? jobOfferDoc.agency._id
                : jobOfferDoc.agency
        }`
    );

    // DEBUG send confirmation email

    return res.json(jobOfferDoc.toObject());
});

export default router;
