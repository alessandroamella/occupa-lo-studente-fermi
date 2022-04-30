import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { Envs } from "@config";

import { AgencyClass } from "@models";
import { AgencyService } from "@services";
import { logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

export class AgencyAuthCookieManager {
    private static async parseAuthCookie(
        jwtCookie: string
    ): Promise<DocumentType<AgencyClass>> {
        return new Promise((resolve, reject) => {
            jwt.verify(
                jwtCookie,
                Envs.env.JWT_SECRET,
                {},
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (err, jwtPayload: any) => {
                    if (err) {
                        logger.debug(
                            "parseAuthCookie failed: error while parsing auth cookie"
                        );
                        logger.debug(err);
                        return reject(err);
                    }

                    if (!jwtPayload.agency) {
                        return reject(
                            "parseAuthCookie jwtPayload has no agency"
                        );
                    }

                    AgencyService.findOne({
                        _id: jwtPayload.agency
                    })
                        .then(obj =>
                            obj
                                ? resolve(obj)
                                : reject("parseAuthCookie can't find agency")
                        )
                        .catch(err => {
                            logger.warn("parseAuthCookie failed");
                            logger.warn(err);
                            return reject(err);
                        });
                }
            );
        });
    }

    private static async createAuthCookie(
        agency: DocumentType<AgencyClass>
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            logger.debug(`Creating JWT auth cookie for agency "${agency._id}"`);
            jwt.sign(
                { agency: agency._id },
                Envs.env.JWT_SECRET,
                {},
                (err, cookie) => {
                    if (err) {
                        logger.warn(
                            "createAuthCookie failed: error while creating auth cookie"
                        );
                        logger.warn(err);
                        return reject(err);
                    } else if (!cookie) {
                        logger.debug("createAuthCookie cookie is undefined");
                        return reject("createAuthCookie cookie is undefined");
                    }

                    return resolve(cookie);
                }
            );
        });
    }

    public static async loadAgencyAuthCookie(req: Request, res: Response) {
        logger.debug("Loading agency auth cookie");

        const cookie = req.signedCookies[Envs.env.AGENCY_AUTH_COOKIE_NAME];
        if (!cookie) return null;

        let agency;
        try {
            agency = await AgencyAuthCookieManager.parseAuthCookie(cookie);
        } catch (err) {
            logger.debug("Error while parsing auth cookie, clearing it");
            res.clearCookie(Envs.env.AGENCY_AUTH_COOKIE_NAME, {
                httpOnly: true,
                signed: true
            });
        }
        if (!agency) {
            logger.debug("Clearing invalid auth cookie");
            res.clearCookie(Envs.env.AGENCY_AUTH_COOKIE_NAME, {
                httpOnly: true,
                signed: true
            });
            return null;
        }

        logger.debug("Agency auth cookie loaded");
        req.agency = agency;
        return agency;
    }

    public static async saveAgencyAuthCookie(
        res: Response,
        agency: DocumentType<AgencyClass>
    ) {
        const c = await AgencyAuthCookieManager.createAuthCookie(agency);
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
