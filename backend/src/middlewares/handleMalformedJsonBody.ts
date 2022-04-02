import { NextFunction, Request, Response } from "express";

import { ResErr } from "@routes";
import { logger } from "@shared";

export function handleMalformedJsonBody(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:

    if (
        err instanceof SyntaxError &&
        (err as any).status === 400 &&
        "body" in err
    ) {
        logger.debug("Bad JSON body:");
        logger.debug(err);
        return res.status(400).json({ err: "Malformed JSON body" } as ResErr); // Bad request
    }

    next();
}
