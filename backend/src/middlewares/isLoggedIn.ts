import { NextFunction, Request, Response } from "express";

import { Envs } from "@config";

import { ResErr } from "@routes";
import { GoogleAuthService } from "@services";
import { logger } from "@shared";

export class isLoggedIn {
    public static async isStudentLoggedIn(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (req.student) return next();
        try {
            const tempData = await GoogleAuthService.parseTempAuthDataCookie(
                req.signedCookies[Envs.env.TEMP_AUTH_DATA_COOKIE_NAME]
            );
            if (tempData) {
                return GoogleAuthService.getRedirectUrlFromTempData(tempData);
            }
        } catch (err) {
            logger.debug("Error while parsing temp auth data cookie");
            logger.debug(err);
        }

        logger.debug("isStudentLoggedIn not logged in");
        res.status(401).json({
            err: "You need to be logged in (as a student) to view this page"
        } as ResErr);
    }

    public static async isAgencyLoggedIn(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (req.agency) return next();

        logger.debug("isAgencyLoggedIn not logged in");
        res.status(401).json({
            err: "You need to be logged in (as an agency) to view this page"
        } as ResErr);
    }
}
