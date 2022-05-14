import { Router } from "express";

import { Envs } from "@config";

import { isLoggedIn } from "@middlewares";
import { ResErr } from "@routes";
import { AgencyService, JobOfferService } from "@services";
import { logger } from "@shared";
import { isDocument } from "@typegoose/typegoose";

/**
 * @openapi
 * /api/agency:
 *  delete:
 *    summary: Delete the currently logged in agency
 *    security:
 *      - studentAuth: []
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
 *      '401':
 *        description: Not logged in
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

router.delete("/", isLoggedIn.isAgencyLoggedIn, async (req, res) => {
    if (!req.agency) {
        logger.error("req.agency null in agency delete route");
        return res
            .status(500)
            .json({ err: "Error while finding agency" } as ResErr);
    }

    try {
        for (const j of req.agency.jobOffers) {
            let jobOffer;
            if (!isDocument(j)) {
                jobOffer = await JobOfferService.findOne({ _id: j });
            }
            if (!jobOffer) {
                throw new Error("JobOffer not found in delete agency service");
            }
            await JobOfferService.delete(jobOffer);
        }
        await AgencyService.delete(req.agency);
        res.clearCookie(Envs.env.STUDENT_AUTH_COOKIE_NAME);
        res.sendStatus(200);
    } catch (err) {
        logger.error("Error while deleting agency");
        logger.error(err);
        res.status(500).json({ err: "Error while deleting agency" } as ResErr);
    }
});

export default router;
