import { Request, Response, Router } from "express";
import { checkSchema, param, validationResult } from "express-validator";

import { Agency } from "@models";
import { ResErr } from "@routes";
import { AgencyService } from "@services";

import { validatorSchema } from "./validatorSchema";

/**
 * @openapi
 * /api/agency:
 *  put:
 *    summary: Update an existing agency
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
    checkSchema(validatorSchema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ err: "Invalid agency ObjectId" } as ResErr);
        } else if (!(await Agency.exists({ _id: req.params._id }))) {
            return res.status(400).json({
                err: "Specified agency ObjectId doesn't exist"
            } as ResErr);
        }

        res.json(
            await AgencyService.update(req.params?.id as string, req.body)
        );
    }
);

export default router;
