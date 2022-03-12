import dotenv from "dotenv";
import process from "process";

import { logger } from "@shared";

dotenv.config();

export const requiredEnvs = [
    "MONGODB_URI",
    "AUTH_COOKIE_NAME",
    "AUTH_COOKIE_DURATION_DAYS",
    "JWT_SECRET",
    "NODE_ENV",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URL",
    "COOKIE_SECRET",
    "LAST_PAGE_URL_COOKIE_NAME",
    "TEMP_AUTH_DATA_COOKIE_NAME",
    "SIGNUP_URL",
    "EMAIL_SUFFIX"
] as const;

type EnvName = typeof requiredEnvs[number];
type EnvsType = {
    [envName in EnvName]: string;
};

export class Envs {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static env: EnvsType = {} as any;

    public static _loadEnvs = () => {
        logger.info("Loading envs...");

        const missingEnvs: string[] = [];
        for (const env of requiredEnvs) {
            if (typeof process.env[env] !== "string") {
                logger.debug(`Env "${env}" doesn't exist`);
                missingEnvs.push(env);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                logger.debug(`Env "${env}" loaded`);
                Envs.env[env] = process.env[env] as string;
            }
        }

        if (missingEnvs.length > 0) {
            logger.error(
                `Missing required envs: "${missingEnvs.join('", "')}"`
            );
            process.exit(1);
        }

        logger.info("Envs loaded");
    };

    private static _staticConstructor = Envs._loadEnvs();
}
