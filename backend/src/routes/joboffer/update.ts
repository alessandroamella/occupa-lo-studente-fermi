import { Request, Response, Router } from "express";
import { checkSchema, param, validationResult } from "express-validator";

import { ResErr } from "@routes";
import { JobOfferService } from "@services";
import { logger } from "@shared";
import { isDocument, mongoose } from "@typegoose/typegoose";

import schema from "./schema/updateSchema";

/**
 * @openapi
 * /api/joboffer/{jobOfferId}:
 *  put:
 *    summary: Update a job offer (all request body fields are optional)
 *    parameters:
 *      - in: path
 *        name: agencyId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the jobOffer to update
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
 *        description: Updated job offer
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
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

const router = Router();

router.put(
    "/:_id",
    param("_id").isMongoId(),
    checkSchema(schema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                err: errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            });
        }

        const { _id } = req.params;

        let jobOffer;

        try {
            jobOffer = await JobOfferService.findOne({ _id }, false);
            if (!jobOffer) throw new Error("jobOffer validated but not found");
        } catch (err) {
            logger.error("Error while finding jobOffer in update route");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while finding job offer" } as ResErr);
        }

        const {
            title,
            description,
            fieldOfStudy,
            expiryDate,
            mustHaveDiploma,
            numberOfPositions
        } = req.body;

        for (const prop in {
            title,
            description,
            fieldOfStudy,
            expiryDate,
            mustHaveDiploma,
            numberOfPositions
        }) {
            if (req.body[prop]) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (jobOffer as any)[prop] = req.body[prop];
                logger.debug(
                    `Prop "${prop} was updated to "${req.body[prop]}" in JobOffer ${jobOffer._id}"`
                );
            }
        }

        logger.debug("Updating jobOffer " + jobOffer._id);

        try {
            await JobOfferService.update(jobOffer);
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                logger.debug("JobOffer update validation error");
                logger.debug(err.message);
                return res.status(400).json({ err: err.message } as ResErr);
            }
            logger.error("Error while updateing job offer");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while updating job offer" } as ResErr);
        }

        logger.info(
            `Updated jobOffer "${jobOffer.title}" for agency ${
                isDocument(jobOffer.agency)
                    ? jobOffer.agency._id
                    : jobOffer.agency
            }`
        );
        return res.json(jobOffer.toObject());
    }
);

export default router;
