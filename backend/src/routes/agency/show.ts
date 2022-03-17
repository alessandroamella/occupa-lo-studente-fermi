import { Router } from "express";
import { param, validationResult } from "express-validator";

import { ResErr } from "@routes";
import { AgencyService } from "@services";

/**
 * @openapi
 * /api/agency/{agencyId}:
 *  get:
 *    summary: Get a single agency by ID
 *    parameters:
 *      - in: path
 *        name: agencyId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the agency to get
 *    tags:
 *      - agency
 *    responses:
 *      '200':
 *        description: Agency
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agency'
 *      '400':
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '404':
 *        description: Agency not found
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

router.get("/:id", param("id").isMongoId(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ err: "Invalid agency ObjectId" } as ResErr);
    }

    const agency = await AgencyService.find({ _id: req.params?.id as string });
    if (!agency) {
        return res.status(404).json({ err: "Agency not found" } as ResErr);
    }

    res.json(agency);
});

export default router;
