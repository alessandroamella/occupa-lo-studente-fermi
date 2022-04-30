import { NextFunction, Request, Response } from "express";

import { ResErr } from "@routes";
import { logger } from "@shared";

export function handleExpressErrors(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) {
    logger.error("Express error handler:");
    logger.error(err);
    return res.status(500).send({ err: "Something broke" } as ResErr);
}
