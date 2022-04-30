import { NextFunction, Request, Response } from "express";

import { ResErr } from "@routes";

export class isAgencyLoggedIn {
    public static async isAgencyLoggedIn(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (req.agency) return next();

        res.status(401).json({
            err: "You need to be logged in to view this page"
        } as ResErr);
    }
}
