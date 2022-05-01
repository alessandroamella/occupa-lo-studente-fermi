import { Response } from "express";

import { Envs } from "@config";

import { AgencyClass } from "@models";
import { AgencyService } from "@services";
import { logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

// DEBUG TO REFACTOR ALONG WITH STUDENT AUTH COOKIE MANAGER
export class AgencyAuthCookieManager {
    public static async saveAgencyAuthCookie(
        res: Response,
        agency: DocumentType<AgencyClass>
    ) {
        const c = await AgencyService.createAuthCookie(agency);
        if (!c) {
            logger.error("Null cookie in saveAgencyAuthCookie");
            return;
        }

        logger.info("Saving auth cookie " + c);

        res.cookie(Envs.env.AGENCY_AUTH_COOKIE_NAME, c, {
            maxAge:
                1000 *
                60 *
                60 *
                24 *
                (parseInt(Envs.env.AUTH_COOKIE_DURATION_DAYS) || 14),
            signed: true,
            httpOnly: true
        });
        logger.debug("Agency auth cookie saved");
    }
}
