import { Router } from "express";
import { ResErr } from "routes/ResErr";

import { isLoggedIn } from "@middlewares";
import { logger } from "@shared";
import { isDocumentArray } from "@typegoose/typegoose";

/**
 * @openapi
 * /api/agency:
 *  get:
 *    summary: Show currently signed in agency
 *    security:
 *      - studentAuth: []
 *    tags:
 *      - agency
 *    responses:
 *      '200':
 *        description: Agency
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agency'
 *      '401':
 *        description: Not logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

const router = Router();

router.get("/", isLoggedIn.isAgencyLoggedIn, async (req, res) => {
    try {
        // Populate job offers
        await req.agency?.populate("jobOffers");
        if (!isDocumentArray(req.agency?.jobOffers)) {
            throw new Error(
                "jobOffers not populated: " + req.agency?.jobOffers?.toString()
            );
        }
        req.agency?.jobOffers.sort(
            (a, b) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (b as any)?.updatedAt?.getTime() -
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (a as any)?.updatedAt?.getTime()
        );
        res.json(req.agency?.toObject());
    } catch (err) {
        logger.error("Error while sending logged in agency");
        logger.error(err);
        res.status(500).json({ err: "Error while fetching agency" } as ResErr);
    }
});

export default router;
