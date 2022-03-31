import { Router } from "express";

import { Envs } from "@config";

import { ResErr } from "@routes";
import { GoogleAuthService, StudentService } from "@services";
import { logger } from "@shared";

import { StudentAuthCookieManager } from "./StudentAuthCookieManager";

const router = Router();

/**
 * @openapi
 * /api/student/auth/google:
 *  get:
 *    summary: Gets Google URL for authentication
 *    tags:
 *      - student
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
    const auth = await GoogleAuthService.createConnection();
    const url = await GoogleAuthService.getConnectionUrl(auth);

    logger.debug("Creating Google auth URL");

    // Save last visited page on a 5-minute cookie to redirect the user to its original URL
    res.cookie(
        Envs.env.LAST_PAGE_URL_COOKIE_NAME,
        req.query.redirectTo || req.originalUrl,
        {
            httpOnly: true,
            maxAge: 5 * 60 * 1000,
            signed: true
        }
    );
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
    logger.debug("Received Google completed authentication");

    const { code } = req.query;
    if (typeof code !== "string") {
        logger.debug('Invalid Google auth "code" query param');
        return res
            .status(400)
            .json({ err: "Invalid code query param" } as ResErr);
    }

    let params;

    try {
        params = await GoogleAuthService.getGoogleAccountFromCode(code);
        logger.debug("Loaded Google account data from Google authentication");
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (
            typeof err === "object" &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any)?.response?.data?.error === "invalid_grant"
        ) {
            logger.debug("Invalid Google /complete code");
            return res.status(400).json({ err: "Invalid auth code" });
        }
        logger.error("Google auth /complete error");
        logger.error(err);

        return res.status(500).json({
            err: "Error while loading Google account information"
        } as ResErr);
    }

    try {
        if (!params.id) throw new Error("Google account has no ID param");

        const student = await StudentService.findOne({
            googleId: params.id
        });

        if (!student) {
            logger.debug(
                "Student with given googleId doesn't exist, creating one"
            );
            const tempDataCookie =
                await GoogleAuthService.createTempAuthDataCookie(params);
            // One week cookie with temp data
            res.cookie(Envs.env.TEMP_AUTH_DATA_COOKIE_NAME, tempDataCookie, {
                httpOnly: true,
                signed: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            logger.debug("Redirecting student to signup URL");
            return res.redirect(
                GoogleAuthService.getRedirectUrlFromTempData(params)
            );
        }

        // Load last visited page cookie
        const lastPageCookie =
            req.signedCookies[Envs.env.LAST_PAGE_URL_COOKIE_NAME];
        if (lastPageCookie) {
            res.clearCookie(lastPageCookie, { httpOnly: true, signed: true });
        }

        if (!req.signedCookies[Envs.env.AUTH_COOKIE_NAME]) {
            logger.debug("Student auth cookie was not saved, now saving it");
            await StudentAuthCookieManager.saveStudentAuthCookie(res, student);
        }

        // logger.debug(
        //     `Redirecting student to last visited page (${
        //         lastPageCookie || "/"
        //     })`
        // );

        // res.redirect(lastPageCookie || "/student");

        try {
            const url = new URL(lastPageCookie);
            res.redirect(`${url.protocol}//${url.host}/student`);
        } catch (err) {
            res.redirect(Envs.env.CLIENT_LOGIN_REDIRECT_URL);
        }
    } catch (err) {
        logger.error("Error while loading Google account from code");
        logger.error(err);

        res.status(500).json({
            err: "Error while loading Google account"
        } as ResErr);
    }
});

export default router;
