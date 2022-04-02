import { checkSecretaryPassword } from "@middlewares";
import { AgencyService } from "@services";
import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import { ResErr } from "routes/ResErr";


/**
 * @openapi
 * /api/secretary/approve/{agencyId}:
 *  get:
 *    summary: Approves or rejects an agency
 *    parameters:
 *      - in: path
 *        name: agencyId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the agency to approve
 *      - in: action
 *        name: username
 *        schema:
 *          type: string
 *          enum:
 *            - approve
 *            - reject
 *        required: true
 *        description: Secretary username
 *      - in: query
 *        name: username
 *        schema:
 *          type: string
 *        required: true
 *        description: Secretary username
 *      - in: query
 *        name: password
 *        schema:
 *          type: string
 *        required: true
 *        description: Secretary password
 *    tags:
 *      - secretary
 *    responses:
 *      '200':
 *        description: Agency approved
 *      '401':
 *        description: Invalid password
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

router.get("/:agencyId", param("agencyId").isMongoId(), query("action").isIn([["approve", "reject"]]), checkSecretaryPassword, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            err: errors
                .array()
                .map(e => e.msg)
                .join(", ")
        } as ResErr);
    }

    const {agencyId} = req.params;
    const {action} = req.query;

    const agency = await AgencyService.findOne(agencyId);
    agency.approvalStatus = action === "approve" ? "approved" : "rejected";
    agency.approvalDate = new Date();
    await agency.save();

    return res.sendStatus(200);
})

export default router;