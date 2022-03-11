import { logger } from "@shared";
import mongoose from "mongoose";

import { envs } from ".";

export const connectToDb = async () => {
    await mongoose.connect(envs.MONGODB_URI, err => {
        err ? logger.error(err) : logger.info("Connected to MongoDB");
    });
};
