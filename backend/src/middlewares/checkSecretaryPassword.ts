import { ResErr } from "@routes";
import { logger } from "@shared";
import { mongoose } from "@typegoose/typegoose";
import { NextFunction, Request, Response } from "express";
import { SecretaryService } from "@services";

export async function checkSecretaryPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password } = req.query;
        if (!username) throw new Error("No username provided");
        if (!password) throw new Error("No password provided");

        const s = await SecretaryService.findOne({ username });
        if (!s) throw new Error("Secretary account not found")

        if (!(await s.isValidPassword(password))) {
            throw new Error("Invalid password");
        }

        req.secretary = s;

        next();
    } catch (err) {
        if (err instanceof mongoose.Error) {
            logger.error("Secretary middleware error");
            logger.error(err);
            return res.status(500).json({err:  "Error while finding secretary account"});
        }

        logger.debug("Secretary middleware error");
        logger.debug(err);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return res.status(401).json({err: (err as any).message} as ResErr);
    }
}