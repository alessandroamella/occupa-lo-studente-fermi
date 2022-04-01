import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { Agency } from "@models";
import { ResErr } from "@routes";
import { AgencyService } from "@services";
import { logger } from "@shared";

import { validatorSchema } from "./validatorSchema";

/**
 * @openapi
 * /api/agency:
 *  post:
 *    summary: Create a new agency
 *    tags:
 *      - agency
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Agency'
 *    responses:
 *      '200':
 *        description: Agency
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agency'
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

router.post(
    "/",
    checkSchema(validatorSchema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                err: errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            } as ResErr);
        }

        const {
            responsibleFirstName,
            responsibleLastName,
            responsibleFiscalNumber,
            email,
            websiteUrl,
            phoneNumber,
            agencyName,
            agencyDescription,
            agencyAddress,
            vatCode
            // approvalStatus,
            // jobOffers
        } = req.body;

        let existingAgency;
        try {
            existingAgency = await AgencyService.findOne({
                $or: [{ agencyName }, { email }, { vatCode }]
            });
        } catch (err) {
            logger.error("Error while finding existing agency");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while creating agency" } as ResErr);
        }

        if (existingAgency) {
            return res.status(400).json({
                err: "Agency with the same data (name, email or VAT code) already exists"
            } as ResErr);
        }

        const agencyDoc = new Agency({
            responsibleFirstName,
            responsibleLastName,
            responsibleFiscalNumber,
            email,
            websiteUrl,
            phoneNumber,
            agencyName,
            agencyDescription,
            agencyAddress,
            vatCode,
            approvalStatus: "waiting",
            jobOffers: []
        });
        res.json(await AgencyService.create(agencyDoc));

        // DEBUG
        logger.warn("DEBUG new agency: send email");
    }
);

export default router;
