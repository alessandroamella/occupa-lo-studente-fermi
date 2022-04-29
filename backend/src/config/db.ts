import mongoose from "mongoose";

import { Envs } from "@config";

import { logger } from "@shared";

export const connectToDb = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        logger.info("Connecting to MongoDB at " + Envs.env.MONGODB_URI);
        mongoose.connect(Envs.env.MONGODB_URI, err => {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                logger.info("Connected to MongoDB");
                resolve();
            }
        });
    });
};
