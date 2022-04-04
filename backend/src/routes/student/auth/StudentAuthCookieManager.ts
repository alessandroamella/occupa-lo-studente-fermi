import { Request, Response } from "express";

import { Envs } from "@config";

import { StudentClass } from "@models";
import { StudentAuthService } from "@services";
import { logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

export class StudentAuthCookieManager {
    public static async loadStudentAuthCookie(req: Request, res: Response) {
        logger.debug("Loading student auth cookie");

        const cookie = req.signedCookies[Envs.env.AUTH_COOKIE_NAME];
        if (!cookie) return null;

        let student;
        try {
            student = await StudentAuthService.parseAuthCookie(cookie);
        } catch (err) {
            logger.debug("Error while parsing auth cookie, clearing it");
            res.clearCookie(Envs.env.AUTH_COOKIE_NAME, {
                httpOnly: true,
                signed: true
            });
        }
        if (!student) {
            logger.debug("Clearing invalid auth cookie");
            res.clearCookie(Envs.env.AUTH_COOKIE_NAME, {
                httpOnly: true,
                signed: true
            });
            return null;
        }

        logger.debug("Student auth cookie loaded");
        req.student = student;
        return student;
    }

    public static async saveStudentAuthCookie(
        res: Response,
        student: DocumentType<StudentClass>
    ) {
        const c = await StudentAuthService.createAuthCookie(student);
        if (!c) {
            logger.error("Null cookie in saveStudentAuthCookie");
            return;
        }

        logger.info("Saving auth cookie " + c);

        res.cookie(Envs.env.AUTH_COOKIE_NAME, c, {
            maxAge:
                1000 *
                60 *
                60 *
                24 *
                (parseInt(Envs.env.AUTH_COOKIE_DURATION_DAYS) || 14),
            signed: true,
            httpOnly: true
        });
        logger.debug("Student auth cookie saved");
    }
}
