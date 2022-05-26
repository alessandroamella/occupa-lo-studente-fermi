import { Request, Response, Router } from "express";
import { param, validationResult } from "express-validator";

import { isAgencyApproved, isLoggedIn } from "@middlewares";
import { ResErr } from "@routes";
import { JobApplicationService } from "@services";
import { logger } from "@shared";

/**
 * @openapi
 * /api/agency/jobapplication/{jobApplicationId}:
 *  delete:
 *    summary: Delete a job application
 *    parameters:
 *      - in: path
 *        name: jobApplicationId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the jobApplication to delete
 *    tags:
 *      - agency
 *    responses:
 *      '200':
 *        description: Job application got deleted (empty body)
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

router.delete(
    "/:_id",
    isLoggedIn.isAgencyLoggedIn,
    isAgencyApproved,
    param("_id").isMongoId(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ err: "Invalid ObjectId" } as ResErr);
        }

        const { _id } = req.params;

        let jobApplication;

        try {
            jobApplication = await JobApplicationService.findOne({ _id });
            if (!jobApplication)
                throw new Error(
                    `jobApplication ${_id} validated but not found`
                );
        } catch (err) {
            logger.error("Error while finding jobApplication in delete route");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while finding job application" } as ResErr);
        }

        if (
            req.agency?._id?.toString() !== jobApplication.forAgency?.toString()
        ) {
            logger.debug(
                `Logged in agency ${req.agency?._id} and jobApplication's agency to delete ${jobApplication.forAgency} don't match`
            );
            return res.status(401).json({
                err: "This job application is not owned by your current agency"
            });
        }

        try {
            await JobApplicationService.delete(jobApplication);
        } catch (err) {
            logger.error(
                "Error while deleting jobApplication " + jobApplication._id
            );
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while deleting jobApplication" } as ResErr);
        }

        res.sendStatus(200);
    }
);

export default router;
