import { logger } from "@shared";

logger.info("Loading middlewares...");

export * from "./populateReq";
export * from "./isStudentLoggedIn";