import { Router } from "express";

import { isLoggedIn } from "@middlewares";
import { ResErr } from "@routes";
import { AgencyService } from "@services";

/**
 * @openapi
 * /api/agency:
 *  get:
 *    summary: Show currently signed in agency
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
 *        description: Not signed in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

const router = Router();

router.get("/", isLoggedIn.isAgencyLoggedIn, (req, res) => {
    res.json(req.agency?.toObject());
});

export default router;
