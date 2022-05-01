import { NextFunction, Request, Response } from "express";

import { Envs } from "@config";

import { AgencyService, StudentService } from "@services";
import { logger } from "@shared";

type _PossibleFields = "student" | "agency";

export class PopulateReq {
    public static async populateStudent(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        logger.debug("Loading student auth cookie");

        const cookie = req.signedCookies[Envs.env.STUDENT_AUTH_COOKIE_NAME];
        if (!cookie) return PopulateReq._nullReq("student", req, next);

        let student;
        try {
            student = await StudentService.parseAuthCookie(cookie);
        } catch (err) {
            logger.debug("Error while parsing auth cookie, clearing it");
            res.clearCookie(Envs.env.STUDENT_AUTH_COOKIE_NAME, {
                httpOnly: true,
                signed: true
            });
            return PopulateReq._nullReq("student", req, next);
        }
        if (!student) {
            logger.debug("Clearing invalid auth cookie");
            res.clearCookie(Envs.env.STUDENT_AUTH_COOKIE_NAME, {
                httpOnly: true,
                signed: true
            });
            return PopulateReq._nullReq("student", req, next);
        }

        logger.debug("Student auth cookie loaded");
        req.student = student;

        return next();
    }

    public static async populateAgency(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        logger.debug("Loading agency auth cookie");

        const cookie = req.signedCookies[Envs.env.AGENCY_AUTH_COOKIE_NAME];
        if (!cookie) return PopulateReq._nullReq("agency", req, next);

        let agency;
        try {
            agency = await AgencyService.parseAuthCookie(cookie);
        } catch (err) {
            logger.debug("Error while parsing auth cookie, clearing it");
            res.clearCookie(Envs.env.AGENCY_AUTH_COOKIE_NAME, {
                httpOnly: true,
                signed: true
            });
            return PopulateReq._nullReq("agency", req, next);
        }
        if (!agency) {
            logger.debug("Clearing invalid auth cookie");
            res.clearCookie(Envs.env.STUDENT_AUTH_COOKIE_NAME, {
                httpOnly: true,
                signed: true
            });
            return PopulateReq._nullReq("agency", req, next);
        }

        logger.debug("Agency auth cookie loaded");
        req.agency = agency;

        return next();
    }

    private static _nullReq(
        field: _PossibleFields,
        req: Request,
        next: NextFunction
    ) {
        logger.debug("populateReq failed");

        req[field] = null;
        return next();
    }
}
