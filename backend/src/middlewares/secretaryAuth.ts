import { NextFunction, Request, Response } from "express";

import { ResErr } from "@routes";
import { SecretaryService } from "@services";
import { logger } from "@shared";
import { mongoose } from "@typegoose/typegoose";

export async function secretaryAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { username, password } = req.query;
        if (typeof username !== "string") {
            throw new Error("No username provided");
        } else if (typeof password !== "string") {
            throw new Error("No password provided");
        }

        const foundSecretary = await SecretaryService.findOne({ username });
        if (!foundSecretary) {
            throw new Error("Secretary account not found");
        } else if (!(await foundSecretary.isValidPassword(password))) {
            throw new Error("Invalid password");
        }

        req.secretary = foundSecretary;

        next();
    } catch (err) {
        if (err instanceof mongoose.Error) {
            logger.error("Secretary middleware error");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while finding secretary account" });
        }

        logger.debug("Secretary middleware error");
        logger.debug(err);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return res.status(401).json({ err: (err as any).message } as ResErr);
    }
}
