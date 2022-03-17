import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

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

        let existingAgency;
        try {
            existingAgency = await AgencyService.find({
                vatCode: req.body.vatCode as string
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
                err: "Agency with the same VAT code already exists"
            } as ResErr);
        }

        res.json(await AgencyService.create(req.body));
    }
);

export default router;
