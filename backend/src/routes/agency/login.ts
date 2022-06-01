import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { ResErr } from "@routes";
import { AgencyService } from "@services";
import { logger } from "@shared";

import { AgencyAuthCookieManager } from "./helpers";
import schema from "./schema/loginSchema";

/**
 * @openapi
 * /api/agency/login:
 *  post:
 *    summary: Login as agency
 *    tags:
 *      - agency
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AgencyLoginParams'
 *    responses:
 *      '200':
 *        description: Agency which just successfully logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agency'
 *      '401':
 *        description: Invalid credentials
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

router.post("/", checkSchema(schema), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            err: errors
                .array()
                .map(e => e.msg)
                .join(", ")
        } as ResErr);
    }

    const { email, password } = req.body;

    let agency;
    try {
        const agencies = await AgencyService.find({
            fields: { email },
            populateJobOffers: true,
            populateJobApplications: true,
            showHashedPassword: true
        });
        if (agencies.length > 0) agency = agencies[0];
    } catch (err) {
        logger.error("Error while finding agency");
        logger.error(err);
        return res
            .status(500)
            .json({ err: "Error while finding agency" } as ResErr);
    }

    const validPw = !!(await agency?.isValidPassword(password));

    if (!agency || !validPw) {
        logger.debug("Agency login invalid credentials");
        return res.status(401).json({ err: "Invalid credentials" } as ResErr);
    }

    try {
        await AgencyAuthCookieManager.saveAgencyAuthCookie(res, agency);
    } catch (err) {
        logger.error("Error while saving agency auth cookie in agency create");
        logger.error(err);
    }

    try {
        await agency.populate("jobOffers");
    } catch (err) {
        logger.error("Error while populating agency jobOffers");
        logger.error(err);
        return res
            .status(500)
            .json({ err: "Error while loading job offers" } as ResErr);
    }

    const _pojo = agency.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...pojo } = _pojo;
    res.json(pojo);
});

export default router;
