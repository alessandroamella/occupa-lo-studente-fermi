import { Router } from "express";

import { AgencyService } from "@services";

/**
 * @openapi
 * /api/agency:
 *  get:
 *    summary: Get many agencies
 *    tags:
 *      - agency
 *    responses:
 *      '200':
 *        description: Agency
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              description: Array of JobOffer objects
 *              items:
 *                $ref: '#/components/schemas/Agency'
 *      '400':
 *        description: Bad request
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

router.get("/", async (req, res) => {
    // DEBUG check authentication

    const agency = await AgencyService.find({});
    res.json(agency);
});

export default router;
