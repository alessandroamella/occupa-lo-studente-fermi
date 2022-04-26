import { Router } from "express";
import { ResErr } from "routes/ResErr";

import { AgencyService } from "@services";

/**
 * @openapi
 * /api/agency/{agencyId}:
 *  delete:
 *    summary: Deletes an agency
 *    parameters:
 *      - in: path
 *        name: agencyId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the agency to delete
 *    tags:
 *      - agency
 *    responses:
 *      '200':
 *        description: Agency got deleted (empty body)
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

router.delete("/:id", async (req, res) => {
    const agency = await AgencyService.findOne({ _id: req.params.id });
    if (!agency) {
        return res.status(404).json({ err: "Agency not found" } as ResErr);
    }
    // DEBUG check authentication

    await AgencyService.delete(agency);
    res.sendStatus(200);
});

export default router;
