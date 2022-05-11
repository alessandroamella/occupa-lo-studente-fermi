import { NextFunction, Request, Response } from "express";

import { ResErr } from "@routes";
import { logger } from "@shared";

export function isAgencyApproved(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.agency) {
        logger.debug("isAgencyApproved not logged in");
        return res.status(401).json({
            err: "You need to be logged in (as an agency) to perform this operation"
        } as ResErr);
    }

    if (req.agency.approvalStatus !== "approved") {
        logger.debug("isAgencyApproved not approved");
        return res.status(401).json({
            err: "Your agency needs to be approved to perform this operation"
        } as ResErr);
    }

    next();
}
