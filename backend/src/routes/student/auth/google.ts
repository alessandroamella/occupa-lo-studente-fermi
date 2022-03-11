import { Router } from "express";

import { Envs } from "@config";

import { ResErr } from "@routes";
import { GoogleAuthService, StudentAuthService } from "@services";
import { logger } from "@shared";

const router = Router();

/**
 * @openapi
 * /api/student/auth/google:
 *  get:
 *    summary: Gets Google URL for authentication
 *    tags:
 *      - student
 *      - auth
 *    responses:
 *      '200':
 *        description: Auth URL
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GoogleAuthUrl'
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

router.get("/", async (req, res) => {
    const auth = await GoogleAuthService.createConnection(); // this is from previous step
    const url = await GoogleAuthService.getConnectionUrl(auth);
    // Save last visited page on a 5-minute cookie to redirect the user to its original URL
    res.cookie(Envs.env.LAST_PAGE_URL_COOKIE_NAME, req.originalUrl, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
        signed: true
    });
    // res.redirect(url);
    res.json({ url });
});

/**
 * @openapi
 * /api/student/auth/google/complete:
 *  get:
 *    summary: Google authentication redirect URL
 *    tags:
 *      - student
 *      - auth
 *    responses:
 *      '302':
 *        description: Auth successful, redirect to main page or signup
 *      '400':
 *        description: Invalid auth code
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '500':
 *        description: Auth server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

router.get("/complete", async (req, res) => {
    const { code } = req.query;
    if (typeof code !== "string") {
        return res
            .status(400)
            .json({ err: "Invalid code query param" } as ResErr);
    }

    try {
        const params = await GoogleAuthService.getGoogleAccountFromCode(code);

        if (!params.id) throw new Error("Google account has no ID param");

        const s = await StudentAuthService.findStudent({ googleId: params.id });
        if (!s) {
            const tempDataCookie =
                await GoogleAuthService.createTempAuthDataCookie(params);
            // One week cookie with temp data
            res.cookie(Envs.env.TEMP_AUTH_DATA_COOKIE_NAME, tempDataCookie, {
                httpOnly: true,
                signed: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.redirect(Envs.env.SIGNUP_URL);
        }

        // DEBUG
        // eslint-disable-next-line no-console
        console.log(params);

        // Load last visited page cookie
        const lastPageCookie =
            req.signedCookies[Envs.env.LAST_PAGE_URL_COOKIE_NAME];
        if (lastPageCookie) {
            res.clearCookie(lastPageCookie, { httpOnly: true, signed: true });
        }

        res.redirect(lastPageCookie || "/");
    } catch (err) {
        logger.error("Error while loading Google account from code");
        logger.error(err);

        res.status(500).json({
            err: "Error while loading Google account"
        } as ResErr);
    }
});

export default router;
