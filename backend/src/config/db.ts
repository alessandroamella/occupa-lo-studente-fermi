import mongoose from "mongoose";

import { Envs } from "@config";

import { logger } from "@shared";

export const connectToDb = async () => {
    await mongoose.connect(Envs.env.MONGODB_URI, err => {
        err ? logger.error(err) : logger.info("Connected to MongoDB");
    });
};
