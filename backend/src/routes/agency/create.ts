import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { ResErr } from "routes/ResErr";
import AgencyService from "services/agency/agency";

import validatorSchema from "./validatorSchema";

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
            return res
                .status(400)
                .json({ err: "Invalid agency ObjectId" } as ResErr);
        }

        res.json(await AgencyService.create(req.body));
    }
);

export default router;
