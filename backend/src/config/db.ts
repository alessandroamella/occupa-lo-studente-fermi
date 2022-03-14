import mongoose from "mongoose";

import { logger } from "@shared";

import { Envs } from "./_envs";

export const connectToDb = async () => {
    await mongoose.connect(Envs.env.MONGODB_URI, err => {
        err ? logger.error(err) : logger.info("Connected to MongoDB");
    });
};
