import { logger } from "@shared";
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
    logger.error("Missing MONGODB_URI env");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, err => {
    err ? logger.error(err) : logger.info("Connected to MongoDB");
});
