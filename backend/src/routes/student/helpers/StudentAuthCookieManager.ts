import { Response } from "express";

import { Envs } from "@config";

import { StudentDoc } from "@models";
import { StudentService } from "@services";
import { logger } from "@shared";

// DEBUG TO REFACTOR ALONG WITH AGENCY AUTH COOKIE MANAGER
export class StudentAuthCookieManager {
    public static async saveStudentAuthCookie(
        res: Response,
        student: StudentDoc
    ) {
        const c = await StudentService.createAuthCookie(student);
        if (!c) {
            logger.error("Null cookie in saveStudentAuthCookie");
            return;
        }

        logger.info("Saving auth cookie " + c);

        res.cookie(Envs.env.STUDENT_AUTH_COOKIE_NAME, c, {
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
