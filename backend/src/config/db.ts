import { logger } from "@shared";
import mongoose from "mongoose";

if (!process.env.MONGOOSE_URI) {
    logger.error("Missing MONGOOSE_URI env");
    process.exit(1);
}

mongoose.connect(process.env.MONGOOSE_URI, err => {
    err ? logger.error(err) : logger.info("Connected to MongoDB");
});
