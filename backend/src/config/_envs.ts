import { logger } from "@shared";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

export const requiredEnvs = [
    "MONGODB_URI",
    "AUTH_COOKIE_NAME",
    "JWT_SECRET",
    "NODE_ENV",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URL"
] as const;

type EnvName = typeof requiredEnvs[number];
type Envs = {
    [envName in EnvName]: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const envs: Envs = {} as any;

export function loadEnvs() {
    const missingEnvs: string[] = [];
    for (const env of requiredEnvs) {
        if (typeof process.env[env] !== "string") {
            logger.debug(`Env "${env}" doesn't exist`);
            missingEnvs.push(env);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (envs as any)[env] = process.env[env];
            logger.debug(`Env "${env}" loaded`);
        }
    }

    if (missingEnvs.length > 0) {
        logger.error(`Missing required envs: "${missingEnvs.join('", "')}"`);
        process.exit(1);
    }
}
export default envs;
