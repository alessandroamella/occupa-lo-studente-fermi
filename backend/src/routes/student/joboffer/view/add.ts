import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { isLoggedIn } from "@middlewares";
import { ResErr } from "@routes";
import { CaptchaService, JobOfferService } from "@services";
import { logger } from "@shared";

import schema from "../schema/addViewSchema";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      AddViewReq:
 *        type: object
 *        required:
 *          - jobOffer
 *          - responsibleLastName
 *        properties:
 *          jobOffer:
 *            type: string
 *            description: ObjectId of the jobOffer
 *          captcha:
 *            type: string
 *            description: Google ReCAPTCHA V3 token
 */

/**
 * @openapi
 * /api/student/joboffers/view:
 *  post:
 *    summary: Add view to job offer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AddViewReq'
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: View added (empty response)
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

router.post(
    "/",
    isLoggedIn.isStudentLoggedIn,
    checkSchema(schema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                err: errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            });
        }

        const { jobOffer, captcha } = req.body;

        // Verify ReCAPTCHA
        try {
            const { success, action, score } = await CaptchaService.verify(
                captcha,
                true
            );
            if (!success) throw new ReferenceError();
            else if (!score) throw new Error("ReCAPTCHA no score param");
            else if (action !== "addview")
                throw new Error("ReCAPTCHA invalid action");
            else if (score <= 0.5) throw new ReferenceError();
        } catch (err) {
            if (err instanceof ReferenceError) {
                logger.debug("CAPTCHA failed for jobOffer view add");
                return res
                    .status(401)
                    .json({ err: "Invalid ReCAPTCHA" } as ResErr);
            }
            logger.error("Error while verifying ReCAPTCHA");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while verifying ReCAPTCHA" } as ResErr);
        }

        try {
            const jobOffers = await JobOfferService.find({
                fields: { _id: jobOffer },
                populateAgency: false,
                lean: false
            });
            if (jobOffers.length > 0) {
                jobOffers[0].views += 1;
                await jobOffers[0].save();
            }
        } catch (err) {
            logger.error(
                "Error while adding view to jobOffer in jobOffer view add route"
            );
            logger.error(err);

            return res.status(500).json({
                err: "Error while adding view to job offer"
            } as ResErr);
        }

        return res.sendStatus(200);
    }
);

export default router;
