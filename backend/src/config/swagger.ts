import { logger } from "@shared";
import { join } from "path";
import { cwd } from "process";
import swaggerJsdoc from "swagger-jsdoc";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version, description } = require(join(cwd(), "./package.json"));

export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Occupa lo studente",
            version,
            description
        },
        servers: [
            {
                url: "http://localhost:5000/",
                description: "Documentazione API"
            }
        ]
    },
    apis: ["**/*.ts"]
};

logger.info(`APIs path at "${options.apis.join('", "')}"`);

export const specs = swaggerJsdoc(options);
