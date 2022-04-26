import mongoose from "mongoose";

import { Envs } from "@config";

import { logger } from "@shared";

export const connectToDb = () => {
    logger.info("Connecting to MongoDB at " + Envs.env.MONGODB_URI);
    mongoose.connect(Envs.env.MONGODB_URI, err => {
        err ? logger.error(err) : logger.info("Connected to MongoDB");
    });
};
