import { NextFunction, Request, Response } from "express";

import { Envs } from "@config";

import { ResErr } from "@routes";
import { logger } from "@shared";

export class isAgencyLoggedIn {
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
