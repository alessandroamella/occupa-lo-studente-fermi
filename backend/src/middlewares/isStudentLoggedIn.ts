import { NextFunction, Request, Response } from "express";

import { Envs } from "@config";

import { ResErr } from "@routes";
import { GoogleAuthService } from "@services";
import { logger } from "@shared";

export class isStudentLoggedIn {
    public static async isStudentLoggedIn(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const c = req.signedCookies[Envs.env.TEMP_AUTH_DATA_COOKIE_NAME];
            if (req.student) next();
            else if (
                c &&
                (await GoogleAuthService.parseTempAuthDataCookie(c))
            ) {
                res.redirect(Envs.env.SIGNUP_URL);
            }
        } catch (err) {
            logger.debug("Error while parsing temp auth data cookie");
            logger.debug(err);
        }

        res.status(401).json({
            err: "You need to be logged in to view this page"
        } as ResErr);
    }
}
