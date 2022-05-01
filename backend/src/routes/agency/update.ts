import { Request, Response, Router } from "express";
import { checkSchema, param, validationResult } from "express-validator";

import { ResErr } from "@routes";
import { AgencyService } from "@services";
import { logger } from "@shared";
import { mongoose } from "@typegoose/typegoose";

import schema from "./schema/updateSchema";

/**
 * @openapi
 * /api/agency/{agencyId}:
 *  put:
 *    summary: Update an existing agency
 *    parameters:
 *      - in: path
 *        name: agencyId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the agency to update
 *    tags:
 *      - agency
 *    responses:
 *      '200':
 *        description: Agency
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AgencyReq'
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

// DEBUG change for AgencyReq not Agency

router.put(
    "/:id",
    param("id").isMongoId(),
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

        let agency;
        try {
            agency = await AgencyService.findOne({ _id });
        } catch (err) {
            logger.error("Error while finding agency in update route");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while finding agency" } as ResErr);
        }

        if (!agency) {
            return res.status(400).json({
                err: "Agency with given ObjectId doesn't exist"
            } as ResErr);
        }

        const {
            responsibleFirstName,
            responsibleLastName,
            responsibleFiscalNumber,
            websiteUrl,
            email,
            password,
            phoneNumber,
            agencyName,
            agencyDescription,
            agencyAddress,
            vatCode,
            logoUrl
        } = req.body;

        for (const prop in {
            responsibleFirstName,
            responsibleLastName,
            responsibleFiscalNumber,
            websiteUrl,
            email,
            password,
            phoneNumber,
            agencyName,
            agencyDescription,
            agencyAddress,
            vatCode,
            logoUrl
        }) {
            if (req.body[prop]) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (agency as any)[prop] = req.body[prop];
            }
        }

        try {
            await AgencyService.update(agency);
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                logger.debug("Agency update validation error");
                logger.debug(err.message);
                return res.status(400).json({ err: err.message } as ResErr);
            }
            logger.error("Error while updating agency " + agency._id);
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while updating agency" } as ResErr);
        }

        return res.json(agency.toObject());
    }
);

export default router;
